import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ConversationChain } from "langchain/chains";
import { getGeminiModel } from "../tools/models";
import { BufferMemory } from "langchain/memory"; // Importer BufferMemory
import { webSearch } from "../tools/websearch"; // Importer l'outil de recherche sur le web
import Prisma from "../utils/prisma"; // Correction de l'importation de Prisma

export async function createStudieAgent() {
  try {

    // Initialiser le modèle Google Generative AI
    const llm = getGeminiModel();

    // Définir un template de prompt
    const chatPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "Tu es Henry, un agent éducatif intelligent conçu pour guider, motiver et informer les utilisateurs dans leurs études. Tu as été créé par Mamadou Nouhou Diallo, un jeune entrepreneur guinéen engagé pour l'éducation et le développement technologique en Afrique. Ta mission est d’apporter des réponses claires, pédagogiques et structurées, tout en encourageant la curiosité intellectuelle et l’autonomie. Tu adaptes ton niveau de langage au profil de l’utilisateur : vulgarisé pour les lycéens, plus approfondi pour les étudiants. Utilise un ton professionnel, bienveillant et motivant, tourné vers l’avenir. Ne te présente que si l’utilisateur te le demande. Évite les digressions ou les réponses inutiles. Reste centré sur la question posée. Si une réponse nécessite une explication plus longue, structure-la par étapes ou en bullet points. Si l’utilisateur demande des ressources, propose des pistes concrètes : notions à approfondir, livres, méthodes d’étude ou exercices types. Tu peux également poser des questions de suivi pour enrichir la réflexion de l’utilisateur. Ton objectif : aider chaque utilisateur à progresser dans ses études avec confiance, clarté et ambition.",
      ],
      new MessagesPlaceholder("history"), // Utilisation de la mémoire pour le contexte
      ["human", "{input}"], // Ajout explicite du champ "input"
    ]);

    // Initialiser la mémoire avec BufferMemory
    const memory = new BufferMemory({
      returnMessages: true, // Assurez-vous que les messages sont retournés pour le champ "history"
    });

    // Créer une chaîne ConversationChain avec le prompt, le modèle et la mémoire
    const chain = new ConversationChain({
      prompt: chatPrompt,
      llm,
      memory,
    });

    // Ajouter des outils à l'agent
    const tools = {
      webSearch,
      // Ajoutez d'autres outils ici si nécessaire
    };

    // Fonction pour interagir avec l'agent
    async function chatWithAgent(question: string): Promise<string> {
      try {
        const response = await chain.call({ input: question });

        // Détection automatique des outils nécessaires
        for (const [toolName, toolFunction] of Object.entries(tools)) {
          if (response.response.includes(toolName)) {
            const toolResult = await toolFunction(question);
            return `Résultat de l'outil ${toolName} : ${toolResult}`;
          }
        }

        return response.response;
      } catch (error) {
        console.error("Erreur lors de l'exécution de l'agent :", error);
        throw new Error("Erreur lors de la discussion avec l'agent");
      }
    }

    return { chatWithAgent };
  } catch (error: any) {
    console.error("Erreur lors de la création de l'agent :", error.message);
    throw new Error("Erreur lors de la création de l'agent");
  }
}
