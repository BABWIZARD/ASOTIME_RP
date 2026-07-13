import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  int,
} from "drizzle-orm/mysql-core";

// OAuth users (from portal login)
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  isBanned: boolean("isBanned").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Local auth users (username/password)
export const localUsers = mysqlTable("local_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  displayName: varchar("displayName", { length: 100 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  isBanned: boolean("isBanned").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type LocalUser = typeof localUsers.$inferSelect;
export type InsertLocalUser = typeof localUsers.$inferInsert;

// Settings table (key-value store for dynamic config)
export const settings = mysqlTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 50 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Setting = typeof settings.$inferSelect;

// Announcements table
export const announcements = mysqlTable("announcements", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  isPinned: boolean("isPinned").default(false).notNull(),
  createdBy: varchar("createdBy", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Announcement = typeof announcements.$inferSelect;

// Downloads table
export const downloads = mysqlTable("downloads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  label: varchar("label", { length: 100 }).notNull(),
  url: text("url").notNull(),
  icon: varchar("icon", { length: 50 }),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Download = typeof downloads.$inferSelect;

// Community links table
export const communityLinks = mysqlTable("community_links", {
  id: serial("id").primaryKey(),
  platform: varchar("platform", { length: 50 }).notNull().unique(),
  label: varchar("label", { length: 100 }).notNull(),
  url: text("url").notNull(),
  buttonText: varchar("buttonText", { length: 50 }).notNull(),
  icon: varchar("icon", { length: 50 }),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type CommunityLink = typeof communityLinks.$inferSelect;

// Media table (videos and images)
export const media = mysqlTable("media", {
  id: serial("id").primaryKey(),
  type: mysqlEnum("type", ["video", "image", "youtube"]).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  url: text("url").notNull(),
  thumbnail: varchar("thumbnail", { length: 500 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Media = typeof media.$inferSelect;

// Server stats table (cached stats)
export const serverStats = mysqlTable("server_stats", {
  id: serial("id").primaryKey(),
  onlinePlayers: int("onlinePlayers").default(0).notNull(),
  maxPlayers: int("maxPlayers").default(500).notNull(),
  status: varchar("status", { length: 20 }).default("online").notNull(),
  uptime: varchar("uptime", { length: 50 }).default("0h 0m"),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type ServerStat = typeof serverStats.$inferSelect;
