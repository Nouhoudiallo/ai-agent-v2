import { VerifyApiKey } from '../fontions/verifyApiKey';
import { Router, Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Classe RouteAgent pour gérer la création de routes sécurisées.
 */
export class RouteAgent {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  /**
   * Crée une route sécurisée.
   * @param path - Chemin de la route
   * @param method - Méthode HTTP (GET, POST, etc.)
   * @param handler - Fonction de gestion de la route
   */
  public createRoute(path: string, method: string, handler: RequestHandler): void {
    const secureHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const apiKey = req.headers['x-api-key'];
      
      if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
        res.status(403).json({ error: `Clé API manquante ou invalide` });
        return;
      }

      // Si la clé API est valide, on continue avec le traitement de la requête
      const check = await VerifyApiKey(apiKey)

      if(!check.isValid){
        res.status(403).json({ error: check.error || `Clé API invalide` });
        return;
      }

      next();
    };

    switch (method.toLowerCase()) {
      case 'get':
        this.router.get(path, secureHandler, handler);
        break;
      case 'post':
        this.router.post(path, secureHandler, handler);
        break;
      case 'put':
        this.router.put(path, secureHandler, handler);
        break;
      case 'delete':
        this.router.delete(path, secureHandler, handler);
        break;
      default:
        throw new Error(`Méthode HTTP non prise en charge : ${method}`);
    }
  }

  /**
   * Crée une route pour interroger l'agent.
   * @param path - Chemin de la route
   * @param handler - Fonction de gestion de la requête
   */
  public createAgentQueryRoute(path: string, handler: RequestHandler): void {
    const secureHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const apiKey = req.headers['x-api-key'];

      if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
        res.status(403).json({ error: `Clé API manquante ou invalide` });
        return;
      }

      const check = await VerifyApiKey(apiKey);

      if (!check.isValid) {
        res.status(403).json({ error: check.error || `Clé API invalide` });
        return;
      }

      next();
    };

    this.router.post(path, secureHandler, handler);
  }

  /**
   * Retourne le routeur configuré.
   */
  public getRouter(): Router {
    return this.router;
  }
}
