"use client";

import { useState, useRef } from "react";
import { Building } from "@/types/document";

interface DocumentFormProps {
  onSubmit: (title: string, file: File, buildingId: number) => Promise<void>;
  buildings: Building[];
  initialTitle?: string;
  buttonText?: string;
}

export default function DocumentForm({
  onSubmit,
  buildings,
  initialTitle = "",
  buttonText = "アップロード"
}: DocumentFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [buildingId, setBuildingId] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ファイルの選択処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // ファイル形式のチェック
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert('PDFまたは画像ファイル（JPG, PNG）のみアップロード可能です');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setFile(selectedFile);

    // 画像プレビューの生成
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !file || !buildingId) {
      alert("タイトル、ファイル、マンションを選択してください");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(title, file, buildingId);
      // 送信成功時にフォームをリセット
      if (!initialTitle) {
        setTitle("");
        setFile(null);
        setPreview(null);
        setBuildingId(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="building" className="block text-sm font-medium text-gray-700">
          マンション
        </label>
        <select
          id="building"
          value={buildingId}
          onChange={(e) => setBuildingId(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
          disabled={isSubmitting}
        >
          <option value={0}>選択してください</option>
          {buildings.map((building) => (
            <option key={building.id} value={building.id}>
              {building.name}
            </option>
          ))}
        </select>
      </div>

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
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
          ファイル
        </label>
        <input
          type="file"
          id="file"
          ref={fileInputRef}
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          disabled={isSubmitting}
        />
        <p className="mt-1 text-sm text-gray-500">
          PDF, JPG, PNG形式のファイルをアップロードできます
        </p>
      </div>

      {preview && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700">プレビュー</p>
          <img
            src={preview}
            alt="プレビュー"
            className="mt-2 max-w-xs rounded border border-gray-200"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !file || !title || !buildingId}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {isSubmitting ? "送信中..." : buttonText}
      </button>
    </form>
  );
}
