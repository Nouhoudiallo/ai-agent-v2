import { withPrisma } from "../methode/withPrisma";

export const getUserByEmail = withPrisma(async (req, res, prisma) => {
  try {
    
    const { email } = req.query;

    if (!email && typeof email !== 'string') {
      return res.status(400).json({
        error: "L'email doit être une chaîne de caractères et doit être valide.",
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

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération de l'utilisateur par email.",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
})