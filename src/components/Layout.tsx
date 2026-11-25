import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const LINKS: [string, string][] = [
  ['/', 'Analyze'],
  ['/dashboard', 'Dashboard'],
  ['/how-it-works', 'How it works'],
]

export function SeoulLogo({ className }: { className?: string }) {
  return (
    <div className={cn('relative flex size-7 items-center justify-center', className)}>
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-sm" />
      <svg viewBox="0 0 100 100" className="relative size-full text-primary" aria-hidden="true">
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeWidth="16"
          fill="none"
          strokeDasharray="251.2"
          strokeDashoffset="60"
        />
        <circle cx="50" cy="50" r="22" fill="currentColor" />
      </svg>
    </div>
  )
}

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col selection:bg-primary/20 selection:text-primary">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-card focus:px-4 focus:py-2 focus:shadow-lg focus:ring-2 focus:ring-primary"
      >
        Skip to content
      </a>

      {/* Modern Frosted Sticky Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/75 backdrop-blur-xl transition-all duration-200 print:hidden">
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="group flex items-center gap-2.5 font-bold tracking-tight text-foreground transition-transform hover:scale-[1.02]"
              onClick={() => setMobileMenuOpen(false)}
            >
              <SeoulLogo className="transition-transform duration-300 group-hover:rotate-12" />
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight">Seoul</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <nav aria-label="Main" className="flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 p-1 backdrop-blur-md">
              {LINKS.map(([to, label]) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-background text-foreground shadow-sm shadow-black/5 font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/50',
                    )
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 ml-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileMenuOpen((o) => !o)}
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border/60 bg-background/95 backdrop-blur-2xl px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <nav aria-label="Mobile Main" className="flex flex-col gap-1">
              {LINKS.map(([to, label]) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground font-semibold'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main id="main" className="container flex-1 py-8 sm:py-12">
        <Outlet />
      </main>

      {/* Modern Sleek Footer */}
      <footer className="border-t border-border/50 bg-background/50 backdrop-blur-md py-8 print:hidden">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <SeoulLogo className="size-4" />
            <span className="font-semibold text-foreground">Seoul</span>
            <span>· Deterministic SEO Intelligence with RAG</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Vector Engine Ready
            </span>
            <span>·</span>
            <Link to="/how-it-works" className="hover:text-foreground transition-colors">
              Methodology
            </Link>
            <span>·</span>
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              Trends
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
