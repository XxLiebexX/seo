import type { AnalyzeRequest } from '@/lib/types'

export const MIN_WORDS = 100
export const MAX_WORDS = 20_000
export const MAX_TITLE = 200
export const MAX_META = 400

export interface FormValues {
  keyword: string
  mode: 'text' | 'url'
  text: string
  url: string
  title: string
  meta: string
  country: string
}

export const emptyForm: FormValues = {
  keyword: '',
  mode: 'text',
  text: '',
  url: '',
  title: '',
  meta: '',
  country: 'us',
}

export function countWords(text: string): number {
  const trimmed = text.trim()
  return trimmed ? trimmed.split(/\s+/).length : 0
}

export function validateForm(form: FormValues): Record<string, string> {
  const errors: Record<string, string> = {}
  const kw = form.keyword.trim()

  if (!kw) {
    errors.keyword = 'Enter the keyword you want to rank for'
  } else if (kw.length < 2) {
    errors.keyword = 'Keyword must contain at least 2 characters'
  }

  if (form.mode === 'text') {
    const words = countWords(form.text)
    if (words < MIN_WORDS) {
      errors.text = `Paste at least ${MIN_WORDS} words (you have ${words})`
    } else if (words > MAX_WORDS) {
      errors.text = `Draft cannot exceed ${MAX_WORDS.toLocaleString()} words (you have ${words})`
    }
  } else {
    const raw = form.url.trim()
    if (!raw) {
      errors.url = 'Enter a full public URL starting with http:// or https://'
    } else {
      try {
        const u = new URL(raw)
        if (u.protocol !== 'http:' && u.protocol !== 'https:') {
          errors.url = 'Enter a full public URL starting with http:// or https://'
        }
      } catch {
        errors.url = 'Enter a full public URL starting with http:// or https://'
      }
    }
  }

  if (form.title.length > MAX_TITLE) {
    errors.title = `Title cannot exceed ${MAX_TITLE} characters`
  }
  if (form.meta.length > MAX_META) {
    errors.meta = `Meta description cannot exceed ${MAX_META} characters`
  }

  return errors
}

export function toRequest(form: FormValues): AnalyzeRequest {
  const req: AnalyzeRequest = {
    keyword: form.keyword.trim().replace(/\s+/g, ' '),
    country: form.country,
  }
  if (form.mode === 'text') {
    req.draft_text = form.text
    if (form.title.trim()) req.draft_title = form.title.trim()
    if (form.meta.trim()) req.meta_description = form.meta.trim()
  } else {
    req.draft_url = form.url.trim()
  }
  return req
}
