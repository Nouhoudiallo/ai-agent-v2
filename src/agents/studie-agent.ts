import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { ConversationChain } from "langchain/chains";
import { getGeminiModel } from "../tools/models";
import { setupReadline } from "../tools/realtime";
import { BufferMemory } from "langchain/memory"; // Importer BufferMemory

export async function createStudieAgent() {
  try {
    // Initialiser le modèle Google Generative AI
    const llm = getGeminiModel();

    // Définir un template de prompt
    const chatPrompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful assistant."],
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

    // Fonction pour interagir avec l'agent
    async function chatWithAgent(question: string) {
      try {
        // Ajouter la question à la mémoire et obtenir la réponse
        const response = await chain.call({ input: question }); // Utilisation correcte du champ "input"
        
        console.log("Agent :", response.response); // Afficher la réponse de l'agent
      } catch (error) {
        console.error("Erreur lors de l'exécution de l'agent :", error);
      }
    }

    // Configurer l'interface readline pour capturer les entrées utilisateur
    setupReadline(async (input: string) => {
      await chatWithAgent(input);
    });
  } catch (error: any) {
    console.error("Erreur lors de la création de l'agent :", error.message);
    return;
  }
}
