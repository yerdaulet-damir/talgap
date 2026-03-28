import { LLMProvider, Message, LLMOptions, LLMResponse } from '../types'
import { ZodSchema } from 'zod'

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

export class DeepSeekProvider implements LLMProvider {
  readonly name = 'deepseek'
  private apiKey: string

  constructor(apiKey?: string) {
    const key = apiKey || process.env.DEEPSEEK_API_KEY
    if (!key) throw new Error('DEEPSEEK_API_KEY is required')
    this.apiKey = key
  }

  async chat(messages: Message[], options?: LLMOptions): Promise<LLMResponse> {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        temperature: options?.temperature ?? 0.3,
        max_tokens: options?.maxTokens ?? 2048,
        top_p: options?.topP ?? 0.9,
      }),
    })

    const data = await response.json()
    const choice = data.choices?.[0]

    return {
      content: choice?.message?.content ?? '',
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      } : undefined,
    }
  }

  async chatJSON<T>(messages: Message[], schema: ZodSchema<T>, options?: LLMOptions): Promise<T> {
    const systemIdx = messages.findIndex(m => m.role === 'system')
    const enhanced = [...messages]
    if (systemIdx >= 0) {
      enhanced[systemIdx] = {
        ...enhanced[systemIdx],
        content: enhanced[systemIdx].content + '\n\nRespond with valid JSON only. No markdown, no code blocks.',
      }
    }

    const response = await this.chat(enhanced, { ...options, temperature: 0.1 })
    const cleaned = response.content.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(cleaned)
    return schema.parse(parsed)
  }
}
