<template>
  <div>
    <div class="page-header" :class="{ 'anim-in': mounted }">
      <h1 class="page-title">Boost Types</h1>
      <p class="page-subtitle">Gestiona los tipos de boost disponibles</p>
    </div>

    <div class="content-card" :class="{ 'anim-in': mounted }">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="content-card-title mb-0">
          <Icon name="mdi:rocket-launch" size="20" class="me-2 text-indigo" />
          Tipos de Boost
        </h5>
        <button class="btn btn-sm btn-primary btn-press" @click="openCreate">
          <Icon name="mdi:plus" size="16" class="me-1" /> Nuevo Boost
        </button>
      </div>

      <div class="table-responsive">
        <table class="table table-sm align-middle">
          <thead><tr><th>Nombre</th><th>Score Bonus</th><th>Duración</th><th>Precio</th><th>Activo</th><th></th></tr></thead>
          <tbody>
            <tr v-for="bt in boostsStore.boostTypes" :key="bt.id">
              <td><strong>{{ bt.name }}</strong><br><small class="text-muted">{{ bt.slug }}</small></td>
              <td>+{{ bt.scoreBonus }}</td>
              <td>{{ bt.durationHours }}h</td>
              <td>${{ Number(bt.priceMXN) }}</td>
              <td><span class="badge" :class="bt.isActive ? 'bg-success' : 'bg-secondary'">{{ bt.isActive ? 'Sí' : 'No' }}</span></td>
              <td><button class="btn btn-sm btn-icon" @click="openEdit(bt)"><Icon name="mdi:pencil" size="16" /></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AppModal v-model="showModal" :title="editing ? 'Editar Boost' : 'Nuevo Boost'">
      <div class="mb-3"><label class="form-label">Nombre</label><input v-model="form.name" class="form-control" /></div>
      <div class="mb-3"><label class="form-label">Slug</label><input v-model="form.slug" class="form-control" /></div>
      <div class="row g-2 mb-3">
        <div class="col-4"><label class="form-label">Score Bonus</label><input v-model.number="form.scoreBonus" type="number" class="form-control" /></div>
        <div class="col-4"><label class="form-label">Duración (h)</label><input v-model.number="form.durationHours" type="number" class="form-control" /></div>
        <div class="col-4"><label class="form-label">Precio MXN</label><input v-model.number="form.priceMXN" type="number" class="form-control" /></div>
      </div>
      <div class="mb-3"><label class="form-label">Descripción</label><textarea v-model="form.description" class="form-control" rows="2"></textarea></div>
      <div class="form-check mb-3"><input v-model="form.isActive" type="checkbox" class="form-check-input" id="boostActive" /><label class="form-check-label" for="boostActive">Activo</label></div>
      <template #footer>
        <button class="btn btn-outline-secondary btn-press" @click="showModal = false">Cancelar</button>
        <button class="btn btn-primary btn-press" :disabled="saving" @click="save">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['role'] });
const boostsStore = useBoostsStore();
const toast = useToast();
const mounted = ref(false);
const showModal = ref(false);
const editing = ref<any>(null);
const saving = ref(false);
const form = reactive({ name: '', slug: '', description: '', scoreBonus: 10, durationHours: 24, priceMXN: 49, isActive: true });

function openCreate() { editing.value = null; Object.assign(form, { name: '', slug: '', description: '', scoreBonus: 10, durationHours: 24, priceMXN: 49, isActive: true }); showModal.value = true; }
function openEdit(bt: any) { editing.value = bt; Object.assign(form, { name: bt.name, slug: bt.slug, description: bt.description || '', scoreBonus: bt.scoreBonus, durationHours: bt.durationHours, priceMXN: Number(bt.priceMXN), isActive: bt.isActive }); showModal.value = true; }

async function save() {
  saving.value = true;
  try {
    if (editing.value) { await boostsStore.adminUpdateBoostType(editing.value.id, form); }
    else { await boostsStore.adminCreateBoostType(form); }
    toast.success('Boost guardado'); showModal.value = false; boostsStore.adminFetchBoostTypes();
  } catch (e: any) { toast.error(e?.data?.error?.message || 'Error'); } finally { saving.value = false; }
}

onMounted(() => { requestAnimationFrame(() => { mounted.value = true; }); boostsStore.adminFetchBoostTypes(); });
useHead({ title: 'Boosts - Admin CERCU' });
</script>

<style lang="scss" scoped>
.page-header { margin-bottom: 1.25rem; opacity: 0; transform: translateY(12px); transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); &.anim-in { opacity: 1; transform: translateY(0); } }
.page-title { font-family: $headings-font-family; font-size: 1.375rem; font-weight: 700; color: $neutral-900; margin-bottom: 0.25rem; }
.page-subtitle { font-size: 0.875rem; color: $neutral-600; margin-bottom: 0; }
.content-card { background: white; border: 1px solid $neutral-200; border-radius: 16px; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06); opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); &.anim-in { opacity: 1; transform: translateY(0); } }
.content-card-title { display: flex; align-items: center; font-size: 1rem; font-weight: 600; color: $neutral-800; }
.text-indigo { color: $cercu-indigo; }
</style>
