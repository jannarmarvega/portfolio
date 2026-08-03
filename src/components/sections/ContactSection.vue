<script setup>
import { social } from '../../data/social.js'
import SocialLinks from '../ui/SocialLinks.vue'
import ScrollReveal from '../ui/ScrollReveal.vue'

const contactLinks = [
  { label: 'Email', value: social.email, href: 'mailto:' + social.email, icon: 'mail' },
  { label: 'GitHub', value: 'jannvega102', href: social.github, icon: 'github' },
  { label: 'LinkedIn', value: 'Jann Niño Armar Vega', href: social.linkedin, icon: 'linkedin' },
  { label: 'Location', value: 'Malaybalay City, Philippines', href: null, icon: 'map' },
]
</script>

<template>
  <section id="contact" class="contact">
    <ScrollReveal>
      <div class="contact__container">
        <h2 class="contact__title scroll-reveal">Get In Touch</h2>
        <p class="contact__subtitle scroll-reveal delay-1">
          I'm always open to new opportunities, collaborations, and interesting projects. Feel free to reach out!
        </p>

        <div class="contact__grid scroll-reveal">
          <a
            v-for="link in contactLinks"
            :key="link.label"
            :href="link.href || '#'"
            :target="link.href && !link.href.startsWith('mailto:') ? '_blank' : undefined"
            class="contact__card"
          >
            <div class="contact__card-icon">
              <svg v-if="link.icon === 'mail'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <svg v-else-if="link.icon === 'github'" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              <svg v-else-if="link.icon === 'linkedin'" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div class="contact__card-text">
              <span class="contact__card-label">{{ link.label }}</span>
              <span class="contact__card-value">{{ link.value }}</span>
            </div>
          </a>
        </div>

        <div class="contact__divider scroll-reveal">
          <span>or find me on</span>
        </div>

        <div class="contact__socials scroll-reveal">
          <SocialLinks />
        </div>
      </div>
    </ScrollReveal>
  </section>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as *;
@use '../../assets/styles/mixins' as *;

.contact {
  @include section;

  &__container {
    @include container;
  }

  &__title {
    @include section-title;
  }

  &__subtitle {
    @include section-subtitle;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    max-width: 900px;
    margin: 0 auto;

    @include respond(md) {
      grid-template-columns: repeat(2, 1fr);
    }
    @include respond(sm) {
      grid-template-columns: 1fr;
    }
  }

  &__card {
    @include card;
    @include flex-center;
    flex-direction: column;
    text-decoration: none;
    text-align: center;
    padding: 28px 16px;
    gap: 12px;

    &:hover .contact__card-icon {
      background: $color-primary;
      color: #fff;
      box-shadow: $shadow-glow;
    }
  }

  &__card-icon {
    width: 52px;
    height: 52px;
    @include flex-center;
    border-radius: $radius-md;
    background: rgba(108, 99, 255, 0.1);
    color: $color-primary;
    transition: all $transition-base;
  }

  &__card-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__card-label {
    font-size: 0.85rem;
    color: $color-text-muted;
    font-weight: 500;
  }

  &__card-value {
    font-size: 0.9rem;
    color: $color-text-heading;
    font-weight: 600;
    word-break: break-all;
  }

  &__divider {
    text-align: center;
    margin: 48px 0 32px;
    position: relative;

    span {
      background: $color-bg;
      padding: 0 20px;
      color: $color-text-muted;
      font-size: 0.9rem;
      position: relative;
      z-index: 1;
    }

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: $color-border;
    }
  }

  &__socials {
    @include flex-center;
  }
}
</style>
