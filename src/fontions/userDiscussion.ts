import Prisma from "../utils/prisma";
// Utilisation des types générés par Prisma Client
import { ROLE, Sender } from "@prisma/client";
// Ajout du hachage du mot de passe avant la création de l'utilisateur
import bcrypt from "bcrypt";

export async function createUser(email: string, password: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    return user;
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error);
    throw error;
  }
}

// Fonction pour mettre à jour un utilisateur
export async function updateUser(userId: string, data: Partial<{ email: string; password: string; role: ROLE }>) {
  try {
    const user = await Prisma.user.update({
      where: { id: userId },
      data,
    });
    return user;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    throw error;
  }
}

// Fonction pour supprimer un utilisateur
export async function deleteUser(userId: string) {
  try {
    await Prisma.user.delete({
      where: { id: userId },
    });
    return `Utilisateur avec l'ID ${userId} supprimé.`;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    throw error;
  }
}

// Fonction pour créer une discussion
export async function createDiscussion(title: string, authorId: string) {
  try {
    const discussion = await Prisma.discussion.create({
      data: {
        title,
        authorId,
      },
    });
    return discussion;
  } catch (error) {
    console.error("Erreur lors de la création de la discussion :", error);
    throw error;
  }
}

// Fonction pour ajouter un message à une discussion
export async function addMessageToDiscussion(discussionId: string, content: string, sender: Sender) {
  try {
    const message = await Prisma.message.create({
      data: {
        discussionId,
        content,
        sender,
      },
    });
    return message;
  } catch (error) {
    console.error("Erreur lors de l'ajout du message à la discussion :", error);
    throw error;
  }
}

// Fonction pour récupérer les discussions d'un utilisateur
export async function getUserDiscussions(userId: string) {
  try {
    const discussions = await Prisma.discussion.findMany({
      where: { authorId: userId },
      include: {
        messages: true,
      },
    });
    return discussions;
  } catch (error) {
    console.error("Erreur lors de la récupération des discussions de l'utilisateur :", error);
    throw error;
  }
}
