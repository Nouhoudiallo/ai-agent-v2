import Prisma from "../utils/prisma";

export async function createAdmin(): Promise<{ id: string; [key: string]: any } | undefined> {
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
  } catch (error: any) {
    console.error("Erreur lors de la création de l'admin :", error);
  }
}