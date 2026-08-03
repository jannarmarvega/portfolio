<script setup>
defineProps({
  tags: { type: Array, default: () => [] },
})
</script>

<template>
  <div class="skill-badges">
    <span v-for="tag in tags" :key="tag" class="badge">{{ tag }}</span>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as *;

.skill-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.badge {
  padding: 6px 14px;
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: $radius-full;
  background: rgba(108, 99, 255, 0.1);
  color: $color-primary-light;
  border: 1px solid rgba(108, 99, 255, 0.2);
  transition: all $transition-fast;

  &:hover {
    background: rgba(108, 99, 255, 0.2);
    border-color: $color-primary;
  }
}
</style>
