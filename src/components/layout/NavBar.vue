<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { personalInfo } from '../../data/personal.js'
import { social } from '../../data/social.js'

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'chat', label: 'Chat' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
]

const themes = [
  'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate',
  'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 'garden',
  'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe', 'black',
  'luxury', 'dracula', 'cmyk', 'autumn', 'business', 'acid', 'lemonade',
  'night', 'coffee', 'winter', 'dim', 'nord', 'sunset',
]

const activeSection = ref('hero')
const isScrolled = ref(false)
const isMenuOpen = ref(false)
const isThemeOpen = ref(false)
const currentTheme = ref(localStorage.getItem('daisyui-theme') || 'dark')

function setTheme(theme) {
  currentTheme.value = theme
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('daisyui-theme', theme)
  isThemeOpen.value = false
}

function toggleTheme() {
  isThemeOpen.value = !isThemeOpen.value
}

function closeThemeDropdown(e) {
  if (!e.target.closest('.theme-dropdown')) {
    isThemeOpen.value = false
  }
}

onMounted(() => {
  document.documentElement.setAttribute('data-theme', currentTheme.value)
  window.addEventListener('scroll', onScroll)
  document.addEventListener('click', closeThemeDropdown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', closeThemeDropdown)
})

function onScroll() {
  isScrolled.value = window.scrollY > 50
  const scrollPos = window.scrollY + 100
  for (const { id } of sections) {
    const el = document.getElementById(id)
    if (el && el.offsetTop <= scrollPos && el.offsetTop + el.offsetHeight > scrollPos) {
      activeSection.value = id
      break
    }
  }
}

function scrollTo(id) {
  isMenuOpen.value = false
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="navbar__inner">
      <a href="#hero" class="navbar__logo" @click.prevent="scrollTo('hero')">
        <span class="logo__bracket">&lt;</span>
        <span class="logo__name">JNV</span>
        <span class="logo__bracket">/&gt;</span>
      </a>

      <ul class="navbar__links" :class="{ open: isMenuOpen }">
        <li v-for="section in sections" :key="section.id">
          <a
            :href="'#' + section.id"
            class="navbar__link"
            :class="{ active: activeSection === section.id }"
            @click.prevent="scrollTo(section.id)"
          >
            {{ section.label }}
          </a>
        </li>
      </ul>

      <div class="theme-dropdown">
        <button class="theme-btn" @click="toggleTheme" title="Change theme">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        </button>
        <div v-if="isThemeOpen" class="theme-menu">
          <button
            v-for="theme in themes"
            :key="theme"
            class="theme-option"
            :class="{ active: currentTheme === theme }"
            @click="setTheme(theme)"
          >
            <span class="theme-swatch" :data-theme="theme"></span>
            <span class="theme-label">{{ theme }}</span>
          </button>
        </div>
      </div>

      <a
        :href="'mailto:' + social.email"
        class="navbar__cta"
      >
        Let's Talk
      </a>

      <button class="navbar__toggle" :class="{ open: isMenuOpen }" @click="isMenuOpen = !isMenuOpen">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as *;
@use '../../assets/styles/mixins' as *;

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: $nav-height;
  transition: all $transition-base;

  &.scrolled {
    @include glass;
    box-shadow: $shadow-md;
  }

  &__inner {
    @include container;
    @include flex-center;
    justify-content: space-between;
    height: 100%;
  }

  &__logo {
    @include flex-center;
    gap: 2px;
    font-family: $font-mono;
    font-size: 1.3rem;
    font-weight: 700;
    color: $color-text-heading;
    text-decoration: none;

    .logo__bracket { @include gradient-text; }

    .logo__name {
      background: $color-text-heading;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  &__links {
    @include flex-center;
    gap: 8px;

    @include respond(md) {
      position: fixed;
      top: $nav-height;
      left: 0;
      right: 0;
      flex-direction: column;
      background: $color-bg-alt;
      padding: 20px;
      gap: 4px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all $transition-base;
      box-shadow: $shadow-lg;
      border-bottom: 1px solid $color-border;

      &.open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
    }
  }

  &__link {
    color: $color-text-muted;
    padding: 8px 16px;
    border-radius: $radius-full;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all $transition-fast;
    text-decoration: none;

    &:hover,
    &.active {
      color: $color-text-heading;
      background: rgba(108, 99, 255, 0.1);
    }

    &.active {
      color: $color-primary;
    }

    @include respond(md) {
      width: 100%;
      text-align: center;
      padding: 12px;
    }
  }

  &__cta {
    padding: 10px 24px;
    background: linear-gradient(135deg, $color-gradient-start, $color-gradient-end);
    color: #fff;
    border-radius: $radius-full;
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: none;
    transition: all $transition-base;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-glow;
    }

    @include respond(md) {
      display: none;
    }
  }

  &__toggle {
    display: none;
    flex-direction: column;
    gap: 5px;
    padding: 4px;
    background: none;
    cursor: pointer;

    span {
      display: block;
      width: 24px;
      height: 2px;
      background: $color-text-heading;
      border-radius: 2px;
      transition: all $transition-base;
    }

    &.open {
      span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
      span:nth-child(2) { opacity: 0; }
      span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
    }

    @include respond(md) {
      display: flex;
    }
  }
}

.theme-dropdown {
  position: relative;
}

.theme-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: $radius-full;
  background: rgba(108, 99, 255, 0.1);
  border: none;
  color: $color-text-heading;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: rgba(108, 99, 255, 0.2);
    color: $color-primary;
  }
}

.theme-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 180px;
  max-height: 320px;
  overflow-y: auto;
  background: $color-bg-alt;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: $color-primary;
    border-radius: 10px;
  }
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: $color-text;
  font-size: 0.82rem;
  cursor: pointer;
  text-transform: capitalize;
  text-align: left;
  transition: all $transition-fast;

  &:hover {
    background: rgba(108, 99, 255, 0.1);
  }

  &.active {
    background: rgba(108, 99, 255, 0.15);
    color: $color-primary;
  }
}

.theme-label {
  flex: 1;
}

.theme-swatch {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2px solid $color-border;

  &[data-theme="light"] { background: linear-gradient(135deg, #fff 30%, #3b82f6 30%, #3b82f6 70%, #fff 70%); }
  &[data-theme="dark"] { background: linear-gradient(135deg, #1d232a 30%, #641ae6 30%, #641ae6 70%, #1d232a 70%); }
  &[data-theme="cupcake"] { background: linear-gradient(135deg, #faf7f5 30%, #65c3c8 30%, #65c3c8 70%, #faf7f5 70%); }
  &[data-theme="bumblebee"] { background: linear-gradient(135deg, #fff 30%, #e0a82e 30%, #e0a82e 70%, #fff 70%); }
  &[data-theme="emerald"] { background: linear-gradient(135deg, #fff 30%, #66cc8a 30%, #66cc8a 70%, #333c4d 70%); }
  &[data-theme="corporate"] { background: linear-gradient(135deg, #fff 30%, #4b6bfb 30%, #4b6bfb 70%, #fff 70%); }
  &[data-theme="synthwave"] { background: linear-gradient(135deg, #2d1b69 30%, #e779c1 30%, #e779c1 70%, #2d1b69 70%); }
  &[data-theme="retro"] { background: linear-gradient(135deg, #eaebe4 30%, #ef9995 30%, #ef9995 70%, #eaebe4 70%); }
  &[data-theme="cyberpunk"] { background: linear-gradient(135deg, #ffee00 30%, #ff00ff 30%, #ff00ff 70%, #ffee00 70%); }
  &[data-theme="valentine"] { background: linear-gradient(135deg, #f0d6e8 30%, #e96d7b 30%, #e96d7b 70%, #f0d6e8 70%); }
  &[data-theme="halloween"] { background: linear-gradient(135deg, #212121 30%, #f28c18 30%, #f28c18 70%, #212121 70%); }
  &[data-theme="garden"] { background: linear-gradient(135deg, #e9e7e7 30%, #5c7f67 30%, #5c7f67 70%, #e9e7e7 70%); }
  &[data-theme="forest"] { background: linear-gradient(135deg, #171212 30%, #1eb854 30%, #1eb854 70%, #171212 70%); }
  &[data-theme="aqua"] { background: linear-gradient(135deg, #ecf4f6 30%, #09ecf3 30%, #09ecf3 70%, #ecf4f6 70%); }
  &[data-theme="lofi"] { background: linear-gradient(135deg, #fff 30%, #808080 30%, #808080 70%, #fff 70%); }
  &[data-theme="pastel"] { background: linear-gradient(135deg, #fff 30%, #d9c9f5 30%, #d9c9f5 70%, #fff 70%); }
  &[data-theme="fantasy"] { background: linear-gradient(135deg, #fff 30%, #6e0b75 30%, #6e0b75 70%, #fff 70%); }
  &[data-theme="wireframe"] { background: linear-gradient(135deg, #fff 30%, #b8b8b8 30%, #b8b8b8 70%, #fff 70%); }
  &[data-theme="black"] { background: linear-gradient(135deg, #000 30%, #343232 30%, #343232 70%, #000 70%); }
  &[data-theme="luxury"] { background: linear-gradient(135deg, #09090b 30%, #dca54c 30%, #dca54c 70%, #09090b 70%); }
  &[data-theme="dracula"] { background: linear-gradient(135deg, #282a36 30%, #bd93f9 30%, #bd93f9 70%, #282a36 70%); }
  &[data-theme="cmyk"] { background: linear-gradient(135deg, #fff 30%, #45aeee 30%, #45aeee 70%, #fff 70%); }
  &[data-theme="autumn"] { background: linear-gradient(135deg, #f1f0ea 30%, #8c0327 30%, #8c0327 70%, #f1f0ea 70%); }
  &[data-theme="business"] { background: linear-gradient(135deg, #fff 30%, #1c4e80 30%, #1c4e80 70%, #fff 70%); }
  &[data-theme="acid"] { background: linear-gradient(135deg, #fafafa 30%, #ff00f2 30%, #ff00f2 70%, #fafafa 70%); }
  &[data-theme="lemonade"] { background: linear-gradient(135deg, #fff 30%, #519e21 30%, #519e21 70%, #fff 70%); }
  &[data-theme="night"] { background: linear-gradient(135deg, #0f172a 30%, #38bdf8 30%, #38bdf8 70%, #0f172a 70%); }
  &[data-theme="coffee"] { background: linear-gradient(135deg, #20161f 30%, #db924b 30%, #db924b 70%, #20161f 70%); }
  &[data-theme="winter"] { background: linear-gradient(135deg, #fff 30%, #1477c8 30%, #1477c8 70%, #fff 70%); }
  &[data-theme="dim"] { background: linear-gradient(135deg, #1e293b 30%, #9f7aea 30%, #9f7aea 70%, #1e293b 70%); }
  &[data-theme="nord"] { background: linear-gradient(135deg, #eceff4 30%, #5e81ac 30%, #5e81ac 70%, #eceff4 70%); }
  &[data-theme="sunset"] { background: linear-gradient(135deg, #121212 30%, #ff7e67 30%, #ff7e67 70%, #121212 70%); }
}
</style>
