// Next.js App RouterでのAPIルート実装
// このファイルは/api/helloエンドポイントを作成します

import { NextResponse } from "next/server";

export async function GET() {
  // レスポンスデータの作成
  const data = {
    message: "Hello from Next.js API!",
    timestamp: new Date().toISOString(),
  };

  // NextResponseを使用してJSONレスポンスを返す
  // status: 200は正常なレスポンスを示します
  return NextResponse.json(data, {
    status: 200,
  });
}
