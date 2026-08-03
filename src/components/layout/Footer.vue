<script setup>
import { social, education, certifications } from '../../data/social.js'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer__top">
      <div class="footer__brand">
        <h3 class="footer__logo">&lt;JNV /&gt;</h3>
        <p class="footer__desc">Full Stack Developer building robust, scalable solutions with the VILT and MERN stacks.</p>
        <div class="footer__socials">
          <a :href="social.github" target="_blank" class="footer__social-link" aria-label="GitHub">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
          <a :href="social.linkedin" target="_blank" class="footer__social-link" aria-label="LinkedIn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a :href="'mailto:' + social.email" class="footer__social-link" aria-label="Email">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </a>
        </div>
      </div>

      <div class="footer__links-col">
        <h4 class="footer__heading">Certifications</h4>
        <ul class="footer__list">
          <li v-for="cert in certifications" :key="cert">{{ cert }}</li>
        </ul>
      </div>

      <div class="footer__links-col">
        <h4 class="footer__heading">Education</h4>
        <ul class="footer__list">
          <li>{{ education.degree }}</li>
          <li>{{ education.school }}</li>
          <li>{{ education.period }}</li>
        </ul>
      </div>
    </div>

    <div class="footer__bottom">
      <p>&copy; {{ year }} Jann Niño Armar Vega. All rights reserved.</p>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as *;
@use '../../assets/styles/mixins' as *;

.footer {
  background: $color-bg-alt;
  border-top: 1px solid $color-border;
  padding: 60px 0 0;

  &__top {
    @include container;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 40px;
    padding-bottom: 40px;

    @include respond(md) {
      grid-template-columns: 1fr;
      gap: 32px;
    }
  }

  &__brand {
    @include respond(md) { text-align: center; }
  }

  &__logo {
    font-family: $font-mono;
    @include gradient-text;
    font-size: 1.3rem;
    margin-bottom: 12px;
  }

  &__desc {
    color: $color-text-muted;
    font-size: 0.95rem;
    max-width: 340px;
    line-height: 1.7;

    @include respond(md) { max-width: 100%; }
  }

  &__socials {
    display: flex;
    gap: 12px;
    margin-top: 20px;

    @include respond(md) { justify-content: center; }
  }

  &__social-link {
    width: 40px;
    height: 40px;
    @include flex-center;
    border-radius: $radius-sm;
    background: rgba(108, 99, 255, 0.1);
    color: $color-text-muted;
    transition: all $transition-fast;

    &:hover {
      background: $color-primary;
      color: #fff;
      transform: translateY(-2px);
    }
  }

  &__links-col {
    @include respond(md) { text-align: center; }
  }

  &__heading {
    color: $color-text-heading;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 16px;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 8px;

    li {
      color: $color-text-muted;
      font-size: 0.9rem;
    }
  }

  &__bottom {
    @include container;
    border-top: 1px solid $color-border;
    padding: 20px 0;
    text-align: center;

    p {
      color: $color-text-muted;
      font-size: 0.85rem;
    }
  }
}
</style>
