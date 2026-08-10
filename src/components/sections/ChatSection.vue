<script setup>
import { ref, nextTick } from 'vue'
import { GROQ_CONFIG } from '../../config/groq.js'
import buildSystemPrompt from '../../config/chatbot.js'

const input = ref('')
const isLoading = ref(false)
const messages = ref([])
const msgListRef = ref(null)
const inputRef = ref(null)

const systemPrompt = buildSystemPrompt()

const suggestions = [
  "What's your tech stack?",
  "Tell me about your experience",
  "What projects have you built?",
  "How can I reach you?"
]

function scrollToBottom() {
  nextTick(() => {
    if (msgListRef.value) {
      msgListRef.value.scrollTop = msgListRef.value.scrollHeight
    }
  })
}

function fillSuggestion(text) {
  input.value = text
  nextTick(() => inputRef.value?.focus())
}

async function sendMessage() {
  const text = input.value.trim()
  if (!text || isLoading.value) return

  messages.value.push({ role: 'user', content: text })
  input.value = ''
  isLoading.value = true
  scrollToBottom()

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
    messages.value.push({ role: 'assistant', content: data.choices[0].message.content })
  } catch (e) {
    messages.value.push({
      role: 'assistant',
      content: `Sorry, something went wrong. Please try again.\n\n(${e.message})`
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
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
  <section id="chat" class="chat-section">
    <div class="chat-section__container">
      <h2 class="chat-section__title">Ask Me Anything</h2>
      <p class="chat-section__subtitle">
        Curious about my skills, experience, or projects? Ask below and my AI assistant will answer.
      </p>

      <div class="chat-section__box">
        <div class="chat-section__input-area">
          <textarea
            ref="inputRef"
            v-model="input"
            placeholder="e.g. What frameworks does Jann use for backend?"
            class="chat-section__textarea"
            rows="2"
            @keydown="handleKeydown"
            :disabled="isLoading"
          ></textarea>
          <div class="chat-section__actions">
            <div class="chat-section__suggestions">
              <button
                v-for="s in suggestions"
                :key="s"
                class="chat-section__suggestion"
                @click="fillSuggestion(s)"
                :disabled="isLoading"
              >{{ s }}</button>
            </div>
            <button
              class="chat-section__send"
              @click="sendMessage"
              :disabled="isLoading || !input.trim()"
              aria-label="Send"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              <span v-if="!isLoading">Ask</span>
              <span v-else class="chat-section__spinner"></span>
            </button>
          </div>
        </div>

        <Transition name="reveal">
          <div v-if="messages.length > 0" class="chat-section__thread" ref="msgListRef">
            <div
              v-for="(msg, i) in messages"
              :key="i"
              :class="['chat-section__msg', `chat-section__msg--${msg.role}`]"
            >
              <span class="chat-section__msg-label">{{ msg.role === 'assistant' ? 'Jann\'s AI' : 'You' }}</span>
              <div class="chat-section__msg-bubble">{{ msg.content }}</div>
            </div>

            <div v-if="isLoading" class="chat-section__msg chat-section__msg--assistant">
              <span class="chat-section__msg-label">Jann's AI</span>
              <div class="chat-section__msg-bubble chat-section__typing">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as *;
@use '../../assets/styles/mixins' as *;

.chat-section {
  @include section;
}

.chat-section__container {
  @include container;
}

.chat-section__title {
  @include section-title;
}

.chat-section__subtitle {
  @include section-subtitle;
}

.chat-section__box {
  max-width: 760px;
  margin: 0 auto;
}

.chat-section__input-area {
  background: $color-bg-card;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: 20px;
}

.chat-section__textarea {
  width: 100%;
  padding: 14px 18px;
  border-radius: $radius-md;
  border: 1px solid $color-border;
  background: $color-bg-alt;
  color: $color-text;
  font-size: 1rem;
  font-family: $font-sans;
  resize: none;
  outline: none;
  line-height: 1.6;
  min-height: 70px;
  transition: border-color $transition-fast;

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

.chat-section__actions {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-top: 12px;

  @include respond(sm) {
    flex-direction: column;
    align-items: stretch;
  }
}

.chat-section__suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chat-section__suggestion {
  font-size: 0.78rem;
  padding: 5px 12px;
  border-radius: $radius-full;
  border: 1px solid $color-border;
  background: transparent;
  color: $color-text-muted;
  cursor: pointer;
  transition: all $transition-fast;
  font-family: $font-sans;

  &:hover:not(:disabled) {
    border-color: $color-primary;
    color: $color-primary;
    background: rgba(108, 99, 255, 0.06);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.chat-section__send {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 24px;
  border: none;
  border-radius: $radius-md;
  background: linear-gradient(135deg, $color-gradient-start, $color-gradient-end);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: $font-sans;
  cursor: pointer;
  transition: all $transition-fast;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(108, 99, 255, 0.35);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.chat-section__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

// ── Thread ─────────────────────────────────────────────

.chat-section__thread {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 480px;
  overflow-y: auto;
  padding: 4px 0;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: rgba(108, 99, 255, 0.2);
    border-radius: 10px;
  }
}

.chat-section__msg {
  display: flex;
  flex-direction: column;
  max-width: 80%;

  &--user {
    align-self: flex-end;
    .chat-section__msg-label { text-align: right; }
    .chat-section__msg-bubble {
      background: linear-gradient(135deg, $color-gradient-start, $color-gradient-end);
      color: #fff;
      border-radius: 18px 18px 4px 18px;
    }
  }

  &--assistant {
    align-self: flex-start;
    .chat-section__msg-bubble {
      background: $color-bg-card;
      color: $color-text;
      border-radius: 18px 18px 18px 4px;
      border: 1px solid $color-border;
    }
  }
}

.chat-section__msg-label {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: $color-text-muted;
  margin-bottom: 4px;
  padding: 0 8px;
}

.chat-section__msg-bubble {
  padding: 12px 18px;
  font-size: 0.9rem;
  line-height: 1.65;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.chat-section__typing {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 14px 22px;

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

// ── Transitions ────────────────────────────────────────

.reveal-enter-active {
  transition: all 0.35s ease;
}

.reveal-enter-from {
  opacity: 0;
  transform: translateY(8px);
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

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
