export type Status = 'pending' | 'running' | 'done' | 'failed'
export type Severity = 'high' | 'medium' | 'low'
export type LlmStatus = 'ok' | 'partial' | 'skipped' | 'failed'
export type SortKey = 'keyword' | 'score' | 'created_at'
export type SortOrder = 'asc' | 'desc'

export interface TopicGap {
  cluster_id: number
  label: string
  label_source: string
  page_count: number
  page_share: number
  coverage: number
  is_gap: boolean
  severity: Severity
  draft_similarity: number
  reference_similarity: number
  example_headings: string[]
  top_terms: string[]
  evidence_chunk_ids: string[]
}

export interface StructureMetrics {
  draft_words: number
  median_competitor_words: number
  draft_headings: number
  median_competitor_headings: number
  draft_readability: number
  median_competitor_readability: number
}

export interface PlacementCheck {
  element: string
  available: boolean
  status: 'exact' | 'partial' | 'missing' | 'not_provided'
}

export interface CompetitorSummary {
  rank: number
  url: string
  title: string
  word_count: number
  headings: number
}

export interface Source {
  n: number
  url: string
  title: string
  rank: number
}

export interface Evidence {
  source_n: number
  chunk_id: string
  heading: string
  excerpt: string
}

export interface GapRecommendation {
  cluster_id: number
  label: string
  severity: Severity
  heading_suggestion: string
  recommendation: string
  citations: number[]
  evidence: Evidence[]
  generated_by: 'llm' | 'template'
  model_cited: boolean
}

export interface OutlineItem {
  level: number
  heading: string
  notes: string
}

export interface SeoSuggestions {
  title: string
  meta_description: string
  outline: OutlineItem[]
  title_has_keyword: boolean
  meta_has_keyword: boolean
}

export interface ScoreComponent {
  name: string
  score: number
  max_score: number
  reason: string
}

export interface IntentResult {
  primary: string
  confidence: number
  scores: Record<string, number>
  cues: string[]
}

export interface Keyphrase {
  phrase: string
  pages: number
  page_share: number
  in_draft: boolean
}

export interface AnalysisResult {
  keyword: string
  draft_title: string | null
  draft_meta_description: string | null
  score: number
  components: ScoreComponent[]
  topics: TopicGap[]
  keyphrases: Keyphrase[]
  placement: PlacementCheck[]
  structure: StructureMetrics
  serp_intent: IntentResult
  draft_intent: IntentResult
  intent_match: number
  competitors: CompetitorSummary[]
  embedder: string
  n_clusters: number
  sources: Source[]
  recommendations: GapRecommendation[]
  suggestions: SeoSuggestions | null
  llm_status: LlmStatus
  llm_message: string
}

export interface AnalysisSummary {
  id: string
  keyword: string
  status: Status
  score: number | null
  is_demo: boolean
  created_at: string
}

export interface AnalysisDetail extends AnalysisSummary {
  country: string
  stage: string | null
  result: AnalysisResult | null
  error: string | null
}

export interface AnalyzeRequest {
  keyword: string
  draft_text?: string
  draft_url?: string
  draft_title?: string
  meta_description?: string
  country?: string
}

export interface AnalyzeAccepted {
  analysis_id: string
  status: Status
  events_url: string
}

export interface AnalysisPage {
  items: AnalysisSummary[]
  total: number
  limit: number
  offset: number
}

export interface ListParams {
  limit?: number
  offset?: number
  q?: string
  sort?: SortKey
  order?: SortOrder
}

export interface TrendPoint {
  id: string
  keyword: string
  score: number
  created_at: string
}

export interface KeywordStat {
  keyword: string
  count: number
  avg_score: number
}

export interface GapStat {
  label: string
  count: number
  share: number
}

export interface DashboardStats {
  total_analyses: number
  avg_score: number | null
  best_score: number | null
  latest_score: number | null
  score_change: number | null
  score_trend: TrendPoint[]
  top_keywords: KeywordStat[]
  common_gaps: GapStat[]
  gap_sample_size: number
}

export interface ProgressEvent {
  analysis_id: string
  stage: string
  status: 'running' | 'done' | 'error'
  message: string
  progress: number
  seq?: number
  data?: Record<string, unknown>
}

export interface HealthResponse {
  status: 'ok'
  app: string
  version: string
  llm_provider: string
  serp_provider: 'serper' | 'duckduckgo'
}
