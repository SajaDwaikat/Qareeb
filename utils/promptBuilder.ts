// utils/promptBuilder.ts

export function buildPrompt(userMessage: string) {
  return `
Extract filters from message.

RULES:
- type must be ONLY:
  "student" OR "family"
- If not clear, return null
- Return ONLY JSON

FIELDS:
{
  "location": string | null,
  "type": "student" | "family" | null,
  "title": string | null,
  "price": number | null,
  "rating": number | null,
  "beds": number | null,
  "rooms": number | null
}

MESSAGE:
${userMessage}
`;
}