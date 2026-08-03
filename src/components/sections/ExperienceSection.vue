<script setup>
import { experience } from '../../data/experience.js'
import ExperienceItem from '../ui/ExperienceItem.vue'
import ScrollReveal from '../ui/ScrollReveal.vue'
</script>

<template>
  <section id="experience" class="experience">
    <ScrollReveal>
      <div class="experience__container">
        <h2 class="experience__title scroll-reveal">Work Experience</h2>
        <p class="experience__subtitle scroll-reveal delay-1">
          Over 7 years of professional experience across web development, GIS, and marketing
        </p>

        <div class="experience__timeline">
          <ExperienceItem
            v-for="(item, index) in experience"
            :key="item.id"
            :item="item"
            :index="index"
          />
        </div>
      </div>
    </ScrollReveal>
  </section>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as *;
@use '../../assets/styles/mixins' as *;

.experience {
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

  &__timeline {
    max-width: 800px;
    margin: 0 auto;
  }
}
</style>
