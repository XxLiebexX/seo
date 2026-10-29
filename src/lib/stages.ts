import { Brain, Database, Globe, Search, Sparkles } from 'lucide-react'
import type { ComponentType } from 'react'

export interface Step {
  stage: string
  label: string
  detail: string
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
}

export const STAGE_PROGRESS: Record<string, number> = {
  queued: 2,
  searching: 10,
  scraping: 25,
  indexing: 50,
  analyzing: 65,
  generating: 80,
  done: 100,
}

export const STEPS: Step[] = [
  {
    stage: 'searching',
    label: 'Search top results',
    detail: 'Retrieving top ranking competitor URLs from search engine',
    icon: Search,
  },
  {
    stage: 'scraping',
    label: 'Scrape competitor pages',
    detail: 'Fetching and parsing competitor content',
    icon: Globe,
  },
  {
    stage: 'indexing',
    label: 'Index & extract content',
    detail: 'Chunking passages and generating semantic embeddings',
    icon: Database,
  },
  {
    stage: 'analyzing',
    label: 'Analyze gaps & metrics',
    detail: 'Comparing draft structure, intent, and keyword coverage',
    icon: Brain,
  },
  {
    stage: 'generating',
    label: 'Generate recommendations',
    detail: 'Synthesizing actionable suggestions and citations',
    icon: Sparkles,
  },
]

export function activeStepIndex(stage: string): number {
  if (stage === 'queued') return -1
  if (stage === 'done') return STEPS.length
  const idx = STEPS.findIndex((s) => s.stage === stage)
  return idx === -1 ? -1 : idx
}
