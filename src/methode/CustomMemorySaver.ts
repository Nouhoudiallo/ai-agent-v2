import { PrismaClient } from "@prisma/client";
import { BaseListChatMessageHistory } from "@langchain/core/chat_history";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";


export class PrismaChatHistory extends BaseListChatMessageHistory {
  lc_namespace = ["langchain", "memory", "prisma"];

  constructor(private prisma: PrismaClient, private threadId: string) {
    super();
  }

  async addMessage(message: BaseMessage): Promise<void> {
    // Conversion BaseMessage -> string + rôle
    let role = "assistant";
    if (message._getType) {
      role = message._getType() === "human" ? "human" : "AGENT";
    } else if ((message as any).role) {
      role = (message as any).role;
    }
    let content = "";
    if (typeof message.content === "string") {
      content = message.content;
    } else if (Array.isArray(message.content)) {
      content = message.content.map((c: any) => typeof c === "string" ? c : c.text || "").join(" ");
    } else if (typeof message.content === "object" && message.content !== null) {
      content = (message.content as any).text || JSON.stringify(message.content);
    }
    await this.prisma.message.create({
      data: {
        content: content.toString(),
        sender: role === "human" ? "USER" : "AGENT",
        discussionId: this.threadId,
      },
    });
  }

  async addMessages(messages: BaseMessage[]): Promise<void> {
    for (const message of messages) {
      await this.addMessage(message);
    }
  }

  async getMessages(): Promise<BaseMessage[]> {
    const rows = await this.prisma.message.findMany({
      where: { discussionId: this.threadId },
      orderBy: { createdAt: "asc" },
    });
    return rows.map((r) =>
      r.sender === "USER"
        ? new HumanMessage({ content: r.content })
        : new AIMessage({ content: r.content })
    );
  }

  async clear(): Promise<void> {
    await this.prisma.message.deleteMany({
      where: { discussionId: this.threadId },
    });
  }
}