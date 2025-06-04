import express from "express";
import LoadEnv from "./src/config/dotenv";
import { RouteAgent } from "./src/tools/RouteAgent";
import { handleAsk } from "./src/routes/ask";

LoadEnv.load();

const app = express();
const agent = new RouteAgent();

// Ajout du middleware express.json() pour traiter les corps de requêtes JSON
app.use(express.json());

agent.createRoute("/ask", "post", handleAsk);

app.use(agent.getRouter());

app.listen(3000, () => {
  console.log("Serveur démarré sur le port http://localhost:3000");
});
