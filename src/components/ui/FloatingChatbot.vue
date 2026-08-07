<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { GROQ_CONFIG } from '../../config/groq.js'
import buildSystemPrompt from '../../config/chatbot.js'

const isOpen = ref(false)
const input = ref('')
const isLoading = ref(false)
const messages = ref([])
const chatRef = ref(null)
const unreadCount = ref(0)
const isFirstOpen = ref(true)

const systemPrompt = buildSystemPrompt()

function scrollToBottom() {
  nextTick(() => {
    if (chatRef.value) chatRef.value.scrollTop = chatRef.value.scrollHeight
  })
}

function addMessage(role, content) {
  messages.value.push({ role, content })
  if (!isOpen.value && role === 'assistant') {
    unreadCount.value++
  }
  scrollToBottom()
}

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
          { role: 'system', content: systemPrompt },
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
    addMessage('assistant', `Sorry, something went wrong. Please try again. (${e.message})`)
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

function toggleChat() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    unreadCount.value = 0
    if (isFirstOpen.value) {
      addMessage('assistant', "Hi! I'm Jann's AI assistant. Ask me anything about his skills, experience, projects, or how to get in touch with him. What would you like to know?")
      isFirstOpen.value = false
    }
    nextTick(() => {
      if (chatRef.value) chatRef.value.scrollTop = chatRef.value.scrollHeight
    })
  }
}
</script>

<template>
  <div class="floating-chat" :class="{ 'floating-chat--open': isOpen }">
    <Transition name="slide-up">
      <div v-if="isOpen" class="floating-chat__window">
        <div class="floating-chat__header">
          <div class="floating-chat__header-left">
            <div class="floating-chat__avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/>
                <path d="M21 21c0-2-1.5-5-4-5H7c-2.5 0-4 3-4 5"/>
              </svg>
            </div>
            <div>
              <span class="floating-chat__name">Jann's AI Assistant</span>
              <span class="floating-chat__status">Online</span>
            </div>
          </div>
          <button class="floating-chat__close" @click="toggleChat" aria-label="Close chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div class="floating-chat__messages" ref="chatRef">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            :class="['floating-chat__message', `floating-chat__message--${msg.role}`]"
          >
            <div
              v-if="msg.role === 'assistant'"
              class="floating-chat__avatar floating-chat__avatar--small"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/>
                <path d="M21 21c0-2-1.5-5-4-5H7c-2.5 0-4 3-4 5"/>
              </svg>
            </div>
            <div class="floating-chat__bubble">{{ msg.content }}</div>
          </div>
          <div v-if="isLoading" class="floating-chat__message floating-chat__message--assistant">
            <div class="floating-chat__avatar floating-chat__avatar--small">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/>
                <path d="M21 21c0-2-1.5-5-4-5H7c-2.5 0-4 3-4 5"/>
              </svg>
            </div>
            <div class="floating-chat__bubble floating-chat__typing">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            </div>
          </div>
        </div>

        <div class="floating-chat__input-area">
          <textarea
            v-model="input"
            placeholder="Ask about Jann's work..."
            class="floating-chat__input"
            rows="1"
            @keydown="handleKeydown"
            :disabled="isLoading"
          ></textarea>
          <button
            class="floating-chat__send"
            @click="sendMessage"
            :disabled="isLoading || !input.trim()"
            aria-label="Send"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>

    <button
      v-if="!isOpen"
      class="floating-chat__bubble"
      @click="toggleChat"
      aria-label="Open chat"
    >
      <span v-if="unreadCount > 0" class="floating-chat__badge">{{ unreadCount }}</span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as *;

.floating-chat {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999;

  &__bubble {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, $color-primary, $color-gradient-end);
    border: none;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(108, 99, 255, 0.4);
    transition: all $transition-fast;
    position: relative;

    &:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(108, 99, 255, 0.55);
    }

    &:active {
      transform: scale(0.96);
    }
  }

  &__badge {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #ef4444;
    color: #fff;
    font-size: 0.7rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid $color-bg-alt;
  }

  &__window {
    width: 370px;
    max-height: 520px;
    background: $color-bg-alt;
    border: 1px solid $color-border;
    border-radius: $radius-lg;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: linear-gradient(135deg, $color-primary, $color-gradient-end);
  }

  &__header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;

    &--small {
      width: 28px;
      height: 28px;
      flex-shrink: 0;
      background: $color-bg-card;
      color: $color-primary;
      border: 1px solid $color-border;
    }
  }

  &__name {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    color: #fff;
  }

  &__status {
    display: block;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.7);
  }

  &__close {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    border: none;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all $transition-fast;

    &:hover {
      background: rgba(255, 255, 255, 0.25);
    }
  }

  &__messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 380px;

    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb {
      background: rgba(108, 99, 255, 0.3);
      border-radius: 10px;
    }
  }

  &__message {
    display: flex;
    gap: 8px;
    max-width: 90%;

    &--user {
      align-self: flex-end;
      .floating-chat__bubble {
        background: linear-gradient(135deg, $color-primary, $color-gradient-end);
        color: #fff;
        border-radius: 16px 16px 4px 16px;
      }
    }

    &--assistant {
      align-self: flex-start;
      .floating-chat__bubble {
        background: $color-bg-card;
        color: $color-text;
        border-radius: 16px 16px 16px 4px;
        border: 1px solid $color-border;
      }
    }
  }

  &__bubble {
    padding: 10px 14px;
    font-size: 0.85rem;
    line-height: 1.55;
    word-wrap: break-word;
    white-space: pre-wrap;
  }

  &__typing {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 14px 18px;

    .dot {
      width: 5px;
      height: 5px;
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
    padding: 10px 12px;
    border-top: 1px solid $color-border;
    background: $color-bg;
  }

  &__input {
    flex: 1;
    padding: 8px 12px;
    border-radius: $radius-sm;
    border: 1px solid $color-border;
    background: $color-bg-alt;
    color: $color-text;
    font-size: 0.85rem;
    font-family: $font-sans;
    resize: none;
    outline: none;

    &:focus { border-color: $color-primary; }
    &::placeholder { color: $color-text-muted; }
    &:disabled { opacity: 0.5; }
  }

  &__send {
    width: 36px;
    height: 36px;
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

    &:hover:not(:disabled) { transform: scale(1.05); }
    &:disabled { opacity: 0.4; cursor: not-allowed; }
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
</style>
