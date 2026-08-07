<script setup>
import { ref, shallowRef, onMounted, onUnmounted, watch } from 'vue'
import { basicSetup } from 'codemirror'
import { EditorView, keymap } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { php } from '@codemirror/lang-php'
import { oneDark } from '@codemirror/theme-one-dark'
import { indentWithTab } from '@codemirror/commands'

const props = defineProps({
  defaultHtml: { type: String, default: '<h1>Hello World</h1>\n<p>Edit me and press Run!</p>' },
  defaultCss: { type: String, default: 'body {\n  font-family: system-ui;\n  background: #f0f0f0;\n  padding: 20px;\n}\n\nh1 {\n  color: #6c63ff;\n}' },
  defaultJs: { type: String, default: 'document.querySelector(\'h1\').addEventListener(\'click\', () => {\n  alert(\'Hello from JavaScript!\');\n});' },
})

const tabs = ['HTML', 'CSS', 'JS']
const activeTab = ref('HTML')
const output = ref('')
const editorContainer = ref(null)
const editorView = shallowRef(null)

function getLangForTab(tab) {
  switch (tab) {
    case 'HTML': return html()
    case 'CSS': return css()
    case 'JS': return javascript()
    default: return html()
  }
}

function getDefaultContent(tab) {
  switch (tab) {
    case 'HTML': return props.defaultHtml
    case 'CSS': return props.defaultCss
    case 'JS': return props.defaultJs
    default: return ''
  }
}

const editorContents = ref({
  HTML: props.defaultHtml,
  CSS: props.defaultCss,
  JS: props.defaultJs,
})

function createEditor() {
  if (!editorContainer.value) return
  if (editorView.value) editorView.value.destroy()

  const state = EditorState.create({
    doc: editorContents.value[activeTab.value],
    extensions: [
      basicSetup,
      getLangForTab(activeTab.value),
      oneDark,
      keymap.of([indentWithTab]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          editorContents.value[activeTab.value] = update.state.doc.toString()
        }
      }),
    ],
  })

  editorView.value = new EditorView({
    state,
    parent: editorContainer.value,
  })
}

function switchTab(tab) {
  if (activeTab.value === tab) return
  activeTab.value = tab
  createEditor()
}

function runCode() {
  const htmlCode = editorContents.value.HTML
  const cssCode = editorContents.value.CSS
  const jsCode = editorContents.value.JS

  const src = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${cssCode}</style>
    </head>
    <body>
      ${htmlCode}
      <script>${jsCode}<\/script>
    </body>
    </html>
  `
  output.value = src
}

onMounted(() => {
  createEditor()
  runCode()
})

onUnmounted(() => {
  if (editorView.value) editorView.value.destroy()
})
</script>

<template>
  <div class="playground">
    <div class="playground__editor-panel">
      <div class="playground__tabs">
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="['playground__tab', { 'playground__tab--active': activeTab === tab }]"
          @click="switchTab(tab)"
        >
          {{ tab }}
        </button>
        <button class="playground__run" @click="runCode">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          Run
        </button>
      </div>
      <div ref="editorContainer" class="playground__editor"></div>
    </div>

    <div class="playground__output-panel">
      <div class="playground__output-header">
        <span class="playground__output-dot playground__output-dot--red"></span>
        <span class="playground__output-dot playground__output-dot--yellow"></span>
        <span class="playground__output-dot playground__output-dot--green"></span>
        Preview
      </div>
      <iframe
        class="playground__iframe"
        :srcdoc="output"
        sandbox="allow-scripts allow-modals"
        title="Code output"
      ></iframe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as *;

.playground {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 500px;
  border-radius: $radius-md;
  overflow: hidden;
  border: 1px solid $color-border;

  &__editor-panel {
    display: flex;
    flex-direction: column;
    background: #282c34;
    border-right: 1px solid $color-border;
    overflow: hidden;
  }

  &__tabs {
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    padding: 0 4px;
    background: #21252b;
  }

  &__tab {
    padding: 8px 16px;
    background: none;
    border: none;
    color: $color-text-muted;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all $transition-fast;
    font-family: $font-sans;

    &:hover {
      color: $color-text;
    }

    &--active {
      color: $color-primary;
      border-bottom-color: $color-primary;
    }
  }

  &__run {
    margin-left: auto;
    padding: 6px 16px;
    border: none;
    border-radius: 4px;
    background: linear-gradient(135deg, $color-primary, $color-gradient-end);
    color: #fff;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all $transition-fast;

    &:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
  }

  &__editor {
    flex: 1;
    overflow: hidden;

    :deep(.cm-editor) {
      height: 100%;
      font-size: 0.85rem;
    }

    :deep(.cm-scroller) {
      overflow: auto;
    }
  }

  &__output-panel {
    display: flex;
    flex-direction: column;
    background: #fff;
    overflow: hidden;
  }

  &__output-header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    font-size: 0.75rem;
    font-weight: 500;
    color: #666;
    border-bottom: 1px solid #eee;
    background: #f8f8f8;
  }

  &__output-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;

    &--red { background: #ff5f57; }
    &--yellow { background: #ffbd2e; }
    &--green { background: #28ca41; }
  }

  &__iframe {
    flex: 1;
    border: none;
    width: 100%;
    height: 100%;
  }
}
</style>
