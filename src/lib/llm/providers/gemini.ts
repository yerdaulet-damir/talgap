import { LLMProvider, Message, LLMOptions, LLMResponse } from '../types'
import { ZodSchema } from 'zod'
import { GoogleGenAI } from '@google/genai'

export class GeminiProvider implements LLMProvider {
  readonly name = 'gemini'
  private client: GoogleGenAI

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY
    if (!key) throw new Error('GEMINI_API_KEY is required')
    this.client = new GoogleGenAI({ apiKey: key })
  }

  async chat(messages: Message[], options?: LLMOptions): Promise<LLMResponse> {
    const systemMessage = messages.find(m => m.role === 'system')
    const chatMessages = messages.filter(m => m.role !== 'system')

    const response = await this.client.models.generateContent({
      model: 'gemini-2.5-flash-preview-05-20',
      contents: chatMessages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      config: {
        systemInstruction: systemMessage?.content,
        temperature: options?.temperature ?? 0.3,
        maxOutputTokens: options?.maxTokens ?? 2048,
        topP: options?.topP ?? 0.9,
      },
    })

    const text = response.text ?? ''

    return {
      content: text,
      usage: response.usageMetadata ? {
        promptTokens: response.usageMetadata.promptTokenCount ?? 0,
        completionTokens: response.usageMetadata.candidatesTokenCount ?? 0,
        totalTokens: response.usageMetadata.totalTokenCount ?? 0,
      } : undefined,
    }
  }

  async chatJSON<T>(messages: Message[], schema: ZodSchema<T>, options?: LLMOptions): Promise<T> {
    const systemMessage = messages.find(m => m.role === 'system')
    const chatMessages = messages.filter(m => m.role !== 'system')

    const enhancedSystem = `${systemMessage?.content ?? ''}\n\nYou MUST respond with valid JSON only. No markdown, no code blocks, just raw JSON.`

    const response = await this.client.models.generateContent({
      model: 'gemini-2.5-flash-preview-05-20',
      contents: chatMessages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      config: {
        systemInstruction: enhancedSystem,
        responseMimeType: 'application/json',
        temperature: options?.temperature ?? 0.3,
        maxOutputTokens: options?.maxTokens ?? 2048,
      },
    })

    const text = response.text ?? '{}'
    const parsed = JSON.parse(text)
    return schema.parse(parsed)
  }
}
