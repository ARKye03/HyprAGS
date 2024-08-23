import GLib from "gi://GLib";

export async function fetchGroq(input: string) {
  const API_KEY = GLib.getenv("GROQ_API_KEY");

  if (!API_KEY) {
    throw new Error("API_KEY not found");
  }

  const response = await Utils.fetch(
    `https://api.groq.com/openai/v1/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: input,
          },
        ],
        model: "llama3-70b-8192",
      }),
    }
  );

  const data = await response.json();
  const textParts = data.choices.map((choice: any) => choice.message.content);

  return textParts;
}
