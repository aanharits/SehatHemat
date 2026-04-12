"use client"

import { TrendingUp, Flame, Drumstick } from "lucide-react"

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

interface SummaryStatsProps {
  weeklyPlan: MealPlanDay[]
  budget: number
  targetCalories: number
  targetProtein: number
}

function formatRp(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value)
}

export function SummaryStats({
  weeklyPlan,
  budget,
  targetCalories,
  targetProtein,
}: SummaryStatsProps) {
  const totalCost = weeklyPlan.reduce((sum, d) => sum + d.daily_cost, 0)
  const avgCalories = Math.round(
    weeklyPlan.reduce((sum, d) => sum + d.total_calories, 0) / weeklyPlan.length
  )
  const avgProtein = Math.round(
    weeklyPlan.reduce((sum, d) => sum + d.total_protein, 0) / weeklyPlan.length
  )

  const costPercent = Math.min((totalCost / budget) * 100, 100)
  const calPercent = Math.min((avgCalories / targetCalories) * 100, 120)
  const proPercent = Math.min((avgProtein / targetProtein) * 100, 120)

  const getStatusColor = (percent: number, isCost = false) => {
    if (isCost) return percent <= 100 ? "emerald" : "red"
    if (percent >= 90 && percent <= 110) return "emerald"
    if (percent >= 75 && percent <= 120) return "amber"
    return "red"
  }

  const colorMap = {
    emerald: {
      text: "text-[var(--accent-800)]",
      bg: "bg-[var(--accent-50)]",
      icon: "text-[var(--accent-600)]",
      bar: "bg-gradient-to-r from-[var(--accent-500)] to-[var(--accent-700)]",
    },
    amber: {
      text: "text-amber-700",
      bg: "bg-amber-50",
      icon: "text-amber-600",
      bar: "bg-gradient-to-r from-amber-400 to-amber-600",
    },
    red: {
      text: "text-red-700",
      bg: "bg-red-50",
      icon: "text-red-500",
      bar: "bg-gradient-to-r from-red-400 to-red-600",
    },
  }

  const stats = [
    {
      label: "Total Weekly Cost",
      value: `Rp ${formatRp(totalCost)}`,
      sub: `of Rp ${formatRp(budget)} budget`,
      percent: costPercent,
      icon: TrendingUp,
      status: getStatusColor(costPercent, true),
    },
    {
      label: "Avg Daily Calories",
      value: `${formatRp(avgCalories)} kcal`,
      sub: `target ${formatRp(targetCalories)} kcal`,
      percent: calPercent,
      icon: Flame,
      status: getStatusColor(calPercent),
    },
    {
      label: "Avg Daily Protein",
      value: `${avgProtein}g`,
      sub: `target ${targetProtein}g`,
      percent: proPercent,
      icon: Drumstick,
      status: getStatusColor(proPercent),
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((s) => {
        const colors = colorMap[s.status as keyof typeof colorMap]
        return (
          <div key={s.label} className="glass-card p-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                {s.label}
              </p>
              <div className={`h-9 w-9 rounded-xl ${colors.bg} flex items-center justify-center`}>
                <s.icon className={`h-[18px] w-[18px] ${colors.icon}`} />
              </div>
            </div>

            {/* Value */}
            <p className={`text-[26px] font-extrabold tracking-tight leading-none ${colors.text}`}>
              {s.value}
            </p>
            <p className="text-[13px] text-[var(--text-tertiary)] mt-2">{s.sub}</p>

            {/* Progress Bar */}
            <div className="mt-5 h-2 w-full rounded-full bg-[var(--bg-input)] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-[var(--ease-out)] ${colors.bar}`}
                style={{ width: `${Math.min(s.percent, 100)}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
