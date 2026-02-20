<template>
  <th
    class="sortable-th"
    :class="[extraClass, { 'sortable-th--active': active }]"
    @click="$emit('sort', sortKey)"
  >
    <span class="sortable-th-inner">
      {{ label }}
      <span class="sort-arrows">
        <Icon
          name="mdi:chevron-up"
          size="12"
          :class="{ 'sort-active': active && dir === 'asc' }"
        />
        <Icon
          name="mdi:chevron-down"
          size="12"
          :class="{ 'sort-active': active && dir === 'desc' }"
        />
      </span>
    </span>
  </th>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  sortKey: string
  active: boolean
  dir: 'asc' | 'desc'
  extraClass?: string
}>()

defineEmits(['sort'])
</script>

<style lang="scss" scoped>
.sortable-th {
  cursor: pointer;
  user-select: none;
  transition: color 0.15s ease;

  &:hover {
    color: $cercu-indigo;
  }

  &--active {
    color: $cercu-indigo !important;
  }
}

.sortable-th-inner {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.sort-arrows {
  display: inline-flex;
  flex-direction: column;
  line-height: 0;
  margin-top: -1px;

  :deep(svg) {
    opacity: 0.25;
    transition: opacity 0.15s ease;
  }

  .sort-active {
    opacity: 1 !important;
  }
}
</style>
