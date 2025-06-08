import express from "express";
import cors from "cors";
import { testRoute } from "@/routes/test";
import { handleAsk } from "@/routes/ask";
import { handleAddUser } from "@/routes/addUser";
import { handleUpdateUser } from "@/routes/uptdateUser";
import { handleDeleteUser } from "@/routes/deleteUser";
import { handleUploadDocument } from "@/routes/uploadDocument";
import { RouteAgent } from "@/tools/RouteAgent";
import LoadEnv from "@/config/dotenv";

LoadEnv.load();

const app = express();
const agent = new RouteAgent();

// Ajout du middleware express.json() pour traiter les corps de requêtes JSON
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

agent.createRoute("/api/ask", "post", handleAsk);
agent.createRoute("/api/add-user", "post", handleAddUser);
agent.createRoute("/api/update-user", "post", handleUpdateUser);
agent.createRoute("/api/delete-user", "post", handleDeleteUser);
agent.createRoute("/api/upload-document", "post", handleUploadDocument);
agent.createRoute("/api/test", "get", testRoute);

app.use(agent.getRouter());

app.listen(3000, () => {
  console.log("Serveur démarré sur le port http://localhost:3000");
});
