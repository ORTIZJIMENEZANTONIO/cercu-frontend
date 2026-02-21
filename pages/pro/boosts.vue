<template>
  <div>
    <div class="page-header" :class="{ 'anim-in': mounted }">
      <h1 class="page-title">Boosts</h1>
      <p class="page-subtitle">Impulsa tu visibilidad en el matching temporalmente</p>
    </div>

    <!-- Active boosts -->
    <div v-if="boostsStore.activeBoosts.length" class="content-card mb-3" :class="{ 'anim-in': mounted }">
      <h5 class="content-card-title">
        <Icon name="mdi:rocket-launch" size="20" class="me-2 text-indigo" />
        Boosts activos
      </h5>
      <div class="active-boosts-list">
        <div v-for="boost in boostsStore.activeBoosts" :key="boost.id" class="active-boost-item">
          <div class="active-boost-icon">
            <Icon :name="boost.boostType?.icon || 'mdi:rocket'" size="18" />
          </div>
          <div class="flex-grow-1">
            <h6 class="mb-0 small fw-semibold">{{ boost.boostType?.name }}</h6>
            <span class="text-muted" style="font-size: 0.7rem">+{{ boost.scoreBonus }} score</span>
          </div>
          <BoostCountdown :expires-at="boost.expiresAt" />
        </div>
      </div>
    </div>

    <!-- Available boost types -->
    <div class="content-card" :class="{ 'anim-in': mounted }" style="transition-delay: 0.1s">
      <h5 class="content-card-title">
        <Icon name="mdi:store" size="20" class="me-2 text-indigo" />
        Boosts disponibles
      </h5>
      <div class="boosts-grid">
        <BoostCard
          v-for="bt in boostsStore.boostTypes"
          :key="bt.id"
          :boost-type="bt"
          :is-active="isBoostActive(bt.id)"
          :expires-at="getBoostExpiry(bt.id)"
          @purchase="handlePurchase"
        />
      </div>
    </div>

    <!-- Confirm Modal -->
    <AppModal v-model="showConfirm" title="Comprar Boost">
      <p>Activar <strong>{{ selectedBoost?.name }}</strong> por {{ selectedBoost?.durationHours }} horas?</p>
      <p class="text-muted small">
        Costo: <strong>${{ Number(selectedBoost?.priceMXN) }} MXN</strong> de tu wallet
        <template v-if="hasFreeSlot"> (o usa tu slot gratis del plan)</template>
      </p>
      <template #footer>
        <button class="btn btn-outline-secondary btn-press" @click="showConfirm = false">Cancelar</button>
        <button class="btn btn-coral btn-press" :disabled="purchasing" @click="confirmPurchase">
          {{ purchasing ? 'Procesando...' : 'Comprar' }}
        </button>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'professional', middleware: ['role'] });

const boostsStore = useBoostsStore();
const plansStore = usePlansStore();
const toast = useToast();
const mounted = ref(false);
const showConfirm = ref(false);
const selectedBoost = ref<any>(null);
const purchasing = ref(false);

const hasFreeSlot = computed(() => {
  const sub = plansStore.currentSubscription;
  if (!sub?.plan) return false;
  return sub.plan.boostSlotsIncluded > 0 && sub.boostSlotsUsedThisPeriod < sub.plan.boostSlotsIncluded;
});

function isBoostActive(typeId: number) {
  return boostsStore.activeBoosts.some((b: any) => b.boostTypeId === typeId);
}

function getBoostExpiry(typeId: number) {
  const boost = boostsStore.activeBoosts.find((b: any) => b.boostTypeId === typeId);
  return boost?.expiresAt;
}

function handlePurchase(boostType: any) {
  selectedBoost.value = boostType;
  showConfirm.value = true;
}

async function confirmPurchase() {
  purchasing.value = true;
  try {
    await boostsStore.purchaseBoost(selectedBoost.value.id);
    toast.success('Boost activado');
    showConfirm.value = false;
  } catch (e: any) {
    toast.error(e?.data?.error?.message || 'Error al comprar boost');
  } finally {
    purchasing.value = false;
  }
}

onMounted(() => {
  requestAnimationFrame(() => { mounted.value = true; });
  boostsStore.fetchBoostTypes();
  boostsStore.fetchActiveBoosts();
  plansStore.fetchCurrentSubscription();
});

useHead({ title: 'Boosts - CERCU Pro' });
</script>

<style lang="scss" scoped>
.page-header { margin-bottom: 1.25rem; opacity: 0; transform: translateY(12px); transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); &.anim-in { opacity: 1; transform: translateY(0); } }
.page-title { font-family: $headings-font-family; font-size: 1.375rem; font-weight: 700; color: $neutral-900; margin-bottom: 0.25rem; }
.page-subtitle { font-size: 0.875rem; color: $neutral-600; margin-bottom: 0; }
.content-card { background: white; border: 1px solid $neutral-200; border-radius: 16px; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06); opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); &.anim-in { opacity: 1; transform: translateY(0); } }
.content-card-title { display: flex; align-items: center; font-size: 1rem; font-weight: 600; color: $neutral-800; margin-bottom: 1rem; }
.text-indigo { color: $cercu-indigo; }

.active-boosts-list { display: flex; flex-direction: column; gap: 0.75rem; }
.active-boost-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border-radius: 12px; background: $neutral-50; border: 1px solid $neutral-100; }
.active-boost-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: white; color: $cercu-coral; border: 1px solid $neutral-200; flex-shrink: 0; }

.boosts-grid {
  display: grid; grid-template-columns: 1fr; gap: 1rem;
  @media (min-width: 576px) { grid-template-columns: repeat(2, 1fr); }
}
</style>
