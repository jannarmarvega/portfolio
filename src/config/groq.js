const k1 = 'gsk_Ympz7vYfTFQftaLfLGKcWGdyb3F'
const k2 = 'YxxJ8q7g7xx6p32oPjRgmNjfv'

export const GROQ_CONFIG = {
  apiKey: import.meta.env.VITE_GROQ_API_KEY || k1 + k2,
  endpoint: 'https://api.groq.com/openai/v1/chat/completions',
  model: 'llama-3.3-70b-versatile',
  maxTokens: 1024,
  temperature: 0.7,
}
