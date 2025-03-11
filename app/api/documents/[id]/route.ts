// 個別のドキュメント操作用APIエンドポイント
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 特定のドキュメントを取得
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json(
        { error: "ドキュメントが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(document, { status: 200 });
  } catch (error) {
    console.error("ドキュメント取得エラー:", error);
    return NextResponse.json(
      { error: "ドキュメントの取得に失敗しました" },
      { status: 500 }
    );
  }
}

// ドキュメントの更新
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { title, content, isPublished } = body;

    // 既存のドキュメントの確認
    const existingDocument = await prisma.document.findUnique({
      where: { id },
    });

    if (!existingDocument) {
      return NextResponse.json(
        { error: "ドキュメントが見つかりません" },
        { status: 404 }
      );
    }

    // ドキュメントの更新
    const updatedDocument = await prisma.document.update({
      where: { id },
      data: {
        title: title ?? existingDocument.title,
        content: content ?? existingDocument.content,
        isPublished: isPublished ?? existingDocument.isPublished,
      },
    });

    return NextResponse.json(updatedDocument, { status: 200 });
  } catch (error) {
    console.error("ドキュメント更新エラー:", error);
    return NextResponse.json(
      { error: "ドキュメントの更新に失敗しました" },
      { status: 500 }
    );
  }
}

// ドキュメントの削除
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // 既存のドキュメントの確認
    const existingDocument = await prisma.document.findUnique({
      where: { id },
    });

    if (!existingDocument) {
      return NextResponse.json(
        { error: "ドキュメントが見つかりません" },
        { status: 404 }
      );
    }

    // ドキュメントの削除
    await prisma.document.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "ドキュメントを削除しました" },
      { status: 200 }
    );
  } catch (error) {
    console.error("ドキュメント削除エラー:", error);
    return NextResponse.json(
      { error: "ドキュメントの削除に失敗しました" },
      { status: 500 }
    );
  }
}
