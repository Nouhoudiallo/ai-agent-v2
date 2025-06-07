import express from "express";
import LoadEnv from "./src/config/dotenv";
import { RouteAgent } from "./src/tools/RouteAgent";
import { handleAsk } from "./src/routes/ask";
import { handleUpdateUser } from "./src/routes/uptdateUser";
import { handleUploadDocument } from "./src/routes/uploadDocument";
import { handleAddUser } from "./src/routes/addUser";
import { handleDeleteUser } from "./src/routes/deleteUser";

LoadEnv.load();

const app = express();
const agent = new RouteAgent();

// Ajout du middleware express.json() pour traiter les corps de requêtes JSON
app.use(express.json());

agent.createRoute("/api/ask", "post", handleAsk);
agent.createRoute("/api/add-user", "post", handleAddUser);
agent.createRoute("/api/update-user", "post", handleUpdateUser);
agent.createRoute("/api/delete-user", "post", handleDeleteUser);
agent.createRoute("/api/upload-document", "post", handleUploadDocument);
agent.createRoute("/api/test", "get", (req, res)=> {
  res.status(200).json({
    message: "Test réussi",
  });
});

app.use(agent.getRouter());

app.listen(3000, () => {
  console.log("Serveur démarré sur le port http://localhost:3000");
});
