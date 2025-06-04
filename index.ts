import { createStudieAgent } from "./src/agents/studie-agent";
import LoadEnv from "./src/config/dotenv"

LoadEnv.load();

createStudieAgent().catch((error) => {
  console.error("Erreur lors de la création de l'agent :", error);
});

