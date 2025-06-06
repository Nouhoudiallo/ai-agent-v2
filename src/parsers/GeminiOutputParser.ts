// src/agents/parsers/GeminiOutputParser.ts
//langchain/schema/output_parser
import { BaseOutputParser } from "@langchain/core/output_parsers";

export class GeminiOutputParser extends BaseOutputParser<string> {
  lc_namespace = ["parsers", "gemini"];

  async parse(result: any): Promise<string> {
    try {
      // Gemini (Google Generative AI) renvoie souvent un objet avec une clé 'content' ou 'text',
      // ou bien un objet message complet (AIMessageChunk) avec 'kwargs.content'.

      // Cas 1 : Si c'est un message Gemini complet (AIMessageChunk)
      if (result && result.kwargs && Array.isArray(result.kwargs.content)) {
        let output = "";
        for (const item of result.kwargs.content) {
          if (item.type === "text") {
            output += item.text + "\n";
          } else if (item.functionCall) {
            output += `[Function Call: ${item.functionCall.name}(${JSON.stringify(item.functionCall.args)})]\n`;
          }
        }
        return output.trim();
      }

      // Cas 2 : Si Gemini renvoie un objet { content: [...] }
      if (typeof result === "object" && Array.isArray(result.content)) {
        let output = "";
        for (const item of result.content) {
          if (item.type === "text") {
            output += item.text + "\n";
          } else if (item.type === "functionCall") {
            output += `[Function Call: ${item.functionCall.name}(${JSON.stringify(item.functionCall.args)})]\n`;
          }
        }
        return output.trim();
      }

      // Cas 3 : Si c'est une string brute
      if (typeof result === "string") {
        return result;
      }

      // Cas 4 : fallback JSON
      return JSON.stringify(result, null, 2);
    } catch (error) {
      console.error("Erreur dans GeminiOutputParser :", error);
      throw new Error("Parsing failed in GeminiOutputParser.");
    }
  }

  getFormatInstructions(): string {
    return "Le modèle doit retourner un objet contenant un champ 'content' avec un tableau d'éléments { type, text | functionCall }.";
  }
}
