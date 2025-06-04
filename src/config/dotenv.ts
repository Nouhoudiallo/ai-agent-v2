import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

// if (!process.env.GOOGLE_API_KEY) {
//   console.error(
//     "Erreur : GOOGLE_API_KEY n'est pas définie dans le fichier .env"
//   );
//   process.exit(1);
// }

export class LoadEnv {
  static load() {
    // Cette méthode est appelée pour charger les variables d'environnement

    if (!process.env.GOOGLE_API_KEY) {
      console.error(
        "Erreur : GOOGLE_API_KEY n'est pas définie dans le fichier .env"
      );
      process.exit(1);
    }
    console.log("Variables d'environnement chargées avec succès.");
  }
  static get(key: string): string | undefined {
    // Cette méthode est utilisée pour obtenir une variable d'environnement spécifique
    return process.env[key];
  }
  static getAll(): NodeJS.ProcessEnv {
    // Cette méthode est utilisée pour obtenir toutes les variables d'environnement
    return process.env;
  }
  static set(key: string, value: string): void {
    // Cette méthode est utilisée pour définir une variable d'environnement
    process.env[key] = value;
  }
  static clear(): void {
    // Cette méthode est utilisée pour effacer toutes les variables d'environnement
    for (const key in process.env) {
      delete process.env[key];
    }
  }
  static has(key: string): boolean {
    // Cette méthode est utilisée pour vérifier si une variable d'environnement existe
    return key in process.env;
  }
  static delete(key: string): void {
    // Cette méthode est utilisée pour supprimer une variable d'environnement
    delete process.env[key];
  }
  static keys(): string[] {
    // Cette méthode est utilisée pour obtenir toutes les clés des variables d'environnement
    return Object.keys(process.env);
  }
}
export default LoadEnv;