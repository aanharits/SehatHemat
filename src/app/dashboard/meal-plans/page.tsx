import { Utensils, Clock } from "lucide-react"

export default function MealPlansPage() {
  return (
    <div className="space-y-8">


      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-28 text-center animate-fade-in-up stagger-1">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent-100)] to-[var(--accent-50)] mb-6 animate-glow">
          <Utensils className="h-7 w-7 text-[var(--accent-600)]" />
        </div>
        <h3 className="text-[18px] font-bold text-[var(--text-primary)]">
          No saved plans
        </h3>
        <p className="text-[14px] text-[var(--text-tertiary)] mt-2.5 max-w-md leading-relaxed">
          Generated meal plans will appear here. Go to the Dashboard to create your first plan.
        </p>
        <div className="flex items-center gap-2 mt-5 text-[13px] text-[var(--text-tertiary)] bg-[var(--bg-input)] px-4 py-2 rounded-full">
          <Clock className="h-3.5 w-3.5" />
          <span className="font-medium">Coming soon — save and compare plans</span>
        </div>
      </div>
    </div>
  )
}
