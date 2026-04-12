"use client"

import * as React from "react"
import { Coffee, Sun, Moon, Heart, Loader2, Trash2 } from "lucide-react"

// ─── Shared Types ───

export interface MealData {
  breakfast: { menu: string; price: number }
  lunch: { menu: string; price: number }
  dinner: { menu: string; price: number }
}

export interface MealPlanDay {
  day: string
  meals: MealData
  total_protein: number
  total_calories: number
  daily_cost: number
}

// ─── Config ───

function formatRp(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value)
}

const mealConfig = [
  { key: "breakfast" as const, label: "Breakfast", icon: Coffee, accent: "text-amber-500" },
  { key: "lunch" as const, label: "Lunch", icon: Sun, accent: "text-orange-400" },
  { key: "dinner" as const, label: "Dinner", icon: Moon, accent: "text-indigo-400" },
]

// ─── Card Props ───

interface MealDayCardProps {
  /** Day name displayed in the banner (e.g., "Monday") */
  dayName: string
  /** Meal data: breakfast, lunch, dinner */
  meals: MealData
  /** Nutrition / cost stats */
  totalCalories: number
  totalProtein: number
  dailyCost: number
  /** Card stagger animation index */
  index?: number
  /** Action slot rendered inside the green banner (right side) */
  headerAction?: React.ReactNode
}

const staggerClasses = [
  "stagger-1", "stagger-2", "stagger-3", "stagger-4",
  "stagger-5", "stagger-6", "stagger-7",
]

// ─── Reusable Meal Day Card ───

export function MealDayCard({
  dayName,
  meals,
  totalCalories,
  totalProtein,
  dailyCost,
  index = 0,
  headerAction,
}: MealDayCardProps) {
  return (
    <div
      className={`glass-card overflow-hidden flex flex-col animate-fade-in-up ${staggerClasses[index % 7] || ""}`}
    >
      {/* Day Header Banner */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/30 bg-white/30">
        <h3 className="text-[15px] font-bold text-[var(--accent-900)] tracking-tight">
          {dayName}
        </h3>
        {headerAction}
      </div>

      {/* Meals */}
      <div className="px-6 pt-5 pb-5 space-y-4 flex-1">
        {mealConfig.map((m) => {
          const mealData = meals[m.key]
          return (
            <div key={m.key}>
              <div className="flex items-center gap-2 mb-1.5">
                <m.icon className={`h-3.5 w-3.5 ${m.accent}`} />
                <span className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[var(--text-tertiary)]">
                  {m.label}
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

      {/* Stats Footer */}
      <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-input)]/50 px-6 py-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[var(--text-tertiary)] mb-0.5">
              Calories
            </p>
            <p className="text-[14px] font-bold text-[var(--text-primary)] tabular-nums">
              {formatRp(totalCalories)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[var(--text-tertiary)] mb-0.5">
              Protein
            </p>
            <p className="text-[14px] font-bold text-[var(--text-primary)] tabular-nums">
              {totalProtein}g
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[var(--text-tertiary)] mb-0.5">
              Cost
            </p>
            <p className="text-[14px] font-bold text-[var(--accent-700)] tabular-nums">
              Rp {formatRp(dailyCost)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Pre-built Header Actions ───

/** Save button for dashboard (heart icon) */
export function SaveDayAction({
  isSaving,
  isSaved,
  onSave,
}: {
  isSaving: boolean
  isSaved: boolean
  onSave: () => void
}) {
  return (
    <button
      onClick={onSave}
      disabled={isSaving || isSaved}
      title={isSaved ? "Saved to favourites" : "Save this day"}
      className={`
        group inline-flex items-center gap-1.5 h-8 px-3
        rounded-lg text-[12px] font-semibold
        transition-all duration-200 ease-[var(--ease-out)]
        cursor-pointer
        ${
          isSaved
            ? "bg-pink-50 text-pink-600 border border-pink-200"
            : "bg-white text-[var(--text-tertiary)] hover:bg-pink-50 hover:text-pink-500 border border-[var(--border-light)] hover:border-pink-200 shadow-[var(--shadow-xs)]"
        }
        disabled:cursor-not-allowed
      `}
    >
      {isSaving ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Heart
          className={`h-3.5 w-3.5 transition-all duration-200 ${
            isSaved
              ? "fill-pink-500 text-pink-500"
              : "group-hover:text-pink-500"
          }`}
        />
      )}
      {isSaving ? "Saving" : isSaved ? "Saved" : "Save"}
    </button>
  )
}

/** Delete button for favourites page (trash icon) */
export function DeleteDayAction({
  isDeleting,
  onDelete,
}: {
  isDeleting: boolean
  onDelete: () => void
}) {
  return (
    <button
      onClick={onDelete}
      disabled={isDeleting}
      className="
        h-7 w-7 rounded-lg flex items-center justify-center shrink-0
        text-[var(--text-tertiary)] hover:text-red-500 hover:bg-red-50
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
      "
      title="Remove from favourites"
    >
      {isDeleting ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Trash2 className="h-3.5 w-3.5" />
      )}
    </button>
  )
}
