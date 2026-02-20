<template>
  <div class="d-flex justify-content-center align-items-center" :class="{ 'py-5': fullPage }">
    <div :class="[`spinner-border text-${color}`, size === 'sm' ? 'spinner-border-sm' : '']" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
    <span v-if="text" class="ms-2 text-muted">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  color?: string;
  size?: 'sm' | 'lg';
  text?: string;
  fullPage?: boolean;
}>();
</script>
