/**
 * Outil de recherche web
 */

/**
 * la requete de recherche web
 * @param query - La requête de recherche
 * @returns - Les résultats de la recherche web
 */


export async function webSearch(query: string) {
  if (!query || typeof query !== "string" || query.trim() === "") {
    throw new Error(
      "La requête de recherche ne peut pas être vide ou invalide."
    );
  }

  const data = {
    query: query,
    topic: "general",
    search_depth: "basic",
    max_results: 2,
    answer: true,
    // chunks_per_source: 3,
    // include_raw_content: true,
  };

  const fetchReq = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer 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"
    },
    body: JSON.stringify(data),
  });

  if (!fetchReq.ok) {
    throw new Error(
      `Erreur lors de la recherche web: ${fetchReq.statusText} (${fetchReq.status})`
    );
  }
  const response = await fetchReq.json();
  if (!response || !response.results || response.results.length === 0) {
    return "Aucun résultat trouvé pour la requête de recherche.";
  }

  console.log(response);
  
  // type resultType = {
  //   title: string;
  //   url: string;
  //   content: string;
  //   score: number;
  //   raw_content?: string;
  // }


  return response
}

// webSearch("Qu'est-ce que l'intelligence artificielle ?")