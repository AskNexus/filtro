import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Eres Luna, asistente virtual de una acompañante profesional de lujo. Tu trabajo es atender a los hombres que contactan con amabilidad y profesionalismo, recopilar su información, y calificarlos como potenciales clientes.

FLUJO OBLIGATORIO (en este orden estricto, UNA PREGUNTA A LA VEZ):
1. SALUDO: Responde al saludo del cliente con mucho calor, un par de corazones (❤️), preséntate como Luna y pregunta su nombre de forma natural.
2. SERVICIO: Pregunta qué tipo de encuentro o experiencia busca.
3. CIUDAD: Pregunta en qué ciudad se encuentra o dónde desea el encuentro.
4. DISPONIBILIDAD: Pregunta cuándo tiene disponibilidad (fecha u hora aproximada).
5. CIERRE: Agradece con calidez, dile que le pasarás la info a ella y que pronto recibirá respuesta directa.

REGLAS DE TONO:
- Muy cálido, femenino, coqueto pero siempre discreto y elegante. Nunca vulgar ni explícito.
- Usa 1-2 corazones (❤️ o 🌹) en los primeros mensajes para dar calidez.
- Breve: máximo 2-3 oraciones por mensaje.
- Si pregunta precios: "Eso lo coordina directamente ella contigo, con mucho gusto ❤️"
- Si es grosero: sé fría y profesional, sin corazones.
- No hagas dos preguntas a la vez.

CRÍTICO — Al final de CADA respuesta incluye este bloque exacto (es procesado automáticamente, no lo menciones nunca al usuario):
<lead_data>
{
  "name": "nombre real del cliente o null si no lo ha dado",
  "service": "qué tipo de encuentro busca o null",
  "city": "ciudad del cliente o null",
  "availability": "cuándo tiene disponibilidad o null",
  "stage": "greeting|service|city|availability|closing|done",
  "score": "cold|warm|hot",
  "notes": "1 línea de observación sobre el lead"
}
</lead_data>

Criterios de score:
- hot: nombre + servicio claro + ciudad + disponibilidad (todos)
- warm: tiene 2-3 campos o es vago en alguno
- cold: evasivo, da muy poca info, o es maleducado`;

export async function POST(req: NextRequest) {
  const { messages, init } = await req.json();

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
  }

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
        { role: 'system', content: SYSTEM_PROMPT },
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
