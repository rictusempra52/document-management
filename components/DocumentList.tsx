"use client";

import { useState } from "react";
import { Document } from "@/types/document";
import DocumentForm from "./DocumentForm";

interface DocumentListProps {
    documents: Document[];
    onDocumentDeleted: () => void;
}

export default function DocumentList({
    documents,
    onDocumentDeleted,
}: DocumentListProps) {
    const [editingId, setEditingId] = useState<number | null>(null);

    // ドキュメントの更新
    const handleUpdate = async (id: number, title: string) => {
        try {
            const response = await fetch(`/api/documents/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title }),
            });

            if (response.ok) {
                setEditingId(null);
                onDocumentDeleted(); // 一覧を更新
            }
        } catch (error) {
            console.error("ドキュメントの更新に失敗しました:", error);
        }
    };

    // ドキュメントの削除
    const handleDelete = async (id: number) => {
        if (!confirm("本当に削除しますか？")) return;

        try {
            const response = await fetch(`/api/documents/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                onDocumentDeleted(); // 一覧を更新
            }
        } catch (error) {
            console.error("ドキュメントの削除に失敗しました:", error);
        }
    };

    // 日付のフォーマット
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // ファイルサイズのフォーマット
    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    };

    if (documents.length === 0) {
        return <p>ドキュメントがありません。</p>;
    }

    return (
        <div className="space-y-4">
            {documents.map((doc) => (
                <div
                    key={doc.id}
                    className="border rounded-lg p-4 bg-white shadow-sm"
                >
                    {editingId === doc.id ? (
                        // 編集フォーム
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">ドキュメントの編集</h3>
                            <DocumentForm
                                initialTitle={doc.title}
                                onSubmit={(title) => handleUpdate(doc.id, title)}
                                buttonText="更新"
                            />
                            <button
                                onClick={() => setEditingId(null)}
                                className="mt-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                            >
                                キャンセル
                            </button>
                        </div>
                    ) : (
                        // ドキュメント表示
                        <>
                            <h3 className="text-lg font-semibold">{doc.title}</h3>
                            {doc.ocrText && (
                                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">OCRテキスト</h4>
                                    <p className="text-gray-600 whitespace-pre-wrap text-sm">{doc.ocrText}</p>
                                </div>
                            )}
                            <div className="mt-4 text-sm text-gray-500">
                                <p>ファイル名: {doc.fileName}</p>
                                <p>ファイルサイズ: {formatFileSize(doc.fileSize)}</p>
                                <p>タイプ: {doc.mimeType}</p>
                                <p>作成: {formatDate(doc.createdAt)}</p>
                                <p>更新: {formatDate(doc.updatedAt)}</p>
                                {doc.building && (
                                    <p>マンション: {doc.building.name}</p>
                                )}
                            </div>
                            <div className="mt-4 space-x-2">
                                <button
                                    onClick={() => setEditingId(doc.id)}
                                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded"
                                >
                                    編集
                                </button>
                                <button
                                    onClick={() => handleDelete(doc.id)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                                >
                                    削除
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
