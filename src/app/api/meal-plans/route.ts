import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ─── GET all saved meal days (newest first) ───
export async function GET() {
  try {
    const plans = await prisma.savedMealPlan.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ plans }, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch saved meals";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── POST save a single day's meal plan ───
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dayName, meals, totalProtein, totalCalories, dailyCost } = body;

    // Validate required fields
    if (!dayName || typeof dayName !== "string") {
      return NextResponse.json(
        { error: "dayName is required" },
        { status: 400 }
      );
    }

    if (!meals || typeof meals !== "object") {
      return NextResponse.json(
        { error: "meals object is required (breakfast, lunch, dinner)" },
        { status: 400 }
      );
    }

    if (totalProtein == null || totalCalories == null || dailyCost == null) {
      return NextResponse.json(
        { error: "totalProtein, totalCalories, and dailyCost are required" },
        { status: 400 }
      );
    }

    const saved = await prisma.savedMealPlan.create({
      data: {
        dayName,
        meals,
        totalProtein: Number(totalProtein),
        totalCalories: Number(totalCalories),
        dailyCost: Number(dailyCost),
      },
    });

    return NextResponse.json({ plan: saved }, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to save meal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── DELETE a saved meal ───
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing plan id parameter" },
        { status: 400 }
      );
    }

    await prisma.savedMealPlan.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete meal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
