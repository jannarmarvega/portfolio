<script setup>
import { ref, nextTick, watch } from 'vue'
import { GROQ_CONFIG } from '../../config/groq.js'

const props = defineProps({
  systemPrompt: { type: String, required: true },
  placeholder: { type: String, default: 'Ask me anything about this project...' },
  greeting: { type: String, default: "Hello! I'm a demo chatbot for this project. How can I help you learn more about it?" },
})

const messages = ref([])
const input = ref('')
const isLoading = ref(false)
const chatRef = ref(null)
const inputRef = ref(null)
const showScrollBtn = ref(false)

function scrollToBottom() {
  nextTick(() => {
    if (chatRef.value) {
      chatRef.value.scrollTop = chatRef.value.scrollHeight
      showScrollBtn.value = false
    }
  })
}

function checkScroll() {
  if (!chatRef.value) return
  const { scrollTop, scrollHeight, clientHeight } = chatRef.value
  showScrollBtn.value = scrollHeight - scrollTop - clientHeight > 50
}

function addMessage(role, content) {
  messages.value.push({ role, content })
  scrollToBottom()
}

watch(() => props.greeting, (val) => {
  if (val) {
    messages.value = [{ role: 'assistant', content: val }]
    scrollToBottom()
  }
}, { immediate: true })

async function sendMessage() {
  const text = input.value.trim()
  if (!text || isLoading.value) return

  addMessage('user', text)
  input.value = ''
  isLoading.value = true

  nextTick(() => inputRef.value?.focus())

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
    addMessage('assistant', `Sorry, I encountered an error. Please try again later.\n\n(${e.message})`)
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
    <div class="chatbot__header">
      <div class="chatbot__brand">
        <div class="chatbot__avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/>
            <path d="M21 17v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-1c0-3 4-5 9-5s9 2 9 5z"/>
            <path d="M16 10a4 4 0 0 1 4 4"/>
            <path d="M8 10a4 4 0 0 0-4 4"/>
            <circle cx="12" cy="20" r="2"/>
            <path d="M2 12c0-3 1.5-5.5 4-7"/>
            <path d="M22 12c0-3-1.5-5.5-4-7"/>
          </svg>
        </div>
        <span class="chatbot__title">Project Demo</span>
      </div>
    </div>

    <div class="chatbot__messages" ref="chatRef" @scroll="checkScroll">
      <TransitionGroup name="msg" tag="div" class="chatbot__msg-list">
        <div
          v-for="(msg, i) in messages"
          :key="i"
          :class="['chatbot__message', `chatbot__message--${msg.role}`]"
        >
          <div class="chatbot__bubble">{{ msg.content }}</div>
        </div>

        <div v-if="isLoading" key="typing" class="chatbot__message chatbot__message--assistant">
          <div class="chatbot__bubble chatbot__typing">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </TransitionGroup>

      <Transition name="fade">
        <button v-if="showScrollBtn" class="chatbot__scroll-btn" @click="scrollToBottom" aria-label="Scroll to bottom">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      </Transition>
    </div>

    <div class="chatbot__input-area">
      <textarea
        ref="inputRef"
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
        aria-label="Send message"
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
}

.chatbot__header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid $color-border;
  background: $color-bg;
  flex-shrink: 0;
  border-radius: $radius-md $radius-md 0 0;
}

.chatbot__brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chatbot__avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, $color-gradient-start, $color-gradient-end);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chatbot__title {
  font-size: 0.9rem;
  font-weight: 600;
  color: $color-text-heading;
}

.chatbot__messages {
  flex: 1;
  overflow-y: auto;
  position: relative;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(108, 99, 255, 0.2);
    border-radius: 10px;
  }
}

.chatbot__msg-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 100%;
}

.chatbot__message {
  display: flex;
  max-width: 85%;

  &--user {
    align-self: flex-end;
    .chatbot__bubble {
      background: linear-gradient(135deg, $color-gradient-start, $color-gradient-end);
      color: #fff;
      border-radius: 18px 18px 4px 18px;
    }
  }

  &--assistant {
    align-self: flex-start;
    .chatbot__bubble {
      background: $color-bg-card;
      color: $color-text;
      border-radius: 18px 18px 18px 4px;
      border: 1px solid $color-border;
    }
  }
}

.chatbot__bubble {
  padding: 12px 16px;
  font-size: 0.9rem;
  line-height: 1.65;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.chatbot__typing {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 14px 20px;

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: $color-text-muted;
    animation: typing-dot 1.4s infinite ease-in-out both;

    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
    &:nth-child(3) { animation-delay: 0s; }
  }
}

.chatbot__scroll-btn {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: $color-bg-card;
  border: 1px solid $color-border;
  color: $color-text-muted;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: all $transition-fast;
  z-index: 2;

  &:hover {
    background: $color-primary;
    color: #fff;
    border-color: $color-primary;
  }
}

.chatbot__input-area {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid $color-border;
  background: $color-bg;
  flex-shrink: 0;
}

.chatbot__input {
  flex: 1;
  padding: 10px 14px;
  border-radius: $radius-md;
  border: 1px solid $color-border;
  background: $color-bg-alt;
  color: $color-text;
  font-size: 0.9rem;
  font-family: $font-sans;
  resize: none;
  outline: none;
  line-height: 1.5;

  &:focus {
    border-color: $color-primary;
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.12);
  }

  &::placeholder {
    color: $color-text-muted;
  }

  &:disabled {
    opacity: 0.5;
  }
}

.chatbot__send {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: $radius-md;
  background: linear-gradient(135deg, $color-gradient-start, $color-gradient-end);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-fast;
  flex-shrink: 0;
  align-self: flex-end;

  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 2px 12px rgba(108, 99, 255, 0.4);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

// ── Transitions ────────────────────────────────────────

.msg-enter-active {
  transition: all 0.25s ease;
}

.msg-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0.9);
}

// ── Keyframes ──────────────────────────────────────────

@keyframes typing-dot {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-6px);
    opacity: 1;
  }
}
</style>
