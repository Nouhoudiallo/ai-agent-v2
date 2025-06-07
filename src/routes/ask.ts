import { createStudieAgentWithMemory } from "../agents/studie-agent";
import { createDiscussion, addMessageToDiscussion } from "../fontions/user";
import { Sender } from "@prisma/client";
import { Request, Response } from "express";

export const handleAsk = async (req: Request, res: Response) => {
  try {
    const { question, userId, discussionId } = req.body;
    if (!question || !userId) {
      res.status(400).json({ error: "La question et l'utilisateur sont requis" });
      return;
    }

    // Récupérer ou créer une discussion
    let discussion = discussionId;
    if (!discussion) {
      const newDiscussion = await createDiscussion("Discussion avec l'agent", userId);
      discussion = newDiscussion.id;
    }

    // Stocker le message utilisateur
    await addMessageToDiscussion(discussion, question, Sender.USER);

    // Appeler l'agent avec mémoire
    const agent = await createStudieAgentWithMemory(discussion);
    if (!agent || !agent.chatWithAgent) {
      res.status(500).json({ error: "Erreur lors de l'initialisation de l'agent" });
      return;
    }
    const response = await agent.chatWithAgent(question);

    // Stocker la réponse de l'agent
    await addMessageToDiscussion(discussion, response, Sender.AGENT);

    res.status(200).json({ response, discussionId: discussion });
  } catch (error: any) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};