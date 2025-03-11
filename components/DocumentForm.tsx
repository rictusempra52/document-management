"use client";

import { useState } from "react";

interface DocumentFormProps {
  onSubmit: (title: string, content: string) => Promise<void>;
  initialTitle?: string;
  initialContent?: string;
  buttonText?: string;
}

export default function DocumentForm({
  onSubmit,
  initialTitle = "",
  initialContent = "",
  buttonText = "作成"
}: DocumentFormProps) {
  // フォームの状態管理
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      alert("タイトルと内容を入力してください");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(title, content);
      // 送信成功時にフォームをリセット（編集時は除く）
      if (!initialTitle && !initialContent) {
        setTitle("");
        setContent("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          タイトル
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
          placeholder="ドキュメントのタイトル"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          内容
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
          rows={5}
          placeholder="ドキュメントの内容"
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {isSubmitting ? "送信中..." : buttonText}
      </button>
    </form>
  );
}
