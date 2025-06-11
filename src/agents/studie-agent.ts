// @ts-ignore
import { createReactAgent } from "@langchain/langgraph/prebuilt";
// @ts-ignore
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { tool } from '@langchain/core/tools';
import { z } from "zod";
// import LoadEnv from "@/config/dotenv";
import { getGeminiModel } from "@/models/models";
import Prisma from "@/utils/prisma";
import { PrismaChatHistory } from "@/methode/CustomMemorySaver";
import { webSearch } from "@/tools/websearch";

// LoadEnv.load();

export async function runAgent(
  threadId: string,
  messages: { role: string; content: string }
): Promise<string> {
  const model = getGeminiModel();
  const chatHistory = new PrismaChatHistory(Prisma, threadId);
  const memorySaver = new MemorySaver();

  


  const webSearchTool = tool(webSearch,{
    name: "web_search",
    description: "Effectue une recherche web pour obtenir des informations supplémentaires.",
    schema: z.object({
      query: z.string().describe("La requête de recherche web à effectuer qui doit contenir moins de 300 caractères.")
    })
  })

  const agent = createReactAgent({
    llm: model,
    prompt:`Tu es un agent d'étude, tu dois répondre aux questions de l'utilisateur en te basant sur l'historique de la conversation. Tu peux utiliser des outils si nécessaire, mais tu dois toujours te référer à l'historique pour donner des réponses précises et pertinentes. utilise le tool web_search si tu n'as pas assez d'informations sur la question de l'utilisateur.`,

    tools: [webSearchTool],
    checkpointer: memorySaver,
    preModelHook: async () => {
      const msgs = await chatHistory.getMessages();
      return {
        llmInputMessages: msgs,
      };
    },
  });

  // Ajoute la question de l'utilisateur à l'historique avant l'appel à l'agent
  await chatHistory.addMessages([
    new HumanMessage({ content: messages.content })
  ]);

  const result = await agent.invoke(
    { messages },
    { configurable: { thread_id: threadId } }
  );

  const answer = result.messages.at(-1);
  if (!answer) {
    throw new Error("No answer received from the agent.");
  }
  
  await chatHistory.addMessages([answer]);

  return answer.content.toString();
}
