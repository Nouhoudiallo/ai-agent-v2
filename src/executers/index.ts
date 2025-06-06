import { getGeminiModel } from "../tools/models";
import { tools } from "../tools/tools";
import { initializeAgentExecutorWithOptions } from "langchain/agents";

export async function createAgentExecutor() {
  const model = getGeminiModel();

  const Executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "structured-chat-zero-shot-react-description", // Compatible Gemini via LangChain
    verbose: true, // Pour le debug
  });

  return Executor;
}
