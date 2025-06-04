import Prisma from "../utils/prisma";

export async function VerifyApiKey(apiKey: string): Promise<{
  isValid: boolean;
  error?: string;
  data?: any;
}>{
  try {
    
    const verifyApiKey = await Prisma.apiKey.findUnique({
      where: {
        key: apiKey
      }
    })

    if(!verifyApiKey) {
      return {
        isValid: false,
        error: "Clé API invalide"
      }
    }




    return {
      isValid: true,
      data: verifyApiKey
    }
  } catch (error) {
    return {
      isValid: false,
      error: "Erreur lors de la vérification de la clé API"
    }
  }
}