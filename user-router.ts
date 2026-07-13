import { z } from "zod";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users, localUsers } from "@db/schema";
import { eq } from "drizzle-orm";

export const userRouter = createRouter({
  list: adminQuery.query(async () => {
    const db = getDb();
    const oauthUsers = await db.select().from(users);
    const local = await db.select().from(localUsers);
    return {
      oauthUsers: oauthUsers.map((u) => ({
        ...u,
        authType: "oauth" as const,
      })),
      localUsers: local.map((u) => ({
        ...u,
        authType: "local" as const,
      })),
    };
  }),

  ban: adminQuery
    .input(
      z.object({
        userId: z.number(),
        type: z.enum(["oauth", "local"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      if (input.type === "oauth") {
        await db
          .update(users)
          .set({ isBanned: true })
          .where(eq(users.id, input.userId));
      } else {
        await db
          .update(localUsers)
          .set({ isBanned: true })
          .where(eq(localUsers.id, input.userId));
      }
      return { success: true };
    }),

  unban: adminQuery
    .input(
      z.object({
        userId: z.number(),
        type: z.enum(["oauth", "local"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      if (input.type === "oauth") {
        await db
          .update(users)
          .set({ isBanned: false })
          .where(eq(users.id, input.userId));
      } else {
        await db
          .update(localUsers)
          .set({ isBanned: false })
          .where(eq(localUsers.id, input.userId));
      }
      return { success: true };
    }),

  delete: adminQuery
    .input(
      z.object({
        userId: z.number(),
        type: z.enum(["oauth", "local"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      if (input.type === "oauth") {
        await db.delete(users).where(eq(users.id, input.userId));
      } else {
        await db.delete(localUsers).where(eq(localUsers.id, input.userId));
      }
      return { success: true };
    }),

  updateProfile: adminQuery
    .input(
      z.object({
        userId: z.number(),
        type: z.enum(["oauth", "local"]),
        displayName: z.string().optional(),
        avatar: z.string().optional(),
        role: z.enum(["user", "admin"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { userId, type, ...updates } = input;
      if (type === "oauth") {
        await db.update(users).set(updates).where(eq(users.id, userId));
        return db.query.users.findFirst({ where: eq(users.id, userId) });
      } else {
        const localUpdates: Record<string, unknown> = {};
        if (updates.displayName) localUpdates.displayName = updates.displayName;
        if (updates.avatar) localUpdates.avatar = updates.avatar;
        if (updates.role) localUpdates.role = updates.role;
        await db.update(localUsers).set(localUpdates).where(eq(localUsers.id, userId));
        return db.query.localUsers.findFirst({ where: eq(localUsers.id, userId) });
      }
    }),
});
