<template>
  <div class="empty-state text-center py-5">
    <div class="empty-state-icon mb-3">
      <Icon :name="icon" size="48" class="text-muted" />
    </div>
    <h5 class="fw-semibold mb-2">{{ title }}</h5>
    <p class="text-muted mb-4">{{ description }}</p>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string;
  title: string;
  description?: string;
}>();
</script>
