<script setup>
import { computed, ref, watch } from 'vue'
import { parseYouTube, youtubeEmbedUrl, youtubeThumbnail } from '../../utils/youtube.js'

const props = defineProps({
  // A YouTube URL / ID / `<iframe>` snippet, or a self-hosted file (e.g. /videos/demo.mp4)
  src: { type: String, required: true },
  title: { type: String, default: 'Video' },
  // Optional poster override. YouTube falls back to its own thumbnail.
  poster: { type: String, default: null },
})

const youtube = computed(() => parseYouTube(props.src))
const isFile = computed(() => !youtube.value)

const fellBack = ref(false)
const thumbnail = computed(() => {
  if (props.poster) return props.poster
  if (!youtube.value) return null
  return youtubeThumbnail(youtube.value.id, fellBack.value ? 'hqdefault' : 'maxresdefault')
})

// maxresdefault does not exist for every upload — drop to the always-present size.
function onThumbnailError() {
  fellBack.value = true
}

const playing = ref(false)

const embedUrl = computed(() =>
  youtube.value ? youtubeEmbedUrl(youtube.value.id, { start: youtube.value.start }) : null
)

// A new src means a new video: reset back to the facade.
watch(
  () => props.src,
  () => {
    playing.value = false
    fellBack.value = false
  }
)
</script>

<template>
  <div class="video-embed">
    <!-- Self-hosted file: native controls, nothing to lazy-load beyond metadata -->
    <video
      v-if="isFile"
      class="video-embed__player"
      :src="src"
      :poster="poster || undefined"
      controls
      playsinline
      preload="metadata"
    />

    <!-- YouTube: facade first, iframe only after a click (keeps YT scripts off initial load) -->
    <iframe
      v-else-if="playing"
      class="video-embed__player"
      :src="embedUrl"
      :title="title"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    />

    <button
      v-else
      type="button"
      class="video-embed__facade"
      :aria-label="`Play video: ${title}`"
      @click="playing = true"
    >
      <img
        v-if="thumbnail"
        class="video-embed__thumb"
        :src="thumbnail"
        :alt="title"
        loading="lazy"
        @error="onThumbnailError"
      />
      <span class="video-embed__play">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as *;
@use '../../assets/styles/mixins' as *;

.video-embed {
  position: relative;
  aspect-ratio: 16 / 9;
  width: 100%;
  overflow: hidden;
  border-radius: $radius-md;
  background: $color-bg;
  border: 1px solid $color-border;

  &__player {
    width: 100%;
    height: 100%;
    display: block;
    border: 0;
    object-fit: cover;
  }

  &__facade {
    @include flex-center;
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    cursor: pointer;
    background: linear-gradient(135deg, rgba(108, 99, 255, 0.15), rgba(59, 130, 246, 0.1));

    &:hover .video-embed__play,
    &:focus-visible .video-embed__play {
      transform: scale(1.1);
      background: $color-primary;
    }

    &:hover .video-embed__thumb {
      transform: scale(1.04);
    }
  }

  &__thumb {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform $transition-base;
  }

  &__play {
    @include flex-center;
    position: relative;
    width: 62px;
    height: 62px;
    border-radius: $radius-full;
    background: rgba(108, 99, 255, 0.85);
    color: #fff;
    padding-left: 4px;
    box-shadow: $shadow-glow;
    transition: transform $transition-base, background $transition-base;
  }
}
</style>
