import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json(
        { error: "Missing input query" },
        { status: 400 }
      );
    }

    // ✅ STEP 1: Load local products.json
    const filePath = path.resolve(process.cwd(), "data/products.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const productData = JSON.parse(rawData);

    // ✅ STEP 2: Flatten product types
    const productTypeList: string[] = [];
    const flatProductMap: { [key: string]: any[] } = {};

    for (const [category, types] of Object.entries(productData)) {
      if (typeof types !== "object") continue;

      for (const [type, items] of Object.entries(types as any)) {
        const normalizedType = type.toLowerCase();
        const itemArray = Array.isArray(items) ? items : [items];
        productTypeList.push(normalizedType);
        flatProductMap[normalizedType] = itemArray;
      }
    }

    // ✅ STEP 3: Ask Groq for relevant types
    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content:
                "You are a shopping assistant. Only select product types from the allowed list. Do NOT invent or explain anything.",
            },
            {
              role: "user",
              content: `Allowed product types: [${productTypeList.join(", ")}]

User input: "${query}"

Respond strictly with valid JSON:
{
  "tshirt": true,
  "sunscreen": true,
  "travel pouch": true
}

You may mark unavailable ones as false, but do not explain anything.`,
            },
          ],
          temperature: 0.4,
        }),
      }
    );

    const groqData = await groqRes.json();
    const content = groqData?.choices?.[0]?.message?.content;

    if (!content) {
      console.error("❌ No content from Groq:", groqData);
      return NextResponse.json({ error: "Empty AI response" }, { status: 500 });
    }

    // ✅ STEP 4: Parse JSON (strip comments)
    let selectedTypes: string[] = [];
    try {
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No JSON block found");

      const cleaned = match[0].replace(/\/\/.*$/gm, "").trim(); // 🧼 Strip comments

      const parsed = JSON.parse(cleaned);
      selectedTypes = Object.keys(parsed).filter((k) => parsed[k]);
    } catch (err) {
      console.error("❌ Failed to parse AI output:", content);
      return NextResponse.json(
        { error: "Invalid AI response format" },
        { status: 500 }
      );
    }

    // ✅ STEP 5: Build final matched product list
    const matchedProducts: { [key: string]: any[] } = {};
    const validSet = new Set(productTypeList);

    for (const type of selectedTypes) {
      const key = type.toLowerCase();
      if (validSet.has(key) && flatProductMap[key]) {
        matchedProducts[key] = flatProductMap[key]; // includes full info
      }
    }

    console.log("✅ AI selected types:", selectedTypes);
    return NextResponse.json({ products: matchedProducts });
  } catch (err) {
    console.error("❌ Error in /api/ai-suggest:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
