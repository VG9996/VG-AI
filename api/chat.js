export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const apiKey = process.env.AI_GATEWAY_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "AI_GATEWAY_API_KEY is not configured"
      });
    }

    const response = await fetch(
      "https://ai-gateway.vercel.sh/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "openai/gpt-5.5",
          input: `Tum VG AI ho. User se Hinglish mein friendly aur simple way mein baat karo.

User ka message:
${message}`
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "AI error"
      });
    }

    return res.status(200).json({
      reply: data.output_text || "AI se response nahi mila."
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Server error"
    });
  }
}
