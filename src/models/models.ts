import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

function getGeminiModel() {
  return new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
    model: "gemini-1.5-flash",
    temperature: 0.7,
  });
}

 function getGeminiEmbeddings() {
  return new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
    model: "embedding-001",
  });
}

export  {
  getGeminiModel,
  getGeminiEmbeddings,}