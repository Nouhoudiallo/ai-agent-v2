import { withPrisma } from "../methode/withPrisma";

export const createDiscussion = withPrisma(async (req, res, prisma) => {
  try {
    const { title, authorId } = req.body;

    if (!title || !authorId) {
      return res.status(400).json({
        error: "Le titre et l'ID de l'auteur sont requis.",
      });
    }

    const check = await prisma.user.findFirst({
      where: {
        id: authorId,
      },
    });


    if (!check) {
      return res.status(404).json({
        error: "Utilisateur non trouvé.",
      });
    }

    const createDiscussion = await prisma.discussion.create({
      data: {
        title,
        authorId,
      },
    })

    if (!createDiscussion) {
      return res.status(500).json({
        error: "Erreur lors de la création de la discussion.",
      });
    }

    res.status(201).json({
      message: "Discussion créée avec succès.",
      discussion: createDiscussion,
    });


  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la création de la discussion.",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
});
// export async function createDiscussion(req: Request, res: Response) {

// }
