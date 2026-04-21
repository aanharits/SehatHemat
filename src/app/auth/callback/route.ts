import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch {
              // Ignore — the redirect below will still have Set-Cookie headers
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Upsert user into our users table
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        try {
          await fetch(`${origin}/api/auth/user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: user.id,
              email: user.email,
              displayName:
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                null,
              avatarUrl: user.user_metadata?.avatar_url || null,
            }),
          });
        } catch {
          // Non-critical — user will be created on next API call
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If code exchange failed, redirect to landing with error
  return NextResponse.redirect(`${origin}/?error=auth_callback_error`);
}
