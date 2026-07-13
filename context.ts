import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User, LocalUser } from "@db/schema";
import { authenticateRequest } from "./kimi/auth";
import { verifyLocalToken } from "./local-auth-utils";

export type UnifiedUser = {
  id: number;
  name: string;
  email: string | null;
  avatar: string | null;
  role: "user" | "admin";
  authType: "oauth" | "local";
};

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
  localUser?: LocalUser;
  unifiedUser?: UnifiedUser;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };

  // Try OAuth auth first
  try {
    ctx.user = await authenticateRequest(opts.req.headers);
    if (ctx.user) {
      ctx.unifiedUser = {
        id: ctx.user.id,
        name: ctx.user.name || "User",
        email: ctx.user.email || null,
        avatar: ctx.user.avatar || null,
        role: ctx.user.role as "user" | "admin",
        authType: "oauth",
      };
    }
  } catch {
    // OAuth auth optional
  }

  // Try local auth if no OAuth user
  if (!ctx.unifiedUser) {
    try {
      const localToken = opts.req.headers.get("x-local-auth-token");
      if (localToken) {
        const localUser = await verifyLocalToken(localToken);
        if (localUser) {
          ctx.localUser = localUser;
          ctx.unifiedUser = {
            id: localUser.id,
            name: localUser.displayName || localUser.username,
            email: localUser.email,
            avatar: localUser.avatar || null,
            role: localUser.role as "user" | "admin",
            authType: "local",
          };
        }
      }
    } catch {
      // Local auth optional
    }
  }

  return ctx;
}
