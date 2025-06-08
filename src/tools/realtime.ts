/* eslint-disable @typescript-eslint/no-unused-vars */
import readline from "readline";
import axios from "axios";

export function setupReadline(chatHandler: (input: string) => Promise<void>) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Bienvenue dans le testeur de routes en temps réel !");
  console.log("Entrez une question pour l'agent (exemple: Quelle est la capitale de la France ?)");

  rl.on("line", async (input) => {
    if (!input.trim()) {
      console.log("Veuillez entrer une question valide.");
      return;
    }

    try {
      const url = `http://localhost:3000/ask`;
      const response = await axios.post(url, { question: input }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Réponse de l'agent:", response.data);
    } catch (error: any) {
      console.error("Erreur:", error.response?.data || error.message);
    }
  });

  rl.on("close", () => {
    console.log("Testeur de routes terminé.");
  });
}