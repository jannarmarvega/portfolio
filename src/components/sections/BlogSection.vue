<script setup>
import { blogPosts } from '../../data/blog.js'
import BlogCard from '../ui/BlogCard.vue'
import ScrollReveal from '../ui/ScrollReveal.vue'
</script>

<template>
  <section id="blog" class="blog">
    <ScrollReveal>
      <div class="blog__container">
        <h2 class="blog__title scroll-reveal">Blog</h2>
        <p class="blog__subtitle scroll-reveal delay-1">
          Insights, tutorials, and thoughts on modern web development, AI integration, and geospatial technologies
        </p>

        <div class="blog__grid">
          <BlogCard
            v-for="(post, i) in blogPosts"
            :key="post.id"
            :post="post"
            :class="`delay-${(i % 3) + 1}`"
          />
        </div>
      </div>
    </ScrollReveal>
  </section>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as *;
@use '../../assets/styles/mixins' as *;

.blog {
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
