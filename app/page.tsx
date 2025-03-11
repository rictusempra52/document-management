"use client";

import { useEffect, useState } from "react";
import { Document } from "@/types/document";
import DocumentList from "@/components/DocumentList";
import DocumentForm from "@/components/DocumentForm";

export default function Home() {
  // ドキュメント一覧の状態管理
  const [documents, setDocuments] = useState<Document[]>([]);
  // 読み込み状態の管理
  const [loading, setLoading] = useState(true);

  // ドキュメント一覧を取得
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

  // 新規ドキュメントの作成
  const createDocument = async (title: string, content: string) => {
    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        // 作成成功後、一覧を更新
        fetchDocuments();
      }
    } catch (error) {
      console.error("ドキュメントの作成に失敗しました:", error);
    }
  };

  // コンポーネントのマウント時にドキュメント一覧を取得
  useEffect(() => {
    fetchDocuments();
  }, []);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ドキュメント管理システム</h1>
      
      {/* 新規作成フォーム */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">新規ドキュメント作成</h2>
        <DocumentForm onSubmit={createDocument} />
      </section>

      {/* ドキュメント一覧 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">ドキュメント一覧</h2>
        <DocumentList
          documents={documents}
          onDocumentDeleted={fetchDocuments}
        />
      </section>
    </main>
  );
}
