import { setupReadline } from "../tools/realtime";
import { webSearch } from "../tools/websearch";

export async function createWebSearchAgent() {
  try {
    // Fonction pour interagir avec l'outil de recherche sur le web
    async function searchWeb(query: string) {
      try {
        const results = await webSearch(query);
        console.log(results); // Afficher uniquement les résultats de la recherche
      } catch (error) {
        console.error("Erreur lors de la recherche sur le web :", error);
      }
    }

    // Configurer l'interface readline pour capturer les entrées utilisateur
    setupReadline(async (input: string) => {
      if (input.startsWith("search:")) {
        const query = input.replace("search:", "").trim();
        await searchWeb(query);
      } else {
        console.log("Commande non reconnue. Utilisez 'search:<votre requête>' pour effectuer une recherche sur le web.");
      }
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erreur lors de la création de l'agent de recherche sur le web :", error.message);
    } else {
      console.error("Erreur lors de la création de l'agent de recherche sur le web :", error);
    }
    return;
  }
}
