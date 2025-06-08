import { withPrisma } from "@/methode/withPrisma"


export const testRoute = withPrisma(async (req, res , prisma) => {
  res.status(200).json({
    message: "Test route is working!",
    method: req.method,
    prismaVersion: prisma.constructor.name, // Affiche juste le nom de la classe
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent'] || 'unknown',
  });
})