import type { Severity } from '@/lib/types'

export type Tone = 'success' | 'warning' | 'danger'

export interface ScoreBandInfo {
  label: string
  tone: Tone
  blurb: string
}

export function scoreBand(score: number): ScoreBandInfo {
  if (score < 50) {
    return {
      label: 'Weak',
      tone: 'danger',
      blurb: 'Your draft has major content gaps and missed search intent compared to top-ranking competitors.',
    }
  }
  if (score < 70) {
    return {
      label: 'Needs work',
      tone: 'warning',
      blurb: 'A solid foundation, but competitors cover several important subtopics that your draft leaves out.',
    }
  }
  if (score < 85) {
    return {
      label: 'Good',
      tone: 'success',
      blurb: 'Strong topical coverage and intent alignment. Addressing key gaps will help you compete with the top results.',
    }
  }
  return {
    label: 'Excellent',
    tone: 'success',
    blurb: 'Comprehensive coverage matching or exceeding top-ranking competitor depth, structure, and intent.',
  }
}

export const SEVERITY_LABEL: Record<Severity, string> = {
  high: 'High priority',
  medium: 'Medium priority',
  low: 'Low priority',
}

export function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function pct(val: number): string {
  return `${Math.round(val * 100)}%`
}

export function formatDate(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
