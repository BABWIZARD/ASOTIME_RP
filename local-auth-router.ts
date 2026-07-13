import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { localUsers } from "@db/schema";
import { eq } from "drizzle-orm";
import {
  hashPassword,
  verifyPassword,
  createLocalToken,
  verifyLocalToken,
} from "./local-auth-utils";

export const localAuthRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        username: z
          .string()
          .min(3, "Username must be at least 3 characters")
          .max(50, "Username must be at most 50 characters")
          .regex(
            /^[a-zA-Z0-9_]+$/,
            "Username can only contain letters, numbers, and underscores"
          ),
        email: z.string().email("Invalid email address"),
        password: z
          .string()
          .min(6, "Password must be at least 6 characters"),
        displayName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // Check if username exists
      const existingUser = await db.query.localUsers.findFirst({
        where: eq(localUsers.username, input.username),
      });
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already taken",
        });
      }

      // Check if email exists
      const existingEmail = await db.query.localUsers.findFirst({
        where: eq(localUsers.email, input.email),
      });
      if (existingEmail) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already registered",
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(input.password);

      // Create user
      const result = await db.insert(localUsers).values({
        username: input.username,
        email: input.email,
        password: hashedPassword,
        displayName: input.displayName || input.username,
      });

      const userId = Number(result[0].insertId);

      // Generate token
      const token = await createLocalToken(userId);

      return {
        success: true,
        token,
        user: {
          id: userId,
          username: input.username,
          email: input.email,
          displayName: input.displayName || input.username,
        },
      };
    }),

  login: publicQuery
    .input(
      z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string().min(1, "Password is required"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // Find user by username
      const user = await db.query.localUsers.findFirst({
        where: eq(localUsers.username, input.username),
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid username or password",
        });
      }

      // Check if banned
      if (user.isBanned) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Your account has been banned",
        });
      }

      // Verify password
      const valid = await verifyPassword(input.password, user.password);
      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });
      }

      // Generate token
      const token = await createLocalToken(user.id);

      return {
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.displayName || user.username,
          role: user.role,
        },
      };
    }),

  me: publicQuery.query(async ({ ctx }) => {
    const localToken = ctx.req.headers.get("x-local-auth-token");
    if (!localToken) return null;

    const user = await verifyLocalToken(localToken);
    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.displayName || user.username,
      displayName: user.displayName || user.username,
      avatar: user.avatar,
      role: user.role,
      isBanned: user.isBanned,
      authType: "local" as const,
    };
  }),
});
