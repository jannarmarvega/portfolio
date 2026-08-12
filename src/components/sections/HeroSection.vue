<script setup>
import { personalInfo } from '../../data/personal.js'
import SocialLinks from '../ui/SocialLinks.vue'

const typewriterLines = [
  'Solution Architect',
  'VILT Stack Expert',
  'MERN Stack Developer',
  'AI & Chatbot Engineer',
]
</script>

<template>
  <section id="hero" class="hero">
    <div class="hero__bg-orb hero__bg-orb--1"></div>
    <div class="hero__bg-orb hero__bg-orb--2"></div>
    <div class="hero__bg-orb hero__bg-orb--3"></div>

    <div class="hero__content">
      <div class="hero__badge scroll-reveal">
        <span class="hero__badge-dot"></span>
        Available for work
      </div>

      <h1 class="hero__title scroll-reveal delay-1">
        Hi, I'm <span class="hero__name">{{ personalInfo.name }}</span>
      </h1>

      <div class="hero__roles scroll-reveal delay-2">
        <span v-for="(role, i) in typewriterLines" :key="role" class="hero__role">
          {{ role }}
          <span v-if="i < typewriterLines.length - 1" class="hero__separator">·</span>
        </span>
      </div>

      <p class="hero__summary scroll-reveal delay-3">
        {{ personalInfo.summary[0] }}
      </p>

      <div class="hero__actions scroll-reveal delay-4">
        <a href="#projects" class="hero__cta-primary">View My Work</a>
        <a href="#contact" class="hero__cta-secondary">Get In Touch</a>
      </div>

      <div class="hero__socials scroll-reveal delay-5">
        <SocialLinks />
      </div>

      <div class="hero__stats scroll-reveal">
        <div v-for="stat in personalInfo.stats" :key="stat.label" class="hero__stat">
          <span class="hero__stat-value">{{ stat.value }}</span>
          <span class="hero__stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <div class="hero__scroll-indicator">
      <span>Scroll</span>
      <div class="hero__scroll-line"></div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as *;
@use '../../assets/styles/mixins' as *;

.hero {
  min-height: 100vh;
  @include flex-center;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  padding: calc($nav-height + 40px) 24px 60px;

  &__bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.15;
    pointer-events: none;

    &--1 {
      width: 500px;
      height: 500px;
      background: $color-primary;
      top: -100px;
      right: -100px;
      animation: float 6s ease-in-out infinite;
    }
    &--2 {
      width: 400px;
      height: 400px;
      background: $color-gradient-end;
      bottom: -80px;
      left: -80px;
      animation: float 8s ease-in-out infinite reverse;
    }
    &--3 {
      width: 300px;
      height: 300px;
      background: $color-accent;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0.08;
      animation: pulse 4s ease-in-out infinite;
    }
  }

  &__content {
    text-align: center;
    max-width: 800px;
    position: relative;
    z-index: 1;
  }

  &__badge {
    @include flex-center;
    gap: 8px;
    display: inline-flex;
    padding: 8px 20px;
    border-radius: $radius-full;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: $color-success;
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 32px;

    &-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $color-success;
      animation: pulse 2s ease-in-out infinite;
    }
  }

  &__title {
    font-size: 3.5rem;
    font-weight: 800;
    color: $color-text-heading;
    margin-bottom: 16px;
    line-height: 1.15;

    @include respond(md) {
      font-size: 2.5rem;
    }
    @include respond(sm) {
      font-size: 2rem;
    }
  }

  &__name {
    @include gradient-text;
  }

  &__roles {
    @include flex-center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 24px;
  }

  &__role {
    font-size: 1.1rem;
    font-weight: 500;
    color: $color-text-muted;
    font-family: $font-mono;

    @include respond(md) { font-size: 0.95rem; }
  }

  &__separator {
    margin-left: 8px;
    color: $color-primary;
  }

  &__summary {
    font-size: 1.1rem;
    color: $color-text-muted;
    line-height: 1.8;
    margin-bottom: 32px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;

    @include respond(md) { font-size: 1rem; }
  }

  &__actions {
    @include flex-center;
    gap: 16px;
    margin-bottom: 32px;

    @include respond(sm) {
      flex-direction: column;
      width: 100%;
    }
  }

  &__cta-primary {
    padding: 14px 32px;
    background: linear-gradient(135deg, $color-gradient-start, $color-gradient-end);
    color: #fff;
    border-radius: $radius-full;
    font-weight: 600;
    font-size: 1rem;
    text-decoration: none;
    transition: all $transition-base;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-glow;
    }

    @include respond(sm) { width: 100%; text-align: center; }
  }

  &__cta-secondary {
    padding: 14px 32px;
    border: 2px solid $color-border;
    color: $color-text-heading;
    border-radius: $radius-full;
    font-weight: 600;
    font-size: 1rem;
    text-decoration: none;
    transition: all $transition-base;

    &:hover {
      border-color: $color-primary;
      color: $color-primary;
    }

    @include respond(sm) { width: 100%; text-align: center; }
  }

  &__socials {
    @include flex-center;
    margin-bottom: 48px;
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;

    @include respond(md) { grid-template-columns: repeat(2, 1fr); }
  }

  &__stat {
    padding: 20px;
    border-radius: $radius-lg;
    background: $color-bg-card;
    border: 1px solid $color-border;

    &-value {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      @include gradient-text;
      margin-bottom: 4px;

      @include respond(md) { font-size: 1.3rem; }
    }

    &-label {
      font-size: 0.8rem;
      color: $color-text-muted;
      font-weight: 500;
    }
  }

  &__scroll-indicator {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    @include flex-center;
    flex-direction: column;
    gap: 8px;
    color: $color-text-muted;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;

    @include respond(sm) { display: none; }
  }

  &__scroll-line {
    width: 1px;
    height: 40px;
    background: linear-gradient(180deg, $color-primary, transparent);
    animation: pulse 2s ease-in-out infinite;
  }
}
</style>
