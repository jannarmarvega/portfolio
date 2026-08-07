export const GROQ_CONFIG = {
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  endpoint: 'https://api.groq.com/openai/v1/chat/completions',
  model: 'llama-3.3-70b-versatile',
  maxTokens: 1024,
  temperature: 0.7,
}
