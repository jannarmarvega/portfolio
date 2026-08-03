<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { personalInfo } from '../../data/personal.js'
import { social } from '../../data/social.js'

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
]

const activeSection = ref('hero')
const isScrolled = ref(false)
const isMenuOpen = ref(false)

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

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
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
</style>
