import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { announcements } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const announcementRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(announcements).orderBy(desc(announcements.createdAt));
  }),

  create: adminQuery
    .input(
      z.object({
        title: z.string().min(1, "Title is required").max(200),
        content: z.string().min(1, "Content is required"),
        isPinned: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const createdBy = ctx.unifiedUser?.name || "Admin";
      const result = await db.insert(announcements).values({
        title: input.title,
        content: input.content,
        isPinned: input.isPinned,
        createdBy,
      });
      return {
        id: Number(result[0].insertId),
        ...input,
        createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).max(200).optional(),
        content: z.string().min(1).optional(),
        isPinned: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...updates } = input;
      await db
        .update(announcements)
        .set(updates)
        .where(eq(announcements.id, id));
      const updated = await db.query.announcements.findFirst({
        where: eq(announcements.id, id),
      });
      return updated;
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(announcements).where(eq(announcements.id, input.id));
      return { success: true };
    }),
});
