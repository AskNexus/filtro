import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { buildSystemPrompt, profileFromEnv } from '@/lib/systemPrompt';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? '';
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
// Owner's Telegram chat ID — receives forwarded conversations
const OWNER_CHAT_ID = process.env.MODEL_OWNER_TELEGRAM_ID
  ? Number(process.env.MODEL_OWNER_TELEGRAM_ID)
  : null;

async function telegramPost(method: string, body: object) {
  await fetch(`${TELEGRAM_API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function sendMessage(chatId: number, text: string) {
  await telegramPost('sendMessage', { chat_id: chatId, text });
}

async function sendTyping(chatId: number) {
  await telegramPost('sendChatAction', { chat_id: chatId, action: 'typing' });
}

async function forwardToOwner(fromName: string, clientText: string, botReply: string) {
  if (!OWNER_CHAT_ID) return;
  const preview = `👤 Cliente: ${clientText}\n\n🤖 ${process.env.MODEL_NAME ?? 'Bot'}: ${botReply}`;
  await sendMessage(OWNER_CHAT_ID, preview);
}

export async function POST(req: NextRequest) {
  if (!BOT_TOKEN) return NextResponse.json({ ok: false, error: 'No bot token' });

  const update = await req.json();
  const message = update.message;
  if (!message || !message.text) return NextResponse.json({ ok: true });

  const chatId: number = message.chat.id;
  const userText: string = message.text;
  const fromName: string = message.from?.first_name ?? 'Cliente';

  // /start command — warm greeting
  if (userText === '/start') {
    const greeting = `hola corazón, qué bueno que escribes ❤️ aquí estoy yo, ¿cómo estás?`;
    await sendMessage(chatId, greeting);
    return NextResponse.json({ ok: true });
  }

  // Load conversation history from KV (7-day TTL)
  const historyKey = `conv_tg_${chatId}`;
  const history: { role: string; content: string }[] =
    (await kv.get(historyKey)) ?? [];

  history.push({ role: 'user', content: userText });
  if (history.length > 20) history.splice(0, history.length - 20);

  // Show typing while AI processes
  await sendTyping(chatId);

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    await sendMessage(chatId, 'Ahora mismo no puedo contestar, escríbeme un poco más tarde ❤️');
    return NextResponse.json({ ok: true });
  }

  const profile = profileFromEnv();
  const systemPrompt = buildSystemPrompt(profile);

  let aiText = '';
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-haiku-4-5',
        max_tokens: 600,
        messages: [{ role: 'system', content: systemPrompt }, ...history],
      }),
    });

    if (!res.ok) throw new Error(`OpenRouter ${res.status}`);

    const data = await res.json();
    const fullText: string = data.choices?.[0]?.message?.content ?? '';

    // Strip lead_data block — not needed in real chat
    aiText = fullText.replace(/<lead_data>[\s\S]*?<\/lead_data>/g, '').trim();

    // Save assistant reply to history
    history.push({ role: 'assistant', content: aiText });
    await kv.set(historyKey, history, { ex: 60 * 60 * 24 * 7 });

  } catch (err) {
    console.error('AI error:', err);
    aiText = 'Ahora mismo no puedo contestar, escríbeme en un momento ❤️';
  }

  // Natural delay (1–2.5s) for realism
  const delay = Math.min(1000 + aiText.length * 15, 2500);
  await new Promise(r => setTimeout(r, delay));

  // Send typing again if delay was long
  await sendTyping(chatId);
  await new Promise(r => setTimeout(r, 600));

  // Reply to client
  await sendMessage(chatId, aiText);

  // Forward exchange to owner (silent monitoring)
  await forwardToOwner(fromName, userText, aiText);

  return NextResponse.json({ ok: true });
}
