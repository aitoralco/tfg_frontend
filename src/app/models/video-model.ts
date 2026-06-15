export type StatusName =
  | 'error'
  | 'unprocessed'
  | 'processing_0'
  | 'processing_dw'
  | 'processing_ew'
  | 'processing_dem'
  | 'processed';

export interface VideoStatus {
  id: number;
  status_name: StatusName;
}

export interface VideoPreview {
  id: number;
  title: string;
  description: string | null;
  file_name: string;
  uploader: string;
  created_at: string;
  preview: string | null;
  shared: boolean;
  status: VideoStatus;
}

export interface VideoPreviewResponse {
  previews: VideoPreview[];
  total: number;
  offset: number;
  limit: number;
}

export interface Video {
  id: number;
  user_id: number;
  title: string;
  file_name: string;
  description: string;
  shared: boolean;
  status: VideoStatus;
  created_at: string;
  updated_at: string;
}

export interface ClassificationClass {
  count: number;
  percentage: number;
  avg_confidence: number;
}

export interface Classification {
  total_images: number;
  classified_images: number;
  errors: number;
  classes: Record<string, ClassificationClass>;
}

export interface VideoInfo {
  id: number;
  title: string;
  description: string | null;
  uploader: string;
  created_at: string;
  status: VideoStatus;
  shared: boolean;
  thumbnail: string | null;
  dw: { available: boolean; video_key: string | null; label_count: number };
  ew: { available: boolean; crop_count: number };
  dem: { available: boolean; txt_count: number; crop_count: number };
  classification: Classification | null;
}

export interface Crop {
  key: string;
  url: string;
}

export interface CropResponse {
  crops: Crop[];
  total: number;
  offset: number;
  limit: number;
}
