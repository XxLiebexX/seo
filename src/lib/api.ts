import type {
  AnalysisDetail,
  AnalysisPage,
  AnalyzeAccepted,
  AnalyzeRequest,
  DashboardStats,
  ListParams,
} from '@/lib/types'

export class ApiError extends Error {
  status: number
  retryAfter: number | null

  constructor(message: string, status: number, retryAfter: number | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.retryAfter = retryAfter
  }
}

export function getClientId(): string {
  if (typeof window === 'undefined') return 'client-anonymous-12345678'
  let id = localStorage.getItem('seoul.client_id') || localStorage.getItem('ranklens.client_id')
  if (!id || !/^[A-Za-z0-9_-]{16,64}$/.test(id)) {
    id = 'client_' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
    id = id.padEnd(24, '0').slice(0, 32)
    localStorage.setItem('seoul.client_id', id)
  }
  return id
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers || {})
  if (!headers.has('X-Client-Id')) {
    headers.set('X-Client-Id', getClientId())
  }

  let res: Response
  try {
    res = await fetch(path, { ...init, headers })
  } catch {
    throw new ApiError('Cannot reach the server. Make sure the backend is running at http://localhost:8000.', 0)
  }

  if (!res.ok) {
    let message = 'Something went wrong'
    try {
      const data = (await res.json()) as Record<string, unknown>
      if (data && typeof data === 'object') {
        if (typeof data.detail === 'string') {
          message = data.detail
        } else if (Array.isArray(data.detail)) {
          message = data.detail
            .map((d: { msg?: string }) => d.msg || JSON.stringify(d))
            .join(', ')
        } else if (typeof data.message === 'string') {
          message = data.message
        }
      }
    } catch {
      message = res.statusText || message
    }

    const retryHeader = res.headers.get('Retry-After')
    const retryAfter = retryHeader ? parseInt(retryHeader, 10) : null
    throw new ApiError(message, res.status, Number.isFinite(retryAfter) ? retryAfter : null)
  }

  if (res.status === 204) {
    return undefined as T
  }

  return (await res.json()) as T
}

export function createAnalysis(body: AnalyzeRequest): Promise<AnalyzeAccepted> {
  return request<AnalyzeAccepted>('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function startDemo(): Promise<AnalyzeAccepted> {
  return request<AnalyzeAccepted>('/api/demo', {
    method: 'POST',
  })
}

export function getAnalysis(id: string): Promise<AnalysisDetail> {
  return request<AnalysisDetail>(`/api/analyses/${encodeURIComponent(id)}`)
}

export function listAnalyses(params: ListParams = {}): Promise<AnalysisPage> {
  const sp = new URLSearchParams()
  if (params.limit !== undefined) sp.set('limit', String(params.limit))
  if (params.offset !== undefined) sp.set('offset', String(params.offset))
  if (params.q) sp.set('q', params.q)
  if (params.sort) sp.set('sort', params.sort)
  if (params.order) sp.set('order', params.order)
  const qs = sp.toString()
  return request<AnalysisPage>(`/api/analyses${qs ? `?${qs}` : ''}`)
}

export function deleteAnalysis(id: string): Promise<void> {
  return request<void>(`/api/analyses/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}

export function getDashboardStats(): Promise<DashboardStats> {
  return request<DashboardStats>('/api/dashboard/stats')
}
