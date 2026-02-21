<template>
  <Teleport to="body">
    <Transition name="fade" appear>
      <div v-if="modelValue" class="modal-backdrop-custom" @click.self="closeable && $emit('update:modelValue', false)" />
    </Transition>
    <Transition name="scale" appear>
      <div
        v-if="modelValue"
        class="modal fade show d-block"
        tabindex="-1"
        @click.self="closeable && $emit('update:modelValue', false)"
      >
        <div class="modal-dialog" :class="[size ? `modal-${size}` : '', { 'modal-dialog-centered': centered }]">
          <div class="modal-content">
            <div v-if="title || $slots.header" class="modal-header">
              <slot name="header">
                <h5 class="modal-title">{{ title }}</h5>
              </slot>
              <button
                v-if="closeable"
                type="button"
                class="btn-close"
                @click="$emit('update:modelValue', false)"
              />
            </div>
            <div class="modal-body">
              <slot />
            </div>
            <div v-if="$slots.footer" class="modal-footer">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  title?: string
  size?: 'sm' | 'lg' | 'xl'
  centered?: boolean
  closeable?: boolean
}>()

defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1049;
  backdrop-filter: blur(4px);
}

.modal {
  z-index: 1050;
}

.modal-content {
  border: none;
  background: $neu-bg;
  box-shadow: $neu-shadow-xl;
}
</style>
