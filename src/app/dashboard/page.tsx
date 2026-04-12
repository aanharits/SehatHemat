"use client"

import * as React from "react"
import { AlertCircle, Utensils } from "lucide-react"
import { MealPlannerForm, type UserTargets } from "@/components/meal-planner-form"
import { SummaryStats } from "@/components/summary-stats"
import { WeeklyPlanResult } from "@/components/weekly-plan-result"

interface MealPlanDay {
  day: string
  meals: {
    breakfast: { menu: string; price: number }
    lunch: { menu: string; price: number }
    dinner: { menu: string; price: number }
  }
  total_protein: number
  total_calories: number
  daily_cost: number
}

interface MealPlanResponse {
  result: {
    weekly_plan: MealPlanDay[]
  }
}

export default function DashboardPage() {
  const [mealPlan, setMealPlan] = React.useState<MealPlanDay[] | null>(null)
  const [userTargets, setUserTargets] = React.useState<UserTargets | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleGenerate = async (targets: UserTargets) => {
    setIsLoading(true)
    setError(null)
    setMealPlan(null)
    setUserTargets(targets)

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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Form Container */}
      <div className="animate-fade-in-up stagger-1">
        <div className="glass-card-static p-5">
          <MealPlannerForm onGenerate={handleGenerate} isLoading={isLoading} />
        </div>
      </div>

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
          <WeeklyPlanResult weeklyPlan={mealPlan} />
        </div>
      )}

      {/* Empty State */}
      {!mealPlan && !isLoading && !error && (
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
