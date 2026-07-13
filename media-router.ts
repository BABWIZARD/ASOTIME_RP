import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { media } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const mediaRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(media).orderBy(desc(media.createdAt));
  }),

  getActive: publicQuery.query(async () => {
    const db = getDb();
    return db.query.media.findFirst({
      where: eq(media.isActive, true),
      orderBy: desc(media.createdAt),
    });
  }),

  create: adminQuery
    .input(
      z.object({
        type: z.enum(["video", "image", "youtube"]),
        title: z.string().min(1),
        url: z.string().min(1),
        thumbnail: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(media).values(input);
      return {
        id: Number(result[0].insertId),
        ...input,
        isActive: true,
        createdAt: new Date(),
      };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        type: z.enum(["video", "image", "youtube"]).optional(),
        title: z.string().optional(),
        url: z.string().optional(),
        thumbnail: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...updates } = input;
      await db.update(media).set(updates).where(eq(media.id, id));
      const updated = await db.query.media.findFirst({
        where: eq(media.id, id),
      });
      return updated;
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(media).where(eq(media.id, input.id));
      return { success: true };
    }),

  setActive: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      // Deactivate all
      await db.update(media).set({ isActive: false });
      // Activate selected
      await db
        .update(media)
        .set({ isActive: true })
        .where(eq(media.id, input.id));
      const updated = await db.query.media.findFirst({
        where: eq(media.id, input.id),
      });
      return updated;
    }),
});
