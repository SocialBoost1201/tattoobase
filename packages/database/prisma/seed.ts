import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // --- Studio ---
  const studio = await prisma.studio.upsert({
    where: { slug: "inkcraft-tokyo" },
    update: {},
    create: {
      name: "InkCraft Tokyo",
      slug: "inkcraft-tokyo",
      accountType: "EXPRESS",
    },
  });
  console.log(`Studio: ${studio.name} (${studio.id})`);

  // --- Staff ---
  const staff1 = await prisma.staff.upsert({
    where: { id: "staff-001" },
    update: {},
    create: {
      id: "staff-001",
      studioId: studio.id,
      displayName: "佐藤 健太",
    },
  });
  const staff2 = await prisma.staff.upsert({
    where: { id: "staff-002" },
    update: {},
    create: {
      id: "staff-002",
      studioId: studio.id,
      displayName: "田中 美咲",
    },
  });

  // --- Artist Profiles ---
  const artist1 = await prisma.artistProfile.upsert({
    where: { id: "artist-001" },
    update: {},
    create: {
      id: "artist-001",
      studioId: studio.id,
      staffId: staff1.id,
      displayName: "Kenta (和彫・ブラックアンドグレー)",
    },
  });
  const artist2 = await prisma.artistProfile.upsert({
    where: { id: "artist-002" },
    update: {},
    create: {
      id: "artist-002",
      studioId: studio.id,
      staffId: staff2.id,
      displayName: "Misaki (洋彫・トラディショナル)",
    },
  });
  console.log(`Artists: ${artist1.displayName}, ${artist2.displayName}`);

  // --- Portfolio Works ---
  await prisma.portfolioWork.createMany({
    skipDuplicates: true,
    data: [
      {
        id: "portfolio-001",
        artistId: artist1.id,
        studioId: studio.id,
        mediaUrls: ["https://placehold.co/600x400?text=Wabori+1"],
      },
      {
        id: "portfolio-002",
        artistId: artist1.id,
        studioId: studio.id,
        mediaUrls: ["https://placehold.co/600x400?text=Wabori+2"],
      },
      {
        id: "portfolio-003",
        artistId: artist2.id,
        studioId: studio.id,
        mediaUrls: ["https://placehold.co/600x400?text=Traditional+1"],
      },
    ],
  });
  console.log("Portfolio works: 3 created");

  // --- Test User ---
  const user = await prisma.user.upsert({
    where: { email: "testuser@tattoobase.dev" },
    update: {},
    create: {
      email: "testuser@tattoobase.dev",
    },
  });
  console.log(`User: ${user.email} (${user.id})`);

  // --- Subscription ---
  await prisma.subscription.upsert({
    where: { studioId: studio.id },
    update: {},
    create: {
      studioId: studio.id,
      status: "active",
    },
  });

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
