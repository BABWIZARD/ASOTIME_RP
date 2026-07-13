import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { settings } from "@db/schema";
import { eq } from "drizzle-orm";

export const settingsRouter = createRouter({
  getAll: publicQuery.query(async () => {
    const db = getDb();
    const allSettings = await db.select().from(settings);
    const result: Record<string, string> = {};
    for (const s of allSettings) {
      result[s.key] = s.value;
    }
    return result;
  }),

  get: publicQuery
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const setting = await db.query.settings.findFirst({
        where: eq(settings.key, input.key),
      });
      return setting?.value || null;
    }),

  update: adminQuery
    .input(z.object({ key: z.string(), value: z.string() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db.query.settings.findFirst({
        where: eq(settings.key, input.key),
      });
      if (existing) {
        await db
          .update(settings)
          .set({ value: input.value })
          .where(eq(settings.key, input.key));
        return { ...existing, value: input.value };
      } else {
        await db.insert(settings).values({
          key: input.key,
          value: input.value,
        });
        return { key: input.key, value: input.value };
      }
    }),

  updateBatch: adminQuery
    .input(
      z.object({
        settings: z.array(z.object({ key: z.string(), value: z.string() })),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      for (const s of input.settings) {
        const existing = await db.query.settings.findFirst({
          where: eq(settings.key, s.key),
        });
        if (existing) {
          await db
            .update(settings)
            .set({ value: s.value })
            .where(eq(settings.key, s.key));
        } else {
          await db.insert(settings).values({
            key: s.key,
            value: s.value,
          });
        }
      }
      return { success: true };
    }),
});
