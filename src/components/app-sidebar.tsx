"use client"

import * as React from "react"
import {
  Apple,
  LayoutDashboard,
  Utensils,
  ChevronLeft,
  Menu,
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Favourite Meal Plans", url: "/dashboard/meal-plans", icon: Utensils },
  { title: "Ingredients", url: "/dashboard/ingredients", icon: Apple },
]

export function AppSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  const pathname = usePathname()

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen z-30
        flex flex-col
        bg-white/60 backdrop-blur-xl border-r border-white/40
        transition-all duration-300 ease-[var(--ease-out)]
        ${collapsed ? "w-[72px]" : "w-[260px]"}
      `}
    >
      {/* Logo Header */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-white/30 shrink-0">
        <div
          className="
            flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
            bg-gradient-to-br from-[var(--accent-700)] to-[var(--accent-950)]
            shadow-[var(--shadow-xs)]
          "
        >
          <Utensils className="h-4 w-4 text-white" />
        </div>
        <span
          className={`
            text-[16px] font-bold tracking-tight text-[var(--text-primary)]
            transition-all duration-300
            ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"}
          `}
        >
          SehatHemat
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-hidden">
        <p
          className={`
            px-3 mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]
            transition-all duration-300
            ${collapsed ? "opacity-0" : "opacity-100"}
          `}
        >
          Menu
        </p>
        {menuItems.map((item) => {
          const isActive = pathname === item.url
          return (
            <Link
              key={item.title}
              href={item.url}
              className={`
                group flex items-center gap-3 px-3 h-11 rounded-xl
                transition-all duration-200 ease-[var(--ease-out)]
                relative overflow-hidden
                ${collapsed ? "justify-center" : ""}
                ${
                  isActive
                    ? "bg-gradient-to-r from-[var(--accent-800)] to-[var(--accent-950)] text-white shadow-[var(--shadow-xs)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--accent-50)] hover:text-[var(--accent-900)]"
                }
              `}
            >
              <item.icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-white" : ""}`} />
              <span
                className={`
                  text-[14px] font-medium whitespace-nowrap
                  transition-all duration-300
                  ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"}
                `}
              >
                {item.title}
              </span>
              {/* Active glow */}
              {isActive && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

/* Mobile sidebar toggle button */
export function MobileSidebarTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="
        lg:hidden flex items-center justify-center
        h-9 w-9 rounded-xl
        text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]
        hover:bg-[var(--bg-input)]
        transition-all duration-200 cursor-pointer
      "
      aria-label="Toggle sidebar"
    >
      <Menu className="h-5 w-5" />
    </button>
  )
}
