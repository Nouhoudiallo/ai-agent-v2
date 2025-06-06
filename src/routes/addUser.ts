import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { createUser, getUserByEmail } from "../fontions/user";
export const handleAddUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "L'email et le mot de passe sont requis" });
      return;
    }

    const generateSalt = await bcrypt.genSalt(20);
    const hashedPassword = await bcrypt.hash(password, generateSalt);

    const veryUser = await getUserByEmail(email);

    if (veryUser) {
      res
        .status(400)
        .json({ error: "Un utilisateur avec cet email existe déjà" });
      return;
    }

    const insertUser = await createUser(email, hashedPassword);

    if (!insertUser) {
      res
        .status(500)
        .json({ error: "Erreur lors de la création de l'utilisateur" });
      return;
    }

    res.status(200).json({
      message: "Utilisateur ajouté avec succès",
      user: insertUser,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};
