import { createStudieAgent } from "../agents/studie-agent";
import { Request, Response } from "express";

export const handleAsk = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    if (!question) {
      res.status(400).json({ error: "La question est requise" });
      return;
    }

    const agent = await createStudieAgent();

    if (!agent || !agent.chatWithAgent) {
      res.status(500).json({ error: "Erreur lors de l'initialisation de l'agent" });
      return;
    }

    const response = await agent.chatWithAgent(question);

    res.status(200).json({  response });
  } catch (error: any) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};