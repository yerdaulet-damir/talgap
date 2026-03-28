import { LLMProvider, Message, LLMOptions, LLMResponse } from '../types'
import { ZodSchema } from 'zod'

export class MockProvider implements LLMProvider {
  readonly name = 'mock'

  async chat(messages: Message[], options?: LLMOptions): Promise<LLMResponse> {
    const lastMessage = messages[messages.length - 1]
    return {
      content: `Mock response to: ${lastMessage?.content?.slice(0, 50) ?? 'empty'}`,
      usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
    }
  }

  async chatJSON<T>(messages: Message[], schema: ZodSchema<T>, options?: LLMOptions): Promise<T> {
    const lastMessage = messages[messages.length - 1]

    // Try to generate a plausible response based on schema
    // For scoring, return a structured response
    const mockData = this.generateMockForSchema(schema)
    return schema.parse(mockData)
  }

  private generateMockForSchema(schema: ZodSchema<unknown>): unknown {
    // Return a generic object that works for our scoring schemas
    return {
      score: 3,
      reasoning: 'Mock reasoning: The candidate demonstrated adequate understanding of the topic with room for improvement.',
      dimension: 'resourcefulness',
      confidence: 0.75,
      evidence: ['Mentioned practical approach', 'Showed awareness of constraints'],
    }
  }
}
