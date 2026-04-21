"use client"

import * as React from "react"
import { AlertCircle, Utensils, Check, X, RefreshCw } from "lucide-react"
import { MealPlannerForm, type UserTargets } from "@/components/meal-planner-form"
import { SummaryStats } from "@/components/summary-stats"
import { WeeklyPlanResult, type MealPlanDay } from "@/components/weekly-plan-result"

interface MealPlanResponse {
  result: {
    weekly_plan: MealPlanDay[]
  }
}

interface ActivePlanResponse {
  plan: {
    weeklyPlan: MealPlanDay[]
    budget: number
    targetCalories: number
    targetProtein: number
  } | null
}

// ─── Toast Notification Component ───
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

export default function DashboardPage() {
  const [mealPlan, setMealPlan] = React.useState<MealPlanDay[] | null>(null)
  const [userTargets, setUserTargets] = React.useState<UserTargets | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isFetchingPlan, setIsFetchingPlan] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [showForm, setShowForm] = React.useState(false)

  // Per-day save state
  const [savingDay, setSavingDay] = React.useState<string | null>(null)
  const [savedDays, setSavedDays] = React.useState<Set<string>>(new Set())
  const [toast, setToast] = React.useState<{
    message: string
    type: "success" | "error"
  } | null>(null)

  // ─── Fetch active plan on mount ───
  React.useEffect(() => {
    const fetchActivePlan = async () => {
      try {
        const response = await fetch("/api/active-plan")
        if (!response.ok) throw new Error("Failed to fetch")
        const data: ActivePlanResponse = await response.json()

        if (data.plan) {
          setMealPlan(data.plan.weeklyPlan as MealPlanDay[])
          setUserTargets({
            budget: data.plan.budget,
            targetCalories: data.plan.targetCalories,
            targetProtein: data.plan.targetProtein,
          })
          setShowForm(false)
        } else {
          setShowForm(true)
        }
      } catch {
        // If fetch fails, just show the form
        setShowForm(true)
      } finally {
        setIsFetchingPlan(false)
      }
    }

    fetchActivePlan()
  }, [])

  const handleGenerate = async (targets: UserTargets) => {
    setIsLoading(true)
    setError(null)
    setMealPlan(null)
    setUserTargets(targets)
    // Reset saved days on new generation
    setSavedDays(new Set())

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budget: targets.budget,
          targetCalories: targets.targetCalories,
          targetProtein: targets.targetProtein,
        }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `Server error (${response.status})`)
      }

      const data: MealPlanResponse = await response.json()

      if (!data.result?.weekly_plan || data.result.weekly_plan.length === 0) {
        throw new Error("AI returned an empty meal plan. Please try again.")
      }

      setMealPlan(data.result.weekly_plan)
      setShowForm(false)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewPlan = async () => {
    // Clear active plan from DB
    try {
      await fetch("/api/active-plan", { method: "DELETE" })
    } catch {
      // Non-critical
    }
    setMealPlan(null)
    setUserTargets(null)
    setSavedDays(new Set())
    setShowForm(true)
  }

  const handleSaveDay = async (day: MealPlanDay) => {
    if (!userTargets || savingDay) return

    setSavingDay(day.day)
    try {
      const response = await fetch("/api/meal-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dayName: day.day,
          meals: day.meals,
          totalProtein: day.total_protein,
          totalCalories: day.total_calories,
          dailyCost: day.daily_cost,
        }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || "Failed to save")
      }

      setSavedDays((prev) => new Set(prev).add(day.day))
      setToast({
        message: `${day.day}'s menu saved to favourites!`,
        type: "success",
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save"
      setToast({ message, type: "error" })
    } finally {
      setSavingDay(null)
    }
  }

  // ─── Initial loading state ───
  if (isFetchingPlan) {
    return (
      <div className="space-y-10 animate-fade-in-up">
        <div className="glass-card-static p-5 space-y-4">
          <div className="h-5 w-32 rounded-lg animate-shimmer" />
          <div className="h-3 w-64 rounded-full animate-shimmer" />
          <div className="grid gap-5 sm:grid-cols-3 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-xl animate-shimmer" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Form Container — Show if no active plan or user wants to regenerate */}
      {showForm && (
        <div className="animate-fade-in-up stagger-1">
          <div className="glass-card-static p-5">
            <MealPlannerForm onGenerate={handleGenerate} isLoading={isLoading} />
          </div>
        </div>
      )}

      {/* New Plan button — shown when there IS an active plan */}
      {mealPlan && !showForm && !isLoading && (
        <div className="flex justify-end animate-fade-in-up">
          <button
            onClick={handleNewPlan}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl
              text-[13px] font-semibold text-[var(--text-secondary)]
              border border-[var(--border-light)] bg-white/40 backdrop-blur-sm
              hover:bg-white/60 hover:border-white/60 hover:shadow-[var(--shadow-sm)]
              transition-all duration-200 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            New Plan
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 animate-fade-in-up">
          <div className="h-9 w-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <AlertCircle className="h-[18px] w-[18px] text-red-500" />
          </div>
          <div>
            <p className="text-[14px] font-bold text-red-800">Generation failed</p>
            <p className="text-[13px] text-red-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="space-y-10 animate-fade-in-up">
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card-static p-6 space-y-4">
                <div className="h-3 w-24 rounded-full animate-shimmer" />
                <div className="h-7 w-32 rounded-lg animate-shimmer" />
                <div className="h-2.5 w-20 rounded-full animate-shimmer" />
                <div className="h-2 w-full rounded-full animate-shimmer" />
              </div>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="glass-card-static p-6 space-y-4">
                <div className="h-5 w-20 rounded-lg animate-shimmer" />
                {[1, 2, 3].map((j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-3 w-14 rounded-full animate-shimmer" />
                    <div className="h-4 w-full rounded-lg animate-shimmer" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {mealPlan && userTargets && !isLoading && (
        <div className="space-y-10 animate-fade-in-up">
          <SummaryStats
            weeklyPlan={mealPlan}
            budget={userTargets.budget}
            targetCalories={userTargets.targetCalories}
            targetProtein={userTargets.targetProtein}
          />
          <WeeklyPlanResult
            weeklyPlan={mealPlan}
            onSaveDay={handleSaveDay}
            savingDay={savingDay}
            savedDays={savedDays}
          />
        </div>
      )}

      {/* Empty State — only when no plan and form is visible */}
      {!mealPlan && !isLoading && !error && showForm && (
        <div className="flex flex-col items-center justify-center py-28 text-center animate-fade-in-up stagger-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent-100)] to-[var(--accent-50)] mb-6 animate-glow">
            <Utensils className="h-7 w-7 text-[var(--accent-600)]" />
          </div>
          <h3 className="text-[18px] font-bold text-[var(--text-primary)]">
            No meal plan yet
          </h3>
          <p className="text-[14px] text-[var(--text-tertiary)] mt-2.5 max-w-md leading-relaxed">
            Fill in your weekly budget and daily nutrition targets above, then
            click &ldquo;Generate Meal Plan&rdquo; to get your personalized weekly menu.
          </p>
        </div>
      )}
    </div>
  )
}
