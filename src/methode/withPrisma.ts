import Prisma from '../utils/prisma';
import { Request, Response } from 'express';

/**
 * Génère un handler Express avec accès à Prisma.
 * @param handler Fonction asynchrone recevant req, res, prisma
 */
export function withPrisma(handler: (req: Request, res: Response, prisma: typeof Prisma) => Promise<any> | void) {
  return (req: Request, res: Response) => {
    return handler(req, res, Prisma);
  };
}
