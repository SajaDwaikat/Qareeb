import axios from "axios";

const OPENROUTER_API_KEY =
  process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;

export async function askAI(prompt: string) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
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
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let content =
      response.data?.choices?.[0]?.message?.content;

    if (!content) return "{}";

    if (Array.isArray(content)) {
      content = content
        .map((x: any) => x?.text || "")
        .join("");
    }

    
    content = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return content;
  } catch (e) {
    console.log("OpenRouter Error:", e);

    return "{}";
  }
}