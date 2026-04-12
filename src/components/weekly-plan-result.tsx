"use client"

import { Coffee, Sun, Moon } from "lucide-react"

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

interface WeeklyPlanResultProps {
  weeklyPlan: MealPlanDay[]
}

function formatRp(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value)
}

const staggerClass = [
  "stagger-1", "stagger-2", "stagger-3", "stagger-4",
  "stagger-5", "stagger-6", "stagger-7",
]

const mealConfig = [
  { key: "breakfast" as const, label: "Breakfast", icon: Coffee, accent: "text-amber-500" },
  { key: "lunch" as const, label: "Lunch", icon: Sun, accent: "text-orange-400" },
  { key: "dinner" as const, label: "Dinner", icon: Moon, accent: "text-indigo-400" },
]

export function WeeklyPlanResult({ weeklyPlan }: WeeklyPlanResultProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[20px] font-bold tracking-tight text-[var(--text-primary)]">
          Weekly Meal Plan
        </h2>
        <p className="text-[13px] text-[var(--text-tertiary)] mt-1">
          Your personalized meal schedule for the week.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {weeklyPlan.map((day, index) => (
          <div
            key={day.day}
            className={`glass-card overflow-hidden animate-fade-in-up ${staggerClass[index] || ""}`}
          >
            {/* Day Header */}
            <div className="px-6 pt-5 pb-2">
              <h3 className="text-[16px] font-bold text-[var(--accent-900)]">
                {day.day}
              </h3>
            </div>

            {/* Meals */}
            <div className="px-6 pb-5 space-y-4">
              {mealConfig.map((meal) => {
                const mealData = day.meals[meal.key]
                return (
                  <div key={meal.key}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <meal.icon className={`h-3.5 w-3.5 ${meal.accent}`} />
                      <span className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[var(--text-tertiary)]">
                        {meal.label}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed flex-1">
                        {mealData.menu}
                      </p>
                      <span className="text-[13px] font-bold text-[var(--accent-700)] whitespace-nowrap shrink-0 tabular-nums">
                        Rp {formatRp(mealData.price)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer Stats */}
            <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-input)]/50 px-6 py-4 grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--text-tertiary)] mb-0.5">
                  Calories
                </p>
                <p className="text-[14px] font-bold text-[var(--text-primary)] tabular-nums">
                  {formatRp(day.total_calories)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--text-tertiary)] mb-0.5">
                  Protein
                </p>
                <p className="text-[14px] font-bold text-[var(--text-primary)] tabular-nums">
                  {day.total_protein}g
                </p>
              </div>
              <div className="text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--text-tertiary)] mb-0.5">
                  Cost
                </p>
                <p className="text-[14px] font-bold text-[var(--accent-700)] tabular-nums">
                  Rp {formatRp(day.daily_cost)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
