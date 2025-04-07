function tryFixAndParseJson(rawContent) {
  if (!rawContent) return null;

  try {
    let fixed = rawContent
      .trim()
      .replace(/^```json|```$/gim, "")
      .replace(/\\n/g, " ")
      .replace(/\n/g, " ")
      .replace(/\t/g, " ")
      .replace(/\s{2,}/g, " ")
      .replace(/'([^']*)'/g, `"$1"`)
      .replace(/"([^"]+)'/g, `"$1"`)
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]");

    const firstCurly = fixed.indexOf("{");
    const lastCurly = fixed.lastIndexOf("}");

    if (firstCurly === -1 || lastCurly === -1) return null;

    const jsonLike = fixed.substring(firstCurly, lastCurly + 1);

    const parsed = JSON.parse(jsonLike);
    if (
      parsed?.aiDescription &&
      typeof parsed.aiDescription === "string" &&
      !parsed.aiDescription.trim().endsWith(".")
    ) {
      parsed.aiDescription = parsed.aiDescription.trim() + ".";
    }

    return parsed;
  } catch (err) {
    console.error("JSON Fixing Failed:", err);
    return null;
  }
}

export async function fetchCocktailFromGroq({ taste, spirits, extras }) {
  const isAllEmpty =
    !taste?.length && spirits.length === 0 && extras.length === 0;

  const systemPrompt = `You are a creative and fun bartender AI who only responds with a random JSON-formatted cocktail recipe.`;

  let prompt = "";

  if (isAllEmpty) {
    prompt = `
      Create a brand new, original cocktail recipe. Each time the user asks, return something different. 
      Come up with a random fun name and a unique recipe. Include a variety of spirits, flavors, or playful elements.

      Respond ONLY with JSON in this format:
      {
        "name": "...",
        "ingredients": ["...", "..."],
        "steps": "...",
        "aiDescription": "..."
      }
    `;
  } else {
    prompt = `
      Create a unique cocktail recipe based on the user's choices.

      Taste: ${taste?.length ? taste.join(", ") : "No preference"}
      Spirits: ${spirits.length ? spirits.join(", ") : "None (non-alcoholic)"}
      Extras: ${extras.length ? extras.join(", ") : "No preference"}

      Come up with a random fun name and a unique recipe
      Respond ONLY with JSON in this format:
      {
        "name": "...",
        "ingredients": ["...", "..."],
        "steps": "...",
        "aiDescription": "..."
      }
    `;
  }

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: 1.7,
      }),
    }
  );

  const data = await response.json();
  console.log("🧾 Raw Groq response:", JSON.stringify(data, null, 2));

  const content = data.choices?.[0]?.message?.content;
  const cocktail = tryFixAndParseJson(content);

  return cocktail;
}
