import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'
import { Section } from '@/components/common'
import { PipelineDiagram } from '@/components/PipelineDiagram'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const WEIGHTS: [string, number, string][] = [
  ['Topic coverage', 30, 'How well your draft covers the subtopics the top pages share.'],
  ['Keyword & phrase coverage', 20, 'Phrases that appear across many top pages and are missing from yours.'],
  ['Keyword placement', 15, 'Your keyword in the title, H1, first 100 words and meta description.'],
  ['Structure & length', 15, 'Word count and heading count versus the competitor median.'],
  ['Search intent match', 10, 'Whether your draft serves the intent the results show (guide, comparison, shop…).'],
  ['Readability', 10, 'Flesch reading ease compared with the pages that rank.'],
]

export default function HowItWorksPage() {
  useEffect(() => {
    document.title = 'How it works · Seoul'
  }, [])

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="max-w-2xl">
        <Badge variant="gradient" className="mb-4">
          <Sparkles className="size-3" /> Architecture &amp; Methodology
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
          How Seoul works
        </h1>
        <p className="mt-4 text-muted-foreground sm:text-lg leading-relaxed">
          Seoul combines live Google SERP web scraping with retrieval-augmented generation (RAG). Every
          recommendation is derived from actual ranking passages so you get verifiable, citation-backed advice.
        </p>
      </div>

      {/* Pipeline Diagram */}
      <Section
        id="pipeline"
        title="The pipeline"
        description="Six named steps run in order as a LangGraph graph. Progress streams to your screen as each one starts."
      >
        <Card className="glass-card p-6 sm:p-8">
          <PipelineDiagram />
        </Card>
      </Section>

      {/* Score Weights Breakdown */}
      <Section
        id="score"
        title="How the score is calculated"
        description="The score is deterministic: the same inputs give the same number. The AI only writes advice, never the score."
      >
        <Card className="glass-card divide-y divide-border/60 overflow-hidden shadow-md">
          {WEIGHTS.map(([name, pts, why]) => (
            <div key={name} className="flex items-center gap-5 p-5 transition-colors hover:bg-muted/30">
              <div className="flex flex-col items-center justify-center w-14 shrink-0 rounded-xl bg-primary/10 py-2 text-primary">
                <span className="text-2xl font-black tabular-nums tracking-tight">
                  {pts}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">pts</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground text-base">{name}</h3>
                  <span className="text-xs text-muted-foreground font-mono">({pts}% weight)</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground leading-normal">{why}</p>
              </div>
            </div>
          ))}
        </Card>
      </Section>

      {/* Key Guarantees & Limits */}
      <Section id="limits" title="What to keep in mind">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="glass-card p-5">
            <div className="flex items-center gap-2 font-semibold text-sm mb-2 text-primary">
              <CheckCircle2 className="size-4" />
              <span>Deterministic Reliability</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Scores measure alignment with today’s top ranking pages using mathematical vector similarity and readability formulas.
            </p>
          </Card>

          <Card className="glass-card p-5">
            <div className="flex items-center gap-2 font-semibold text-sm mb-2 text-amber-500">
              <AlertCircle className="size-4" />
              <span>Competitor Scraping Threshold</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              At least 4 competitor pages are indexed. Pages with anti-bot shields or paywalls are safely bypassed.
            </p>
          </Card>
        </div>

        <div className="mt-8 flex items-center justify-start">
          <Button asChild size="lg" variant="gradient" className="shadow-lg shadow-primary/25">
            <Link to="/">
              Analyze a draft now <ArrowRight className="size-4 ml-1" />
            </Link>
          </Button>
        </div>
      </Section>
    </div>
  )
}
