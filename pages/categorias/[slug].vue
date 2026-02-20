<template>
  <div class="category-detail">
    <AppSpinner v-if="loading" full-page />
    <template v-else-if="category">
      <!-- Category Hero -->
      <section class="category-hero">
        <div class="container">
          <nav aria-label="breadcrumb" class="mb-3">
            <ol class="breadcrumb-custom">
              <li><NuxtLink to="/categorias">Categorias</NuxtLink></li>
              <li class="active">{{ category.name }}</li>
            </ol>
          </nav>

          <div class="category-heading" :class="{ 'anim-in': mounted }">
            <div class="category-icon-lg">
              <Icon :name="category.icon || 'mdi:wrench'" size="32" />
            </div>
            <div>
              <h1 class="category-title">{{ category.name }}</h1>
              <div class="category-meta">
                <span v-if="category.type === 'emergency'" class="category-badge category-badge--urgent">
                  <Icon name="mdi:lightning-bolt" size="14" />
                  Emergencia disponible
                </span>
                <span class="category-badge">
                  <Icon name="mdi:clipboard-list" size="14" />
                  {{ category.chips?.length || 0 }} servicios
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="container category-body">
        <div class="row g-4">
          <!-- Main Content -->
          <div class="col-lg-8">
            <!-- Chips Section -->
            <div class="content-card" :class="{ 'anim-in': mounted }">
              <h5 class="content-card-title">
                <Icon name="mdi:tag-multiple" size="20" class="me-2 text-indigo" />
                Servicios disponibles
              </h5>
              <div class="chips-grid">
                <span
                  v-for="chip in category.chips"
                  :key="chip.id"
                  class="service-chip"
                >
                  {{ chip.label }}
                </span>
              </div>
            </div>

            <!-- Pricing Section -->
            <div class="content-card" :class="{ 'anim-in': mounted }" style="transition-delay: 0.15s">
              <h5 class="content-card-title">
                <Icon name="mdi:currency-usd" size="20" class="me-2 text-indigo" />
                Precios de referencia
              </h5>
              <div class="pricing-grid">
                <div
                  v-for="price in category.pricing"
                  :key="price.id"
                  class="pricing-card"
                  :class="`pricing-card--${price.urgencyTier}`"
                >
                  <div class="pricing-tier">
                    <Icon :name="urgencyIcon(price.urgencyTier)" size="16" />
                    {{ urgencyLabel(price.urgencyTier) }}
                  </div>
                  <div class="pricing-amount">${{ price.priceMXN }}</div>
                  <div class="pricing-currency">MXN por lead</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-lg-4">
            <div class="cta-sidebar" :class="{ 'anim-in': mounted }" style="transition-delay: 0.25s">
              <div class="cta-sidebar-icon">
                <Icon name="mdi:rocket-launch" size="28" />
              </div>
              <h5 class="cta-sidebar-title">Necesitas este servicio?</h5>
              <p class="cta-sidebar-desc">
                Describe tu necesidad y conecta con profesionales verificados cerca de ti.
              </p>
              <NuxtLink
                :to="{ path: '/solicitar', query: { categoria: category.slug } }"
                class="btn btn-cta-primary btn-press w-100"
              >
                Solicitar servicio
                <Icon name="mdi:arrow-right" class="ms-2 cta-arrow" size="18" />
              </NuxtLink>
              <div class="cta-trust-row">
                <div class="cta-trust-item">
                  <Icon name="mdi:shield-check" size="16" />
                  <span>Verificados</span>
                </div>
                <div class="cta-trust-item">
                  <Icon name="mdi:clock-fast" size="16" />
                  <span>Rapido</span>
                </div>
                <div class="cta-trust-item">
                  <Icon name="mdi:cash-multiple" size="16" />
                  <span>Sin costo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const categoriesStore = useCategoriesStore()
const loading = ref(true)
const mounted = ref(false)
const category = ref<any>(null)

onMounted(async () => {
  try {
    category.value = await categoriesStore.fetchById(route.params.slug as string)
  } finally {
    loading.value = false
    requestAnimationFrame(() => {
      mounted.value = true
    })
  }
})

function urgencyLabel(tier: string) {
  const map: Record<string, string> = {
    standard: 'Estandar',
    today: 'Hoy',
    immediate: 'Inmediato',
  }
  return map[tier] || tier
}

function urgencyIcon(tier: string) {
  const map: Record<string, string> = {
    standard: 'mdi:clock-outline',
    today: 'mdi:clock-fast',
    immediate: 'mdi:lightning-bolt',
  }
  return map[tier] || 'mdi:clock-outline'
}

useHead({ title: () => `${category.value?.name || 'Categoria'} - CERCU` })
</script>

<style lang="scss" scoped>
// ─── Hero ───
.category-hero {
  background: $neutral-50;
  border-bottom: 1px solid $neutral-100;
  padding: 1.5rem 0;

  @media (min-width: 768px) {
    padding: 2rem 0;
  }
}

.breadcrumb-custom {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;

  li {
    color: $neutral-400;

    a {
      color: $cercu-indigo;
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }

    &::before {
      content: '/';
      margin-right: 0.5rem;
      color: $neutral-300;
    }

    &:first-child::before {
      display: none;
    }

    &.active {
      color: $neutral-600;
      font-weight: 500;
    }
  }
}

.category-heading {
  display: flex;
  align-items: center;
  gap: 1rem;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-icon-lg {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba($cercu-indigo, 0.08) 0%, rgba($cercu-indigo, 0.15) 100%);
  color: $cercu-indigo;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (min-width: 768px) {
    width: 68px;
    height: 68px;
  }
}

.category-title {
  font-family: $headings-font-family;
  font-size: 1.5rem;
  font-weight: 700;
  color: $neutral-900;
  margin-bottom: 0.375rem;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
}

.category-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: $neutral-100;
  color: $neutral-600;

  &--urgent {
    background: rgba($cercu-coral, 0.1);
    color: $cercu-coral;
  }
}

// ─── Body ───
.category-body {
  padding: 1.5rem 0 3rem;

  @media (min-width: 768px) {
    padding: 2rem 0 4rem;
  }
}

// ─── Content Card ───
.content-card {
  background: white;
  border: 1px solid $neutral-100;
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);

  @media (min-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.25rem;
  }

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.content-card-title {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  color: $neutral-800;
  margin-bottom: 1rem;
}

.text-indigo {
  color: $cercu-indigo;
}

// ─── Chips ───
.chips-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.service-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.875rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
  background: $neutral-50;
  color: $neutral-700;
  border: 1px solid $neutral-200;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background: rgba($cercu-indigo, 0.06);
    border-color: rgba($cercu-indigo, 0.2);
    color: $cercu-indigo;
    transform: translateY(-1px);
  }
}

// ─── Pricing ───
.pricing-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  @media (min-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
}

.pricing-card {
  background: $neutral-50;
  border: 1px solid $neutral-200;
  border-radius: 14px;
  padding: 1.25rem;
  text-align: center;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  }

  &--immediate {
    border-color: rgba($cercu-coral, 0.3);
    background: rgba($cercu-coral, 0.04);

    .pricing-tier {
      color: $cercu-coral;
    }
  }

  &--today {
    border-color: rgba($warning, 0.3);
    background: rgba($warning, 0.04);

    .pricing-tier {
      color: $warning;
    }
  }
}

.pricing-tier {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: $cercu-indigo;
  margin-bottom: 0.5rem;
}

.pricing-amount {
  font-family: $headings-font-family;
  font-size: 1.75rem;
  font-weight: 700;
  color: $neutral-900;
  line-height: 1.2;
}

.pricing-currency {
  font-size: 0.75rem;
  color: $neutral-400;
  margin-top: 0.125rem;
}

// ─── CTA Sidebar ───
.cta-sidebar {
  background: white;
  border: 1px solid $neutral-100;
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  position: sticky;
  top: 80px;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease 0.25s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.25s;

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.cta-sidebar-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba($cercu-indigo, 0.08) 0%, rgba($cercu-indigo, 0.15) 100%);
  color: $cercu-indigo;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.cta-sidebar-title {
  font-weight: 700;
  color: $neutral-900;
  margin-bottom: 0.5rem;
}

.cta-sidebar-desc {
  font-size: 0.875rem;
  color: $neutral-500;
  margin-bottom: 1.25rem;
  line-height: 1.5;
}

.btn-cta-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 12px;
  background: $cercu-indigo;
  color: white;
  border: none;
  box-shadow: 0 4px 14px rgba($cercu-indigo, 0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba($cercu-indigo, 0.35);
    background: $cercu-indigo-dark;
    color: white;
  }

  .cta-arrow {
    transition: transform 0.2s ease;
  }

  &:hover .cta-arrow {
    transform: translateX(3px);
  }
}

.cta-trust-row {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid $neutral-100;
}

.cta-trust-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  font-weight: 500;
  color: $neutral-400;
}
</style>
