"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { X, Mail, Lock, User, Loader2, Eye, EyeOff } from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase-browser"

type AuthMode = "login" | "signup"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: AuthMode
}

export function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = React.useState<AuthMode>(initialMode)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [fullName, setFullName] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)

  const supabase = React.useMemo(() => createSupabaseBrowserClient(), [])

  // Reset form state when mode changes
  React.useEffect(() => {
    setError(null)
    setSuccess(null)
  }, [mode])

  // Reset everything when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
      setEmail("")
      setPassword("")
      setFullName("")
      setError(null)
      setSuccess(null)
      setShowPassword(false)
    }
  }, [isOpen, initialMode])

  const handleGoogleAuth = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Google sign-in failed"
      setError(message)
      setIsLoading(false)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error

        // If email confirmation is required
        if (data.user && !data.session) {
          setSuccess("Check your email for a confirmation link!")
          setIsLoading(false)
          return
        }

        // If auto-confirmed, upsert user and redirect
        if (data.user) {
          await fetch("/api/auth/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: data.user.id,
              email: data.user.email,
              displayName: fullName || null,
              avatarUrl: null,
            }),
          })
          window.location.href = "/dashboard"
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error

        if (data.user) {
          await fetch("/api/auth/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: data.user.id,
              email: data.user.email,
              displayName:
                data.user.user_metadata?.full_name || null,
              avatarUrl:
                data.user.user_metadata?.avatar_url || null,
            }),
          })
          window.location.href = "/dashboard"
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed"
      setError(message)
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[var(--accent-950)]/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="auth-modal-card relative z-10 w-full max-w-[420px]"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 h-8 w-8 rounded-lg flex items-center justify-center
                text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-white/50
                transition-all duration-200 cursor-pointer z-10"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="text-center pt-8 pb-6 px-8">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl
                bg-gradient-to-br from-[var(--accent-700)] to-[var(--accent-950)] shadow-[var(--shadow-sm)] mb-4">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-[22px] font-bold text-[var(--text-primary)] tracking-tight">
                    {mode === "login" ? "Selamat Datang" : "Buat Akun Baru"}
                  </h2>
                  <p className="text-[14px] text-[var(--text-tertiary)] mt-1.5">
                    {mode === "login"
                      ? "Masuk untuk melanjutkan ke dashboard"
                      : "Daftar untuk mulai merencanakan menu sehat"}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Body */}
            <div className="px-8 pb-8 space-y-5">
              {/* Google OAuth */}
              <button
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full h-12 rounded-xl border border-[var(--border-light)]
                  bg-white/60 backdrop-blur-sm
                  flex items-center justify-center gap-3
                  text-[14px] font-semibold text-[var(--text-secondary)]
                  hover:bg-white/80 hover:border-white/70 hover:shadow-[var(--shadow-sm)]
                  transition-all duration-200 cursor-pointer
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Lanjutkan dengan Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-[var(--border-light)]" />
                <span className="text-[12px] font-medium text-[var(--text-tertiary)] uppercase tracking-widest">atau</span>
                <div className="flex-1 h-px bg-[var(--border-light)]" />
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleEmailAuth} className="space-y-3.5">
                <AnimatePresence mode="wait">
                  {mode === "signup" && (
                    <motion.div
                      key="name-field"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
                        <input
                          type="text"
                          placeholder="Nama lengkap"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          disabled={isLoading}
                          className="auth-input pl-11"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="auth-input pl-11"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={mode === "signup" ? "Buat password (min. 6 karakter)" : "Password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={isLoading}
                    className="auth-input pl-11 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]
                      hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Error */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[13px] font-medium text-red-500 bg-red-50 px-4 py-2.5 rounded-xl"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Success */}
                {success && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[13px] font-medium text-[var(--accent-700)] bg-[var(--accent-50)] px-4 py-2.5 rounded-xl"
                  >
                    {success}
                  </motion.p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl
                    bg-gradient-to-r from-[var(--accent-800)] to-[var(--accent-950)]
                    text-white text-[14px] font-semibold
                    hover:shadow-[var(--shadow-glow),var(--shadow-md)] hover:-translate-y-0.5
                    transition-all duration-250 ease-[var(--ease-out)]
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
                    cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {mode === "login" ? "Masuk..." : "Mendaftar..."}
                    </>
                  ) : (
                    mode === "login" ? "Masuk" : "Buat Akun"
                  )}
                </button>
              </form>

              {/* Toggle mode */}
              <p className="text-center text-[13px] text-[var(--text-tertiary)]">
                {mode === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
                <button
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="font-semibold text-[var(--accent-700)] hover:text-[var(--accent-800)]
                    transition-colors cursor-pointer underline underline-offset-2"
                >
                  {mode === "login" ? "Daftar" : "Masuk"}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
