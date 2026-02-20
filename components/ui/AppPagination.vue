<template>
  <nav v-if="totalPages > 1" aria-label="Paginacion">
    <ul class="pagination justify-content-center mb-0">
      <li class="page-item" :class="{ disabled: currentPage <= 1 }">
        <button class="page-link" @click="$emit('change', currentPage - 1)">Anterior</button>
      </li>
      <li
        v-for="page in visiblePages"
        :key="page"
        class="page-item"
        :class="{ active: page === currentPage }"
      >
        <button class="page-link" @click="$emit('change', page)">{{ page }}</button>
      </li>
      <li class="page-item" :class="{ disabled: currentPage >= totalPages }">
        <button class="page-link" @click="$emit('change', currentPage + 1)">Siguiente</button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();

defineEmits(['change']);

const visiblePages = computed(() => {
  const pages: number[] = [];
  const start = Math.max(1, props.currentPage - 2);
  const end = Math.min(props.totalPages, props.currentPage + 2);
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});
</script>
