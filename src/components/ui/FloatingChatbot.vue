<script setup>
import { ref, nextTick, watch } from 'vue'
import { GROQ_CONFIG } from '../../config/groq.js'
import buildSystemPrompt from '../../config/chatbot.js'

const isOpen = ref(false)
const input = ref('')
const isLoading = ref(false)
const messages = ref([])
const chatRef = ref(null)
const inputRef = ref(null)
const unreadCount = ref(0)
const isFirstOpen = ref(true)
const showScrollBtn = ref(false)

const systemPrompt = buildSystemPrompt()

const welcomeHints = [
  "What makes Jann's tech stack special?",
  "Tell me about Jann's experience",
  "What projects has Jann built?",
  "How can I reach Jann?"
]

function checkScroll() {
  if (!chatRef.value) return
  const { scrollTop, scrollHeight, clientHeight } = chatRef.value
  showScrollBtn.value = scrollHeight - scrollTop - clientHeight > 50
}

function scrollToBottom() {
  nextTick(() => {
    if (chatRef.value) {
      chatRef.value.scrollTop = chatRef.value.scrollHeight
      showScrollBtn.value = false
    }
  })
}

function addMessage(role, content) {
  messages.value.push({ role, content })
  if (!isOpen.value && role === 'assistant') {
    unreadCount.value++
  }
  scrollToBottom()
}

function autoResize() {
  nextTick(() => {
    const el = inputRef.value
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  })
}

watch(input, autoResize)

async function sendMessage() {
  const text = input.value.trim()
  if (!text || isLoading.value) return

  addMessage('user', text)
  input.value = ''
  autoResize()
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
    addMessage('assistant', `Sorry, something went wrong. Please try again.\n\n(${e.message})`)
  } finally {
    isLoading.value = false
  }
}

function fillHint(hint) {
  input.value = hint
  autoResize()
  nextTick(() => inputRef.value?.focus())
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
    scrollToBottom()
    nextTick(() => inputRef.value?.focus())
  }
}
</script>

<template>
  <div class="floating-chat" :class="{ 'floating-chat--open': isOpen }">
    <Transition name="slide-up">
      <div v-if="isOpen" class="floating-chat__window">
        <div class="floating-chat__header">
          <div class="floating-chat__brand">
            <div class="floating-chat__avatar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/>
                <path d="M21 17v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-1c0-3 4-5 9-5s9 2 9 5z"/>
                <path d="M16 10a4 4 0 0 1 4 4"/>
                <path d="M8 10a4 4 0 0 0-4 4"/>
                <circle cx="12" cy="20" r="2"/>
                <path d="M2 12c0-3 1.5-5.5 4-7"/>
                <path d="M22 12c0-3-1.5-5.5-4-7"/>
              </svg>
            </div>
            <span class="floating-chat__title">AI Assistant</span>
          </div>
          <button class="floating-chat__close" @click="toggleChat" aria-label="Close chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div class="floating-chat__messages" ref="chatRef" @scroll="checkScroll">
          <TransitionGroup name="msg" tag="div" class="floating-chat__msg-list">
            <div
              v-for="(msg, i) in messages"
              :key="i"
              :class="['floating-chat__message', `floating-chat__message--${msg.role}`]"
            >
              <div class="floating-chat__bubble">{{ msg.content }}</div>
            </div>

            <div v-if="isLoading" key="typing" class="floating-chat__message floating-chat__message--assistant">
              <div class="floating-chat__bubble floating-chat__typing">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>

            <div v-if="messages.length === 0 && !isLoading" key="empty" class="floating-chat__empty">
              <div class="floating-chat__empty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <p class="floating-chat__empty-text">Ask me anything about Jann</p>
              <div class="floating-chat__hints">
                <button v-for="hint in welcomeHints" :key="hint" class="floating-chat__hint" @click="fillHint(hint)">
                  {{ hint }}
                </button>
              </div>
            </div>
          </TransitionGroup>

          <Transition name="fade">
            <button v-if="showScrollBtn" class="floating-chat__scroll-btn" @click="scrollToBottom" aria-label="Scroll to bottom">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          </Transition>
        </div>

        <div class="floating-chat__input-area">
          <textarea
            ref="inputRef"
            v-model="input"
            placeholder="Type your message..."
            class="floating-chat__input"
            rows="1"
            @keydown="handleKeydown"
            :disabled="isLoading"
          ></textarea>
          <button
            class="floating-chat__send"
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
    </Transition>

    <button
      v-if="!isOpen"
      class="floating-chat__toggle"
      @click="toggleChat"
      aria-label="Open chat"
    >
      <span v-if="unreadCount > 0" class="floating-chat__badge">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
      <div class="floating-chat__toggle-inner">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as *;
@use '../../assets/styles/mixins' as *;

.floating-chat {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999;

  @include respond(sm) {
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100dvh;
    pointer-events: none;
  }

  &--open {
    @include respond(sm) {
      pointer-events: auto;
    }
  }
}

// ── Toggle button ──────────────────────────────────────

.floating-chat__toggle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, $color-gradient-start, $color-gradient-end);
  border: none;
  padding: 0;
  cursor: pointer;
  position: relative;
  box-shadow: 0 4px 20px rgba(108, 99, 255, 0.35);
  transition: transform $transition-fast, box-shadow $transition-fast;

  @include respond(sm) {
    position: absolute;
    bottom: 24px;
    right: 24px;
    pointer-events: auto;
  }

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 28px rgba(108, 99, 255, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }
}

.floating-chat__toggle-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.floating-chat__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 22px;
  height: 22px;
  border-radius: 11px;
  background: #ef4444;
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  border: 2px solid $color-bg;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
  animation: pop-in 0.3s ease;
}

// ── Window ─────────────────────────────────────────────

.floating-chat__window {
  width: 420px;
  max-height: 600px;
  background: $color-bg-alt;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.05);

  @include respond(sm) {
    width: 100%;
    height: 100dvh;
    max-height: none;
    border-radius: 0;
    border: none;
  }
}

// ── Header ─────────────────────────────────────────────

.floating-chat__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: $color-bg;
  border-bottom: 1px solid $color-border;
  flex-shrink: 0;

  @include respond(sm) {
    padding: 12px 16px;
    padding-top: max(12px, env(safe-area-inset-top));
  }
}

.floating-chat__brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.floating-chat__avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, $color-gradient-start, $color-gradient-end);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.floating-chat__title {
  font-size: 0.95rem;
  font-weight: 600;
  color: $color-text-heading;
}

.floating-chat__close {
  width: 32px;
  height: 32px;
  border-radius: $radius-sm;
  background: transparent;
  border: none;
  color: $color-text-muted;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: $color-text;
  }
}

// ── Messages area ──────────────────────────────────────

.floating-chat__messages {
  flex: 1;
  overflow-y: auto;
  position: relative;
  min-height: 0;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: rgba(108, 99, 255, 0.2);
    border-radius: 10px;
  }

  @include respond(sm) {
    flex: 1;
  }
}

.floating-chat__msg-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 100%;
}

// ── Messages ───────────────────────────────────────────

.floating-chat__message {
  display: flex;
  max-width: 85%;

  &--user {
    align-self: flex-end;
    .floating-chat__bubble {
      background: linear-gradient(135deg, $color-gradient-start, $color-gradient-end);
      color: #fff;
      border-radius: 18px 18px 4px 18px;
    }
  }

  &--assistant {
    align-self: flex-start;
    .floating-chat__bubble {
      background: $color-bg-card;
      color: $color-text;
      border-radius: 18px 18px 18px 4px;
      border: 1px solid $color-border;
    }
  }
}

.floating-chat__bubble {
  padding: 12px 16px;
  font-size: 0.9rem;
  line-height: 1.65;
  word-wrap: break-word;
  white-space: pre-wrap;

  @include respond(sm) {
    font-size: 0.95rem;
  }
}

// ── Typing indicator ───────────────────────────────────

.floating-chat__typing {
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

// ── Empty state ────────────────────────────────────────

.floating-chat__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 40px 16px;
  flex: 1;
}

.floating-chat__empty-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(108, 99, 255, 0.1);
  color: $color-primary;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-chat__empty-text {
  font-size: 0.9rem;
  color: $color-text-muted;
  margin: 0;
}

.floating-chat__hints {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.floating-chat__hint {
  font-size: 0.78rem;
  padding: 6px 14px;
  border-radius: $radius-full;
  border: 1px solid $color-border;
  background: transparent;
  color: $color-text-muted;
  cursor: pointer;
  transition: all $transition-fast;
  font-family: $font-sans;

  &:hover {
    border-color: $color-primary;
    color: $color-primary;
    background: rgba(108, 99, 255, 0.06);
  }
}

// ── Scroll-to-bottom button ────────────────────────────

.floating-chat__scroll-btn {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 36px;
  height: 36px;
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

// ── Input area ─────────────────────────────────────────

.floating-chat__input-area {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid $color-border;
  background: $color-bg;
  flex-shrink: 0;

  @include respond(sm) {
    padding: 12px 16px;
    padding-bottom: max(12px, env(safe-area-inset-bottom));
  }
}

.floating-chat__input {
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
  max-height: 120px;
  line-height: 1.5;
  transition: border-color $transition-fast;

  @include respond(sm) {
    font-size: 0.95rem;
  }

  &:focus {
    border-color: $color-primary;
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.12);
  }

  &::placeholder {
    color: $color-text-muted;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.floating-chat__send {
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

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);

  @include respond(sm) {
    transform: translateY(40px);
  }
}

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

@keyframes pop-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  70% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
