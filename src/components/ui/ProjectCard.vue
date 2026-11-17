<script setup>
import VideoEmbed from './VideoEmbed.vue'

const props = defineProps({
  project: { type: Object, required: true },
})

const emit = defineEmits(['open-demo'])
</script>

<template>
  <div class="project-card scroll-reveal-scale">
    <VideoEmbed
      v-if="project.video"
      :src="project.video"
      :title="project.title"
      :poster="project.image"
    />
    <a
      v-else-if="project.image"
      :href="project.link || project.github || undefined"
      target="_blank"
      rel="noopener"
      class="project-card__shot"
    >
      <img :src="project.image" :alt="`${project.title} screenshot`" loading="lazy" />
    </a>
    <div v-else class="project-card__icon">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
      </svg>
    </div>
    <h3 class="project-card__title">{{ project.title }}</h3>
    <p class="project-card__desc">{{ project.description }}</p>
    <div class="project-card__tags">
      <span v-for="tag in project.tags" :key="tag" class="project-card__tag">{{ tag }}</span>
    </div>
    <div v-if="project.link || project.github || project.demo" class="project-card__actions">
      <a v-if="project.link" :href="project.link" target="_blank" rel="noopener" class="project-card__link">
        Live Site
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
      <a v-if="project.github" :href="project.github" target="_blank" class="project-card__link project-card__link--github">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        GitHub
      </a>
      <button
        v-if="project.demo"
        class="project-card__demo-btn"
        @click="emit('open-demo', project)"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
        Live Demo
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as *;
@use '../../assets/styles/mixins' as *;

.project-card {
  @include card;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__icon {
    width: 50px;
    height: 50px;
    @include flex-center;
    border-radius: $radius-md;
    background: linear-gradient(135deg, rgba(108, 99, 255, 0.2), rgba(59, 130, 246, 0.15));
    color: $color-primary;
  }

  &__shot {
    display: block;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    border-radius: $radius-md;
    border: 1px solid rgba(255, 255, 255, 0.08);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
      transition: transform 0.4s ease;
    }

    &:hover img {
      transform: scale(1.04);
    }
  }

  &__title {
    font-size: 1.2rem;
    font-weight: 600;
    color: $color-text-heading;
  }

  &__desc {
    color: $color-text-muted;
    font-size: 0.9rem;
    line-height: 1.7;
    flex-grow: 1;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__tag {
    padding: 4px 10px;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: $radius-full;
    background: rgba(108, 99, 255, 0.08);
    color: $color-primary-light;
  }

  &__actions {
    display: flex;
    gap: 10px;
    padding-top: 12px;
    border-top: 1px solid $color-border;

    @include respond(sm) {
      flex-direction: column;
    }
  }

  &__link {
    @include flex-center;
    gap: 8px;
    flex: 1;
    padding: 10px 16px;
    color: $color-primary;
    font-size: 0.85rem;
    font-weight: 600;
    text-decoration: none;
    border-radius: $radius-sm;
    border: 1px solid rgba(108, 99, 255, 0.25);
    transition: all $transition-fast;

    &:hover {
      background: rgba(108, 99, 255, 0.08);
    }
  }

  &__demo-btn {
    @include flex-center;
    gap: 8px;
    flex: 1;
    padding: 10px 16px;
    background: linear-gradient(135deg, $color-primary, $color-gradient-end);
    color: #fff;
    font-size: 0.85rem;
    font-weight: 600;
    border: none;
    border-radius: $radius-sm;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover {
      transform: translateY(-1px);
      box-shadow: $shadow-glow;
    }
  }
}
</style>
