<template>
  <div>
    <div class="page-header" :class="{ 'anim-in': mounted }">
      <h1 class="page-title">Planes</h1>
      <p class="page-subtitle">Gestiona los planes de suscripción</p>
    </div>

    <div class="content-card" :class="{ 'anim-in': mounted }">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="content-card-title mb-0">
          <Icon name="mdi:crown" size="20" class="me-2 text-indigo" />
          Planes
        </h5>
        <button class="btn btn-sm btn-primary btn-press" @click="openCreate">
          <Icon name="mdi:plus" size="16" class="me-1" /> Nuevo Plan
        </button>
      </div>

      <div class="table-responsive">
        <table class="table table-sm align-middle">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Precio</th>
              <th>Leads/día</th>
              <th>Boost</th>
              <th>Slots</th>
              <th>Activo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="plan in plansStore.plans" :key="plan.id">
              <td><strong>{{ plan.name }}</strong><br><small class="text-muted">{{ plan.slug }}</small></td>
              <td>${{ Number(plan.priceMXN) }}</td>
              <td>{{ plan.maxLeadsPerDay === -1 ? '∞' : plan.maxLeadsPerDay }}</td>
              <td>+{{ plan.matchPriorityBoost }}</td>
              <td>{{ plan.boostSlotsIncluded }}</td>
              <td><span class="badge" :class="plan.isActive ? 'bg-success' : 'bg-secondary'">{{ plan.isActive ? 'Sí' : 'No' }}</span></td>
              <td>
                <button class="btn btn-sm btn-icon" @click="openEdit(plan)"><Icon name="mdi:pencil" size="16" /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AppModal v-model="showModal" :title="editingPlan ? 'Editar Plan' : 'Nuevo Plan'">
      <div class="mb-3">
        <label class="form-label">Nombre</label>
        <input v-model="form.name" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Slug</label>
        <input v-model="form.slug" class="form-control" />
      </div>
      <div class="row g-2 mb-3">
        <div class="col-6">
          <label class="form-label">Precio MXN</label>
          <input v-model.number="form.priceMXN" type="number" class="form-control" />
        </div>
        <div class="col-6">
          <label class="form-label">Leads/día (-1 = ilimitado)</label>
          <input v-model.number="form.maxLeadsPerDay" type="number" class="form-control" />
        </div>
      </div>
      <div class="row g-2 mb-3">
        <div class="col-4">
          <label class="form-label">Boost prioridad</label>
          <input v-model.number="form.matchPriorityBoost" type="number" class="form-control" />
        </div>
        <div class="col-4">
          <label class="form-label">Slots boost</label>
          <input v-model.number="form.boostSlotsIncluded" type="number" class="form-control" />
        </div>
        <div class="col-4">
          <label class="form-label">Orden</label>
          <input v-model.number="form.sortOrder" type="number" class="form-control" />
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">Descripción</label>
        <textarea v-model="form.description" class="form-control" rows="2"></textarea>
      </div>
      <div class="form-check mb-3">
        <input v-model="form.isActive" type="checkbox" class="form-check-input" id="planActive" />
        <label class="form-check-label" for="planActive">Activo</label>
      </div>
      <template #footer>
        <button class="btn btn-outline-secondary btn-press" @click="showModal = false">Cancelar</button>
        <button class="btn btn-primary btn-press" :disabled="saving" @click="savePlan">
          {{ saving ? 'Guardando...' : 'Guardar' }}
        </button>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['role'] });

const plansStore = usePlansStore();
const toast = useToast();
const mounted = ref(false);
const showModal = ref(false);
const editingPlan = ref<any>(null);
const saving = ref(false);

const form = reactive({
  name: '', slug: '', description: '', priceMXN: 0, maxLeadsPerDay: 3,
  matchPriorityBoost: 0, boostSlotsIncluded: 0, sortOrder: 0, isActive: true,
});

function openCreate() {
  editingPlan.value = null;
  Object.assign(form, { name: '', slug: '', description: '', priceMXN: 0, maxLeadsPerDay: 3, matchPriorityBoost: 0, boostSlotsIncluded: 0, sortOrder: 0, isActive: true });
  showModal.value = true;
}

function openEdit(plan: any) {
  editingPlan.value = plan;
  Object.assign(form, { name: plan.name, slug: plan.slug, description: plan.description || '', priceMXN: Number(plan.priceMXN), maxLeadsPerDay: plan.maxLeadsPerDay, matchPriorityBoost: plan.matchPriorityBoost, boostSlotsIncluded: plan.boostSlotsIncluded, sortOrder: plan.sortOrder, isActive: plan.isActive });
  showModal.value = true;
}

async function savePlan() {
  saving.value = true;
  try {
    if (editingPlan.value) {
      await plansStore.adminUpdatePlan(editingPlan.value.id, form);
    } else {
      await plansStore.adminCreatePlan(form);
    }
    toast.success('Plan guardado');
    showModal.value = false;
    plansStore.adminFetchPlans();
  } catch (e: any) { toast.error(e?.data?.error?.message || 'Error'); } finally { saving.value = false; }
}

onMounted(() => {
  requestAnimationFrame(() => { mounted.value = true; });
  plansStore.adminFetchPlans();
});
useHead({ title: 'Planes - Admin CERCU' });
</script>

<style lang="scss" scoped>
.page-header { margin-bottom: 1.25rem; opacity: 0; transform: translateY(12px); transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); &.anim-in { opacity: 1; transform: translateY(0); } }
.page-title { font-family: $headings-font-family; font-size: 1.375rem; font-weight: 700; color: $neutral-900; margin-bottom: 0.25rem; }
.page-subtitle { font-size: 0.875rem; color: $neutral-600; margin-bottom: 0; }
.content-card { background: white; border: 1px solid $neutral-200; border-radius: 16px; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06); opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); &.anim-in { opacity: 1; transform: translateY(0); } }
.content-card-title { display: flex; align-items: center; font-size: 1rem; font-weight: 600; color: $neutral-800; }
.text-indigo { color: $cercu-indigo; }
</style>
