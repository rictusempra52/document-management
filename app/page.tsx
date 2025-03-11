"use client";

import { useEffect, useState } from "react";
import { Document, Building } from "@/types/document";
import DocumentList from "@/components/DocumentList";
import DocumentForm from "@/components/DocumentForm";

export default function Home() {
  // 状態管理
  const [documents, setDocuments] = useState<Document[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);

  // ドキュメント一覧の取得
  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/documents");
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("ドキュメントの取得に失敗しました:", error);
    } finally {
      setLoading(false);
    }
  };

  // マンション一覧の取得
  const fetchBuildings = async () => {
    try {
      const response = await fetch("/api/buildings");
      const data = await response.json();
      setBuildings(data);
    } catch (error) {
      console.error("マンション一覧の取得に失敗しました:", error);
    }
  };

  // 新規ドキュメントのアップロード
  const handleUpload = async (title: string, file: File, buildingId: number) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('file', file);
      formData.append('buildingId', buildingId.toString());

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // アップロード成功後、一覧を更新
        fetchDocuments();
      }
    } catch (error) {
      console.error("ドキュメントのアップロードに失敗しました:", error);
    }
  };

  // コンポーネントのマウント時にデータを取得
  useEffect(() => {
    fetchBuildings();
    fetchDocuments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">マンション書類管理システム</h1>
      
      {/* 新規アップロードフォーム */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">書類のアップロード</h2>
        <DocumentForm
          buildings={buildings}
          onSubmit={handleUpload}
        />
      </section>

      {/* ドキュメント一覧 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">書類一覧</h2>
        <DocumentList
          documents={documents}
          buildings={buildings}
          onDocumentDeleted={fetchDocuments}
        />
      </section>
    </main>
  );
}
