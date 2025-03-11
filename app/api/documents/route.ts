// ドキュメント管理用のAPIエンドポイント
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ドキュメント一覧の取得
export async function GET() {
  try {
    // すべてのドキュメントを取得
    const documents = await prisma.document.findMany({
      orderBy: {
        createdAt: 'desc' // 作成日時の降順でソート
      }
    })

    return NextResponse.json(documents, { status: 200 })
  } catch (error) {
    console.error('ドキュメント取得エラー:', error)
    return NextResponse.json(
      { error: 'ドキュメントの取得に失敗しました' },
      { status: 500 }
    )
  }
}

// 新規ドキュメントの作成
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content } = body

    // バリデーション
    if (!title || !content) {
      return NextResponse.json(
        { error: 'タイトルと内容は必須です' },
        { status: 400 }
      )
    }

    // ドキュメントの作成
    const document = await prisma.document.create({
      data: {
        title,
        content,
      }
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('ドキュメント作成エラー:', error)
    return NextResponse.json(
      { error: 'ドキュメントの作成に失敗しました' },
      { status: 500 }
    )
  }
}
