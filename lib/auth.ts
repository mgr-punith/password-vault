import jwt, { Secret } from "jsonwebtoken";
import { cookies } from "next/headers";

export interface AuthTokenPayload {
  _id: unknown;
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}
const JWT_SECRET: Secret = (process.env.JWT_SECRET ||
  "myjwtsecret1234567890") as Secret;
const TOKEN_EXPIRATION = "7d";

export function signAuthToken(
  payload: Omit<AuthTokenPayload, "iat" | "exp">
): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRATION,
    algorithm: "HS256",
  });
}

export async function verifyAuth(
  token: string
): Promise<AuthTokenPayload | null> {
  if (!token) {
    return null;
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    return payload;
  } catch (error) {
    console.error("JWT Verification Error:", (error as Error).message);
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthTokenPayload | null> {
  const token = (await cookies()).get("vault_session12345")?.value;

  if (!token) {
    return null;
  }

  const userPayload = await verifyAuth(token);

  return userPayload;
}
