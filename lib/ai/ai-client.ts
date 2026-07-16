import type { AIMessage } from "./types";

export interface AIClient {
  generate(messages: AIMessage[]): Promise<string>;
}