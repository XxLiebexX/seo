import { useMutation } from '@tanstack/react-query'
import {
  ChevronDown,
  FileText,
  Link2,
  Loader2,
  Search,
  Play,
  Sparkles,
  Wand2,
  Clock,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { CharCounter } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Label, Select, Textarea } from '@/components/ui/input'
import { useToast } from '@/components/toast'
import { Alert, Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/misc'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ApiError, createAnalysis, startDemo } from '@/lib/api'
import { EXAMPLE_KEYWORD, EXAMPLE_TEXT } from '@/lib/example'
import {
  countWords,
  emptyForm,
  MAX_META,
  MAX_TITLE,
  MAX_WORDS,
  MIN_WORDS,
  toRequest,
  validateForm,
  type FormValues,
} from '@/lib/validate'
import { cn } from '@/lib/utils'

const COUNTRIES: [string, string][] = [
  ['us', 'United States'],
  ['gb', 'United Kingdom'],
  ['in', 'India'],
  ['ca', 'Canada'],
  ['au', 'Australia'],
  ['de', 'Germany'],
  ['fr', 'France'],
  ['es', 'Spain'],
  ['br', 'Brazil'],
  ['sg', 'Singapore'],
  ['ae', 'United Arab Emirates'],
]

const QUICK_KEYWORDS = [
  'best running shoes',
  'sustainable coffee brewing',
  'remote team onboarding',
]

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-destructive animate-in fade-in-50 duration-200">
      {message}
    </p>
  )
}

export default function AnalyzerPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormValues>(emptyForm)
  const [submitted, setSubmitted] = useState(false)
  const [optionalOpen, setOptionalOpen] = useState(false)

  useEffect(() => {
    document.title = 'Seoul · SEO Content Optimizer'
  }, [])

  const errors = validateForm(form)
  const shown = submitted ? errors : {}
  const words = countWords(form.text)
  const readingTime = Math.max(1, Math.ceil(words / 220))
  const set = <K extends keyof FormValues>(k: K, v: FormValues[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const toast = useToast()
  const mutation = useMutation({
    mutationFn: createAnalysis,
    onSuccess: (res) => navigate(`/analysis/${res.analysis_id}`),
  })
  const demo = useMutation({
    mutationFn: startDemo,
    onSuccess: (res) => navigate(`/analysis/${res.analysis_id}`),
    onError: (e: Error) => toast.error(e.message || 'The demo is unavailable right now.'),
  })

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length > 0) return
    mutation.mutate(toRequest(form))
  }

  function loadExample() {
    setForm({ ...emptyForm, keyword: EXAMPLE_KEYWORD, text: EXAMPLE_TEXT, mode: 'text' })
    setSubmitted(false)
  }

  const apiError = mutation.error instanceof ApiError ? mutation.error : null
  const retryMinutes = apiError?.retryAfter ? Math.ceil(apiError.retryAfter / 60) : null
  const errorText = apiError
    ? apiError.status === 429 && retryMinutes
      ? `${apiError.message.replace(/\s*Try again later\.?\s*$/i, '')} You can try again in about ${retryMinutes} minute${retryMinutes > 1 ? 's' : ''}.`
      : apiError.message
    : ''

  return (
    <div className="mx-auto max-w-3xl space-y-8 sm:space-y-10">
      {/* Modern Hero Section */}
      <div className="text-center relative">
        {/* Glow backdrop decoration */}
        <div className="pointer-events-none absolute left-1/2 -top-12 -translate-x-1/2 size-72 rounded-full bg-primary/10 blur-3xl dark:bg-primary/20" />

        <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md mb-6 shadow-sm">
          <Sparkles className="size-3.5 animate-pulse" />
          <span>Next-Gen Content Intelligence · RAG over Live SERP</span>
        </div>

        <h1 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          See exactly what your draft is{' '}
          <span className="text-gradient">missing to rank</span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground sm:text-lg">
          Seoul fetches Google’s top ranking pages in real time, computes semantic vector gaps, and tells you exactly what to write — backed by source citations.
        </p>


        {/* Instant Demo Launcher */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full shadow-xs hover:border-primary/50"
              onClick={() => demo.mutate()}
              disabled={demo.isPending}
            >
              {demo.isPending ? <Loader2 className="animate-spin" /> : <Play className="size-3 text-primary fill-primary" />}
              <span>Try demo analysis</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-full text-xs"
              onClick={loadExample}
            >
              <Wand2 className="size-3.5 text-muted-foreground" />
              <span>Load example draft</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Explore a full competitor analysis instantly with zero API keys required.
          </p>
        </div>
      </div>

      {/* Main Analyzer Form Card */}
      <Card className="glass-card p-6 sm:p-9 border border-border/80 shadow-xl shadow-black/5 dark:shadow-black/20">
        <form onSubmit={onSubmit} noValidate className="space-y-6">
          {/* Target Keyword and Search Country */}
          <div className="grid gap-4 sm:grid-cols-[1fr_13rem]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="keyword" className="font-semibold text-sm">Target keyword</Label>
                <span className="text-[11px] text-muted-foreground">What you want to rank for</span>
              </div>
              <Input
                id="keyword"
                className="rounded-xl h-11 bg-background/80 shadow-xs focus-visible:ring-primary/40 text-base"
                placeholder="e.g. best running shoes"
                value={form.keyword}
                onChange={(e) => set('keyword', e.target.value)}
                aria-invalid={!!shown.keyword}
                aria-describedby={shown.keyword ? 'keyword-error' : undefined}
                maxLength={120}
                autoComplete="off"
              />
              <FieldError id="keyword-error" message={shown.keyword} />

              {/* Quick suggestion pills */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-muted-foreground text-[11px]">Popular:</span>
                {QUICK_KEYWORDS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => set('keyword', k)}
                    className="rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-muted transition-colors"
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="country" className="font-semibold text-sm">Search country</Label>
              </div>
              <Select
                id="country"
                className="rounded-xl h-11 bg-background/80 shadow-xs text-sm"
                value={form.country}
                onChange={(e) => set('country', e.target.value)}
              >
                {COUNTRIES.map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <Tabs value={form.mode} onValueChange={(v) => set('mode', v as FormValues['mode'])}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
              <TabsList aria-label="Draft source" className="bg-muted/60 p-1 rounded-xl">
                <TabsTrigger value="text" className="rounded-lg text-xs sm:text-sm font-medium">
                  <FileText className="size-3.5" aria-hidden="true" />
                  Paste text
                </TabsTrigger>
                <TabsTrigger value="url" className="rounded-lg text-xs sm:text-sm font-medium">
                  <Link2 className="size-3.5" aria-hidden="true" />
                  From URL
                </TabsTrigger>
              </TabsList>

              <Button type="button" variant="ghost" size="sm" onClick={loadExample} className="text-xs text-muted-foreground hover:text-foreground">
                <Wand2 className="size-3.5" /> Try an example draft
              </Button>
            </div>

            <TabsContent value="text" className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="draft-text" className="font-semibold text-sm">
                  Your draft
                </Label>
                {words > 0 && (
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    <span>~{readingTime} min read</span>
                  </span>
                )}
              </div>
              <Textarea
                id="draft-text"
                placeholder="Paste your article or draft here in markdown or plain text…"
                value={form.text}
                onChange={(e) => set('text', e.target.value)}
                aria-invalid={!!shown.text}
                aria-describedby={cn('draft-count', shown.text && 'draft-error')}
                rows={11}
                className="rounded-xl bg-background/80 p-4 text-sm font-mono leading-relaxed shadow-xs focus-visible:ring-primary/40 resize-y"
              />
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>
                  Tip: start headings with <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">#</code>,{' '}
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">##</code> or{' '}
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">###</code> so structure is scored.
                </span>
                <span
                  id="draft-count"
                  className={cn(
                    'tabular-nums font-medium inline-flex items-center gap-1',
                    words >= MIN_WORDS && words <= MAX_WORDS ? 'text-success' : '',
                  )}
                >
                  {words >= MIN_WORDS && words <= MAX_WORDS && (
                    <CheckCircle2 className="size-3.5 text-success" />
                  )}
                  {words.toLocaleString()} words · min {MIN_WORDS}
                </span>
              </div>
              <FieldError id="draft-error" message={shown.text} />
            </TabsContent>

            <TabsContent value="url" className="mt-4">
              <Label htmlFor="draft-url" className="font-semibold text-sm mb-2 block">
                Draft URL
              </Label>
              <Input
                id="draft-url"
                type="url"
                inputMode="url"
                placeholder="https://yourdomain.com/your-article"
                value={form.url}
                onChange={(e) => set('url', e.target.value)}
                aria-invalid={!!shown.url}
                aria-describedby={cn('url-help', shown.url && 'url-error')}
                className="rounded-xl h-11 bg-background/80 shadow-xs text-sm"
              />
              <p id="url-help" className="mt-2 text-xs text-muted-foreground">
                We fetch the public page and read its title, meta description and headings
                automatically. Private and internal addresses are blocked.
              </p>
              <FieldError id="url-error" message={shown.url} />
            </TabsContent>
          </Tabs>

          {/* Optional Title Tag & Meta Description Accordion */}
          {form.mode === 'text' && (
            <Collapsible open={optionalOpen} onOpenChange={setOptionalOpen}>
              <CollapsibleTrigger className="group flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                <ChevronDown
                  className={cn('size-4 transition-transform duration-200', !optionalOpen && '-rotate-90')}
                  aria-hidden="true"
                />
                <span>Add title tag &amp; meta description (optional)</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-4 rounded-xl border border-border/60 bg-muted/20 p-4">
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="title" className="text-sm font-medium">Title tag</Label>
                    <CharCounter value={form.title.length} max={MAX_TITLE} />
                  </div>
                  <Input
                    id="title"
                    className="mt-1.5 rounded-xl bg-background/80"
                    placeholder="e.g. 10 Best Running Shoes for Marathoners in 2026"
                    value={form.title}
                    onChange={(e) => set('title', e.target.value)}
                    aria-invalid={!!shown.title}
                  />
                  <FieldError id="title-error" message={shown.title} />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="meta" className="text-sm font-medium">Meta description</Label>
                    <CharCounter value={form.meta.length} max={MAX_META} />
                  </div>
                  <Textarea
                    id="meta"
                    className="mt-1.5 rounded-xl bg-background/80 min-h-[84px]"
                    placeholder="Brief summary that would appear in search snippets…"
                    rows={3}
                    value={form.meta}
                    onChange={(e) => set('meta', e.target.value)}
                    aria-invalid={!!shown.meta}
                  />
                  <FieldError id="meta-error" message={shown.meta} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Providing these lets the placement score check your keyword in them and compare
                  your title with our suggestion.
                </p>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* API Error Alert */}
          {apiError && (
            <Alert variant="destructive" className="rounded-xl">
              <p>{errorText}</p>
            </Alert>
          )}
          {mutation.error && !apiError && (
            <Alert variant="destructive" className="rounded-xl">
              <p>Something went wrong. Please try again.</p>
            </Alert>
          )}

          {/* Action Submit Button */}
          <Button
            type="submit"
            size="lg"
            variant="gradient"
            className="w-full h-13 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="animate-spin size-5" /> Starting Analysis…
              </>
            ) : (
              <>
                <Search className="size-5" /> Analyze my draft
                <ArrowRight className="size-4 ml-1 opacity-80" />
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  )
}
