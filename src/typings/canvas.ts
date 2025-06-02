export interface CanvasDraftRequest {
  id: string;
  graph: Record<string, any>;
}

export interface CanvasDraftResponse {
  success: boolean;
  message?: string;
}

export interface CanvasDetailRequest {
  id: string;
}

export interface CanvasDetailResponse {
  id: string;
  name: string;
  graph: Record<string, any>;
} 