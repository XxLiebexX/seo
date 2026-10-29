import type { AnalysisResult } from '@/lib/types'

export function buildMarkdownReport(result: AnalysisResult): string {
  const lines: string[] = []

  lines.push(`# SEO Content Optimization Report: "${result.keyword}"`)
  lines.push('')
  lines.push(`**Overall SEO Score:** ${Math.round(result.score)} / 100`)
  lines.push('')

  if (result.components && result.components.length > 0) {
    lines.push('## Score Breakdown')
    lines.push('')
    lines.push('| Component | Score | Max | Reason |')
    lines.push('|---|---|---|---|')
    for (const c of result.components) {
      lines.push(`| ${c.name} | ${c.score} | ${c.max_score} | ${c.reason} |`)
    }
    lines.push('')
  }

  const gaps = result.topics?.filter((t) => t.is_gap) || []
  if (gaps.length > 0) {
    lines.push('## Content Gaps & Opportunities')
    lines.push('')
    for (const gap of gaps) {
      lines.push(`### ${gap.label} (${gap.severity.toUpperCase()} priority)`)
      lines.push(`- **Draft coverage:** ${Math.round(gap.coverage * 100)}%`)
      lines.push(`- **Competitor coverage:** ${gap.page_count} competitors`)
      const rec = result.recommendations?.find((r) => r.cluster_id === gap.cluster_id)
      if (rec) {
        if (rec.heading_suggestion) {
          lines.push(`- **Suggested Heading:** ${rec.heading_suggestion}`)
        }
        lines.push(`- **Recommendation:** ${rec.recommendation}`)
      }
      lines.push('')
    }
  }

  if (result.suggestions) {
    lines.push('## On-Page Suggestions')
    lines.push('')
    if (result.suggestions.title) {
      lines.push(`- **Suggested Title:** ${result.suggestions.title}`)
    }
    if (result.suggestions.meta_description) {
      lines.push(`- **Suggested Meta Description:** ${result.suggestions.meta_description}`)
    }
    if (result.suggestions.outline && result.suggestions.outline.length > 0) {
      lines.push('')
      lines.push('### Suggested Outline')
      for (const item of result.suggestions.outline) {
        const prefix = '#'.repeat(item.level)
        lines.push(`${prefix} ${item.heading}`)
        if (item.notes) {
          lines.push(`> ${item.notes}`)
        }
      }
    }
    lines.push('')
  }

  if (result.competitors && result.competitors.length > 0) {
    lines.push('## Top Competitors Analyzed')
    lines.push('')
    lines.push('| Rank | Title | Words | Headings | URL |')
    lines.push('|---|---|---|---|---|')
    for (const comp of result.competitors) {
      lines.push(`| #${comp.rank} | ${comp.title || 'Untitled'} | ${comp.word_count} | ${comp.headings} | ${comp.url} |`)
    }
    lines.push('')
  }

  return lines.join('\n')
}
