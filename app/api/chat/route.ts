import { NextRequest, NextResponse } from 'next/server';
import { buildSystemPrompt, DEFAULT_PROFILE, Profile } from '@/lib/systemPrompt';

export async function POST(req: NextRequest) {
  const { messages, profile } = await req.json();

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
  }

  const activeProfile: Profile = profile ?? DEFAULT_PROFILE;
  const systemPrompt = buildSystemPrompt(activeProfile);

  const apiMessages: { role: string; content: string }[] = messages.map(
    (m: { role: string; content: string }) => ({ role: m.role, content: m.content })
  );

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-haiku-4-5',
      max_tokens: 600,
      messages: [
        { role: 'system', content: systemPrompt },
        ...apiMessages,
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('OpenRouter error:', res.status, err);
    return NextResponse.json({ error: 'AI service error' }, { status: 500 });
  }

  const data = await res.json();
  const fullText: string = data.choices?.[0]?.message?.content ?? '';

  const leadDataMatch = fullText.match(/<lead_data>([\s\S]*?)<\/lead_data>/);
  let leadData = null;
  const messageText = fullText.replace(/<lead_data>[\s\S]*?<\/lead_data>/g, '').trim();

  if (leadDataMatch) {
    try {
      leadData = JSON.parse(leadDataMatch[1].trim());
    } catch {
      // ignore
    }
  }

  return NextResponse.json({ message: messageText, leadData });
}
