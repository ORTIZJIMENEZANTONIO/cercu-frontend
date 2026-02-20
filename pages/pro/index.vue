<template>
  <div>
    <div class="page-header d-flex justify-content-between align-items-center mb-4" :class="{ 'anim-in': mounted }">
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
const toast = useToast()

const mounted = ref(false)

onMounted(async () => {
  requestAnimationFrame(() => { mounted.value = true })
  await Promise.all([
    leadsStore.fetchProLeads().catch(() => {}),
    proStore.fetchProfile().catch(() => {}),
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
