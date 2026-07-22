"use client"

import * as React from "react"
import { Utensils, Sparkles, Shield, TrendingUp, ArrowUpRight, BookOpen, Wallet, Bot } from "lucide-react"
import { AuthModal } from "@/components/auth-modal"

export default function LandingPage() {
  const [authOpen, setAuthOpen] = React.useState(false)
  const [authMode, setAuthMode] = React.useState<"login" | "signup">("login")
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const openAuth = (mode: "login" | "signup") => {
    setAuthMode(mode)
    setAuthOpen(true)
  }

  return (
    <div className="landing-page min-h-screen flex flex-col">
      {/* ─── Navigation ─── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white border-b border-gray-200 shadow-md"
          : "bg-transparent border-b border-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-400)]">
              <Utensils className="h-4 w-4 text-white" />
            </div>
            <span className="text-[20px] font-semibold tracking-tight text-[var(--text-primary)]">
              SehatHemat
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => openAuth("login")}
              className="h-10 px-6 rounded-full text-[15px] font-medium border border-[var(--border-light)]
                bg-[var(--text-primary)] text-white shadow-sm hover:bg-[var(--text-secondary)] transition-all duration-200 cursor-pointer"
            >
              Masuk
            </button>
            <button
              onClick={() => openAuth("signup")}
              className="h-10 px-6 rounded-full text-[15px] font-medium
                bg-[var(--accent-400)] text-white
                hover:bg-[var(--accent-500)]
                transition-all duration-250 cursor-pointer"
            >
              Mulai Gratis
            </button>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ─── */}
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 pt-24 pb-20 w-full max-w-[1600px] mx-auto">
        
        {/* Outer Container mimicking the reference image rounded shape */}
        <div className="relative w-full rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden bg-white border border-white shadow-sm min-h-[500px] md:min-h-[650px] flex items-center mb-16">
          
          {/* Background Pattern confined to this hero card */}
          <div 
            className="absolute inset-0 z-0 opacity-40 mix-blend-multiply bg-[url('/images/hero-bg.png')] bg-repeat bg-[length:350px_350px]"
          />
          {/* Subtle gradient to ensure text readability */}
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent" />
          
          {/* Main Content inside Hero Container */}
          <div className="relative z-10 w-full px-8 md:px-16 lg:px-24 py-20 flex flex-col md:flex-row justify-between items-center h-full">
            
            {/* Left Side: Text and CTA */}
            <div className="max-w-2xl text-left space-y-6">
              <p className="text-[14px] md:text-[16px] font-medium text-[var(--text-secondary)] flex items-center gap-2">
                #1 AI Meal Planner di Indonesia
              </p>
              
              <h1 className="text-5xl md:text-[80px] font-medium tracking-tight text-[var(--text-primary)] leading-[1.05]">
                Makan Sehat, <br />
                Hemat Budget
              </h1>
              
              <div className="flex items-center gap-8 pt-12">
                <button
                  onClick={() => openAuth("signup")}
                  className="flex items-center gap-3 text-[15px] font-semibold text-[var(--text-primary)] border-b border-[var(--text-primary)] pb-1.5 hover:text-[var(--accent-600)] hover:border-[var(--accent-600)] transition-colors cursor-pointer"
                >
                  Mulai Sekarang <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openAuth("login")}
                  className="flex items-center gap-3 text-[15px] font-semibold text-[var(--text-primary)] border-b border-[var(--text-primary)] pb-1.5 hover:text-[var(--accent-600)] hover:border-[var(--accent-600)] transition-colors cursor-pointer"
                >
                  Fitur Kami <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>            
          </div>
          
          {/* Stats Block overlapping bottom right corner (mimicking the reference cut-out) */}
          <div className="absolute bottom-0 right-0 bg-[var(--bg-primary)] rounded-tl-[3rem] px-12 py-10 hidden lg:flex gap-16 items-center">
              <div>
                  <p className="text-5xl font-medium text-[var(--text-primary)] tracking-tight">6 bln</p>
                  <p className="text-[14px] text-[var(--text-tertiary)] mt-3 leading-relaxed">Waktu hemat<br/>setiap tahunnya</p>
              </div>
              <div>
                  <p className="text-5xl font-medium text-[var(--text-primary)] tracking-tight">315</p>
                  <p className="text-[14px] text-[var(--text-tertiary)] mt-3 leading-relaxed">Pilihan resep<br/>sehat & hemat</p>
              </div>
              <div>
                  <p className="text-5xl font-medium text-[var(--text-primary)] tracking-tight">120K</p>
                  <p className="text-[14px] text-[var(--text-tertiary)] mt-3 leading-relaxed">Pengguna terbantu<br/>di Indonesia</p>
              </div>
          </div>
        </div>

        {/* Remove Feature Cards from Hero Main */}
      </main>

      {/* ─── Features Section ─── */}
      <section className="w-full bg-[#fcfcfd] py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-[var(--text-primary)]">
              Kualitas perencanaan, <span className="text-[var(--accent-400)]">dengan<br className="hidden md:block"/> fitur dan layanan terbaik</span>
            </h2>
          </div>

          {/* Grid Container */}
          <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-[var(--border-light)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-[var(--border-light)] gap-[1px]">
              {[
                {
                  icon: Sparkles,
                  title: "Perencanaan makanan pintar",
                  desc: "AI menyusun rencana makan 7 hari penuh berdasarkan database nyata, menghindari repetisi dan kebosanan.",
                },
                {
                  icon: Shield,
                  title: "Kualitas nutrisi terjaga",
                  desc: "Setiap resep telah dikurasi untuk memastikan asupan gizi dan kalori sesuai dengan target spesifik Anda.",
                },
                {
                  icon: TrendingUp,
                  title: "Layanan yang andal",
                  desc: "Akses menu planner Anda kapan saja dan di mana saja. Platform kami siap membantu kebutuhan makan Anda.",
                },
                {
                  icon: BookOpen,
                  title: "Panduan resep lengkap",
                  desc: "Kami menyediakan buku panduan digital dan instruksi masak yang mudah diikuti bahkan untuk pemula.",
                },
                {
                  icon: Wallet,
                  title: "Tepat sasaran budget",
                  desc: "Setiap bahan yang direkomendasikan dipastikan sesuai dengan batas anggaran mingguan yang Anda atur.",
                },
                {
                  icon: Bot,
                  title: "Berbasis kecerdasan buatan",
                  desc: "Anda bisa mengontrol dan melihat setiap menu dari HP Anda, sangat praktis dan mudah untuk digunakan.",
                },
              ].map((feature, i) => (
                <div key={i} className="bg-white p-10 lg:p-12 flex flex-col items-start hover:bg-gray-50/50 transition-colors">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-gray-100 flex items-center justify-center mb-8">
                    <feature.icon className="w-5 h-5 text-[var(--accent-400)]" />
                  </div>
                  <h3 className="text-[19px] font-medium text-[var(--text-primary)] mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-[14px] text-[var(--text-tertiary)] leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
