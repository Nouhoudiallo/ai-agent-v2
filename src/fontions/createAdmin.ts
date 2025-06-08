import Prisma from "../utils/prisma";

export async function createAdmin() {
  try {
    const admin = await Prisma.user.create({
      data: {
        email: "admineé@example.com",
        password: "securepassword",
        role: "ADMIN"
      },
      include:{
        apiKeys: true,
      }
    });

    console.log("Admin créé avec succès :", admin);
    return admin;
  } catch (error) {
    console.error("Erreur lors de la création de l'admin :", error);
  }
}