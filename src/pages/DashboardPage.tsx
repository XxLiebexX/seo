import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  Search,
  Sparkles,
  TrendingUp,
  Award,
  BarChart3,
  Flame,
} from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Section } from '@/components/common'
import { ScoreTrendChart, TopKeywordsChart } from '@/components/DashboardCharts'
import { HistoryTable } from '@/components/HistoryTable'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress, Skeleton } from '@/components/ui/misc'
import { useDashboardStats } from '@/hooks/useDashboard'
import { pct } from '@/lib/format'
import type { DashboardStats } from '@/lib/types'

function Kpi({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: ReactNode
  hint?: ReactNode
  icon?: typeof Sparkles
}) {
  return (
    <Card className="glass-card relative overflow-hidden p-5 transition-all duration-300 hover:shadow-md hover:border-primary/40">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-foreground">{value}</p>
        </div>
        {Icon && (
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-5" />
          </div>
        )}
      </div>
      {hint && <div className="mt-3 text-xs text-muted-foreground">{hint}</div>}
    </Card>
  )
}

function Change({ value }: { value: number | null }) {
  if (value === null) return <>Run two or more analyses to see a trend</>
  const Icon = value > 0 ? ArrowUpRight : value < 0 ? ArrowDownRight : Minus
  const tone = value > 0 ? 'text-success font-semibold' : value < 0 ? 'text-destructive font-semibold' : ''
  return (
    <span className={`inline-flex items-center gap-1 ${tone}`}>
      <Icon className="size-3.5" aria-hidden="true" />
      {value > 0 ? '+' : ''}
      {value} since the first shown analysis
    </span>
  )
}

function Kpis({ s }: { s: DashboardStats }) {
  const fmt = (n: number | null) => (n === null ? '–' : Math.round(n))
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Kpi label="Analyses" value={s.total_analyses} icon={BarChart3} />
      <Kpi label="Average score" value={fmt(s.avg_score)} icon={TrendingUp} />
      <Kpi label="Best score" value={fmt(s.best_score)} icon={Award} />
      <Kpi
        label="Latest score"
        value={fmt(s.latest_score)}
        hint={<Change value={s.score_change} />}
        icon={Flame}
      />
    </div>
  )
}

function EmptyState() {
  return (
    <Card className="glass-card mx-auto max-w-xl p-8 sm:p-12 text-center">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
        <Search className="size-7" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-2xl font-bold tracking-tight">No analyses yet</h2>
      <p className="mx-auto mt-2.5 max-w-sm text-sm text-muted-foreground leading-relaxed">
        Your scores, trends and most common content gaps will appear here after your first analysis.
        History is private to this browser.
      </p>
      <Button asChild variant="gradient" className="mt-6 shadow-md shadow-primary/25">
        <Link to="/">Analyze a draft</Link>
      </Button>
    </Card>
  )
}

export default function DashboardPage() {
  const stats = useDashboardStats()
  useEffect(() => {
    document.title = 'Dashboard · Seoul'
  }, [])

  if (stats.isLoading) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    )
  }
  if (stats.isError || !stats.data) {
    return (
      <Card className="glass-card mx-auto max-w-xl p-8 text-center" role="alert">
        <h1 className="text-xl font-bold">Could not load the dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">{stats.error?.message ?? 'No data available.'}</p>
        <Button variant="outline" className="mt-6" onClick={() => void stats.refetch()}>
          Retry
        </Button>
      </Card>
    )
  }
  const s = stats.data
  const empty = s.total_analyses === 0

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your analyses over time. Stored privately in this browser.
          </p>
        </div>
        {!empty && (
          <Button asChild size="sm" variant="gradient">
            <Link to="/">+ New Analysis</Link>
          </Button>
        )}
      </div>

      {empty ? (
        <EmptyState />
      ) : (
        <>
          <Kpis s={s} />

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold tracking-tight">Score over time</h2>
                <span className="text-xs text-muted-foreground">Historical progression</span>
              </div>
              {s.score_trend.length > 1 ? (
                <ScoreTrendChart points={s.score_trend} />
              ) : (
                <div className="py-16 text-center text-sm text-muted-foreground">
                  <TrendingUp className="mx-auto size-8 opacity-30 mb-2" />
                  <p>Run another analysis to see your trend curve.</p>
                </div>
              )}
            </Card>

            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold tracking-tight">Top keywords</h2>
                <span className="text-xs text-muted-foreground">Highest frequency queries</span>
              </div>
              <TopKeywordsChart keywords={s.top_keywords} />
            </Card>
          </div>

          <Section
            id="common-gaps"
            title="Most common content gaps"
            description={`Topics competitors cover that your drafts missed, across your latest ${s.gap_sample_size} ${s.gap_sample_size === 1 ? 'analysis' : 'analyses'}.`}
          >
            {s.common_gaps.length === 0 ? (
              <p className="text-sm text-muted-foreground">No content gaps found. Nice work.</p>
            ) : (
              <Card className="glass-card p-6">
                <ul className="space-y-4">
                  {s.common_gaps.map((g) => (
                    <li key={g.label} className="group">
                      <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {g.label}
                        </span>
                        <span className="tabular-nums text-xs text-muted-foreground">
                          {g.count} of {s.gap_sample_size} · <strong className="text-foreground">{pct(g.share)}</strong>
                        </span>
                      </div>
                      <Progress value={g.share * 100} label={`${g.label} gap frequency`} className="h-2 rounded-full" />
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </Section>
        </>
      )}

      <Section id="history" title="History">
        <HistoryTable />
      </Section>
    </div>
  )
}
