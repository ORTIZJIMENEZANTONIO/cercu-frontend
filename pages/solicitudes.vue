<template>
  <div class="solicitudes-page">
    <div class="container py-4">
      <div class="page-header" :class="{ 'anim-in': mounted }">
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <h1 class="page-title">Mis solicitudes</h1>
            <p class="page-subtitle">Seguimiento de tus servicios solicitados</p>
          </div>
          <NuxtLink to="/solicitar" class="btn btn-primary btn-press d-none d-sm-inline-flex">
            <Icon name="mdi:plus" class="me-1" size="18" />
            Nueva solicitud
          </NuxtLink>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-if="leadsStore.userLeadsLoading" class="d-flex flex-column gap-3">
        <div v-for="i in 3" :key="i" class="lead-skeleton" :class="{ 'anim-in': mounted }" :style="{ transitionDelay: `${0.1 + i * 0.08}s` }">
          <div class="skel-circle" />
          <div class="skel-lines">
            <div class="skel-line w-50" />
            <div class="skel-line w-75" />
            <div class="skel-line w-25" />
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="!pendingLeads.length && !takenLeads.length" class="empty-card" :class="{ 'anim-in': mounted }">
        <div class="empty-illustration">
          <div class="empty-radar">
            <div class="radar-ring radar-ring-1" />
            <div class="radar-ring radar-ring-2" />
            <div class="radar-ring radar-ring-3" />
            <div class="empty-radar-icon">
              <Icon name="mdi:clipboard-text-search-outline" size="32" />
            </div>
          </div>
        </div>
        <h3 class="empty-title">Sin solicitudes activas</h3>
        <p class="empty-text">Cuando solicites un servicio, podras ver aqui el estado y seguimiento en tiempo real.</p>
        <NuxtLink to="/solicitar" class="btn btn-primary btn-press">
          <Icon name="mdi:plus-circle" class="me-1" size="18" />
          Solicitar servicio
        </NuxtLink>
        <div class="empty-categories mt-4">
          <p class="empty-categories-label">Servicios populares</p>
          <div class="d-flex flex-wrap justify-content-center gap-2">
            <NuxtLink
              v-for="cat in popularCategories"
              :key="cat.slug"
              :to="`/categorias/${cat.slug}`"
              class="popular-chip"
            >
              <Icon :name="cat.icon" size="14" class="me-1" />
              {{ cat.name }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Leads list -->
      <div v-else class="leads-list">
        <!-- Pending leads (searching) -->
        <div
          v-for="(lead, i) in pendingLeads"
          :key="'p-' + lead.id"
          class="lead-card"
          :class="{ 'anim-in': mounted }"
          :style="{ transitionDelay: `${0.1 + i * 0.08}s` }"
        >
          <div class="lead-card-inner">
            <div class="lead-radar-wrap">
              <div class="radar-container">
                <div class="radar-ring radar-ring-1" />
                <div class="radar-ring radar-ring-2" />
                <div class="radar-ring radar-ring-3" />
                <div class="radar-dot" />
              </div>
            </div>
            <div class="lead-info">
              <div class="d-flex align-items-center gap-2 mb-1">
                <span class="lead-category">{{ lead.categoryName || 'Servicio' }}</span>
                <span :class="['badge', urgencyBadgeClass(lead.urgencyTier)]">{{ urgencyLabel(lead.urgencyTier) }}</span>
              </div>
              <p class="lead-desc">{{ lead.description }}</p>
              <div v-if="lead.chips?.length" class="lead-chips mb-2">
                <span v-for="(chip, ci) in lead.chips.slice(0, 3)" :key="ci" class="lead-chip">{{ chip }}</span>
                <span v-if="lead.chips.length > 3" class="lead-chip lead-chip-more">+{{ lead.chips.length - 3 }}</span>
              </div>
              <div class="lead-meta">
                <span class="searching-text">
                  <span class="searching-dot" />
                  Buscando profesionales{{ searchDots }}
                </span>
                <span v-if="lead.createdAt" class="lead-date">
                  <Icon name="mdi:clock-outline" size="13" class="me-1" />
                  {{ timeAgo(lead.createdAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Taken leads (matched) -->
        <div
          v-for="(lead, i) in takenLeads"
          :key="'t-' + lead.id"
          class="lead-card lead-card-taken"
          :class="{ 'anim-in': mounted }"
          :style="{ transitionDelay: `${0.1 + (pendingLeads.length + i) * 0.08}s` }"
        >
          <div class="lead-card-inner">
            <div class="lead-status-icon lead-status-matched">
              <Icon name="mdi:account-check" size="22" />
            </div>
            <div class="lead-info">
              <div class="d-flex align-items-center gap-2 mb-1">
                <span class="lead-category">{{ lead.categoryName || 'Servicio' }}</span>
                <span class="badge badge-matched">Profesional asignado</span>
              </div>
              <p class="lead-desc">{{ lead.description }}</p>
              <div class="lead-meta">
                <span v-if="lead.professional?.name" class="lead-pro-name">
                  <Icon name="mdi:account-hard-hat" size="13" class="me-1" />
                  {{ lead.professional.name }}
                </span>
                <span v-if="lead.createdAt" class="lead-date">
                  <Icon name="mdi:clock-outline" size="13" class="me-1" />
                  {{ timeAgo(lead.createdAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile FAB -->
      <NuxtLink to="/solicitar" class="fab-solicitar d-sm-none" :class="{ 'anim-in': mounted }">
        <Icon name="mdi:plus" size="24" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const authStore = useAuthStore()
const leadsStore = useLeadsStore()
const mounted = ref(false)
const searchDots = ref('')

const popularCategories = [
  { name: 'Plomeria', slug: 'plomeria', icon: 'mdi:pipe-wrench' },
  { name: 'Electricidad', slug: 'electricidad', icon: 'mdi:flash' },
  { name: 'Limpieza', slug: 'limpieza', icon: 'mdi:broom' },
  { name: 'Cerrajeria', slug: 'cerrajeria', icon: 'mdi:key-variant' },
]

const pendingLeads = computed(() =>
  leadsStore.userLeads.filter((l: any) =>
    l.status === 'pending' || l.status === 'open' || l.status === 'viewed' || l.status === 'matched'
  )
)

const takenLeads = computed(() =>
  leadsStore.userLeads.filter((l: any) => l.status === 'taken')
)

function urgencyLabel(tier: string) {
  return { standard: 'Estandar', today: 'Hoy', immediate: 'Inmediato' }[tier] || tier
}

function urgencyBadgeClass(tier: string) {
  return { standard: 'bg-info', today: 'bg-warning', immediate: 'bg-danger' }[tier] || 'bg-secondary'
}

function timeAgo(dateStr: string) {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMin = Math.floor((now - then) / 60000)
  if (diffMin < 1) return 'Justo ahora'
  if (diffMin < 60) return `Hace ${diffMin} min`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `Hace ${diffH}h`
  const diffD = Math.floor(diffH / 24)
  return `Hace ${diffD}d`
}

let dotsInterval: ReturnType<typeof setInterval>

onMounted(async () => {
  requestAnimationFrame(() => { mounted.value = true })

  let count = 0
  dotsInterval = setInterval(() => {
    count = (count + 1) % 4
    searchDots.value = '.'.repeat(count)
  }, 500)

  leadsStore.fetchUserLeads()
})

onUnmounted(() => {
  clearInterval(dotsInterval)
})

useHead({ title: 'Mis solicitudes - CERCU' })
</script>

<style lang="scss" scoped>
.solicitudes-page {
  min-height: 100vh;
  background: #F7F7FB;
  padding-bottom: 5rem;
}

.page-header {
  margin-bottom: 1.5rem;
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
  font-size: 1.5rem;
  font-weight: 700;
  color: $neutral-900;
  margin-bottom: 0.25rem;
}

.page-subtitle {
  font-size: 0.875rem;
  color: $neutral-600;
  margin-bottom: 0;
}

// ─── Lead cards ───
.leads-list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.lead-card {
  background: white;
  border: 1px solid $neutral-200;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease;

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
}

.lead-card-taken {
  border-left: 4px solid $success;
}

.lead-card-inner {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
}

.lead-info {
  flex: 1;
  min-width: 0;
}

.lead-category {
  font-weight: 600;
  font-size: 0.95rem;
  color: $neutral-900;
}

.lead-desc {
  font-size: 0.85rem;
  color: $neutral-500;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.lead-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.lead-chip {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  font-size: 0.7rem;
  font-weight: 500;
  color: $cercu-indigo;
  background: rgba($cercu-indigo, 0.06);
  border: 1px solid rgba($cercu-indigo, 0.15);
  border-radius: 999px;
}

.lead-chip-more {
  color: $neutral-400;
}

.lead-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.75rem;
  color: $neutral-400;
}

.lead-date {
  display: inline-flex;
  align-items: center;
}

.lead-pro-name {
  display: inline-flex;
  align-items: center;
  color: $cercu-indigo;
  font-weight: 500;
}

// ─── Radar animation ───
.lead-radar-wrap {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radar-container {
  position: relative;
  width: 48px;
  height: 48px;
}

.radar-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba($cercu-indigo, 0.15);
  animation: radar-pulse 2.4s ease-out infinite;
}

.radar-ring-1 { animation-delay: 0s; }
.radar-ring-2 { animation-delay: 0.8s; }
.radar-ring-3 { animation-delay: 1.6s; }

.radar-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 14px;
  height: 14px;
  margin: -7px 0 0 -7px;
  border-radius: 50%;
  background: $cercu-indigo;
  box-shadow: 0 0 8px rgba($cercu-indigo, 0.4);
  animation: radar-dot-pulse 1.8s ease-in-out infinite;
}

@keyframes radar-pulse {
  0% {
    transform: scale(0.3);
    opacity: 0.8;
    border-color: rgba($cercu-indigo, 0.4);
  }
  100% {
    transform: scale(1.1);
    opacity: 0;
    border-color: rgba($cercu-indigo, 0);
  }
}

@keyframes radar-dot-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 8px rgba($cercu-indigo, 0.4);
  }
  50% {
    transform: scale(1.2);
    box-shadow: 0 0 16px rgba($cercu-indigo, 0.6);
  }
}

// ─── Searching text ───
.searching-text {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: $cercu-indigo;
  font-weight: 500;
  font-family: monospace;
  letter-spacing: -0.3px;
}

.searching-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: $cercu-indigo;
  animation: searching-blink 1.2s ease-in-out infinite;
}

@keyframes searching-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

// ─── Matched ───
.badge-matched {
  background: rgba($success, 0.12);
  color: $success;
  font-weight: 600;
}

.lead-status-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lead-status-matched {
  background: rgba($success, 0.1);
  color: $success;
  border: 1px solid rgba($success, 0.2);
}

// ─── Empty state ───
.empty-card {
  background: white;
  border: 1px solid $neutral-200;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  padding: 3rem 1.5rem;
  text-align: center;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease 0.1s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.1s;

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.empty-illustration {
  margin-bottom: 1.5rem;
}

.empty-radar {
  position: relative;
  width: 96px;
  height: 96px;
  margin: 0 auto;
}

.empty-radar .radar-ring {
  border-color: rgba($neutral-400, 0.15);
}

.empty-radar-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: white;
  border: 1px solid $neutral-200;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $neutral-400;
}

.empty-title {
  font-family: $headings-font-family;
  font-size: 1.15rem;
  font-weight: 700;
  color: $neutral-800;
  margin-bottom: 0.5rem;
}

.empty-text {
  font-size: 0.875rem;
  color: $neutral-500;
  max-width: 360px;
  margin: 0 auto 1.25rem;
  line-height: 1.6;
}

.empty-categories-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: $neutral-400;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.popular-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.875rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: $neutral-600;
  text-decoration: none;
  background: white;
  border: 1px solid $neutral-200;
  border-radius: 999px;
  transition: color 0.2s ease, background 0.2s ease, transform 0.15s ease;

  &:hover {
    color: $cercu-indigo;
    transform: translateY(-2px);
    background: $neutral-50;
    border-color: rgba($cercu-indigo, 0.3);
  }
}

// ─── FAB (mobile) ───
.fab-solicitar {
  position: fixed;
  bottom: 1.25rem;
  right: 1.25rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: $cercu-indigo;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-shadow: 0 4px 16px rgba($cercu-indigo, 0.4);
  z-index: 1020;
  opacity: 0;
  transform: scale(0.5);
  transition: opacity 0.4s ease 0.5s, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s, box-shadow 0.2s ease;

  &.anim-in {
    opacity: 1;
    transform: scale(1);
  }

  &:hover {
    color: white;
    box-shadow: 0 6px 24px rgba($cercu-indigo, 0.5);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: 0 2px 8px rgba($cercu-indigo, 0.3);
  }
}

// ─── Skeleton ───
.lead-skeleton {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 16px;
  border: 1px solid $neutral-200;
  background: white;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.skel-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(90deg, $neutral-100 25%, $neutral-50 50%, $neutral-100 75%);
  background-size: 200% 100%;
  animation: skel-shimmer 1.5s ease-in-out infinite;
  flex-shrink: 0;
}

.skel-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skel-line {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, $neutral-100 25%, $neutral-50 50%, $neutral-100 75%);
  background-size: 200% 100%;
  animation: skel-shimmer 1.5s ease-in-out infinite;
}

@keyframes skel-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
