'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, GitCompare, Shield, ArrowLeft } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Обзор', icon: LayoutDashboard },
  { href: '/dashboard/compare', label: 'Сравнение', icon: GitCompare },
  { href: '/dashboard/fairness', label: 'Fairness', icon: Shield },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <aside className="w-[220px] border-r border-gray-200 bg-white flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-100">
          <Link href="/" className="font-display text-lg font-semibold tracking-tight text-[#010042]">
            talgap
          </Link>
          <p className="text-[10px] text-gray-400 mt-0.5">Dashboard комиссии</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors duration-100 ${
                  isActive
                    ? 'bg-[#010042] text-white'
                    : 'text-gray-400 hover:text-[#010042] hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Clean context — no colored boxes */}
        <div className="p-5 border-t border-gray-100">
          <p className="text-[11px] text-gray-400 leading-relaxed border-l-2 border-[#010042]/10 pl-3 mb-4">
            AI ранжирует, человек решает. Gemini 2.5 Flash с chain-of-thought reasoning.
          </p>
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#010042] transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            На главную
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
