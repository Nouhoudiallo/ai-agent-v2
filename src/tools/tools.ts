import { DynamicTool } from "langchain/tools";
import { webSearch } from "./websearch";

export const tools: DynamicTool[] = [
  new DynamicTool({
    name: "web_search",
    description: "Effectue une recherche sur le web pour trouver des informations pertinentes.",
    func: webSearch,
  })
]