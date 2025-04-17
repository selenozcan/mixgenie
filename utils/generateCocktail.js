export function tryFixAndParseJson(rawContent) {
  if (!rawContent) return null;

  try {
    let fixed = rawContent
      .trim()
      .replace(/^```json|```$/gi, "") // remove ```json and ending ```
      .replace(/^```|```$/gi, "") // remove ``` if not followed by json
      .replace(/\\n/g, " ") // remove escaped newlines
      .replace(/\n/g, " ") // remove real newlines
      .replace(/\t/g, " ") // remove tabs
      .replace(/\s{2,}/g, " ") // reduce multiple spaces
      .replace(/'([^']*)'/g, `"$1"`) // replace single quotes with double
      .replace(/,\s*}/g, "}") // trailing comma in object
      .replace(/,\s*]/g, "]"); // trailing comma in array

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

export async function fetchCocktailFromAi({ taste, spirits, extras }) {
  const isAllEmpty =
    !taste?.length && spirits.length === 0 && extras.length === 0;

  const systemPrompt = `You are a creative and fun bartender AI who ONLY responds with a fresh, random cocktail recipe in valid JSON.`;

  const prompt = isAllEmpty
    ? `
      Generate a random cocktail recipe.
      Make sure each result is different. Avoid repeating names or descriptions.
      Use playful ingredients or presentation ideas if you'd like! But keep it simple.
      Units: metric (ml, g, etc.)

      Format (JSON only):
      {
        "name": "...",
        "ingredients": ["...", "..."],
        "steps": "...",
        "aiDescription": "..."
      }
    `
    : `
      Based on the following preferences, create a fun and unique cocktail:

      Taste: ${taste?.length ? taste.join(", ") : "No preference"}
      Spirits: ${spirits.length ? spirits.join(", ") : "None"}
      Extras: ${extras.length ? extras.join(", ") : "No preference"}

      Each output should be unique and fun to read.
      Respond with JSON only:
      {
        "name": "...",
        "ingredients": ["...", "..."],
        "steps": "...",
        "aiDescription": "..."
      }
    `;

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
  return tryFixAndParseJson(content);
}
