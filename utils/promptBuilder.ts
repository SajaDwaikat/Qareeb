export const buildPrompt = (message: string) => {
  return `
You are a JSON extractor for a housing app.

Extract filters from user message.

Return ONLY valid JSON.

Fields:
- location (string)
- maxPrice (number)
- type (string: apartment, room, villa, etc)
- beds (number optional)
- rooms (number optional)

Message:
"${message}"

Example output:
{
  "location": "نابلس",
  "maxPrice": 300,
  "type": "apartment",
  "beds": 2
}
`;
};