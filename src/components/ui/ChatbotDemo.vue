<script setup>
import { ref, nextTick, watch } from 'vue'
import { GROQ_CONFIG } from '../../config/groq.js'

const props = defineProps({
  systemPrompt: { type: String, required: true },
  placeholder: { type: String, default: 'Ask me anything about this project...' },
  greeting: { type: String, default: 'Hello! I\'m a demo chatbot for this project. How can I help you learn more about it?' },
})

const messages = ref([])
const input = ref('')
const isLoading = ref(false)
const chatRef = ref(null)

function scrollToBottom() {
  nextTick(() => {
    if (chatRef.value) chatRef.value.scrollTop = chatRef.value.scrollHeight
  })
}

function addMessage(role, content) {
  messages.value.push({ role, content })
  scrollToBottom()
}

watch(() => props.greeting, (val) => {
  if (val) {
    messages.value = [{ role: 'assistant', content: val }]
  }
}, { immediate: true })

async function sendMessage() {
  const text = input.value.trim()
  if (!text || isLoading.value) return

  addMessage('user', text)
  input.value = ''
  isLoading.value = true

  try {
    const response = await fetch(GROQ_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_CONFIG.model,
        messages: [
          { role: 'system', content: props.systemPrompt },
          ...messages.value.map(m => ({ role: m.role, content: m.content })),
        ],
        max_tokens: GROQ_CONFIG.maxTokens,
        temperature: GROQ_CONFIG.temperature,
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error?.message || 'API request failed')
    }

    const data = await response.json()
    addMessage('assistant', data.choices[0].message.content)
  } catch (e) {
    addMessage('assistant', `Sorry, I encountered an error. Please try again later. (${e.message})`)
  } finally {
    isLoading.value = false
  }
}

function handleKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}
</script>

<template>
  <div class="chatbot">
    <div class="chatbot__messages" ref="chatRef">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        :class="['chatbot__message', `chatbot__message--${msg.role}`]"
      >
        <span class="chatbot__role">{{ msg.role === 'assistant' ? 'AI' : 'You' }}</span>
        <div class="chatbot__bubble">{{ msg.content }}</div>
      </div>
      <div v-if="isLoading" class="chatbot__message chatbot__message--assistant">
        <span class="chatbot__role">AI</span>
        <div class="chatbot__bubble chatbot__typing">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
    </div>

    <div class="chatbot__input-area">
      <textarea
        v-model="input"
        :placeholder="placeholder"
        class="chatbot__input"
        rows="1"
        @keydown="handleKeydown"
        :disabled="isLoading"
      ></textarea>
      <button
        class="chatbot__send"
        @click="sendMessage"
        :disabled="isLoading || !input.trim()"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as *;

.chatbot {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 400px;

  &__messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-height: 450px;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(108, 99, 255, 0.3);
      border-radius: 10px;
    }
  }

  &__message {
    display: flex;
    flex-direction: column;
    max-width: 85%;

    &--user {
      align-self: flex-end;
      .chatbot__role { text-align: right; }
      .chatbot__bubble {
        background: linear-gradient(135deg, $color-primary, $color-gradient-end);
        color: #fff;
        border-radius: 16px 16px 4px 16px;
      }
    }

    &--assistant {
      align-self: flex-start;
      .chatbot__bubble {
        background: $color-bg-card;
        color: $color-text;
        border-radius: 16px 16px 16px 4px;
        border: 1px solid $color-border;
      }
    }
  }

  &__role {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: $color-text-muted;
    margin-bottom: 4px;
    padding: 0 8px;
  }

  &__bubble {
    padding: 12px 16px;
    font-size: 0.9rem;
    line-height: 1.6;
    word-wrap: break-word;
    white-space: pre-wrap;
  }

  &__typing {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 16px 20px;

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: $color-text-muted;
      animation: bounce 1.4s infinite ease-in-out both;

      &:nth-child(1) { animation-delay: -0.32s; }
      &:nth-child(2) { animation-delay: -0.16s; }
    }
  }

  &__input-area {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid $color-border;
    background: $color-bg-alt;
    border-radius: 0 0 $radius-md $radius-md;
  }

  &__input {
    flex: 1;
    padding: 10px 14px;
    border-radius: $radius-sm;
    border: 1px solid $color-border;
    background: $color-bg;
    color: $color-text;
    font-size: 0.9rem;
    font-family: $font-sans;
    resize: none;
    outline: none;

    &:focus {
      border-color: $color-primary;
    }

    &::placeholder {
      color: $color-text-muted;
    }

    &:disabled {
      opacity: 0.5;
    }
  }

  &__send {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: $radius-sm;
    background: linear-gradient(135deg, $color-primary, $color-gradient-end);
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all $transition-fast;
    flex-shrink: 0;

    &:hover:not(:disabled) {
      transform: scale(1.05);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
</style>
