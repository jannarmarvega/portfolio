<script setup>
import ChatbotDemo from './ChatbotDemo.vue'
import CodePlayground from './CodePlayground.vue'

defineProps({
  title: { type: String, required: true },
  demoType: { type: String, required: true },
  demoConfig: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['close'])

function handleClose() {
  emit('close')
}
</script>

<template>
  <div class="demo-modal-overlay" @click.self="handleClose">
    <div class="demo-modal">
        <div class="demo-modal__header">
          <h2 class="demo-modal__title">{{ title }}</h2>
          <button class="demo-modal__close" @click="handleClose" aria-label="Close demo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div class="demo-modal__body">
          <ChatbotDemo
            v-if="demoType === 'chatbot'"
            :system-prompt="demoConfig.systemPrompt || 'You are a technical demo assistant.'"
            :greeting="demoConfig.greeting || 'Hello! Ask me anything about this project.'"
            :placeholder="demoConfig.placeholder || 'Type your question...'"
          />

          <CodePlayground
            v-else-if="demoType === 'playground'"
            :default-html="demoConfig.defaultHtml || '<h1>Hello World</h1>'"
            :default-css="demoConfig.defaultCss || 'body { font-family: system-ui; padding: 20px; }'"
            :default-js="demoConfig.defaultJs || 'console.log(\'Hello!\')'"
          />
        </div>
      </div>
    </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as *;

.demo-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.demo-modal {
  width: 100%;
  max-width: 1000px;
  max-height: 85vh;
  background: $color-bg-alt;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: scaleIn 0.25s ease;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid $color-border;
  }

  &__title {
    font-size: 1.1rem;
    font-weight: 600;
    color: $color-text-heading;
  }

  &__close {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: $radius-sm;
    background: rgba(255, 255, 255, 0.05);
    color: $color-text-muted;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all $transition-fast;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: $color-text;
    }
  }

  &__body {
    flex: 1;
    overflow: auto;
    padding: 20px;
  }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
