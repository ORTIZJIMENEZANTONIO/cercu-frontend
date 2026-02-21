<template>
  <div class="skeleton-wrapper">
    <div
      v-for="i in count"
      :key="i"
      class="skeleton"
      :class="[`skeleton-${variant}`]"
      :style="{ width, height }"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'text' | 'circle' | 'rect' | 'card';
  width?: string;
  height?: string;
  count?: number;
}>();
</script>

<style lang="scss" scoped>
.skeleton {
  background: linear-gradient(90deg, $neu-bg 25%, $neu-bg-light 50%, $neu-bg 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: $border-radius-sm;
  box-shadow: $neu-inset-sm;

  &-text {
    height: 1rem;
    margin-bottom: 0.5rem;
    border-radius: $border-radius-sm;
  }

  &-circle {
    border-radius: 50%;
  }

  &-rect {
    border-radius: $border-radius;
  }

  &-card {
    height: 200px;
    border-radius: $border-radius-lg;
  }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
