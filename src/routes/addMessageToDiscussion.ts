import { withPrisma } from "../methode/withPrisma";

export const addMessageToDiscussion = withPrisma(async (req, res, prisma) => {
  try {

    const { discussionId, content, sender } = req.body;

    if (!discussionId || !content || !sender) {
      return res.status(400).json({
        error: "L'ID de la discussion, le contenu du message et l'expéditeur sont requis.",
      });
    }

    // Vérifier si la discussion existe
    const discussion = await prisma.discussion.findUnique({
      where: { id: discussionId },
    });

    if (!discussion) {
      return res.status(404).json({
        error: "Discussion non trouvée.",
      });
    }

    // Ajouter le message à la discussion
    const newMessage = await prisma.message.create({
      data: {
        content,
        sender,
        discussionId,
      },
    });

    res.status(201).json({
      message: "Message ajouté avec succès.",
      newMessage,
    });

  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la création de la discussion.",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
});
