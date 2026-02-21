<template>
  <div>
    <NuxtLink to="/pro" class="btn btn-link ps-0 mb-3 btn-press">
      <Icon name="mdi:arrow-left" class="me-1" /> Volver al inbox
    </NuxtLink>

    <AppSpinner v-if="loading" full-page />
      <Transition name="fade" appear>
        <template v-if="!loading && lead">
          <div>
            <div class="card main-card p-4 mb-4" :class="{ 'anim-in': mounted }">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h2 class="h5 fw-bold mb-1">{{ lead.lead.categoryName }}</h2>
                  <span :class="['badge', urgencyBadge]">{{ urgencyLabel }}</span>
                </div>
                <div class="text-end">
                  <div class="h4 fw-bold text-brand">${{ lead.lead.priceMXN }} MXN</div>
                  <small class="text-muted">Costo del lead</small>
                </div>
              </div>

              <div class="mb-3">
                <h6 class="fw-semibold">Descripcion</h6>
                <p>{{ lead.lead.description }}</p>
              </div>

              <div v-if="lead.lead.chips?.length" class="mb-3">
                <h6 class="fw-semibold">Servicios solicitados</h6>
                <div class="d-flex flex-wrap gap-2">
                  <span v-for="(chip, i) in lead.lead.chips" :key="i" class="btn-chip active chip-bounce">{{ chip }}</span>
                </div>
              </div>

              <div v-if="lead.lead.conditionalFields?.length" class="mb-3">
                <h6 class="fw-semibold">Detalles adicionales</h6>
                <ul class="list-unstyled">
                  <li v-for="(f, i) in lead.lead.conditionalFields" :key="i">
                    <strong>{{ f.label }}:</strong> {{ f.value }}
                  </li>
                </ul>
              </div>

              <div v-if="lead.lead.photos?.length" class="mb-3">
                <h6 class="fw-semibold">Fotos</h6>
                <div class="d-flex flex-wrap gap-2">
                  <img v-for="(p, i) in lead.lead.photos" :key="i" :src="p" class="lead-photo rounded" />
                </div>
              </div>

              <div class="mb-3">
                <div class="d-flex gap-3 text-muted small">
                  <span><Icon name="mdi:map-marker" size="14" /> {{ lead.distanceKm }}km</span>
                  <span><Icon name="mdi:star" size="14" class="text-warning" /> Score: {{ lead.score }}</span>
                </div>
              </div>

              <!-- Contact info (only if taken) -->
              <Transition name="slide-up">
                <div v-if="takenData" ref="contactCard" class="alert alert-success contact-reveal">
                  <h6 class="fw-semibold mb-2">
                    <Icon name="mdi:phone-check" class="me-1" />
                    Informacion de contacto
                  </h6>
                  <p class="mb-1"><strong>Nombre:</strong> {{ takenData.lead.user.name }}</p>
                  <p class="mb-1"><strong>Telefono:</strong> {{ takenData.lead.user.phone }}</p>
                  <p class="mb-0"><strong>Direccion:</strong> {{ takenData.lead.address }}</p>
                </div>
              </Transition>

              <!-- Actions -->
              <div v-if="!takenData" class="d-flex gap-2 mt-3">
                <AppButton variant="outline-secondary" @click="handleDecline">
                  Declinar
                </AppButton>
                <AppButton variant="primary" class="flex-grow-1" @click="showTakeModal = true">
                  <Icon name="mdi:hand-pointing-right" class="me-1" />
                  Tomar lead por ${{ lead.lead.priceMXN }} MXN
                </AppButton>
              </div>
            </div>
          </div>
        </template>
      </Transition>

      <!-- Take modal -->
      <AppConfirmDialog
        v-model="showTakeModal"
        title="Tomar este lead?"
        :message="`Se debitaran $${lead?.lead?.priceMXN || 0} MXN de tu wallet. Recibiras la informacion de contacto del cliente.`"
        type="warning"
        confirm-text="Confirmar"
        cancel-text="Cancelar"
        :loading="taking"
        @confirm="handleTake"
      />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'professional', middleware: ['role'] })

const route = useRoute()
const leadsStore = useLeadsStore()
const toast = useToast()
const { celebrationBurst } = useAnimations()

const loading = ref(true)
const lead = ref<any>(null)
const takenData = ref<any>(null)
const showTakeModal = ref(false)
const taking = ref(false)
const mounted = ref(false)
const contactCard = ref<HTMLElement>()

onMounted(async () => {
  try {
    lead.value = await leadsStore.fetchLeadPreview(Number(route.params.id))
  } finally {
    loading.value = false
    nextTick(() => {
      requestAnimationFrame(() => { mounted.value = true })
    })
  }
})

const urgencyLabel = computed(() => {
  const tier = lead.value?.lead?.urgencyTier
  return { standard: 'Estandar', today: 'Hoy', immediate: 'Inmediato' }[tier] || tier
})

const urgencyBadge = computed(() => {
  const tier = lead.value?.lead?.urgencyTier
  return { standard: 'bg-info', today: 'bg-warning', immediate: 'bg-danger' }[tier] || 'bg-secondary'
})

async function handleTake() {
  taking.value = true
  try {
    takenData.value = await leadsStore.takeLead(Number(route.params.id))
    showTakeModal.value = false
    toast.success('Lead tomado! Ya puedes contactar al cliente.')

    // Celebration animation
    nextTick(() => {
      if (contactCard.value) celebrationBurst(contactCard.value)
    })
  } catch (e: any) {
    const msg = e?.data?.error?.message
    if (msg === 'Insufficient wallet balance') {
      toast.error('Saldo insuficiente en tu wallet. Recarga para tomar este lead.')
    } else if (msg === 'Profile onboarding not complete') {
      toast.error('Tu perfil aún no ha sido aprobado. Completa tu onboarding primero.')
    } else if (msg === 'Wallet is frozen') {
      toast.error('Tu wallet está congelada. Contacta soporte.')
    } else if (msg === 'Lead is no longer available') {
      toast.error('Este lead ya no está disponible.')
    } else {
      toast.error(msg || 'Error al tomar lead')
    }
  } finally {
    taking.value = false
  }
}

async function handleDecline() {
  await leadsStore.declineLead(Number(route.params.id))
  toast.info('Lead declinado')
  navigateTo('/pro')
}
</script>

<style lang="scss" scoped>
.main-card {
  background: white;
  border: 1px solid $neutral-200;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.lead-photo {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid $neutral-200;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;

  &:hover {
    transform: scale(1.08);
  }
}

.contact-reveal {
  position: relative;
  overflow: hidden;
}
</style>
