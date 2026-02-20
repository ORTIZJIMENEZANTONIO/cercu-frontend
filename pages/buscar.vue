<template>
  <div class="search-page">
    <div class="container">
      <!-- Header -->
      <div class="search-header" :class="{ 'anim-in': mounted }">
        <div class="search-header-text">
          <h1 class="page-title">Resultados de busqueda</h1>
          <p class="page-subtitle">{{ searchStore.totalResults }} servicios encontrados</p>
        </div>
        <button class="btn btn-view-toggle btn-press" @click="searchStore.toggleViewMode()">
          <Icon :name="searchStore.viewMode === 'list' ? 'mdi:map' : 'mdi:view-list'" size="18" />
          <span class="d-none d-sm-inline ms-1">
            {{ searchStore.viewMode === 'list' ? 'Ver mapa' : 'Ver lista' }}
          </span>
        </button>
      </div>

      <!-- Search bar -->
      <div class="search-bar" :class="{ 'anim-in': mounted }">
        <div class="position-relative">
          <Icon name="mdi:magnify" class="search-bar-icon" size="20" />
          <input
            v-model="query"
            type="text"
            class="search-bar-input"
            placeholder="Buscar servicios..."
            @input="debouncedSearch"
          />
        </div>
      </div>

      <!-- Results -->
      <AppSpinner v-if="searchStore.loading" full-page />
      <Transition name="fade" mode="out-in">
        <div v-if="!searchStore.loading && searchStore.results.length === 0" key="empty">
          <AppEmptyState
            icon="mdi:magnify"
            title="No se encontraron resultados"
            description="Intenta con otra busqueda o revisa las categorias"
          />
        </div>
        <div v-else-if="searchStore.results.length > 0" key="results" class="results-grid">
          <div
            v-for="(cat, i) in searchStore.results"
            :key="cat.id"
            class="result-item"
            :class="{ 'anim-in': mounted }"
            :style="{ transitionDelay: `${0.15 + i * 0.05}s` }"
          >
            <NuxtLink :to="`/categorias/${cat.slug}`" class="text-decoration-none">
              <div class="result-card">
                <div class="result-card-header">
                  <div class="result-card-icon">
                    <Icon :name="cat.icon || 'mdi:wrench'" size="24" />
                  </div>
                  <div>
                    <h6 class="result-card-title">{{ cat.name }}</h6>
                    <span v-if="cat.type === 'emergency'" class="result-badge">
                      <Icon name="mdi:lightning-bolt" size="12" />
                      Emergencia
                    </span>
                  </div>
                </div>
                <div class="result-chips">
                  <span v-for="chip in cat.chips?.slice(0, 4)" :key="chip.id" class="result-chip">
                    {{ chip.label }}
                  </span>
                  <span v-if="(cat.chips?.length || 0) > 4" class="result-chip result-chip--more">
                    +{{ cat.chips.length - 4 }}
                  </span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
const searchStore = useSearchStore()
const route = useRoute()
const query = ref((route.query.q as string) || '')
const mounted = ref(false)

let searchTimeout: ReturnType<typeof setTimeout>

function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    searchStore.setQuery(query.value)
    searchStore.search()
  }, 300)
}

onMounted(async () => {
  if (query.value) {
    searchStore.setQuery(query.value)
  }
  await searchStore.search()
  requestAnimationFrame(() => {
    mounted.value = true
  })
})

useHead({ title: 'Buscar servicios - CERCU' })
</script>

<style lang="scss" scoped>
.search-page {
  padding: 1.25rem 0 3rem;

  @media (min-width: 768px) {
    padding: 2rem 0 4rem;
  }
}

// ─── Header ───
.search-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }

  @media (min-width: 768px) {
    margin-bottom: 1.25rem;
  }
}

.page-title {
  font-family: $headings-font-family;
  font-size: 1.25rem;
  font-weight: 700;
  color: $neutral-900;
  margin-bottom: 0.125rem;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
}

.page-subtitle {
  font-size: 0.8rem;
  color: $neutral-500;
  margin-bottom: 0;
}

.btn-view-toggle {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: $cercu-indigo;
  background: rgba($cercu-indigo, 0.06);
  border: 1px solid rgba($cercu-indigo, 0.15);
  border-radius: 10px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba($cercu-indigo, 0.1);
  }
}

// ─── Search Bar ───
.search-bar {
  margin-bottom: 1.5rem;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s ease 0.05s, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.05s;

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-bar-icon {
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: $neutral-400;
  pointer-events: none;
}

.search-bar-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  font-size: 0.9rem;
  border: 1px solid $neutral-200;
  border-radius: 12px;
  background: white;
  color: $neutral-800;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder {
    color: $neutral-400;
  }

  &:focus {
    outline: none;
    border-color: $cercu-indigo;
    box-shadow: 0 0 0 3px rgba($cercu-indigo, 0.08);
  }
}

// ─── Results Grid ───
.results-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  @media (min-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.result-item {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-card {
  background: white;
  border: 1px solid $neutral-100;
  border-radius: 14px;
  padding: 1.125rem;
  height: 100%;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease, border-color 0.25s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    border-color: rgba($cercu-indigo, 0.2);
  }

  &:active {
    transform: translateY(-1px);
    transition-duration: 0.1s;
  }
}

.result-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.result-card-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba($cercu-indigo, 0.08) 0%, rgba($cercu-indigo, 0.15) 100%);
  color: $cercu-indigo;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.result-card-title {
  font-weight: 600;
  color: $neutral-800;
  margin-bottom: 0.125rem;
  font-size: 0.9rem;
}

.result-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: $cercu-coral;
}

.result-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.result-chip {
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 500;
  background: $neutral-50;
  color: $neutral-600;

  &--more {
    background: rgba($cercu-indigo, 0.06);
    color: $cercu-indigo;
  }
}
</style>
