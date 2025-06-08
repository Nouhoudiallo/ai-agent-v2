import { ApiKey } from "@prisma/client";
import Prisma from "../utils/prisma";

export async function VerifyApiKey(apiKey: string): Promise<{
  isValid: boolean;
  error?: string;
  data?: {
    data: ApiKey;
  };
}> {
  try {
    const verifyApiKey = await Prisma.apiKey.findUnique({
      where: {
        key: apiKey,
      },
    });

    if (!verifyApiKey) {
      return {
        isValid: false,
        error: "Clé API invalide",
      };
    }

    return {
      isValid: true,
      data: {
        data: verifyApiKey,
      },
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}
