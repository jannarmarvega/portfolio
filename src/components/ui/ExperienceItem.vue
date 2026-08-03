<script setup>
defineProps({
  item: { type: Object, required: true },
  index: { type: Number, default: 0 },
})
</script>

<template>
  <div
    class="experience-item"
    :class="[
      `scroll-reveal-${index % 2 === 0 ? 'left' : 'right'}`,
      `delay-${(index % 3) + 1}`
    ]"
  >
    <div class="experience-item__dot"></div>
    <div class="experience-item__line"></div>
    <div class="experience-item__content">
      <span class="experience-item__period">{{ item.period }} · {{ item.duration }}</span>
      <h3 class="experience-item__role">{{ item.role }}</h3>
      <div class="experience-item__company">
        <span>{{ item.company }}</span>
        <span v-if="item.location" class="experience-item__location">{{ item.location }}</span>
      </div>
      <ul v-if="item.highlights.length" class="experience-item__highlights">
        <li v-for="(h, i) in item.highlights" :key="i">{{ h }}</li>
      </ul>
      <div class="experience-item__footer">
        <span class="experience-item__type">{{ item.type }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as *;
@use '../../assets/styles/mixins' as *;

.experience-item {
  display: flex;
  gap: 24px;
  position: relative;
  padding-bottom: 40px;

  &:last-child { padding-bottom: 0; }

  &__dot {
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: $color-primary;
    border: 3px solid $color-bg;
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.3);
    position: relative;
    z-index: 2;
    margin-top: 6px;
  }

  &__line {
    position: absolute;
    left: 6px;
    top: 20px;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, $color-primary, rgba(108, 99, 255, 0.1));

    .experience-item:last-child & { display: none; }
  }

  &__content {
    flex: 1;
    @include card;
    padding: 24px;

    @include respond(md) { padding: 20px; }
  }

  &__period {
    @include gradient-text;
    font-size: 0.85rem;
    font-weight: 600;
    font-family: $font-mono;
    margin-bottom: 8px;
    display: block;
  }

  &__role {
    font-size: 1.15rem;
    font-weight: 700;
    color: $color-text-heading;
    margin-bottom: 4px;
  }

  &__company {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    font-size: 0.9rem;
    color: $color-text-muted;
    margin-bottom: 12px;
  }

  &__location {
    color: $color-primary-light;
    font-size: 0.85rem;
  }

  &__highlights {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;

    li {
      font-size: 0.9rem;
      color: $color-text-muted;
      line-height: 1.6;
      padding-left: 16px;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 10px;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: $color-primary;
      }
    }
  }

  &__footer {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid $color-border;
  }

  &__type {
    font-size: 0.8rem;
    padding: 4px 12px;
    border-radius: $radius-full;
    background: rgba(245, 158, 11, 0.15);
    color: $color-accent;
    font-weight: 600;
  }
}
</style>
