import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// ─── GET: Return the current user's active meal plan ───
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activePlan = await prisma.activeMealPlan.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({ plan: activePlan }, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch active plan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── DELETE: Clear the user's active meal plan ───
export async function DELETE() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.activeMealPlan.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete active plan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
