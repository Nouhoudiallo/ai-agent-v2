import { withPrisma } from "../methode/withPrisma";

export const getUserDiscussions = withPrisma(async (req, res, prisma) => {
  try {
    const {userId} = req.body

    if (!userId) {
      return res.status(400).json({
        error: "L'ID de l'utilisateur est requis.",
      });
    }


    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId }, 
      select: { id: true, email: true }, // Sélectionner uniquement les champs nécessaires
    });

    if (!user) {
      return res.status(404).json({
        error: "Utilisateur non trouvé.",
      });
    }

    // Récupérer les discussions de l'utilisateur
    const discussions = await prisma.discussion.findMany({
      where: { authorId: user.id },
      include: {
        messages: true, // Inclure les messages associés à chaque discussion
      },
    });

    if (discussions.length === 0) {
      return res.status(404).json({
        message: "Aucune discussion trouvée pour cet utilisateur.",
      });
    }

    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération des discussions de l'utilisateur.",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
});
