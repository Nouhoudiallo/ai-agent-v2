import { withPrisma } from "../methode/withPrisma";
import bcrypt from "bcrypt";


export const getUserByEmail = withPrisma(async (req, res, prisma) => {
  try {
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "L'email et le mot de passe doit être valide.",
      });
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { 
        email: email as string, // Assurez-vous que l'email est une chaîne de caractères
       },
    });

    if (!user) {
      return res.status(404).json({
        error: "Utilisateur non trouvé.",
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if(!isPasswordValid) {
      return res.status(401).json({
        error: "Mot de passe incorrect.",
      });
    }

    return res.status(200).json({
      message: "Utilisateur récupéré avec succès.",
      user: {
        id: user.id,
        email: user.email,
        token: user.token,
        tokenExpiry: user.tokenExpiry,
      }
    });

  } catch (error) {
    return res.status(500).json({
      error: "Erreur lors de la récupération de l'utilisateur par email.",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
})