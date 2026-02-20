<template>
  <AppModal :model-value="modelValue" centered closeable @update:model-value="$emit('update:modelValue', $event)">
    <div class="modal-confirm">
      <div :class="['modal-confirm-icon', `icon-${type}`]">
        <Icon :name="icon" />
      </div>
      <h5 class="fw-bold mb-2">{{ title }}</h5>
      <p class="text-muted mb-4">{{ message }}</p>
      <div class="d-flex gap-2 justify-content-center">
        <button class="btn btn-light" @click="$emit('update:modelValue', false)">
          {{ cancelText }}
        </button>
        <button :class="['btn', `btn-${type}`]" :disabled="loading" @click="$emit('confirm')">
          <span v-if="loading" class="spinner-border spinner-border-sm me-1" />
          {{ confirmText }}
        </button>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'success';
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}>();

const icon = computed(() => {
  return 'mdi:alert';
});

defineEmits(['update:modelValue', 'confirm']);
</script>
