import Prisma from "../utils/prisma";
export async function createApiKey(userId:string): Promise<string> {
  try {

    if (!userId) {
      return("L'ID utilisateur est requis pour créer une clé API.");
    }

    const verifyUser = await Prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    if(!verifyUser) {
      return("Utilisateur non trouvé.");
    }
    
    if(verifyUser.role !== "ADMIN") {
      return("Seuls les utilisateurs avec le rôle 'ADMIN' peuvent créer des clés API.");
    }

    const generateApiKey = () => {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };
    const apiKey = await Prisma.apiKey.create({
      data: {
        authorId: userId,
        key: generateApiKey()
      },
      include: {
        author: true
      }
    });

    if (!apiKey) {
      return("Erreur lors de la création de la clé API.");
    }
    console.log("Clé API créée avec succès :", apiKey.key);


    return apiKey.key;
  } catch (error:any) {
    console.error("Erreur lors de la création de la clé API :", error)
    return error.message;
  }
}