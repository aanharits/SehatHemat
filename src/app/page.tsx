"use client"

import * as React from "react"
import { Utensils, Sparkles, Shield, TrendingUp, ArrowRight } from "lucide-react"
import { AuthModal } from "@/components/auth-modal"

export default function LandingPage() {
  const [authOpen, setAuthOpen] = React.useState(false)
  const [authMode, setAuthMode] = React.useState<"login" | "signup">("login")

  const openAuth = (mode: "login" | "signup") => {
    setAuthMode(mode)
    setAuthOpen(true)
  }

  return (
    <div className="landing-page min-h-screen flex flex-col">
      {/* ─── Navigation ─── */}
      <header className="fixed top-0 left-0 right-0 z-40 landing-nav">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl
              bg-gradient-to-br from-[var(--accent-700)] to-[var(--accent-950)]
              shadow-[var(--shadow-xs)]">
              <Utensils className="h-4 w-4 text-white" />
            </div>
            <span className="text-[17px] font-bold tracking-tight text-[var(--text-primary)]">
              SehatHemat
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openAuth("login")}
              className="h-10 px-5 rounded-xl text-[14px] font-semibold
                text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                hover:bg-white/50 transition-all duration-200 cursor-pointer"
            >
              Masuk
            </button>
            <button
              onClick={() => openAuth("signup")}
              className="h-10 px-5 rounded-xl text-[14px] font-semibold
                bg-[var(--accent-950)] text-white
                hover:shadow-[var(--shadow-glow),var(--shadow-md)] hover:-translate-y-0.5
                transition-all duration-250 ease-[var(--ease-out)] cursor-pointer"
            >
              Daftar
            </button>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ─── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-20">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-[var(--accent-50)] border border-[var(--accent-200)]/30">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent-600)]" />
            <span className="text-[12px] font-semibold text-[var(--accent-700)] tracking-wide uppercase">
              Didukung AI
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="landing-headline text-[var(--text-primary)]">
              Makan Sehat,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-600)] to-[var(--accent-800)]">
                Hemat Budget
              </span>
            </h1>
            <p className="text-[18px] leading-relaxed text-[var(--text-tertiary)] max-w-xl mx-auto">
              AI meal planner yang merancang menu mingguan sesuai budget dan target nutrisi kamu.
              Tidak perlu ribet — cukup masukkan angka, dan dapatkan rencana makan lengkap.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => openAuth("signup")}
              className="group h-13 px-8 rounded-2xl text-[15px] font-semibold
                bg-gradient-to-r from-[var(--accent-700)] to-[var(--accent-950)]
                text-white shadow-[var(--shadow-sm)]
                hover:shadow-[var(--shadow-glow),var(--shadow-md)] hover:-translate-y-1
                transition-all duration-300 ease-[var(--ease-out)] cursor-pointer
                flex items-center gap-2.5"
            >
              Mulai Sekarang
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => openAuth("login")}
              className="h-13 px-8 rounded-2xl text-[15px] font-semibold
                text-[var(--text-secondary)] border border-[var(--border-light)]
                bg-white/40 backdrop-blur-sm
                hover:bg-white/60 hover:border-white/60 hover:shadow-[var(--shadow-sm)]
                transition-all duration-200 cursor-pointer"
            >
              Sudah Punya Akun
            </button>
          </div>
        </div>

        {/* ─── Feature Cards ─── */}
        <div className="max-w-4xl mx-auto mt-24 grid gap-5 sm:grid-cols-3 w-full">
          {[
            {
              icon: Sparkles,
              title: "AI Meal Planning",
              desc: "Rencana makan 7 hari yang dihasilkan AI berdasarkan database bahan makanan nyata dengan harga akurat.",
              gradient: "from-amber-400 to-orange-500",
              bg: "bg-amber-50",
            },
            {
              icon: Shield,
              title: "Budget Terkontrol",
              desc: "Tetapkan budget mingguan dan AI akan memastikan total biaya tidak melebihi batas yang kamu tentukan.",
              gradient: "from-[var(--accent-400)] to-[var(--accent-700)]",
              bg: "bg-[var(--accent-50)]",
            },
            {
              icon: TrendingUp,
              title: "Target Nutrisi",
              desc: "Pantau kalori dan protein harian. Setiap menu dioptimalkan untuk memenuhi target nutrisi kamu.",
              gradient: "from-blue-400 to-indigo-500",
              bg: "bg-blue-50",
            },
          ].map((feature) => (
            <div key={feature.title} className="landing-feature-card group">
              <div className={`h-11 w-11 rounded-2xl ${feature.bg} flex items-center justify-center mb-5
                group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`h-5 w-5 bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`}
                  style={{ color: feature.gradient.includes("accent") ? "var(--accent-600)" : undefined }}
                />
              </div>
              <h3 className="text-[16px] font-bold text-[var(--text-primary)] mb-2">
                {feature.title}
              </h3>
              <p className="text-[14px] text-[var(--text-tertiary)] leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="py-8 text-center">
        <p className="text-[13px] text-[var(--text-tertiary)]">
          &copy; {new Date().getFullYear()} SehatHemat. Meal planning made simple.
        </p>
      </footer>

      {/* ─── Auth Modal ─── */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
      />
    </div>
  )
}
