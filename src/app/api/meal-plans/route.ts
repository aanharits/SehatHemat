import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// ─── GET all saved meal days for the current user (newest first) ───
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plans = await prisma.savedMealPlan.findMany({
      where: { userId: user.id },
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
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
        userId: user.id,
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
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing plan id parameter" },
        { status: 400 }
      );
    }

    // Ensure the plan belongs to the current user
    await prisma.savedMealPlan.deleteMany({
      where: { id, userId: user.id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete meal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
