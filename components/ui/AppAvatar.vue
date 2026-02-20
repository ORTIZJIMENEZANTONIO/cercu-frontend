<template>
  <div
    class="app-avatar d-inline-flex align-items-center justify-content-center rounded-circle"
    :class="[`avatar-${size}`]"
    :style="{ backgroundColor: bgColor }"
  >
    <img v-if="src" :src="src" :alt="alt" class="rounded-circle w-100 h-100 object-fit-cover" />
    <span v-else class="avatar-initials fw-semibold text-white">{{ initials }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  src?: string;
  name?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
}>();

const initials = computed(() => {
  if (!props.name) return '?';
  return props.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
});

const bgColor = computed(() => {
  if (props.src) return 'transparent';
  const colors = ['#3730A3', '#4F46E5', '#FB7185', '#10B981', '#F59E0B'];
  const hash = (props.name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return colors[hash % colors.length];
});
</script>

<style lang="scss" scoped>
.avatar-sm { width: 32px; height: 32px; font-size: 0.75rem; }
.avatar-md { width: 48px; height: 48px; font-size: 0.875rem; }
.avatar-lg { width: 64px; height: 64px; font-size: 1.125rem; }
</style>
