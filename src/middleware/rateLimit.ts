import { Request, Response, NextFunction } from 'express';

type Entry = { timestamps: number[] };
const ipMap: Map<string, Entry> = new Map();

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

export function softRateLimit(req: Request, res: Response, next: NextFunction): void {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    const entry = ipMap.get(ip) || { timestamps: [] };
    // Remove old timestamps
    entry.timestamps = entry.timestamps.filter((ts) => now - ts < WINDOW_MS);

    if (entry.timestamps.length >= MAX_REQUESTS) {
        res.status(429).json({ status: false, message: 'Too many requests' });
        return;
    }

    entry.timestamps.push(now);
    ipMap.set(ip, entry);
    next();
}

export default softRateLimit;



