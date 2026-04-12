"use client"

import * as React from "react"
import { Loader2, Sparkles } from "lucide-react"

export interface UserTargets {
  budget: number
  targetCalories: number
  targetProtein: number
}

interface MealPlannerFormProps {
  onGenerate: (data: UserTargets) => void
  isLoading: boolean
}

function formatRupiah(value: string): string {
  const num = value.replace(/\D/g, "")
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

function parseRupiah(value: string): number {
  return parseInt(value.replace(/\./g, ""), 10) || 0
}

export function MealPlannerForm({ onGenerate, isLoading }: MealPlannerFormProps) {
  const [budgetDisplay, setBudgetDisplay] = React.useState("")
  const [calories, setCalories] = React.useState("")
  const [protein, setProtein] = React.useState("")
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    const budgetVal = parseRupiah(budgetDisplay)
    const calVal = parseInt(calories, 10)
    const proVal = parseInt(protein, 10)

    if (!budgetVal || budgetVal < 50000)
      newErrors.budget = "Minimum budget Rp 50.000"
    if (!calVal || calVal < 500 || calVal > 5000)
      newErrors.calories = "Between 500–5000 kcal"
    if (!proVal || proVal < 10 || proVal > 300)
      newErrors.protein = "Between 10–300 g"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onGenerate({
      budget: parseRupiah(budgetDisplay),
      targetCalories: parseInt(calories, 10),
      targetProtein: parseInt(protein, 10),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 ">
      {/* Section Title */}
      <div>
        <h2 className="text-[18px] font-bold text-[var(--text-primary)]">
          Plan Your Week
        </h2>
        <p className="text-[13px] text-[var(--text-tertiary)] mt-1">
          Set your budget and nutrition targets to generate a personalized meal plan.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {/* Budget */}
        <div className="space-y-2">
          <label
            htmlFor="budget"
            className="block text-[13px] font-semibold text-[var(--text-secondary)] tracking-tight"
          >
            Weekly Budget
          </label>
          <div className="relative">
            <input
              id="budget"
              type="text"
              inputMode="numeric"
              placeholder="350.000"
              value={budgetDisplay}
              onChange={(e) => setBudgetDisplay(formatRupiah(e.target.value))}
              disabled={isLoading}
              className="input-field pl-10"
            />
          </div>
          {errors.budget && (
            <p className="text-[12px] font-medium text-red-500">{errors.budget}</p>
          )}
        </div>

        {/* Calories */}
        <div className="space-y-2">
          <label
            htmlFor="calories"
            className="block text-[13px] font-semibold text-[var(--text-secondary)] tracking-tight"
          >
            Daily Calories
          </label>
          <div className="relative">
            <input
              id="calories"
              type="number"
              placeholder="2100"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              disabled={isLoading}
              className="input-field pr-14"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-medium text-[var(--text-tertiary)]">
              kcal
            </span>
          </div>
          {errors.calories && (
            <p className="text-[12px] font-medium text-red-500">{errors.calories}</p>
          )}
        </div>

        {/* Protein */}
        <div className="space-y-2">
          <label
            htmlFor="protein"
            className="block text-[13px] font-semibold text-[var(--text-secondary)] tracking-tight"
          >
            Daily Protein
          </label>
          <div className="relative">
            <input
              id="protein"
              type="number"
              placeholder="140"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              disabled={isLoading}
              className="input-field pr-14"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-medium text-[var(--text-tertiary)]">
              gram
            </span>
          </div>
          {errors.protein && (
            <p className="text-[12px] font-medium text-red-500">{errors.protein}</p>
          )}
        </div>
      </div>

      <button type="submit" disabled={isLoading} className="btn-primary">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generate Meal Plan
          </>
        )}
      </button>
    </form>
  )
}
