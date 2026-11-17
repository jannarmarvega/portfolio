<script setup>
import { reactive, ref } from 'vue'
import ScrollReveal from '../ui/ScrollReveal.vue'

const form = reactive({ name: '', email: '', subject: '', message: '', website: '' })
const status = ref('idle') // idle | sending | sent | error
const errorText = ref('')

const topics = [
  'Job opportunity',
  'Freelance project',
  'Collaboration',
  'Question about a project',
]

function pickTopic(topic) {
  form.subject = topic
}

async function send() {
  if (status.value === 'sending') return
  status.value = 'sending'
  errorText.value = ''

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || 'Your message could not be sent. Please try again later.')

    status.value = 'sent'
    Object.assign(form, { name: '', email: '', subject: '', message: '', website: '' })
  } catch (err) {
    status.value = 'error'
    errorText.value = err.message
  }
}
</script>

<template>
  <section id="message" class="message">
    <ScrollReveal>
      <div class="message__container">
        <h2 class="message__title scroll-reveal">Ask Me Anything</h2>
        <p class="message__subtitle scroll-reveal delay-1">
          Have a project, a role or a question? Send me an email right here. It goes straight to my inbox and I'll reply to the address you give.
        </p>

        <form class="message__form scroll-reveal delay-2" @submit.prevent="send">
          <div class="message__row">
            <label class="message__field">
              <span>Name</span>
              <input v-model="form.name" type="text" name="name" autocomplete="name" maxlength="100" required placeholder="Your name" />
            </label>
            <label class="message__field">
              <span>Email</span>
              <input v-model="form.email" type="email" name="email" autocomplete="email" maxlength="200" required placeholder="you@example.com" />
            </label>
          </div>

          <div class="message__topics">
            <button
              v-for="topic in topics"
              :key="topic"
              type="button"
              class="message__topic"
              :class="{ 'message__topic--active': form.subject === topic }"
              @click="pickTopic(topic)"
            >
              {{ topic }}
            </button>
          </div>

          <label class="message__field">
            <span>Subject <em>(optional)</em></span>
            <input v-model="form.subject" type="text" name="subject" maxlength="150" placeholder="What's it about?" />
          </label>

          <label class="message__field">
            <span>Message</span>
            <textarea v-model="form.message" name="message" rows="6" maxlength="5000" required placeholder="Hi Jann, ..." />
          </label>

          <!-- Honeypot for bots: hidden from people and screen readers -->
          <input v-model="form.website" class="message__hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />

          <div class="message__footer">
            <p v-if="status === 'sent'" class="message__note message__note--ok" role="status">
              Thanks! Your message was sent. I'll get back to you soon.
            </p>
            <p v-else-if="status === 'error'" class="message__note message__note--err" role="alert">
              {{ errorText }}
            </p>
            <span v-else />

            <button type="submit" class="message__send" :disabled="status === 'sending'">
              <span v-if="status === 'sending'" class="message__spinner" />
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              {{ status === 'sending' ? 'Sending…' : 'Send Email' }}
            </button>
          </div>
        </form>
      </div>
    </ScrollReveal>
  </section>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables' as *;
@use '../../assets/styles/mixins' as *;

.message {
  @include section;

  &__container {
    @include container;
  }

  &__title {
    @include section-title;
  }

  &__subtitle {
    @include section-subtitle;
  }

  &__form {
    max-width: 760px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px;
    background: $color-bg-card;
    border: 1px solid $color-border;
    border-radius: $radius-lg;

    @include respond(sm) {
      padding: 16px;
    }
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    @include respond(sm) {
      grid-template-columns: 1fr;
    }
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 6px;

    > span {
      font-size: 0.85rem;
      font-weight: 500;
      color: $color-text-muted;

      em {
        font-style: normal;
        opacity: 0.7;
      }
    }

    input,
    textarea {
      width: 100%;
      padding: 12px 16px;
      border-radius: $radius-md;
      border: 1px solid $color-border;
      background: $color-bg-alt;
      color: $color-text;
      font-size: 1rem;
      font-family: $font-sans;
      line-height: 1.6;
      outline: none;
      transition: border-color $transition-fast;

      &:focus {
        border-color: $color-primary;
        box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.12);
      }

      &::placeholder {
        color: $color-text-muted;
      }
    }

    textarea {
      resize: vertical;
      min-height: 140px;
    }
  }

  &__topics {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__topic {
    font-size: 0.8rem;
    padding: 6px 14px;
    border-radius: $radius-full;
    border: 1px solid $color-border;
    background: transparent;
    color: $color-text-muted;
    font-family: $font-sans;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover,
    &--active {
      border-color: $color-primary;
      color: $color-primary;
      background: rgba(108, 99, 255, 0.06);
    }
  }

  &__hp {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    opacity: 0;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    @include respond(sm) {
      flex-direction: column-reverse;
      align-items: stretch;
    }
  }

  &__note {
    font-size: 0.9rem;

    &--ok {
      color: #22c55e;
    }

    &--err {
      color: #f87171;
    }
  }

  &__send {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 28px;
    border: none;
    border-radius: $radius-md;
    background: linear-gradient(135deg, $color-gradient-start, $color-gradient-end);
    color: #fff;
    font-size: 0.95rem;
    font-weight: 600;
    font-family: $font-sans;
    cursor: pointer;
    flex-shrink: 0;
    transition: all $transition-fast;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(108, 99, 255, 0.35);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
