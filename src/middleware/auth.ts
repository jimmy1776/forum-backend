// middleware/auth.ts
import jwt from 'jsonwebtoken';
import type { RequestHandler } from 'express';

const JWT_SECRET = process.env.JWT_SECRET!;

interface JwtPayload {
  id: number;
  username: string;
  roles: string[];
}

const authenticated: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as any).user = payload;   // 👈 this is what isAdmin will read
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export const isAdmin: RequestHandler = (req, res, next) => {
  const user = (req as any).user as JwtPayload | undefined;

  if (!user?.roles?.includes('ADMIN')) {
    return res.status(403).json({ error: 'You are not allowed to do this' });
  }

  next();
};

export default authenticated;
