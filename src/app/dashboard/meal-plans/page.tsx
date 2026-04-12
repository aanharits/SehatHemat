"use client"

import * as React from "react"
import Link from "next/link"
import { Heart, Sparkles, X, Check } from "lucide-react"
import { MealDayCard, DeleteDayAction } from "@/components/meal-day-card"
import type { MealData } from "@/components/meal-day-card"

// ─── Types ───

interface SavedMeal {
  id: string
  dayName: string
  meals: MealData
  totalProtein: number
  totalCalories: number
  dailyCost: number
  createdAt: string
}

// ─── Toast Component ───

function Toast({
  message,
  type,
  onClose,
}: {
  message: string
  type: "success" | "error"
  onClose: () => void
}) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50 flex items-center gap-3
        px-5 py-3.5 rounded-xl shadow-lg
        animate-fade-in-up
        ${
          type === "success"
            ? "bg-[var(--accent-900)] text-white"
            : "bg-red-600 text-white"
        }
      `}
      style={{ animationDuration: "0.3s" }}
    >
      <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 bg-white/15">
        {type === "success" ? (
          <Check className="h-4 w-4" />
        ) : (
          <X className="h-4 w-4" />
        )}
      </div>
      <p className="text-[13px] font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

// ─── Main Page ───

export default function MealPlansPage() {
  const [plans, setPlans] = React.useState<SavedMeal[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [toast, setToast] = React.useState<{
    message: string
    type: "success" | "error"
  } | null>(null)

  const fetchPlans = React.useCallback(async () => {
    try {
      const response = await fetch("/api/meal-plans")
      if (!response.ok) throw new Error("Failed to fetch saved meals")
      const data = await response.json()
      setPlans(data.plans || [])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load"
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const response = await fetch(`/api/meal-plans?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete")

      setPlans((prev) => prev.filter((p) => p.id !== id))
      setToast({ message: "Removed from favourites", type: "success" })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete"
      setToast({ message: msg, type: "error" })
    } finally {
      setDeletingId(null)
    }
  }

  // Group plans by day in weekday order (must be before early returns for Rules of Hooks)
  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const grouped = React.useMemo(() => {
    const map = new Map<string, SavedMeal[]>()
    for (const plan of plans) {
      const existing = map.get(plan.dayName) || []
      existing.push(plan)
      map.set(plan.dayName, existing)
    }
    return dayOrder
      .filter((day) => map.has(day))
      .map((day) => ({ day, meals: map.get(day)! }))
  }, [plans])

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 animate-fade-in-up">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card-static p-6 space-y-4">
            <div className="h-12 w-full rounded-lg animate-shimmer" />
            {[1, 2, 3].map((j) => (
              <div key={j} className="space-y-2">
                <div className="h-3 w-16 rounded-full animate-shimmer" />
                <div className="h-4 w-full rounded-lg animate-shimmer" />
              </div>
            ))}
            <div className="h-16 rounded-xl animate-shimmer" />
          </div>
        ))}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 animate-fade-in-up">
        <div className="h-9 w-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
          <X className="h-[18px] w-[18px] text-red-500" />
        </div>
        <div>
          <p className="text-[14px] font-bold text-red-800">Failed to load favourites</p>
          <p className="text-[13px] text-red-600 mt-0.5">{error}</p>
        </div>
      </div>
    )
  }

  // Empty state
  if (plans.length === 0) {
    return (
      <div className="space-y-8">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <div className="flex flex-col items-center justify-center py-28 text-center animate-fade-in-up stagger-1">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-pink-50 mb-6 animate-glow">
            <Heart className="h-7 w-7 text-pink-500" />
          </div>
          <h3 className="text-[18px] font-bold text-[var(--text-primary)]">
            No favourites yet
          </h3>
          <p className="text-[14px] text-[var(--text-tertiary)] mt-2.5 max-w-md leading-relaxed">
            Generate a meal plan from the Dashboard and tap the
            <Heart className="inline h-3.5 w-3.5 mx-1 text-pink-500" />
            button on the days you love. They&apos;ll be collected here.
          </p>
          <Link
            href="/dashboard"
            className="
              inline-flex items-center gap-2 mt-7 h-11 px-6
              bg-gradient-to-r from-[var(--accent-700)] to-[var(--accent-900)]
              text-white text-[13px] font-semibold rounded-xl
              shadow-[var(--shadow-sm)]
              hover:shadow-[var(--shadow-glow),var(--shadow-md)] hover:-translate-y-0.5
              transition-all duration-250 ease-[var(--ease-out)]
            "
          >
            <Sparkles className="h-4 w-4" />
            Generate Meal Plan
          </Link>
        </div>
      </div>
    )
  }


  // Plans grouped by day
  return (
    <div className="space-y-5">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div className="flex items-center gap-2.5">
          <Heart className="h-4 w-4 fill-pink-500 text-pink-500" />
          <p className="text-[13px] text-[var(--text-tertiary)]">
            {plans.length} favourite meal{plans.length !== 1 ? "s" : ""} saved
          </p>
        </div>
      </div>

      {/* Grouped by Day */}
      <div className="space-y-8">
        {grouped.map((group) => (
          <div key={group.day} className="animate-fade-in-up">
            {/* Day Section Header */}
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-[16px] font-bold text-[var(--primary)]">
                {group.day}
              </h3>
              <div className="flex-1 h-px bg-[var(--text-tertiary)]" />
              <span className="text-[12px] text-[var(--text-tertiary)] tabular-nums">
                {group.meals.length} {group.meals.length === 1 ? "plan" : "plans"}
              </span>
            </div>

            {/* Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {group.meals.map((plan, index) => (
                <MealDayCard
                  key={plan.id}
                  dayName={plan.dayName}
                  meals={plan.meals}
                  totalCalories={plan.totalCalories}
                  totalProtein={plan.totalProtein}
                  dailyCost={plan.dailyCost}
                  index={index}
                  headerAction={
                    <DeleteDayAction
                      isDeleting={deletingId === plan.id}
                      onDelete={() => handleDelete(plan.id)}
                    />
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
