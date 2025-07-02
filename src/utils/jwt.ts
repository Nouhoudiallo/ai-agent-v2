import jwt from "jsonwebtoken";

export interface JwtUserPayload {
  id: string;
  email: string;
  role: string; // 'USER' | 'ADMIN'
}

export class JwtUtil {
  private static secret = process.env.JWT_SECRET!;

  /**
   * Génère un token JWT pour un utilisateur donné.
   * @param user Les informations de l'utilisateur à inclure dans le token (id, email, role).
   * @param expiresIn Durée de validité du token (ex: '7d' pour 7 jours). Par défaut : 7 jours.
   * @returns Le token JWT signé.
   */
  static generateToken(user: JwtUserPayload, expiresIn: string = "7d"): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return jwt.sign(payload, this.secret as jwt.Secret, { expiresIn } as jwt.SignOptions);
  }

  /**
   * Vérifie et décode un token JWT.
   * @param token Le token JWT à vérifier.
   * @returns Les informations de l'utilisateur si le token est valide, sinon null.
   */
  static verifyToken(token: string): JwtUserPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret) as JwtUserPayload & {
        sub: string;
      };
      return {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };
    } catch {
      return null;
    }
  }
}


