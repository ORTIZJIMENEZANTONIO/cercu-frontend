<template>
  <div class="chip-selector">
    <label v-if="label" class="form-label">{{ label }}</label>
    <div class="d-flex flex-wrap gap-2">
      <button
        v-for="chip in chips"
        :key="chip.id"
        ref="chipRefs"
        type="button"
        class="btn-chip chip-bounce"
        :class="{ active: isSelected(chip.id) }"
        @click="toggleChip(chip.id, $event)"
      >
        {{ chip.label }}
      </button>
    </div>
    <Transition name="slide-up">
      <div v-if="error" class="invalid-feedback d-block mt-1">{{ error }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'

interface Chip {
  id: number
  label: string
  slug?: string
}

const props = defineProps<{
  modelValue: number[]
  chips: Chip[]
  label?: string
  multiple?: boolean
  error?: string
}>()

const emit = defineEmits(['update:modelValue'])
const chipRefs = ref<HTMLButtonElement[]>([])

function isSelected(id: number) {
  return props.modelValue.includes(id)
}

function toggleChip(id: number, e: MouseEvent) {
  const target = e.currentTarget as HTMLElement
  if (target) {
    gsap.fromTo(target,
      { scale: 1 },
      { scale: 1.1, duration: 0.12, yoyo: true, repeat: 1, ease: 'back.out(3)' }
    )
  }

  if (props.multiple) {
    const newVal = isSelected(id)
      ? props.modelValue.filter((v) => v !== id)
      : [...props.modelValue, id]
    emit('update:modelValue', newVal)
  } else {
    emit('update:modelValue', isSelected(id) ? [] : [id])
  }
}
</script>
