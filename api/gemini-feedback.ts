import { GoogleGenAI } from '@google/genai';
import type { Request, Response } from 'express';

const MODEL_CANDIDATES = [
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
];

function getApiKey(): string {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    ''
  ).trim();
}

function getAiClient(): GoogleGenAI | null {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export default async function handler(req: Request, res: Response) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const { userQuery, contextText, history = [] } = req.body;
    if (!userQuery || !userQuery.trim()) {
      return res.status(400).json({ error: 'EMPTY_QUERY' });
    }

    const client = getAiClient();
    if (!client) {
      return res.status(503).json({ error: 'NO_API_KEY' });
    }

    const historyText = history
      .slice(-6)
      .map((h: any) => `${h.role === 'user' ? 'Citizen' : 'Investigator'}: ${h.content}`)
      .join('\n');

    const prompt = `You are a concise, expert cybercrime forensic investigator advising an Indian citizen who checked a message in the Scam Triage scanner.

Original Suspicious Message Context:
"""${contextText || 'No original message provided.'}"""

Citizen's Question:
"${userQuery}"

Recent conversation:
${historyText || 'None.'}

Instructions:
1. Deliver a direct, factual, legally accurate answer in 2-3 crisp sentences or 2-3 concise bullet points.
2. Ground advice in Indian Cyber Law (IT Act 2000), RBI Guidelines, and Indian Police procedures.
3. Be reassuring, calm, and practical. Cite 1930 Cyber Helpline or cybercrime.gov.in if financial transactions occurred.`;

    for (const model of MODEL_CANDIDATES) {
      try {
        const response = await client.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0.2,
          },
        });
        if (response?.text) {
          return res.json({ success: true, reply: response.text.trim() });
        }
      } catch (err) {
        console.warn(`[VERCEL CHAT] Model ${model} failed, trying fallback...`);
      }
    }

    return res.status(500).json({ error: 'ALL_MODELS_FAILED' });
  } catch (err: any) {
    console.error('[VERCEL CHAT ERROR]', err);
    return res.status(500).json({ error: 'CHAT_FAILED' });
  }
}
