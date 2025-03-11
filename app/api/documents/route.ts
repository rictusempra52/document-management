import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { createWorker } from "tesseract.js";

// ドキュメント一覧の取得
export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        building: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    console.error("ドキュメント取得エラー:", error);
    return NextResponse.json(
      { error: "ドキュメントの取得に失敗しました" },
      { status: 500 }
    );
  }
}

// 新規ドキュメントの作成（ファイルアップロード）
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const buildingId = parseInt(formData.get("buildingId") as string);
    const file = formData.get("file") as File;
    
    if (!title || !file || !buildingId) {
      return NextResponse.json(
        { error: "タイトル、ファイル、マンションは必須です" },
        { status: 400 }
      );
    }

    // ファイルの保存
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // アップロードディレクトリの作成
    const uploadDir = join(process.cwd(), "uploads");
    await createUploadDirectory(uploadDir);

    // ファイル名の生成（一意のファイル名を保証）
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = join(uploadDir, fileName);

    // ファイルの保存
    await writeFile(filePath, buffer);

    // OCR処理（画像ファイルの場合のみ）
    let ocrText = null;
    if (file.type.startsWith("image/")) {
      ocrText = await performOCR(filePath);
    }

    // データベースにドキュメント情報を保存
    const document = await prisma.document.create({
      data: {
        title,
        fileName: file.name,
        filePath: fileName,
        mimeType: file.type,
        fileSize: buffer.length,
        ocrText,
        building: {
          connect: {
            id: buildingId,
          },
        },
        uploadedBy: {
          connect: {
            // TODO: 実際のユーザーIDを設定
            id: 1,
          },
        },
        isPublished: true,
      },
      include: {
        building: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("ドキュメント作成エラー:", error);
    return NextResponse.json(
      { error: "ドキュメントの作成に失敗しました" },
      { status: 500 }
    );
  }
}

// アップロードディレクトリの作成
async function createUploadDirectory(dir: string) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    // ディレクトリが既に存在する場合は無視
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      throw error;
    }
  }
}

// OCR処理の実行
async function performOCR(imagePath: string): Promise<string> {
  const worker = await createWorker("jpn");
  
  try {
    const { data: { text } } = await worker.recognize(imagePath);
    await worker.terminate();
    return text;
  } catch (error) {
    console.error("OCR処理エラー:", error);
    await worker.terminate();
    return "";
  }
}
