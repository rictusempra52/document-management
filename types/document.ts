// ユーザーロールの定義
export enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  USER = "USER"
}

// ベースとなる日時フィールド
interface TimeStamps {
  createdAt: string;
  updatedAt: string;
}

// マンション情報の型定義
export interface Building extends TimeStamps {
  id: number;
  name: string;
  address: string;
}

// ユーザー情報の型定義
export interface User extends TimeStamps {
  id: number;
  email: string;
  name: string;
  role: Role;
}

// ドキュメント情報の型定義
export interface Document extends TimeStamps {
  id: number;
  title: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  ocrText?: string;
  buildingId: number;
  building?: Building;
  userId: number;
  uploadedBy?: User;
  isPublished: boolean;
}

// ドキュメントアップロード用の型定義
export interface DocumentUpload {
  title: string;
  buildingId: number;
  file: File;
}

// ドキュメント検索用のクエリパラメータ
export interface DocumentSearchQuery {
  buildingId?: number;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// API レスポンスの型定義
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// ページネーション付きレスポンスの型定義
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
