import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// マンション一覧の取得
export async function GET() {
  try {
    const buildings = await prisma.building.findMany({
      orderBy: {
        name: "asc", // マンション名でソート
      },
    });

    return NextResponse.json(buildings, { status: 200 });
  } catch (error) {
    console.error("マンション一覧の取得エラー:", error);
    return NextResponse.json(
      { error: "マンション一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}

// 新規マンションの作成
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, address } = body;

    // バリデーション
    if (!name || !address) {
      return NextResponse.json(
        { error: "マンション名と住所は必須です" },
        { status: 400 }
      );
    }

    // マンションの作成
    const building = await prisma.building.create({
      data: {
        name,
        address,
      },
    });

    return NextResponse.json(building, { status: 201 });
  } catch (error) {
    console.error("マンション作成エラー:", error);
    return NextResponse.json(
      { error: "マンションの作成に失敗しました" },
      { status: 500 }
    );
  }
}
