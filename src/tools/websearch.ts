import axios from 'axios';

/**
 * Fonction pour effectuer une recherche sur le web.
 * @param query La requête de recherche.
 * @returns Les résultats de la recherche sous forme de texte.
 */
export async function webSearch(query: string): Promise<string> {
  try {
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: process.env.GOOGLE_API_KEY, // Clé API Google
        cx: process.env.GOOGLE_SEARCH_ENGINE_ID, // ID du moteur de recherche personnalisé
        q: query, // Requête de recherche
      },
    });

    // Extraire les résultats pertinents
    const items = response.data.items || [];
    return items.map((item: any) => `${item.title}: ${item.link}`).join('\n');
  } catch (error) {
    console.error('Erreur lors de la recherche sur le web :', error);
    throw new Error('Impossible de récupérer les résultats de la recherche.');
  }
}
