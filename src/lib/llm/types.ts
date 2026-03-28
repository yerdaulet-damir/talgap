import { z, ZodSchema } from 'zod'

export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LLMOptions {
  temperature?: number
  maxTokens?: number
  topP?: number
}

export interface LLMResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface LLMProvider {
  readonly name: string
  chat(messages: Message[], options?: LLMOptions): Promise<LLMResponse>
  chatJSON<T>(messages: Message[], schema: ZodSchema<T>, options?: LLMOptions): Promise<T>
}
