"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { AppSidebar, MobileSidebarTrigger } from "@/components/app-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const pathname = usePathname()

  let title = "Dashboard"
  let desc = "Plan, optimize, and manage your weekly meals with ease."

  if (pathname === "/dashboard/ingredients") {
    title = "Ingredients"
    desc = "Browse and manage your ingredients database."
  } else if (pathname === "/dashboard/meal-plans") {
    title = "Favourite Meal Plans"
    desc = "View and manage your saved weekly meal plans."
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AppSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 left-0 z-30 lg:hidden">
            <AppSidebar
              collapsed={false}
              onToggle={() => setMobileOpen(false)}
            />
          </div>
        </>
      )}

      {/* Main content */}
      <div
        className={`
          flex-1 flex flex-col min-h-screen transition-all duration-300 ease-[var(--ease-out)]
          ${collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"}
        `}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 px-6 lg:px-10 bg-white/40 backdrop-blur-xl border-b border-white/30">
          <MobileSidebarTrigger onClick={() => setMobileOpen(true)} />
          <div className="flex items-center gap-3">
            <h1 className="text-[17px] font-bold text-[var(--text-primary)]">{title}</h1>
            <div className="hidden sm:block h-4 w-px bg-[var(--border-light)]" />
            <p className="hidden sm:block text-[14px] text-[var(--text-tertiary)]">{desc}</p>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-6 pb-8 pt-5 lg:px-10 lg:pb-10 lg:pt-8 max-w-[1200px] w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
