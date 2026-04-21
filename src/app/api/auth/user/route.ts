import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ─── POST: Upsert user record from Supabase auth data ───
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, email, displayName, avatarUrl } = body;

    if (!id || !email) {
      return NextResponse.json(
        { error: "id and email are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.upsert({
      where: { id },
      update: {
        email,
        displayName: displayName || undefined,
        avatarUrl: avatarUrl || undefined,
      },
      create: {
        id,
        email,
        displayName: displayName || null,
        avatarUrl: avatarUrl || null,
      },
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to upsert user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
