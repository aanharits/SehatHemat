import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import prisma from "@/lib/prisma";

const groqApiKey = process.env.GROQ_API_KEY || "";
const groq = new Groq({ apiKey: groqApiKey });

export async function POST(request: Request) {
  try {
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
    const systemInstruction = `Kamu adalah ahli gizi dan perencana keuangan fitness.

Buat rencana makan mingguan (Senin-Minggu) berdasarkan budget, target protein, dan kalori yang dikirim user.

ATURAN KERAS: 
1. Kamu HANYA boleh menggunakan bahan makanan dan harga yang ada di daftar database yang saya berikan.
2. Buatlah menu yang SANGAT BERVARIASI setiap hari dan setiap waktu makan. Jangan hanya menggunakan telur dan tempe terus-menerus.
3. Total harga harian tidak boleh melebihi budget mingguan yang dibagi 7.
4. JANGAN gunakan tag markdown seperti \`\`\`json. Langsung mulai dengan karakter '{'.

Daftar bahan makanan:
${ingredientsJson}

Struktur Output JSON yang diharapkan:
{ "weekly_plan": [ { "day": "Monday", "meals": { "breakfast": { "menu": "...", "price": 0 }, "lunch": { "menu": "...", "price": 0 }, "dinner": { "menu": "...", "price": 0 } }, "total_protein": 0, "total_calories": 0, "daily_cost": 0 } ] }`;

    const userPrompt = `Buatkan meal plan mingguan dengan budget mingguan: ${budget}, target protein per hari: ${targetProtein}g, target kalori per hari}. Output wajib berupa JSON murni tanpa markdown!`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "{}";
    
    // Parse ke JSON untuk memastikan frontend menerima format objek, bukan sekedar string json
    const mealPlan = JSON.parse(responseText);
    return NextResponse.json({ result: mealPlan }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { error: "Gagal menghasilkan meal plan.", details: error.message },
      { status: 500 }
    );
  }
}
