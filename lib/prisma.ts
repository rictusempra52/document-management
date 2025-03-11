// PrismaClientのシングルトンインスタンスを作成
import { PrismaClient } from "@prisma/client";

// グローバル変数としてPrismaClientを宣言
declare global {
  var prisma: PrismaClient | undefined;
}

// 開発環境でのホットリロード時に複数のインスタンスが作成されるのを防ぐ
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
