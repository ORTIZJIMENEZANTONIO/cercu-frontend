<template>
  <div>
    <div class="page-header" :class="{ 'anim-in': mounted }">
      <h1 class="page-title">Reportes</h1>
      <p class="page-subtitle">Reportes de usuarios y profesionales</p>
    </div>

    <div class="content-card" :class="{ 'anim-in': mounted }" style="transition-delay: 0.1s">
    <AppEmptyState
      icon="mdi:flag"
      title="Sin reportes pendientes"
      description="Los reportes de usuarios y profesionales apareceran aqui."
    />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['role'] })

const mounted = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true
  })
})

useHead({ title: 'Reportes - Admin CERCU' })
</script>

<style lang="scss" scoped>
.page-header {
  margin-bottom: 1.25rem;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-title {
  font-family: $headings-font-family;
  font-size: 1.375rem;
  font-weight: 700;
  color: $neutral-900;
  margin-bottom: 0.25rem;
}

.page-subtitle {
  font-size: 0.875rem;
  color: $neutral-500;
  margin-bottom: 0;
}

.content-card {
  background: white;
  border: 1px solid $neutral-100;
  border-radius: 16px;
  padding: 1.25rem;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);

  @media (min-width: 768px) {
    padding: 1.5rem;
  }

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
