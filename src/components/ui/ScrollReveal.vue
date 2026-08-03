<template>
  <div class="scroll-reveal-wrap">
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const el = ref(null)
let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const children = entry.target.querySelectorAll(
            '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale'
          )
          children.forEach((child) => child.classList.add('revealed'))
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )

  const targets = document.querySelectorAll('.scroll-reveal-wrap')
  targets.forEach((t) => observer.observe(t))
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>
