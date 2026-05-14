// services/openRouter.ts

const OPENROUTER_API_KEY =
  process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;

export async function askAI(prompt: string) {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model:
            "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",

          messages: [
            {
              role: "system",
              content:
                "Return ONLY valid JSON. No text. No markdown.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    let content = data?.choices?.[0]?.message?.content;

    if (!content) return "{}";

    // لو array (rare case)
    if (Array.isArray(content)) {
      content = content.map((x: any) => x?.text || "").join("");
    }

    // تنظيف أي markdown
    content = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return content;
  } catch (e) {
    return "{}";
  }
}