import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { communityLinks } from "@db/schema";
import { eq } from "drizzle-orm";

export const communityRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(communityLinks);
  }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        url: z.string(),
        label: z.string().optional(),
        buttonText: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...updates } = input;
      await db.update(communityLinks).set(updates).where(eq(communityLinks.id, id));
      const updated = await db.query.communityLinks.findFirst({
        where: eq(communityLinks.id, id),
      });
      return updated;
    }),
});
