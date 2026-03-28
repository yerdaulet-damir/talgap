import { LLMProvider } from './types'
import { MockProvider } from './providers/mock'
import { GeminiProvider } from './providers/gemini'
import { DeepSeekProvider } from './providers/deepseek'
import { GroqProvider } from './providers/groq'

export type ProviderName = 'gemini' | 'deepseek' | 'groq' | 'mock'

const providers = new Map<string, LLMProvider>()

export function getLLM(provider?: ProviderName): LLMProvider {
  const name = provider || (process.env.DEFAULT_LLM_PROVIDER as ProviderName) || 'mock'

  if (providers.has(name)) {
    return providers.get(name)!
  }

  let instance: LLMProvider

  switch (name) {
    case 'gemini':
      instance = new GeminiProvider()
      break
    case 'deepseek':
      instance = new DeepSeekProvider()
      break
    case 'groq':
      instance = new GroqProvider()
      break
    case 'mock':
    default:
      instance = new MockProvider()
      break
  }

  providers.set(name, instance)
  return instance
}

export { type LLMProvider, type Message, type LLMOptions, type LLMResponse } from './types'
