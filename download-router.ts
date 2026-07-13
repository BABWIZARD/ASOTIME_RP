import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { downloads } from "@db/schema";
import { eq } from "drizzle-orm";

export const downloadRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(downloads);
  }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        label: z.string().optional(),
        url: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...updates } = input;
      await db.update(downloads).set(updates).where(eq(downloads.id, id));
      const updated = await db.query.downloads.findFirst({
        where: eq(downloads.id, id),
      });
      return updated;
    }),
});
