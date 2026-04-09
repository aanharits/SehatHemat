import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/prisma";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { budget, targetProtein, targetCalories, dietaryRestrictions } = body;

    // Check required inputs
    if (!budget || !targetProtein || !targetCalories) {
      return NextResponse.json(
        { error: "budget, targetProtein, and targetCalories are required" },
        { status: 400 }
      );
    }

    // Ambil data bahan makanan dari database menggunakan Prisma
    // dan tangani kemungkinan error dari call database.
    let ingredientsData;
    try {
      ingredientsData = await prisma.ingridients.findMany();
    } catch (dbError: any) {
      console.error("Database Fetch Error:", dbError);
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

ATURAN KERAS: Kamu HANYA boleh menggunakan bahan makanan dan harga yang ada di daftar database yang saya berikan. Jangan mengarang harga sendiri.

Daftar bahan makanan:
${ingredientsJson}

Hitung total harga harian dan pastikan tidak melebihi budget mingguan yang dibagi 7.

Output harus berupa JSON MURNI agar bisa langsung diparsing oleh frontend.
Struktur Output JSON yang diharapkan:
{ "weekly_plan": [ { "day": "Monday", "meals": { "breakfast": { "menu": "...", "price": 0 }, "lunch": { "menu": "...", "price": 0 }, "dinner": { "menu": "...", "price": 0 } }, "total_protein": 0, "total_calories": 0, "daily_cost": 0 } ] }`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction,
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const userPrompt = `Buatkan meal plan mingguan dengan budget mingguan: ${budget}, target protein per hari: ${targetProtein}g, target kalori per hari: ${targetCalories}kcal. Batasan diet tambahan: ${dietaryRestrictions || "Tidak ada"}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    });

    const responseText = result.response.text();
    
    // Parse ke JSON untuk memastikan frontend menerima format objek, bukan sekedar string json
    const mealPlan = JSON.parse(responseText);
    return NextResponse.json({ result: mealPlan }, { status: 200 });
    
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Gagal menghasilkan meal plan.", details: error.message },
      { status: 500 }
    );
  }
}
