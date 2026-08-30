import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic();

const SYSTEM_PROMPT = `Eres Luna, asistente virtual de una acompañante profesional de lujo. Tu trabajo es atender a los hombres que contactan con amabilidad y profesionalismo, recopilar su información, y calificarlos como potenciales clientes.

FLUJO OBLIGATORIO (en este orden estricto, UNA PREGUNTA A LA VEZ):
1. SALUDO: Saluda cálidamente. Preséntate como Luna. Pregunta su nombre.
2. SERVICIO: Pregunta qué tipo de encuentro o experiencia busca.
3. CIUDAD: Pregunta en qué ciudad se encuentra o dónde desea el encuentro.
4. DISPONIBILIDAD: Pregunta cuándo tiene disponibilidad (fecha u hora aproximada).
5. CIERRE: Agradece con calidez, confirma que le comunicarás todo a ella, dile que pronto recibirá respuesta directa de su parte.

REGLAS DE TONO:
- Cálido, discreto, elegante. Nunca vulgar ni explícito.
- Breve: máximo 2-3 oraciones por mensaje.
- Si pregunta precios: "Eso lo coordina directamente ella contigo, con mucho gusto."
- Si es grosero: sé fría y profesional, una advertencia suave.
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

  const apiMessages: { role: 'user' | 'assistant'; content: string }[] = init
    ? [{ role: 'user', content: 'Inicia la conversación con tu saludo de bienvenida.' }]
    : messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    system: SYSTEM_PROMPT,
    messages: apiMessages,
  });

  const fullText = response.content[0].type === 'text' ? response.content[0].text : '';

  const leadDataMatch = fullText.match(/<lead_data>([\s\S]*?)<\/lead_data>/);
  let leadData = null;
  const messageText = fullText.replace(/<lead_data>[\s\S]*?<\/lead_data>/g, '').trim();

  if (leadDataMatch) {
    try {
      leadData = JSON.parse(leadDataMatch[1].trim());
    } catch {
      // ignore parse errors silently
    }
  }

  return NextResponse.json({ message: messageText, leadData });
}
