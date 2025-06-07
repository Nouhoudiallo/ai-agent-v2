import { GeminiOutputParser } from "../parsers/GeminiOutputParser"; // Ton parser (optionnel)
import { createAgentExecutor } from "../executers";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { Sender } from "@prisma/client";
import Prisma from "../utils/prisma";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

// Correction : la fonction getDiscussionHistory doit retourner le format attendu par ChatMessageHistory
function getDiscussionHistory(discussionId: string) {
  return Prisma.message
    .findMany({
      where: { 
        discussionId
       },
      orderBy: { createdAt: "asc" },
    })
    .then((messages) =>
      messages.map((msg) => ({
        role: msg.sender === "USER" ? "user" : "ai",
        content: msg.content,
      }))
    );
}

// === Création de l'agent avec Gemini et tools ===
// export async function createStudieAgent() {
//   try {
//     const exercutor = await createAgentExecutor();
//     // === Fonction d'interaction principale ===
//     async function chatWithAgent(question: string): Promise<string> {
//       try {
//         const raw = await exercutor.invoke({
//           input: question,
//         });

//         if (typeof raw === "string") return raw;
//         if (!raw || !raw.output) {
//           return "Aucune réponse fournie par l'agent.";
//         }
//         const fallback = new GeminiOutputParser(); // Optionnel
//         const parsed = await fallback.parse(raw.output);
//         return parsed || "Réponse incomplète.";
//       } catch (error) {
//         console.error("Erreur dans chatWithAgent :", error);
//         return "Erreur lors de l'interaction avec l'agent.";
//       }
//     }

//     return { chatWithAgent };
//   } catch (error: any) {
//     console.error("Erreur lors de la création de l'agent :", error.message);
//     throw new Error("Échec de l'initialisation de l'agent Gemini.");
//   }
// }

// === Création de l'agent avec Gemini, tools et mémoire ===
export async function createStudieAgentWithMemory(discussionId: string) {
  try {
    const exercutor = await createAgentExecutor();
    const history = await getDiscussionHistory(discussionId);
    const memory = new BufferMemory({
      chatHistory: new ChatMessageHistory(),
      returnMessages: true,
      memoryKey: "chat_history",
      outputKey: "output",
    });
    // Charger l'historique dans la mémoire
    for (const msg of history) {
      if (msg.role === "user") {
        memory.chatHistory.addMessage(new HumanMessage(msg.content));
      } else {
        memory.chatHistory.addMessage(new AIMessage(msg.content));
      }
    }
    // Fonction d'interaction principale
    async function chatWithAgent(question: string): Promise<string> {
      try {
        // Recherche si la question a déjà été posée et répondue dans l'historique
        const allHistory = await memory.chatHistory.getMessages();
        let reponseTrouvee: string | null = null;
        for (let i = 0; i < allHistory.length; i++) {
          const msg = allHistory[i];
          let content = "";
          if (msg._getType && typeof msg._getType === "function" && msg._getType() === "human") {
            // Extraction robuste du texte pour tous les types de contenu
            content = msg.content
              ? (typeof msg.content === "string"
                  ? msg.content
                  : Array.isArray(msg.content)
                    ? msg.content.map(c => {
                        if (typeof c === "string") return c;
                        if (c && typeof c === "object") {
                          if (Object.prototype.hasOwnProperty.call(c, "text") && typeof (c as any).text === "string") return (c as any).text;
                          if (Object.prototype.hasOwnProperty.call(c, "caption") && typeof (c as any).caption === "string") return (c as any).caption;
                          if (Object.prototype.hasOwnProperty.call(c, "url") && typeof (c as any).url === "string") return (c as any).url;
                        }
                        return "";
                      }).join(" ")
                    : "")
              : "";
            // Si la question actuelle est très similaire à une question précédente
            if (content.trim().toLowerCase() === question.trim().toLowerCase()) {
              // Cherche la réponse suivante dans l'historique
              const nextMsg = allHistory[i + 1];
              if (nextMsg && nextMsg._getType && typeof nextMsg._getType === "function" && nextMsg._getType() === "ai") {
                let aiContent = "";
                aiContent = nextMsg.content
                  ? (typeof nextMsg.content === "string"
                      ? nextMsg.content
                      : Array.isArray(nextMsg.content)
                        ? nextMsg.content.map(c => {
                            if (typeof c === "string") return c;
                            if (c && typeof c === "object") {
                              if (Object.prototype.hasOwnProperty.call(c, "text") && typeof (c as any).text === "string") return (c as any).text;
                              if (Object.prototype.hasOwnProperty.call(c, "caption") && typeof (c as any).caption === "string") return (c as any).caption;
                              if (Object.prototype.hasOwnProperty.call(c, "url") && typeof (c as any).url === "string") return (c as any).url;
                            }
                            return "";
                          }).join(" ")
                        : "")
                  : "";
                reponseTrouvee = aiContent;
                break;
              }
            }
          }
        }
        if (reponseTrouvee) {
          return `Je me souviens que tu m'as déjà posé cette question, voici la réponse que je t'avais donnée :\n${reponseTrouvee}`;
        }

        // Recherche d'une information personnelle déjà donnée dans l'historique
        // Correction 1 : extraction robuste du texte utilisateur (comme plus haut)
        // Correction 2 : regex plus large pour les prénoms composés/accents
        const infoRegex = /(je m'appelle|mon nom est|je suis)\s+([\wÀ-ÿ'’ -]+)/i;
        let infoTrouvee: string | null = null;
        for (const msg of allHistory) {
          let content = "";
          if (msg._getType && typeof msg._getType === "function" && msg._getType() === "human") {
            if (typeof msg.content === "string") {
              content = msg.content;
            } else if (Array.isArray(msg.content)) {
              content = msg.content.map(c => {
                if (typeof c === "string") return c;
                if (c && typeof c === "object") {
                  if (Object.prototype.hasOwnProperty.call(c, "text") && typeof (c as any).text === "string") return (c as any).text;
                  if (Object.prototype.hasOwnProperty.call(c, "caption") && typeof (c as any).caption === "string") return (c as any).caption;
                  if (Object.prototype.hasOwnProperty.call(c, "url") && typeof (c as any).url === "string") return (c as any).url;
                }
                return "";
              }).join(" ");
            }
            const match = infoRegex.exec(content);
            if (match) {
              infoTrouvee = match[2];
              break;
            }
          }
        }
        if (infoTrouvee && /comment.*(je|tu).*appelle/i.test(question)) {
          return `Tu m'as déjà dit que tu t'appelais ${infoTrouvee}. Je m'en souviens !`;
        }

        // Appel de l'agent
        let output = "";
        try {
          const raw = await exercutor.invoke({
            input: question,
            chat_history: await memory.loadMemoryVariables({}),
          });
          if (typeof raw === "string") output = raw;
          else if (raw && raw.output) {
            const fallback = new GeminiOutputParser();
            output = await fallback.parse(raw.output);
          } else {
            output = "Aucune réponse fournie par l'agent.";
          }
        } catch (e) {
          output = "Je n'ai pas compris la réponse du modèle. Merci de reformuler.";
        }

        // Filtrage : si l'agent indique qu'il ne se souvient pas ou n'a pas de mémoire, on ne sauvegarde pas et on retourne une réponse adaptée
        const lower = output.toLowerCase();
        if (
          lower.includes("je ne retiens pas") ||
          lower.includes("je ne peux pas me souvenir") ||
          lower.includes("je n'ai pas la capacité de me souvenir") ||
          lower.includes("je ne me souviens pas") ||
          lower.includes("je ne garde pas en mémoire")
        ) {
          return "Je me souviens de ce que tu me dis dans cette discussion. N'hésite pas à continuer ou à me rappeler un détail si besoin !";
        }

        // Sauvegarde de l'interaction complète UNIQUEMENT si la réponse n'est pas une erreur technique
        if (output && output !== "Erreur lors de l'interaction avec l'agent.") {
          await memory.saveContext({ input: question }, { output });
        } else if (!output) {
          console.warn("⚠️ Réponse vide, non sauvegardée dans la mémoire.");
        } else {
          console.warn("⚠️ Réponse d'erreur technique non sauvegardée dans la mémoire.");
        }

        return output;
      } catch (error) {
        console.error("Erreur dans chatWithAgent :", error);
        return "Erreur lors de l'interaction avec l'agent.";
      }
    }

    return { chatWithAgent };
  } catch (error: any) {
    console.error("Erreur lors de la création de l'agent :", error && error.message ? error.message : error);
    throw new Error("Échec de l'initialisation de l'agent Gemini.");
  }
}
