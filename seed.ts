import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import * as schema from "./schema";

const pool = createPool(process.env.DATABASE_URL || "");
const db = drizzle(pool, { schema, mode: "planetscale" });

async function seed() {
  console.log("Seeding database...");

  // Seed settings
  const defaultSettings = [
    { key: "serverIp", value: "51.83.49.125:11940" },
    { key: "siteName", value: "ASOTIME RP" },
    { key: "logoUrl", value: "/assets/logo.png" },
    { key: "bannerUrl", value: "/assets/hero-bg.jpg" },
    { key: "serverStatus", value: "online" },
    { key: "onlinePlayers", value: "0" },
    { key: "maxPlayers", value: "500" },
    { key: "uptime", value: "24h 0m" },
  ];

  for (const s of defaultSettings) {
    await db.insert(schema.settings).values(s).onDuplicateKeyUpdate({
      set: { value: s.value },
    });
  }
  console.log("Settings seeded.");

  // Seed downloads
  const defaultDownloads = [
    {
      name: "ASOTIME APK",
      label: "Download APK",
      url: "https://www.mediafire.com/file/ny9vfzxqnd5poi1/ASOTIME--RP_MODPACK%25F0%259F%2593%25B1%25282%apk.zip/file",
      icon: "smartphone",
    },
    {
      name: "MODPACK",
      label: "Download MODPACK",
      url: "https://www.mediafire.com/file/ny9vfzxqnd5poi1/ASOTIME--RP_MODPACK%25F0%259F%2593%25B1%25282%2529.zip/file",
      icon: "archive",
    },
  ];

  for (const d of defaultDownloads) {
    await db.insert(schema.downloads).values(d).onDuplicateKeyUpdate({
      set: { url: d.url },
    });
  }
  console.log("Downloads seeded.");

  // Seed community links
  const defaultCommunityLinks = [
    {
      platform: "WhatsApp",
      label: "Join our WhatsApp",
      url: "https://chat.whatsapp.com/J9MaxUqewnLLsG6hrQ9WRr",
      buttonText: "Join WhatsApp",
      icon: "message-circle",
    },
    {
      platform: "Discord",
      label: "Join our Discord",
      url: "https://discord.gg/bQVyPQTrD",
      buttonText: "Join Discord",
      icon: "gamepad-2",
    },
    {
      platform: "TikTok",
      label: "Follow on TikTok",
      url: "https://vm.tiktok.com/ZS92oXmK5qqPc-zZPDb/",
      buttonText: "Follow on TikTok",
      icon: "music",
    },
  ];

  for (const c of defaultCommunityLinks) {
    await db.insert(schema.communityLinks).values(c).onDuplicateKeyUpdate({
      set: { url: c.url },
    });
  }
  console.log("Community links seeded.");

  // Seed server stats
  await db.insert(schema.serverStats).values({
    onlinePlayers: 0,
    maxPlayers: 500,
    status: "online",
    uptime: "24h 0m",
  }).onDuplicateKeyUpdate({
    set: { status: "online" },
  });
  console.log("Server stats seeded.");

  // Seed a sample announcement
  await db.insert(schema.announcements).values({
    title: "Welcome to ASOTIME RP!",
    content: "Welcome to the official ASOTIME RP website. Join our server and experience the best SA Roleplay!",
    isPinned: true,
    createdBy: "System",
  }).onDuplicateKeyUpdate({
    set: { title: "Welcome to ASOTIME RP!" },
  });
  console.log("Announcements seeded.");

  console.log("Seed complete!");
  await pool.end();
}

seed().catch(console.error);
