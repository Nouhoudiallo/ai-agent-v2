import {withPrisma} from "../methode/withPrisma";

export const handleDeleteUser = withPrisma(async (req , res , prisma)=> {
  try {
    const { userId } = req.body;


    if (!userId) {
      return res.status(400).json({
        error: "L'ID de l'utilisateur est requis.",
      });
    }

    

    const check = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });


    if (!check) {
      return res.status(404).json({
        error: "Utilisateur non trouvé.",
      });
    }

    

    const deletedUser = await prisma.user.delete({
      where: {
        id: check.id
      }
    })

    res.status(200).json({
      message: `Utilisateur avec l'ID ${deletedUser.id} supprimé avec succès.`,
      user: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la suppression de l'utilisateur.",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
})


