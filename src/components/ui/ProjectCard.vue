<script setup>
defineProps({
  project: { type: Object, required: true },
})
</script>

<template>
  <div class="project-card scroll-reveal-scale">
    <div class="project-card__icon">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
      </svg>
    </div>
    <h3 class="project-card__title">{{ project.title }}</h3>
    <p class="project-card__desc">{{ project.description }}</p>
    <div class="project-card__tags">
      <span v-for="tag in project.tags" :key="tag" class="project-card__tag">{{ tag }}</span>
    </div>
    <a v-if="project.link" :href="project.link" class="project-card__link">
      View Project
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </a>
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

  &__link {
    @include flex-center;
    gap: 8px;
    padding: 10px 0 0;
    color: $color-primary;
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: none;
    border-top: 1px solid $color-border;
    transition: gap $transition-fast;

    &:hover { gap: 12px; }
  }
}
</style>
