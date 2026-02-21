<template>
  <div>
    <div class="page-header" :class="{ 'anim-in': mounted }">
      <h1 class="page-title">Mi Plan</h1>
      <p class="page-subtitle">Elige el plan que mejor se adapte a tu negocio</p>
    </div>

    <!-- Current subscription info -->
    <div v-if="plansStore.currentSubscription" class="content-card mb-3" :class="{ 'anim-in': mounted }">
      <div class="d-flex align-items-center gap-3">
        <div class="current-plan-icon">
          <Icon :name="currentPlanIcon" size="24" />
        </div>
        <div class="flex-grow-1">
          <h6 class="mb-0">Plan {{ plansStore.currentPlan?.name }}</h6>
          <p class="text-muted small mb-0">
            {{ plansStore.currentSubscription.status === 'active' ? 'Activo' : plansStore.currentSubscription.status }}
            <template v-if="plansStore.currentPlan?.slug !== 'starter'">
              &middot; Vence {{ formatDate(plansStore.currentSubscription.currentPeriodEnd) }}
            </template>
          </p>
        </div>
        <button
          v-if="plansStore.currentPlan?.slug !== 'starter'"
          class="btn btn-sm btn-outline-secondary btn-press"
          @click="handleCancel"
        >
          Cancelar
        </button>
      </div>
    </div>

    <!-- Plan cards -->
    <div class="plans-grid" :class="{ 'anim-in': mounted }" style="transition-delay: 0.1s">
      <PlanCard
        v-for="plan in plansStore.plans"
        :key="plan.id"
        :plan="plan"
        :current-plan-slug="plansStore.currentPlan?.slug"
        @select="handleSelectPlan"
      />
    </div>

    <!-- Confirm Modal -->
    <AppModal v-model="showConfirm" title="Confirmar cambio de plan">
      <p>
        {{ isUpgrade ? 'Mejorar' : 'Cambiar' }} a <strong>{{ selectedPlan?.name }}</strong>
        <template v-if="Number(selectedPlan?.priceMXN) > 0">
          por <strong>${{ Number(selectedPlan?.priceMXN) }}/mes</strong>
        </template>
      </p>
      <p v-if="isUpgrade" class="text-muted small">
        Se cobrará la diferencia de tu wallet inmediatamente.
      </p>
      <p v-else class="text-muted small">
        El cambio se aplicará al final de tu periodo actual.
      </p>
      <template #footer>
        <button class="btn btn-outline-secondary btn-press" @click="showConfirm = false">Cancelar</button>
        <button class="btn btn-primary btn-press" :disabled="subscribing" @click="confirmPlan">
          {{ subscribing ? 'Procesando...' : 'Confirmar' }}
        </button>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'professional', middleware: ['role'] });

const plansStore = usePlansStore();
const toast = useToast();
const mounted = ref(false);
const showConfirm = ref(false);
const selectedPlan = ref<any>(null);
const subscribing = ref(false);

const currentPlanIcon = computed(() => {
  const icons: Record<string, string> = { starter: 'mdi:account-circle', normal: 'mdi:star-circle', premium: 'mdi:crown' };
  return icons[plansStore.currentPlan?.slug] || 'mdi:star';
});

const isUpgrade = computed(() => {
  if (!selectedPlan.value || !plansStore.currentPlan) return false;
  const order: Record<string, number> = { starter: 0, normal: 1, premium: 2 };
  return (order[selectedPlan.value.slug] || 0) > (order[plansStore.currentPlan.slug] || 0);
});

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

function handleSelectPlan(plan: any) {
  selectedPlan.value = plan;
  showConfirm.value = true;
}

async function handleCancel() {
  try {
    await plansStore.cancelSubscription();
    toast.success('Suscripción cancelada');
  } catch (e: any) {
    toast.error(e?.data?.error?.message || 'Error al cancelar');
  }
}

async function confirmPlan() {
  subscribing.value = true;
  try {
    if (plansStore.currentSubscription) {
      await plansStore.changePlan(selectedPlan.value.id);
    } else {
      await plansStore.subscribe(selectedPlan.value.id);
    }
    toast.success('Plan actualizado');
    showConfirm.value = false;
  } catch (e: any) {
    toast.error(e?.data?.error?.message || 'Error al cambiar plan');
  } finally {
    subscribing.value = false;
  }
}

onMounted(() => {
  requestAnimationFrame(() => { mounted.value = true; });
  plansStore.fetchPlans();
  plansStore.fetchCurrentSubscription();
});

useHead({ title: 'Mi Plan - CERCU Pro' });
</script>

<style lang="scss" scoped>
.page-header {
  margin-bottom: 1.25rem;
  opacity: 0; transform: translateY(12px);
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  &.anim-in { opacity: 1; transform: translateY(0); }
}
.page-title { font-family: $headings-font-family; font-size: 1.375rem; font-weight: 700; color: $neutral-900; margin-bottom: 0.25rem; }
.page-subtitle { font-size: 0.875rem; color: $neutral-600; margin-bottom: 0; }

.content-card {
  background: white; border: 1px solid $neutral-200; border-radius: 16px; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  opacity: 0; transform: translateY(16px);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  &.anim-in { opacity: 1; transform: translateY(0); }
}

.current-plan-icon {
  width: 48px; height: 48px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  background: $neutral-50; color: $cercu-indigo; border: 1px solid $neutral-100;
}

.plans-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  opacity: 0; transform: translateY(16px);
  transition: opacity 0.5s ease 0.1s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.1s;
  &.anim-in { opacity: 1; transform: translateY(0); }

  @media (min-width: 768px) { grid-template-columns: repeat(3, 1fr); }
}
</style>
