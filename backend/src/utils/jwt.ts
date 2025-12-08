import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  plan: string;
  type: 'access' | 'refresh';
  tokenVersion?: number;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
  tokenVersion: number;
}

// Short-lived access tokens (15 minutes)
const ACCESS_TOKEN_EXPIRY = '15m';
// Longer refresh tokens (7 days)
const REFRESH_TOKEN_EXPIRY = '7d';

/**
 * Generate a cryptographically secure token ID
 */
export function generateTokenId(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Sign a short-lived access token (15 minutes)
 * Contains user claims but expires quickly
 */
export function signAccessToken(payload: Omit<JWTPayload, 'type'>): string {
  return jwt.sign(
    { ...payload, type: 'access' },
    env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

/**
 * Sign a refresh token (7 days)
 * Used only for obtaining new access tokens
 */
export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(
    { ...payload, type: 'refresh' },
    env.JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
}

/**
 * Legacy sign function - uses short-lived tokens now
 */
export function signToken(payload: Omit<JWTPayload, 'type'>): string {
  return signAccessToken(payload);
}

/**
 * Verify and decode an access token
 */
export function verifyToken(token: string): JWTPayload {
  const payload = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
  
  // Ensure it's an access token or legacy token (no type field)
  if (payload.type && payload.type !== 'access') {
    throw new Error('Invalid token type');
  }
  
  return payload;
}

/**
 * Verify and decode a refresh token
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload & { type: 'refresh' } {
  const payload = jwt.verify(token, env.JWT_SECRET) as RefreshTokenPayload & { type: string };
  
  if (payload.type !== 'refresh') {
    throw new Error('Invalid token type');
  }
  
  return payload as RefreshTokenPayload & { type: 'refresh' };
}

/**
 * Decode token without verification (for debugging/logging)
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Generate both access and refresh tokens
 */
export function generateTokenPair(
  userId: string,
  email: string,
  role: string,
  plan: string,
  tokenVersion: number = 0
): { accessToken: string; refreshToken: string; tokenId: string } {
  const tokenId = generateTokenId();
  
  const accessToken = signAccessToken({
    userId,
    email,
    role,
    plan,
    tokenVersion,
  });
  
  const refreshToken = signRefreshToken({
    userId,
    tokenId,
    tokenVersion,
  });
  
  return { accessToken, refreshToken, tokenId };
}
