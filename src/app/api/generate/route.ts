import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import prisma from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const groqApiKey = process.env.GROQ_API_KEY || "";
const groq = new Groq({ apiKey: groqApiKey });

export async function POST(request: Request) {
  try {
    // ─── Auth check ───
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { budget, targetProtein, targetCalories } = body;

    // Check required inputs
    if (!budget || !targetProtein || !targetCalories) {
      return NextResponse.json(
        { error: "budget, targetProtein, and targetCalories are required" },
        { status: 400 }
      );
    }

    // Ambil data bahan makanan dari database menggunakan Prisma
    let ingredientsData;
    try {
      ingredientsData = await prisma.ingridients.findMany();
    } catch (dbError: any) {
      return NextResponse.json(
        { error: "Gagal mengambil data bahan makanan dari database", details: dbError.message },
        { status: 500 }
      );
    }

    // Handle BigInt serialization sebelum convert ke JSON string
    const ingredientsJson = JSON.stringify(ingredientsData, (_, value) => 
      typeof value === "bigint" ? Number(value) : value
    );

    // Persiapkan Strict System Prompt
    const systemInstruction = `You are an expert Dietitian and strict Financial Planner. Your task is to create a 7-day meal plan (Monday to Sunday) based ONLY on the provided ingredient list.

[USER TARGETS]
Weekly Budget: Rp ${budget}
Daily Calories Target: ${targetCalories} kcal (Allowable range: +/- 50 kcal)
Daily Protein Target: ${targetProtein} g (Allowable range: +/- 5 g)

[STRICT RULES]
1. BUDGET LIMIT: The total sum of 'daily_cost' for all 7 days MUST NOT exceed the Weekly Budget. 
   To achieve this, your absolute maximum limit per day is Rp ${budget / 7}. Do not exceed this daily limit under any circumstances.
2. NUTRITION ACCURACY: The 'total_calories' and 'total_protein' for each day must closely match the user targets within the allowable range.
3. INVENTORY ONLY: You must ONLY use the ingredients, exact prices, and exact nutritional values provided in the [DATABASE] below. Do not invent or estimate any values.
4. CALCULATION: Double-check your math before generating the output. Ensure (Breakfast Price + Lunch Price + Dinner Price) = daily_cost.

[DATABASE]
${ingredientsJson}

[OUTPUT FORMAT]
You must respond ONLY with a valid, raw JSON object. Do not include markdown formatting like \`\`\`json or any explanation text. Use this exact schema:
{
  "result": {
    "weekly_plan": [
      {
        "day": "Monday",
        "meals": {
          "breakfast": { "menu": "...", "price": 0 },
          "lunch": { "menu": "...", "price": 0 },
          "dinner": { "menu": "...", "price": 0 }
        },
        "total_protein": 0,
        "total_calories": 0,
        "daily_cost": 0
      }
    ]
  }
}`;

    const userPrompt = `Please generate the 7-day meal plan based on the provided instructions. Output only valid JSON.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userPrompt }
      ],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" },
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "{}";
    
    // Parse ke JSON untuk memastikan frontend menerima format objek, bukan sekedar string json
    const mealPlan = JSON.parse(responseText);
    
    // To match the payload structure frontend expects
    const finalResponse = mealPlan.result ? mealPlan : { result: mealPlan };

    // ─── Save as ActiveMealPlan for the current user ───
    try {
      await prisma.activeMealPlan.upsert({
        where: { userId: user.id },
        update: {
          weeklyPlan: finalResponse.result.weekly_plan,
          budget: Number(budget),
          targetCalories: Number(targetCalories),
          targetProtein: Number(targetProtein),
          updatedAt: new Date(),
        },
        create: {
          userId: user.id,
          weeklyPlan: finalResponse.result.weekly_plan,
          budget: Number(budget),
          targetCalories: Number(targetCalories),
          targetProtein: Number(targetProtein),
        },
      });
    } catch (saveError: any) {
      // Non-critical: still return the plan even if save fails
      console.error("Failed to save active meal plan:", saveError.message);
    }

    return NextResponse.json(finalResponse, { status: 200 });

  } catch (error: any) {
    const msg = error.message || "";

    // Detect Groq rate limit errors
    if (msg.includes("rate_limit") || msg.includes("Rate limit") || msg.includes("429")) {
      return NextResponse.json(
        {
          error: "API rate limit reached. The free tier daily token limit has been exceeded. Please try again in about 1 hour.",
          details: msg,
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Gagal menghasilkan meal plan.", details: msg },
      { status: 500 }
    );
  }
}
