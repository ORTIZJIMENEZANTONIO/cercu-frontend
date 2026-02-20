<template>
  <button
    ref="btnRef"
    :type="type"
    :class="[
      'btn btn-press',
      `btn-${variant}`,
      size ? `btn-${size}` : '',
      { 'btn-block w-100': block, 'btn-icon': icon && !$slots.default },
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" />
    <Icon v-if="icon && !loading" :name="icon" class="me-1" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import gsap from 'gsap'

const props = defineProps<{
  variant?: string
  size?: 'sm' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  icon?: string
}>()

const emit = defineEmits(['click'])
const btnRef = ref<HTMLButtonElement>()

function handleClick(e: MouseEvent) {
  if (props.disabled || props.loading) return

  // Bounce micro-interaction
  if (btnRef.value) {
    gsap.fromTo(btnRef.value,
      { scale: 1 },
      { scale: 0.95, duration: 0.08, yoyo: true, repeat: 1, ease: 'power2.inOut' }
    )
  }
  emit('click', e)
}
</script>
