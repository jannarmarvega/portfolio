<script setup>
import { personalInfo } from '../../data/personal.js'
import SkillBadge from '../ui/SkillBadge.vue'
import ScrollReveal from '../ui/ScrollReveal.vue'
import { education, certifications } from '../../data/social.js'

const skillCategories = [
  { name: 'Stacks', items: personalInfo.skills.stacks },
  { name: 'Frontend', items: personalInfo.skills.frontend },
  { name: 'Backend', items: personalInfo.skills.backend },
  { name: 'AI & Automation', items: personalInfo.skills.ai },
  { name: 'Geospatial', items: personalInfo.skills.geospatial },
  { name: 'Mobile', items: personalInfo.skills.mobile },
  { name: 'Cloud', items: personalInfo.skills.cloud },
  { name: 'Infrastructure', items: personalInfo.skills.infrastructure },
  { name: 'Tools', items: personalInfo.skills.tools },
]
</script>

<template>
  <section id="about" class="about">
    <ScrollReveal>
      <div class="about__container">
        <h2 class="about__title scroll-reveal">About Me</h2>
        <p class="about__subtitle scroll-reveal delay-1">
          A passionate solution architect bridging complex backend architecture with modern frontend frameworks
        </p>

        <div class="about__content">
          <div class="about__bio scroll-reveal-left delay-1">
            <div class="about__image">
              <div class="about__image-placeholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </div>
            <div class="about__text">
              <p v-for="(para, i) in personalInfo.summary" :key="i" class="about__para">{{ para }}</p>
            </div>
          </div>

          <div class="about__details scroll-reveal-right delay-1">
            <div class="about__detail-card">
              <h4>Education</h4>
              <p class="about__detail-main">{{ education.degree }}</p>
              <p class="about__detail-sub">{{ education.school }} · {{ education.period }}</p>
            </div>
            <div class="about__detail-card">
              <h4>Certifications</h4>
              <ul class="about__cert-list">
                <li v-for="cert in certifications" :key="cert">{{ cert }}</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="about__skills scroll-reveal">
          <h3 class="about__skills-title">Skills &amp; Technologies</h3>
          <div class="about__skills-grid">
            <div v-for="cat in skillCategories" :key="cat.name" class="about__skill-category scroll-reveal-scale">
              <h4 class="about__skill-cat-name">{{ cat.name }}</h4>
              <SkillBadge :tags="cat.items" />
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  </section>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as *;
@use '../../assets/styles/mixins' as *;

.about {
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

  &__content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 32px;
    margin-bottom: 60px;

    @include respond(lg) {
      grid-template-columns: 1fr;
    }
  }

  &__bio {
    display: flex;
    gap: 24px;

    @include respond(md) {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
  }

  &__image {
    flex-shrink: 0;
  }

  &__image-placeholder {
    width: 120px;
    height: 120px;
    @include flex-center;
    border-radius: $radius-xl;
    background: linear-gradient(135deg, rgba(108, 99, 255, 0.15), rgba(59, 130, 246, 0.1));
    border: 2px solid $color-border;

    @include respond(md) {
      width: 100px;
      height: 100px;
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__para {
    color: $color-text-muted;
    font-size: 0.95rem;
    line-height: 1.8;
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__detail-card {
    @include card;
  }

  &__detail-card h4 {
    @include gradient-text;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  &__detail-main {
    color: $color-text-heading;
    font-weight: 600;
    font-size: 0.95rem;
  }

  &__detail-sub {
    color: $color-text-muted;
    font-size: 0.85rem;
    margin-top: 4px;
  }

  &__cert-list {
    display: flex;
    flex-direction: column;
    gap: 6px;

    li {
      color: $color-text-muted;
      font-size: 0.9rem;
      padding-left: 16px;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 8px;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: $color-primary;
      }
    }
  }

  &__skills {
    margin-top: 20px;
  }

  &__skills-title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 700;
    color: $color-text-heading;
    margin-bottom: 32px;
  }

  &__skills-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

    @include respond(lg) {
      grid-template-columns: repeat(2, 1fr);
    }
    @include respond(sm) {
      grid-template-columns: 1fr;
    }
  }

  &__skill-category {
    @include card;
    padding: 20px;

    &:hover {
      transform: translateY(-2px);
    }
  }

  &__skill-cat-name {
    @include gradient-text;
    font-size: 0.85rem;
    font-weight: 700;
    margin-bottom: 12px;
  }
}
</style>
