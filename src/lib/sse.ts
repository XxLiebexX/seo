import { getClientId } from '@/lib/api'
import type { ProgressEvent } from '@/lib/types'

export interface StreamOptions {
  signal?: AbortSignal
  onEvent: (event: ProgressEvent) => void
}

export async function streamProgress(id: string, options: StreamOptions): Promise<void> {
  const res = await fetch(`/api/analyses/${encodeURIComponent(id)}/events`, {
    signal: options.signal,
    headers: {
      Accept: 'text/event-stream',
      'X-Client-Id': getClientId(),
    },
  })

  if (!res.ok || !res.body) {
    return
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      const parts = buffer.split('\n\n')
      buffer = parts.pop() ?? ''

      for (const block of parts) {
        let eventType = 'message'
        let eventData = ''

        const lines = block.split('\n')
        for (const line of lines) {
          if (line.startsWith('event:')) {
            eventType = line.slice(6).trim()
          } else if (line.startsWith('data:')) {
            eventData = line.slice(5).trim()
          }
        }

        if (eventData) {
          try {
            const parsed = JSON.parse(eventData) as ProgressEvent
            options.onEvent(parsed)
            if (eventType === 'done' || eventType === 'error' || parsed.status === 'done' || parsed.status === 'error') {
              return
            }
          } catch {
            // ignore JSON parse error in event stream
          }
        }
      }
    }
  } catch (err: unknown) {
    if ((err as Error)?.name === 'AbortError') return
    throw err
  }
}
