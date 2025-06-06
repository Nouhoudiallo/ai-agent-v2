import { GeminiOutputParser } from "../parsers/GeminiOutputParser"; // Ton parser (optionnel)
import { createAgentExecutor } from "../executers";

// === Création de l'agent avec Gemini et tools ===
export async function createStudieAgent() {
  try {
    const exercutor = await createAgentExecutor();
    // === Fonction d'interaction principale ===
    async function chatWithAgent(question: string): Promise<string> {
      try {
        const raw = await exercutor.invoke({
          input: question,
        });

        if (typeof raw === "string") return raw;
        if (!raw || !raw.output) {
          return "Aucune réponse fournie par l'agent.";
        }
        const fallback = new GeminiOutputParser(); // Optionnel
        const parsed = await fallback.parse(raw.output);
        return parsed || "Réponse incomplète.";
      } catch (error) {
        console.error("Erreur dans chatWithAgent :", error);
        return "Erreur lors de l'interaction avec l'agent.";
      }
    }

    return { chatWithAgent };
  } catch (error: any) {
    console.error("Erreur lors de la création de l'agent :", error.message);
    throw new Error("Échec de l'initialisation de l'agent Gemini.");
  }
}
