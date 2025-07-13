import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { ChatGroq } from "@langchain/groq";
import { DynamicTool } from "@langchain/core/tools";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

const ProductSelectionSchema = z.object({
  selectedTypes: z
    .array(z.string())
    .describe("Array of selected product types that match the user query"),
  reasoning: z
    .string()
    .optional()
    .describe("Brief reasoning for the selection"),
});

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json(
        { error: "Missing input query" },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("❌ GROQ_API_KEY is not set");
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db("sparkathon");
    const collection = db.collection("data");

    const productDataArray = await collection.find({}).toArray();

    if (!productDataArray || productDataArray.length === 0) {
      console.error("❌ No product data found in MongoDB");
      return NextResponse.json(
        { error: "No product data available" },
        { status: 404 }
      );
    }

    const productData = productDataArray[0];

    const productTypeList: string[] = [];
    const flatProductMap: { [key: string]: any[] } = {};

    for (const [category, types] of Object.entries(productData)) {
      if (category === "_id") continue;

      if (typeof types !== "object") continue;
      for (const [type, items] of Object.entries(types as any)) {
        const normalizedType = type.toLowerCase();
        const itemArray = Array.isArray(items) ? items : [items];
        productTypeList.push(normalizedType);
        flatProductMap[normalizedType] = itemArray;
      }
    }

    const llm = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama3-70b-8192",
      temperature: 0.1,
    });

    // ✅ STEP 4: Create tools for the agent
    const productSearchTool = new DynamicTool({
      name: "product_search",
      description:
        "Search for relevant product types based on user query. Returns matching product types from available inventory.",
      schema: z.object({
        userQuery: z.string().describe("The user's search query"),
        availableTypes: z
          .array(z.string())
          .describe("List of available product types to search from"),
      }),
      func: async ({
        userQuery,
        availableTypes,
      }: {
        userQuery: string;
        availableTypes: string[];
      }) => {
        const relevantTypes = availableTypes.filter((type) => {
          const query = userQuery.toLowerCase();
          const typeWords = type.split(" ");

          return (
            typeWords.some(
              (word) =>
                query.includes(word.toLowerCase()) ||
                word.toLowerCase().includes(query.split(" ")[0])
            ) ||
            query.includes(type.toLowerCase()) ||
            type.toLowerCase().includes(query)
          );
        });
        // Limit to top 10 matches{}
        return JSON.stringify({
          relevantTypes: relevantTypes.slice(0, 10),
          totalAvailable: availableTypes.length,
          searchQuery: userQuery,
        });
      },
    });

    const productDetailsTool = new DynamicTool({
      name: "get_product_details",
      description:
        "Get detailed information about specific product types including available items and their details.",
      schema: z.object({
        productTypes: z
          .array(z.string())
          .describe("Array of product types to get details for"),
      }),
      func: async ({ productTypes }: any) => {
        const details: { [key: string]: any } = {};

        for (const type of productTypes) {
          const normalizedType = type.toLowerCase();
          if (flatProductMap[normalizedType]) {
            details[normalizedType] = {
              items: flatProductMap[normalizedType],
              count: flatProductMap[normalizedType].length,
            };
          }
        }

        return JSON.stringify(details);
      },
    });

    // ✅ STEP 5: Create the agent prompt
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are a helpful shopping assistant. Your job is to help users find relevant products from our inventory.

Available product types: {availableTypes}

Instructions:
1. Use the product_search tool to find relevant product types based on the user's query
2. Use the get_product_details tool to get more information about promising product types
3. Select the most relevant product types that match the user's needs
4. Return your final selection as a JSON object with the selected product types

Be helpful and try to understand what the user is looking for. Consider related items, seasonal needs, and common shopping patterns.`,
      ],
      ["human", "{input}"],
      ["placeholder", "{agent_scratchpad}"],
    ]);

    const tools = [productSearchTool, productDetailsTool];
    const agent = await createToolCallingAgent({
      llm,
      tools,
      prompt,
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools,
      verbose: true,
    });

    const result = await agentExecutor.invoke({
      input: `Find products that match this query: "${query}". Return a JSON response with selected product types.`,
      availableTypes: productTypeList.join(", "),
    });

    let selectedTypes: string[] = [];
    try {
      const response = result.output;

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        selectedTypes =
          parsed.selectedTypes ||
          parsed.selected_products ||
          parsed.products ||
          Object.keys(parsed).filter((k) => parsed[k] === true) ||
          (Array.isArray(parsed) ? parsed : []);
      } else {
        // Fallback: use product_search tool result
        const searchResult = await productSearchTool.invoke({
          userQuery: query,
          availableTypes: productTypeList,
        });
        const searchData = JSON.parse(searchResult);
        selectedTypes = searchData.relevantTypes || [];
      }
    } catch (err) {
      console.error("❌ Failed to parse agent response:", result.output);
      // Fallback to simple keyword matching
      selectedTypes = productTypeList
        .filter(
          (type) =>
            query.toLowerCase().includes(type.toLowerCase()) ||
            type.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5);
    }

    const matchedProducts: { [key: string]: any[] } = {};
    const validSet = new Set(productTypeList);

    for (const type of selectedTypes) {
      const key = type.toLowerCase();
      if (validSet.has(key) && flatProductMap[key]) {
        matchedProducts[key] = flatProductMap[key];
      }
    }

    console.log("✅ Agent selected types:", selectedTypes);
    console.log("✅ Agent reasoning:", result.output);

    return NextResponse.json({
      products: matchedProducts,
      reasoning: result.output,
      selectedTypes,
    });
  } catch (err) {
    console.error("❌ Error in /api/ai-suggest:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}