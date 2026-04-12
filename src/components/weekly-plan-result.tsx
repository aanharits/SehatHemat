"use client"

import { MealDayCard, SaveDayAction } from "@/components/meal-day-card"
import type { MealPlanDay } from "@/components/meal-day-card"

// Re-export the type so existing imports still work
export type { MealPlanDay }

interface WeeklyPlanResultProps {
  weeklyPlan: MealPlanDay[]
  onSaveDay?: (day: MealPlanDay) => Promise<void>
  savingDay?: string | null
  savedDays?: Set<string>
}

export function WeeklyPlanResult({ weeklyPlan, onSaveDay, savingDay, savedDays }: WeeklyPlanResultProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[20px] font-bold tracking-tight text-[var(--text-primary)]">
          Weekly Meal Plan
        </h2>
        <p className="text-[13px] text-[var(--text-tertiary)] mt-1">
          Your personalized meal schedule for the week. Save the days you like!
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {weeklyPlan.map((day, index) => {
          const isSaving = savingDay === day.day
          const isSaved = savedDays?.has(day.day) ?? false

          return (
            <MealDayCard
              key={day.day}
              dayName={day.day}
              meals={day.meals}
              totalCalories={day.total_calories}
              totalProtein={day.total_protein}
              dailyCost={day.daily_cost}
              index={index}
              headerAction={
                onSaveDay ? (
                  <SaveDayAction
                    isSaving={isSaving}
                    isSaved={isSaved}
                    onSave={() => onSaveDay(day)}
                  />
                ) : undefined
              }
            />
          )
        })}
      </div>
    </div>
  )
}
