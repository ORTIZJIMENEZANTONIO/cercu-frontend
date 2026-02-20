<template>
  <div class="categories-page">
    <div class="container">
      <div class="page-header" :class="{ 'anim-in': mounted }">
        <h1 class="page-title">Todas las categorias</h1>
        <p class="page-subtitle">Encuentra el servicio que necesitas</p>
      </div>

      <!-- Emergency -->
      <div v-if="categoriesStore.emergencyCategories.length" class="category-section">
        <div class="section-label" :class="{ 'anim-in': mounted }">
          <div class="section-label-icon section-label-icon--coral">
            <Icon name="mdi:lightning-bolt" size="18" />
          </div>
          <span>Emergencias</span>
        </div>
        <div class="category-grid">
          <div
            v-for="(cat, i) in categoriesStore.emergencyCategories"
            :key="cat.id"
            class="category-grid-item"
            :class="{ 'anim-in': mounted }"
            :style="{ transitionDelay: `${0.1 + i * 0.05}s` }"
          >
            <NuxtLink :to="`/categorias/${cat.slug}`" class="text-decoration-none">
              <div class="category-card">
                <div class="category-card-icon">
                  <Icon :name="cat.icon || 'mdi:wrench'" size="26" />
                </div>
                <h6 class="category-card-name">{{ cat.name }}</h6>
                <span class="category-card-count">{{ cat.chips?.length || 0 }} servicios</span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Projects -->
      <div v-if="categoriesStore.projectCategories.length" class="category-section">
        <div class="section-label" :class="{ 'anim-in': mounted }">
          <div class="section-label-icon section-label-icon--indigo">
            <Icon name="mdi:hammer-wrench" size="18" />
          </div>
          <span>Proyectos</span>
        </div>
        <div class="category-grid">
          <div
            v-for="(cat, i) in categoriesStore.projectCategories"
            :key="cat.id"
            class="category-grid-item"
            :class="{ 'anim-in': mounted }"
            :style="{ transitionDelay: `${0.15 + i * 0.05}s` }"
          >
            <NuxtLink :to="`/categorias/${cat.slug}`" class="text-decoration-none">
              <div class="category-card">
                <div class="category-card-icon">
                  <Icon :name="cat.icon || 'mdi:wrench'" size="26" />
                </div>
                <h6 class="category-card-name">{{ cat.name }}</h6>
                <span class="category-card-count">{{ cat.chips?.length || 0 }} servicios</span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const categoriesStore = useCategoriesStore()
const mounted = ref(false)

onMounted(async () => {
  await categoriesStore.fetchAll().catch(() => {})
  requestAnimationFrame(() => {
    mounted.value = true
  })
})

useHead({ title: 'Categorias - CERCU' })
</script>

<style lang="scss" scoped>
.categories-page {
  padding: 1.25rem 0 3rem;

  @media (min-width: 768px) {
    padding: 2rem 0 4rem;
  }
}

// ─── Page Header ───
.page-header {
  margin-bottom: 1.5rem;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }

  @media (min-width: 768px) {
    margin-bottom: 2rem;
  }
}

.page-title {
  font-family: $headings-font-family;
  font-size: 1.375rem;
  font-weight: 700;
  color: $neutral-900;
  margin-bottom: 0.25rem;

  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
}

.page-subtitle {
  font-size: 0.875rem;
  color: $neutral-500;
  margin-bottom: 0;
}

// ─── Section ───
.category-section {
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: $neutral-700;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-label-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  &--coral {
    background: rgba($cercu-coral, 0.1);
    color: $cercu-coral;
  }

  &--indigo {
    background: rgba($cercu-indigo, 0.08);
    color: $cercu-indigo;
  }
}

// ─── Grid ───
.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;

  @media (min-width: 576px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
}

.category-grid-item {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

// ─── Card ───
.category-card {
  background: white;
  border: 1px solid $neutral-100;
  border-radius: 14px;
  padding: 1.25rem 1rem;
  text-align: center;
  height: 100%;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease, border-color 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    border-color: rgba($cercu-indigo, 0.2);
  }

  &:active {
    transform: translateY(-1px);
    transition-duration: 0.1s;
  }
}

.category-card-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba($cercu-indigo, 0.08) 0%, rgba($cercu-indigo, 0.15) 100%);
  color: $cercu-indigo;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease;
}

.category-card:hover .category-card-icon {
  transform: scale(1.12) rotate(5deg);
  background: linear-gradient(135deg, rgba($cercu-indigo, 0.12) 0%, rgba($cercu-indigo, 0.22) 100%);
}

.category-card-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: $neutral-800;
  margin-bottom: 0.25rem;
}

.category-card-count {
  font-size: 0.7rem;
  color: $neutral-400;
}
</style>
