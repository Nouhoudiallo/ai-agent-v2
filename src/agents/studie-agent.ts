import { webSearch } from "../tools/websearch"; // Ton outil custom
import { getGeminiModel } from "../tools/models"; // Ton LLM Gemini
import { GeminiOutputParser } from "../parsers/GeminiOutputParser"; // Parser personnalisé si besoin

// Fonction de parsing propre pour Gemini
function extractGeminiContent(raw: any): string {
  try {
    // Cas 1 : Réponse déjà sous forme d'objet avec kwargs.content
    if (raw?.lc_kwargs?.content) {
      return raw.lc_kwargs.content;
    }

    // Cas 2 : Si raw est un objet avec `response` (stringifiée)
    if (typeof raw === "object" && typeof raw.response === "string") {
      const parsedLevel1 = JSON.parse(raw.response);
      if (parsedLevel1?.lc_kwargs?.content) {
        return parsedLevel1.lc_kwargs.content;
      }
      return JSON.stringify(parsedLevel1, null, 2);
    }

    // Cas 3 : Si raw est une string JSON stringifiée
    if (typeof raw === "string") {
      const parsed = JSON.parse(raw);
      return extractGeminiContent(parsed);
    }

    // Cas 4 : Rien à extraire
    return "Aucun contenu détecté dans la réponse Gemini.";
  } catch (err) {
    console.error("Erreur de parsing Gemini :", err);
    return "Erreur lors de l'extraction du contenu.";
  }
}

// Fonction principale de création de l'agent
export async function createStudieAgent() {
  try {
    const llm = getGeminiModel(); // Ton modèle Gemini déjà configuré

    // Fonction d’interaction avec l’agent
    async function chatWithAgent(question: string): Promise<string> {
      try {
        const res = await llm.invoke(question); // Appel direct au modèle

        // Tentative de parsing intelligent
        const parsedOutput = extractGeminiContent(res);
        if (parsedOutput && typeof parsedOutput === "string") {
          return parsedOutput;
        }

        // Fallback : parser personnalisé (utile en debug)
        const geminiParser = new GeminiOutputParser();
        const fallbackParsed = await geminiParser.parse(res);
        return fallbackParsed || "Réponse non compréhensible.";
      } catch (error) {
        console.error("Erreur lors de l'exécution de l'agent :", error);
        throw new Error("Erreur lors de la discussion avec l'agent");
      }
    }

    return { chatWithAgent };
  } catch (err: any) {
    console.error("Erreur agent :", err.message);
    throw new Error("Création de l'agent échouée.");
  }
}
