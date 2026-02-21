<template>
  <div>
    <div class="page-header d-flex justify-content-between align-items-center mb-3" :class="{ 'anim-in': mounted }">
      <h1 class="h4 fw-bold mb-0">Inbox de Leads</h1>
      <div class="d-flex align-items-center gap-3">
        <span class="text-muted small">{{ leadsStore.stats.total }} leads</span>
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            :checked="proStore.profile?.isAvailable"
            @change="toggleAvailable"
          />
          <label class="form-check-label small">Disponible</label>
        </div>
      </div>
    </div>

    <!-- Gamification Quick Summary -->
    <div class="gam-strip mb-3" :class="{ 'anim-in': mounted }" style="transition-delay: 0.05s">
      <NuxtLink to="/pro/gamificacion" class="gam-strip-item text-decoration-none">
        <div class="gam-strip-icon"><Icon name="mdi:shield-star" size="18" /></div>
        <div class="gam-strip-info">
          <span class="gam-strip-value">{{ gamStore.dashboard?.levelName || 'Bronce' }}</span>
          <span class="gam-strip-label">Nivel</span>
        </div>
      </NuxtLink>
      <NuxtLink to="/pro/gamificacion" class="gam-strip-item text-decoration-none">
        <div class="gam-strip-icon gam-strip-icon--xp"><Icon name="mdi:star-four-points" size="18" /></div>
        <div class="gam-strip-info">
          <span class="gam-strip-value">{{ gamStore.totalXP }} XP</span>
          <span class="gam-strip-label">Total</span>
        </div>
      </NuxtLink>
      <NuxtLink to="/pro/planes" class="gam-strip-item text-decoration-none">
        <div class="gam-strip-icon gam-strip-icon--plan"><Icon name="mdi:crown" size="18" /></div>
        <div class="gam-strip-info">
          <span class="gam-strip-value">{{ plansStore.currentPlan?.name || 'Starter' }}</span>
          <span class="gam-strip-label">Plan</span>
        </div>
      </NuxtLink>
      <NuxtLink v-if="boostsStore.hasActiveBoost" to="/pro/boosts" class="gam-strip-item gam-strip-item--boost text-decoration-none">
        <div class="gam-strip-icon gam-strip-icon--boost"><Icon name="mdi:rocket-launch" size="18" /></div>
        <div class="gam-strip-info">
          <span class="gam-strip-value">+{{ boostsStore.totalBoostBonus }}</span>
          <span class="gam-strip-label">Boost activo</span>
        </div>
      </NuxtLink>
    </div>

    <!-- Active Missions Quick View -->
    <div v-if="gamStore.activeMissions.length" class="missions-quick mb-3" :class="{ 'anim-in': mounted }" style="transition-delay: 0.1s">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="missions-quick-title"><Icon name="mdi:target" size="16" class="me-1 text-indigo" /> Misiones activas</span>
        <NuxtLink to="/pro/gamificacion" class="small text-indigo text-decoration-none">Ver todas</NuxtLink>
      </div>
      <div class="missions-quick-list">
        <div v-for="m in gamStore.activeMissions.slice(0, 2)" :key="m.id" class="mission-mini">
          <div class="mission-mini-name">{{ m.name }}</div>
          <div class="mission-mini-bar">
            <div class="mission-mini-fill" :style="{ width: (m.current / m.target * 100) + '%' }"></div>
          </div>
          <span class="mission-mini-count">{{ m.current }}/{{ m.target }}</span>
        </div>
      </div>
    </div>

    <AppSpinner v-if="leadsStore.loading" full-page />
      <Transition name="fade">
        <AppEmptyState
          v-if="!leadsStore.loading && leadsStore.leads.length === 0"
          icon="mdi:inbox"
          title="No hay leads disponibles"
          description="Cuando un usuario solicite un servicio en tu zona, aparecera aqui."
        />
      </Transition>
      <TransitionGroup v-if="leadsStore.leads.length > 0" name="slide-up" tag="div" class="d-flex flex-column gap-3">
        <div
          v-for="(match, index) in leadsStore.leads"
          :key="match.matchId"
          class="lead-card card card-interactive p-3"
          :class="{ 'lead-card--urgent': match.lead.urgencyTier === 'immediate' }"
          :style="{ transitionDelay: `${index * 0.06}s` }"
        >
          <NuxtLink :to="`/pro/leads/${match.lead.id}`" class="text-decoration-none text-dark">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <div class="d-flex align-items-center gap-2 mb-1">
                  <Icon :name="match.lead.categoryIcon || 'mdi:wrench'" class="text-brand" />
                  <strong>{{ match.lead.categoryName }}</strong>
                  <AppStatusPill :status="match.lead.status" />
                </div>
                <div class="d-flex flex-wrap gap-1 mb-2">
                  <TransitionGroup name="pop">
                    <span v-for="(chip, i) in match.lead.chips" :key="i" class="badge bg-light text-dark small">
                      {{ chip }}
                    </span>
                  </TransitionGroup>
                </div>
                <div class="text-muted small">
                  <Icon name="mdi:map-marker" size="14" class="me-1" />
                  {{ match.distanceKm }}km de distancia
                  <span class="mx-2">|</span>
                  <Icon name="mdi:star" size="14" class="me-1 text-warning" />
                  Score: {{ match.score }}
                </div>
              </div>
              <div class="text-end">
                <div class="h5 fw-bold text-brand mb-0">${{ match.lead.priceMXN }}</div>
                <span :class="['badge', urgencyBadge(match.lead.urgencyTier)]">
                  {{ urgencyLabel(match.lead.urgencyTier) }}
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'professional', middleware: ['role'] })

const leadsStore = useLeadsStore()
const proStore = useProfessionalStore()
const authStore = useAuthStore()
const gamStore = useGamificationStore()
const plansStore = usePlansStore()
const boostsStore = useBoostsStore()
const toast = useToast()

const mounted = ref(false)

onMounted(async () => {
  requestAnimationFrame(() => { mounted.value = true })
  await Promise.all([
    leadsStore.fetchProLeads().catch(() => {}),
    proStore.fetchProfile().catch(() => {}),
    gamStore.fetchDashboard().catch(() => {}),
    gamStore.fetchMissions().catch(() => {}),
    plansStore.fetchCurrentSubscription().catch(() => {}),
    boostsStore.fetchActiveBoosts().catch(() => {}),
  ])
  if (proStore.profileMissing && !authStore.isAdmin) {
    return navigateTo('/pro/onboarding')
  }
})

async function toggleAvailable() {
  const newVal = !proStore.profile?.isAvailable
  try {
    await proStore.toggleAvailability(newVal)
    toast.success(newVal ? 'Ahora estas disponible' : 'Estas no disponible')
  } catch {
    toast.error('Error al cambiar disponibilidad')
  }
}

function urgencyLabel(tier: string) {
  return { standard: 'Estandar', today: 'Hoy', immediate: 'Inmediato' }[tier] || tier
}

function urgencyBadge(tier: string) {
  return { standard: 'bg-info', today: 'bg-warning', immediate: 'bg-danger' }[tier] || 'bg-secondary'
}

useHead({ title: 'Dashboard Pro - CERCU' })
</script>

<style lang="scss" scoped>
.page-header {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

// ─── Gamification Strip ───
.gam-strip {
  display: flex;
  gap: 0.625rem;
  overflow-x: auto;
  scrollbar-width: none;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  &.anim-in { opacity: 1; transform: translateY(0); }
  &::-webkit-scrollbar { display: none; }
}

.gam-strip-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  background: white;
  border: 1px solid $neutral-200;
  border-radius: 12px;
  transition: background 0.2s ease, transform 0.15s ease;

  &:hover { background: $neutral-50; transform: translateY(-1px); }
  &--boost { background: linear-gradient(135deg, rgba($cercu-coral, 0.08), rgba($cercu-indigo, 0.06)); border-color: rgba($cercu-coral, 0.2); }
}

.gam-strip-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $neutral-50;
  border: 1px solid $neutral-100;
  color: $cercu-indigo;

  &--xp { color: $warning; }
  &--plan { color: $cercu-coral; }
  &--boost { color: $cercu-coral; }
}

.gam-strip-info { display: flex; flex-direction: column; }
.gam-strip-value { font-family: $headings-font-family; font-size: 0.8rem; font-weight: 700; color: $neutral-900; line-height: 1.2; }
.gam-strip-label { font-size: 0.625rem; color: $neutral-400; text-transform: uppercase; letter-spacing: 0.03em; }

// ─── Missions Quick View ───
.missions-quick {
  background: white;
  border: 1px solid $neutral-200;
  border-radius: 14px;
  padding: 0.875rem 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  &.anim-in { opacity: 1; transform: translateY(0); }
}

.missions-quick-title { font-size: 0.8rem; font-weight: 600; color: $neutral-700; }
.text-indigo { color: $cercu-indigo; }

.missions-quick-list { display: flex; flex-direction: column; gap: 0.5rem; }

.mission-mini {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mission-mini-name { font-size: 0.75rem; font-weight: 500; color: $neutral-700; flex-shrink: 0; min-width: 120px; }
.mission-mini-bar { flex: 1; height: 4px; background: $neutral-200; border-radius: 2px; overflow: hidden; }
.mission-mini-fill { height: 100%; background: $cercu-indigo; border-radius: 2px; transition: width 0.6s ease; }
.mission-mini-count { font-size: 0.65rem; font-weight: 600; color: $neutral-500; flex-shrink: 0; }

// ─── Leads ───
.lead-card {
  &.lead-card--urgent {
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, $cercu-coral, $danger);
      animation: urgentPulse 2s ease-in-out infinite;
    }
  }
}

@keyframes urgentPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
</style>
