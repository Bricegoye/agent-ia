import OpenAI from "openai";

import type { AIClient } from "./ai-client";
import type { AIMessage } from "./types";

export class OpenAIClient implements AIClient {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(
    apiKey: string = process.env.OPENAI_API_KEY ?? "",
    model: string = process.env.OPENAI_MODEL ?? "gpt-4.1-mini"
  ) {
    if (!apiKey) {
      throw new Error(
        "La variable d'environnement OPENAI_API_KEY est manquante."
      );
    }

    this.client = new OpenAI({
      apiKey,
    });

    this.model = model;
  }

  async generate(messages: AIMessage[]): Promise<string> {
    if (messages.length === 0) {
      throw new Error(
        "Impossible de générer une réponse IA sans message."
      );
    }

    const systemMessage = messages.find(
      (message) => message.role === "system"
    );

    const conversationMessages = messages
      .filter((message) => message.role !== "system")
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    const response = await this.client.responses.create({
      model: this.model,
      instructions: systemMessage?.content,
      input: conversationMessages,
    });

    const outputText = response.output_text?.trim();

    if (!outputText) {
      throw new Error(
        "OpenAI a retourné une réponse vide."
      );
    }

    return outputText;
  }
}