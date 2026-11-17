<template>
  <div ref="el" class="scroll-reveal-wrap">
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const el = ref(null)
let observer = null

// Each animated element is observed on its own. Observing the whole section with a
// 10% threshold never fired on phones: a long stacked section (e.g. Projects) is
// taller than ten screens, so 10% of it can never be visible at once.
onMounted(() => {
  const children = el.value.querySelectorAll(
    '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale'
  )

  if (!('IntersectionObserver' in window)) {
    children.forEach((child) => child.classList.add('revealed'))
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0, rootMargin: '0px 0px -40px 0px' }
  )

  children.forEach((child) => observer.observe(child))
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>
