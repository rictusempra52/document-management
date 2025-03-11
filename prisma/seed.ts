import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // 管理者ユーザーの作成
    const admin = await prisma.user.create({
      data: {
        email: "admin@example.com",
        name: "管理者",
        // 注意: 実際のアプリケーションではパスワードはハッシュ化して保存する必要があります
        password: "admin123",
        role: "ADMIN",
      },
    });

    console.log("管理者ユーザーを作成しました:", admin);

    // サンプルマンションの作成
    const buildings = await Promise.all([
      prisma.building.create({
        data: {
          name: "サンプルマンションA",
          address: "東京都渋谷区○○1-1-1",
          // 管理者をこのマンションに関連付け
          users: {
            connect: {
              id: admin.id,
            },
          },
        },
      }),
      prisma.building.create({
        data: {
          name: "サンプルマンションB",
          address: "東京都新宿区××2-2-2",
          users: {
            connect: {
              id: admin.id,
            },
          },
        },
      }),
    ]);

    console.log("マンションを作成しました:", buildings);

    // 一般ユーザーの作成
    const user = await prisma.user.create({
      data: {
        email: "user@example.com",
        name: "一般ユーザー",
        password: "user123",
        role: "USER",
        // ユーザーをマンションAに関連付け
        buildings: {
          connect: {
            id: buildings[0].id,
          },
        },
      },
    });

    console.log("一般ユーザーを作成しました:", user);

    // マンション管理者の作成
    const manager = await prisma.user.create({
      data: {
        email: "manager@example.com",
        name: "マンション管理者",
        password: "manager123",
        role: "MANAGER",
        // 管理者を両方のマンションに関連付け
        buildings: {
          connect: buildings.map((b) => ({ id: b.id })),
        },
      },
    });

    console.log("マンション管理者を作成しました:", manager);
  } catch (error) {
    console.error("エラーが発生しました:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
