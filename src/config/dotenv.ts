import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

export class LoadEnv {
  /**
   * Charge toutes les variables d'environnement nécessaires.
   * Vérifie que les clés requises sont définies dans le fichier .env.
   * En cas d'absence d'une clé, le programme s'arrête avec une erreur.
   */
  static load() {
    // Charger toutes les variables d'environnement
    const requiredKeys = ["GOOGLE_API_KEY", "GOOGLE_SEARCH_ENGINE_ID", "GOOGLE_GEMINI_API_KEY"];

    for (const key of requiredKeys) {
      if (!process.env[key]) {
        console.error(`Erreur : ${key} n'est pas définie dans le fichier .env`);
        process.exit(1);
      }
    }

    console.log(
      "Toutes les variables d'environnement requises ont été chargées avec succès."
    );
  }

  /**
   * Récupère la valeur d'une variable d'environnement spécifique.
   * @param key - La clé de la variable d'environnement à récupérer.
   * @returns La valeur de la variable d'environnement ou undefined si elle n'existe pas.
   */
  static get(key: string): string | undefined {
    // Cette méthode est utilisée pour obtenir une variable d'environnement spécifique
    return process.env[key];
  }

  /**
   * Récupère toutes les variables d'environnement.
   * @returns Un objet contenant toutes les variables d'environnement.
   */
  static getAll(): NodeJS.ProcessEnv {
    // Cette méthode est utilisée pour obtenir toutes les variables d'environnement
    return process.env;
  }

  /**
   * Définit une variable d'environnement avec une clé et une valeur.
   * @param key - La clé de la variable d'environnement.
   * @param value - La valeur à associer à la clé.
   */
  static set(key: string, value: string): void {
    // Cette méthode est utilisée pour définir une variable d'environnement
    process.env[key] = value;
  }

  /**
   * Efface toutes les variables d'environnement.
   */
  static clear(): void {
    // Cette méthode est utilisée pour effacer toutes les variables d'environnement
    for (const key in process.env) {
      delete process.env[key];
    }
  }

  /**
   * Vérifie si une variable d'environnement existe.
   * @param key - La clé de la variable d'environnement à vérifier.
   * @returns True si la variable existe, sinon False.
   */
  static has(key: string): boolean {
    // Cette méthode est utilisée pour vérifier si une variable d'environnement existe
    return key in process.env;
  }

  /**
   * Supprime une variable d'environnement spécifique.
   * @param key - La clé de la variable d'environnement à supprimer.
   */
  static delete(key: string): void {
    // Cette méthode est utilisée pour supprimer une variable d'environnement
    delete process.env[key];
  }

  /**
   * Récupère toutes les clés des variables d'environnement.
   * @returns Un tableau contenant les clés des variables d'environnement.
   */
  static keys(): string[] {
    // Cette méthode est utilisée pour obtenir toutes les clés des variables d'environnement
    return Object.keys(process.env);
  }
}
export default LoadEnv;