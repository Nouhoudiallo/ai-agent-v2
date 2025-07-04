// import 'tsconfig-paths/register.js';
import express from "express";
import cors from "cors";
import { testRoute } from "@/routes/test";
import { handleAsk } from "@/routes/ask";
import { handleAddUser } from "@/routes/addUser";
import { handleUpdateUser } from "@/routes/uptdateUser";
import { handleDeleteUser } from "@/routes/deleteUser";
import { handleUploadDocument } from "@/routes/uploadDocument";
import { RouteAgent } from "@/methode/RouteAgent";
import LoadEnv from "@/config/dotenv";
import { getUserByEmail } from "@/routes/getUserByEmail";

LoadEnv.load();

const app = express();
const agent = new RouteAgent();

// Ajout du middleware express.json() pour traiter les corps de requêtes JSON
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Remplacez par l'URL de votre frontend
  })
);

// Ajout des routes pour la gestion des questions
agent.createRoute("/api/ask", "post", handleAsk);
// Ajout des routes pour la gestion des utilisateurs
agent.createRoute("/api/add-user", "post", handleAddUser);
agent.createRoute("/api/get-user-by-email", "post", getUserByEmail);
agent.createRoute("/api/update-user", "post", handleUpdateUser);
agent.createRoute("/api/delete-user", "post", handleDeleteUser);
// Ajout de la route pour le téléchargement de documents
agent.createRoute("/api/upload-document", "post", handleUploadDocument);
// Ajout de la route de test
agent.createRoute("/api/test", "get", testRoute);

app.use(agent.getRouter());

app.listen(3000, () => {
  console.log("Serveur démarré sur le port http://localhost:3000");
});
