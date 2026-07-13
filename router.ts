import { authRouter } from "./auth-router";
import { localAuthRouter } from "./local-auth-router";
import { settingsRouter } from "./settings-router";
import { announcementRouter } from "./announcement-router";
import { downloadRouter } from "./download-router";
import { communityRouter } from "./community-router";
import { mediaRouter } from "./media-router";
import { userRouter } from "./user-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  localAuth: localAuthRouter,
  settings: settingsRouter,
  announcement: announcementRouter,
  download: downloadRouter,
  community: communityRouter,
  media: mediaRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
