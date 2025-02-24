export interface AnalysisResult {
  task: string;
  result: string | null;
  error?: string;
}

export interface FileUploadResult {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}