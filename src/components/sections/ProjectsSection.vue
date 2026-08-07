<script setup>
import { ref } from 'vue'
import { projects } from '../../data/projects.js'
import ProjectCard from '../ui/ProjectCard.vue'
import DemoModal from '../ui/DemoModal.vue'
import ScrollReveal from '../ui/ScrollReveal.vue'

const activeDemo = ref(null)

function openDemo(project) {
  activeDemo.value = project
}

function closeDemo() {
  activeDemo.value = null
}
</script>

<template>
  <section id="projects" class="projects">
    <ScrollReveal>
      <div class="projects__container">
        <h2 class="projects__title scroll-reveal">Projects</h2>
        <p class="projects__subtitle scroll-reveal delay-1">
          A selection of projects showcasing my expertise across the VILT and MERN stacks, AI integration, and geospatial development
        </p>

        <div class="projects__grid">
          <ProjectCard
            v-for="(project, i) in projects"
            :key="project.id"
            :project="project"
            :style="{ animationDelay: `${i * 0.1}s` }"
            @open-demo="openDemo"
          />
        </div>
      </div>
    </ScrollReveal>

    <DemoModal
      v-if="activeDemo?.demo"
      :title="activeDemo.title + ' — Live Demo'"
      :demo-type="activeDemo.demo.type"
      :demo-config="activeDemo.demo.config"
      @close="closeDemo"
    />
  </section>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as *;
@use '../../assets/styles/mixins' as *;

.projects {
  @include section;
  background: $color-bg-alt;

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
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;

    @include respond(lg) {
      grid-template-columns: repeat(2, 1fr);
    }
    @include respond(md) {
      grid-template-columns: 1fr;
      max-width: 500px;
      margin: 0 auto;
    }
  }
}
</style>
