import { SignJWT, jwtVerify } from "jose";
import { compare, hash } from "bcryptjs";
import { getDb } from "./queries/connection";
import { localUsers } from "@db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = new TextEncoder().encode(
  process.env.APP_SECRET || "asotime-rp-local-secret-key-2024"
);

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashed: string
): Promise<boolean> {
  return compare(password, hashed);
}

export async function createLocalToken(userId: number): Promise<string> {
  return new SignJWT({ userId, type: "local" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

export async function verifyLocalToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      clockTolerance: 60,
    });
    const userId = payload.userId as number;
    if (!userId) return null;

    const db = getDb();
    const user = await db.query.localUsers.findFirst({
      where: eq(localUsers.id, userId),
    });
    return user || null;
  } catch {
    return null;
  }
}
