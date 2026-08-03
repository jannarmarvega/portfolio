<script setup>
defineProps({
  post: { type: Object, required: true },
})
</script>

<template>
  <article class="blog-card scroll-reveal">
    <div class="blog-card__header">
      <div class="blog-card__meta">
        <span class="blog-card__date">{{ post.date }}</span>
        <span class="blog-card__read-time">{{ post.readTime }}</span>
      </div>
      <h3 class="blog-card__title">{{ post.title }}</h3>
    </div>
    <p class="blog-card__excerpt">{{ post.excerpt }}</p>
    <div class="blog-card__footer">
      <div class="blog-card__tags">
        <span v-for="tag in post.tags" :key="tag" class="blog-card__tag">{{ tag }}</span>
      </div>
      <a :href="post.link" class="blog-card__read-more">
        Read more
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
    </div>
  </article>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as *;
@use '../../assets/styles/mixins' as *;

.blog-card {
  @include card;
  text-align: left;

  &__header {
    margin-bottom: 12px;
  }

  &__meta {
    display: flex;
    gap: 12px;
    margin-bottom: 8px;
  }

  &__date {
    font-size: 0.8rem;
    color: $color-primary-light;
    font-family: $font-mono;
  }

  &__read-time {
    font-size: 0.8rem;
    color: $color-text-muted;
  }

  &__title {
    font-size: 1.15rem;
    font-weight: 600;
    color: $color-text-heading;
    line-height: 1.4;
  }

  &__excerpt {
    color: $color-text-muted;
    font-size: 0.9rem;
    line-height: 1.7;
    margin-bottom: 16px;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid $color-border;
  }

  &__tags {
    display: flex;
    gap: 6px;
  }

  &__tag {
    font-size: 0.75rem;
    padding: 3px 10px;
    border-radius: $radius-full;
    background: rgba(108, 99, 255, 0.1);
    color: $color-primary-light;
  }

  &__read-more {
    @include flex-center;
    gap: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    color: $color-primary;
    text-decoration: none;
    transition: gap $transition-fast;

    &:hover { gap: 10px; }
  }
}
</style>
