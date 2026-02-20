<template>
  <span :class="['badge', `bg-${variant}`, { 'badge-status': status }]">
    <slot />
  </span>
</template>

<script setup lang="ts">
defineProps<{
  variant?: string;
  status?: boolean;
}>();
</script>
