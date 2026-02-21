<template>
  <div>
    <div class="page-header" :class="{ 'anim-in': mounted }">
      <h1 class="page-title">Configuración</h1>
      <p class="page-subtitle">Variables de configuración del sistema (ConfigKV)</p>
    </div>

    <div class="content-card" :class="{ 'anim-in': mounted }">
      <h5 class="content-card-title">
        <Icon name="mdi:cog" size="20" class="me-2 text-indigo" />
        Variables
      </h5>

      <div class="config-list">
        <div v-for="kv in configs" :key="kv.key" class="config-item">
          <div class="config-info">
            <code class="config-key">{{ kv.key }}</code>
            <small class="text-muted d-block">{{ kv.description }}</small>
          </div>
          <div class="config-value-wrap">
            <input
              v-model="kv.editValue"
              class="form-control form-control-sm config-input"
              @blur="saveConfig(kv)"
              @keyup.enter="saveConfig(kv)"
            />
          </div>
        </div>
      </div>

      <div class="mt-3 pt-3" style="border-top: 1px dashed rgba(0,0,0,0.06);">
        <h6 class="small fw-semibold mb-2">Agregar nueva variable</h6>
        <div class="d-flex gap-2">
          <input v-model="newKey" placeholder="key" class="form-control form-control-sm" />
          <input v-model="newValue" placeholder="value" class="form-control form-control-sm" />
          <input v-model="newDesc" placeholder="descripción" class="form-control form-control-sm" />
          <button class="btn btn-sm btn-primary btn-press" @click="addConfig">
            <Icon name="mdi:plus" size="16" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['role'] });
const plansStore = usePlansStore();
const toast = useToast();
const mounted = ref(false);

const configs = ref<{ key: string; value: string; description: string; editValue: string }[]>([]);
const newKey = ref('');
const newValue = ref('');
const newDesc = ref('');

const defaultKeys = [
  'xp_per_job_completion',
  'xp_per_high_rating',
  'xp_per_fast_response',
  'missions_per_week',
  'trust_score_base',
];

async function loadConfigs() {
  const loaded: any[] = [];
  for (const key of defaultKeys) {
    try {
      const data = await plansStore.adminGetConfig(key);
      loaded.push({ ...data, editValue: data.value });
    } catch { /* key doesn't exist yet */ }
  }
  configs.value = loaded;
}

async function saveConfig(kv: any) {
  if (kv.editValue === kv.value) return;
  try {
    await plansStore.adminSetConfig(kv.key, kv.editValue, kv.description);
    kv.value = kv.editValue;
    toast.success(`${kv.key} actualizado`);
  } catch (e: any) {
    toast.error('Error al guardar');
    kv.editValue = kv.value;
  }
}

async function addConfig() {
  if (!newKey.value || !newValue.value) return;
  try {
    await plansStore.adminSetConfig(newKey.value, newValue.value, newDesc.value);
    toast.success('Variable creada');
    configs.value.push({ key: newKey.value, value: newValue.value, description: newDesc.value, editValue: newValue.value });
    newKey.value = ''; newValue.value = ''; newDesc.value = '';
  } catch (e: any) { toast.error('Error'); }
}

onMounted(() => {
  requestAnimationFrame(() => { mounted.value = true; });
  loadConfigs();
});
useHead({ title: 'Configuración - Admin CERCU' });
</script>

<style lang="scss" scoped>
.page-header { margin-bottom: 1.25rem; opacity: 0; transform: translateY(12px); transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); &.anim-in { opacity: 1; transform: translateY(0); } }
.page-title { font-family: $headings-font-family; font-size: 1.375rem; font-weight: 700; color: $neutral-900; margin-bottom: 0.25rem; }
.page-subtitle { font-size: 0.875rem; color: $neutral-600; margin-bottom: 0; }
.content-card { background: white; border: 1px solid $neutral-200; border-radius: 16px; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06); opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); &.anim-in { opacity: 1; transform: translateY(0); } }
.content-card-title { display: flex; align-items: center; font-size: 1rem; font-weight: 600; color: $neutral-800; margin-bottom: 1rem; }
.text-indigo { color: $cercu-indigo; }

.config-list { display: flex; flex-direction: column; gap: 0.75rem; }
.config-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem; border-radius: 12px; background: $neutral-50; border: 1px solid $neutral-100; }
.config-info { flex: 1; min-width: 0; }
.config-key { font-size: 0.8rem; color: $cercu-indigo; background: rgba($cercu-indigo, 0.06); padding: 0.1rem 0.4rem; border-radius: 4px; }
.config-value-wrap { width: 120px; flex-shrink: 0; }
.config-input { text-align: right; font-weight: 600; font-size: 0.85rem; }
</style>
