<template>
  <div>
    <div class="page-header" :class="{ 'anim-in': mounted }">
      <h1 class="page-title">Gamificación</h1>
      <p class="page-subtitle">Niveles, logros y misiones</p>
    </div>

    <!-- Tabs -->
    <div class="admin-tabs mb-3" :class="{ 'anim-in': mounted }">
      <button class="tab-btn" :class="{ active: tab === 'levels' }" @click="tab = 'levels'">Niveles</button>
      <button class="tab-btn" :class="{ active: tab === 'achievements' }" @click="tab = 'achievements'">Logros</button>
      <button class="tab-btn" :class="{ active: tab === 'missions' }" @click="tab = 'missions'">Misiones</button>
    </div>

    <!-- Levels Tab -->
    <div v-if="tab === 'levels'" class="content-card" :class="{ 'anim-in': mounted }">
      <h5 class="content-card-title"><Icon name="mdi:trending-up" size="20" class="me-2 text-indigo" /> Niveles</h5>
      <div class="table-responsive">
        <table class="table table-sm align-middle">
          <thead><tr><th>Nivel</th><th>Nombre</th><th>XP Req</th><th>Score Bonus</th><th>Perks</th><th></th></tr></thead>
          <tbody>
            <tr v-for="l in gamStore.levels" :key="l.id">
              <td>{{ l.level }}</td>
              <td><strong>{{ l.name }}</strong></td>
              <td>{{ l.xpRequired }}</td>
              <td>+{{ l.matchScoreBonus }}</td>
              <td><small class="text-muted">{{ l.perks?.description || '-' }}</small></td>
              <td><button class="btn btn-sm btn-icon" @click="openEditLevel(l)"><Icon name="mdi:pencil" size="16" /></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Achievements Tab -->
    <div v-if="tab === 'achievements'" class="content-card" :class="{ 'anim-in': mounted }">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="content-card-title mb-0"><Icon name="mdi:trophy" size="20" class="me-2 text-indigo" /> Logros</h5>
        <button class="btn btn-sm btn-primary btn-press" @click="openCreateAchievement">
          <Icon name="mdi:plus" size="16" class="me-1" /> Nuevo
        </button>
      </div>
      <div class="table-responsive">
        <table class="table table-sm align-middle">
          <thead><tr><th>Nombre</th><th>Tipo</th><th>Condición</th><th>Reward</th><th>Activo</th><th></th></tr></thead>
          <tbody>
            <tr v-for="a in gamStore.achievementTemplates" :key="a.id">
              <td>
                <div class="d-flex align-items-center gap-2">
                  <Icon :name="a.icon || 'mdi:trophy'" size="18" class="text-indigo" />
                  <strong>{{ a.name }}</strong>
                </div>
              </td>
              <td><small>{{ a.triggerType }}</small></td>
              <td>{{ a.triggerCondition?.value }}</td>
              <td><small>{{ a.reward?.xp ? a.reward.xp + ' XP' : '' }} {{ a.reward?.walletCreditMXN ? '$' + a.reward.walletCreditMXN : '' }}</small></td>
              <td><span class="badge" :class="a.isActive ? 'bg-success' : 'bg-secondary'">{{ a.isActive ? 'Sí' : 'No' }}</span></td>
              <td>
                <div class="d-flex gap-1">
                  <button class="btn btn-sm btn-icon" @click="openEditAchievement(a)"><Icon name="mdi:pencil" size="16" /></button>
                  <button class="btn btn-sm btn-icon text-danger" @click="confirmDeleteAchievement(a)"><Icon name="mdi:delete" size="16" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Missions Tab -->
    <div v-if="tab === 'missions'" class="content-card" :class="{ 'anim-in': mounted }">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="content-card-title mb-0"><Icon name="mdi:target" size="20" class="me-2 text-indigo" /> Plantillas de Misión</h5>
        <button class="btn btn-sm btn-primary btn-press" @click="openCreateMission">
          <Icon name="mdi:plus" size="16" class="me-1" /> Nueva
        </button>
      </div>
      <div class="table-responsive">
        <table class="table table-sm align-middle">
          <thead><tr><th>Nombre</th><th>Tipo</th><th>Objetivo</th><th>Reward</th><th>Activo</th><th></th></tr></thead>
          <tbody>
            <tr v-for="m in gamStore.missionTemplates" :key="m.id">
              <td>
                <div class="d-flex align-items-center gap-2">
                  <Icon :name="m.icon || 'mdi:target'" size="18" class="text-indigo" />
                  <strong>{{ m.name }}</strong>
                </div>
              </td>
              <td><small>{{ m.missionType }}</small></td>
              <td>{{ m.targetCondition?.targetValue }}</td>
              <td><small>{{ m.reward?.xp ? m.reward.xp + ' XP' : '' }} {{ m.reward?.walletCreditMXN ? '$' + m.reward.walletCreditMXN : '' }}</small></td>
              <td><span class="badge" :class="m.isActive ? 'bg-success' : 'bg-secondary'">{{ m.isActive ? 'Sí' : 'No' }}</span></td>
              <td>
                <div class="d-flex gap-1">
                  <button class="btn btn-sm btn-icon" @click="openEditMission(m)"><Icon name="mdi:pencil" size="16" /></button>
                  <button class="btn btn-sm btn-icon text-danger" @click="confirmDeleteMission(m)"><Icon name="mdi:delete" size="16" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ─── Level Edit Modal ─── -->
    <AppModal v-model="showLevelModal" title="Editar Nivel">
      <div class="mb-3">
        <label class="form-label">Nombre</label>
        <input v-model="levelForm.name" class="form-control" />
      </div>
      <div class="row g-2 mb-3">
        <div class="col-6">
          <label class="form-label">XP Requerido</label>
          <input v-model.number="levelForm.xpRequired" type="number" min="0" class="form-control" />
        </div>
        <div class="col-6">
          <label class="form-label">Score Bonus (+)</label>
          <input v-model.number="levelForm.matchScoreBonus" type="number" min="0" class="form-control" />
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">Descripción de perks</label>
        <textarea v-model="levelForm.perksDescription" class="form-control" rows="2"></textarea>
      </div>
      <template #footer>
        <button class="btn btn-outline-secondary btn-press" @click="showLevelModal = false">Cancelar</button>
        <button class="btn btn-primary btn-press" :disabled="saving" @click="saveLevel">
          {{ saving ? 'Guardando...' : 'Guardar' }}
        </button>
      </template>
    </AppModal>

    <!-- ─── Achievement Modal ─── -->
    <AppModal v-model="showAchievementModal" :title="editingAchievement ? 'Editar Logro' : 'Nuevo Logro'" size="lg">
      <div class="row g-2 mb-3">
        <div class="col-8">
          <label class="form-label">Nombre</label>
          <input v-model="achForm.name" class="form-control" placeholder="Ej: Primera reseña" />
        </div>
        <div class="col-4">
          <label class="form-label">Icono (MDI)</label>
          <input v-model="achForm.icon" class="form-control" placeholder="mdi:trophy" />
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">Descripción</label>
        <textarea v-model="achForm.description" class="form-control" rows="2" placeholder="Lo que el usuario ve"></textarea>
      </div>
      <div class="row g-2 mb-3">
        <div class="col-6">
          <label class="form-label">Tipo de trigger</label>
          <select v-model="achForm.triggerType" class="form-select">
            <option value="phone_verified">Teléfono verificado</option>
            <option value="address_saved">Dirección guardada</option>
            <option value="first_service">Primer servicio</option>
            <option value="services_completed">Servicios completados</option>
            <option value="review_given">Reseña dada</option>
            <option value="photo_uploaded">Foto subida</option>
            <option value="description_quality">Descripción de calidad</option>
            <option value="no_late_cancellations">Sin cancelaciones tardías</option>
            <option value="fast_response">Respuesta rápida</option>
            <option value="rating_threshold">Rating mínimo</option>
            <option value="leads_taken">Leads tomados</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div class="col-6">
          <label class="form-label">Valor condición</label>
          <input v-model="achForm.triggerConditionValue" class="form-control" placeholder="Ej: 3, 80, true" />
        </div>
      </div>
      <div class="row g-2 mb-3">
        <div class="col-4">
          <label class="form-label">Reward XP</label>
          <input v-model.number="achForm.rewardXP" type="number" min="0" class="form-control" />
        </div>
        <div class="col-4">
          <label class="form-label">Créditos MXN</label>
          <input v-model.number="achForm.rewardCredit" type="number" min="0" class="form-control" />
        </div>
        <div class="col-4">
          <label class="form-label">Target</label>
          <select v-model="achForm.target" class="form-select">
            <option value="user">Usuario</option>
            <option value="pro">Profesional</option>
            <option value="both">Ambos</option>
          </select>
        </div>
      </div>
      <div class="form-check mb-3">
        <input v-model="achForm.isActive" type="checkbox" class="form-check-input" id="achActive" />
        <label class="form-check-label" for="achActive">Activo</label>
      </div>
      <template #footer>
        <button class="btn btn-outline-secondary btn-press" @click="showAchievementModal = false">Cancelar</button>
        <button class="btn btn-primary btn-press" :disabled="saving" @click="saveAchievement">
          {{ saving ? 'Guardando...' : 'Guardar' }}
        </button>
      </template>
    </AppModal>

    <!-- ─── Mission Modal ─── -->
    <AppModal v-model="showMissionModal" :title="editingMission ? 'Editar Misión' : 'Nueva Misión'" size="lg">
      <div class="row g-2 mb-3">
        <div class="col-8">
          <label class="form-label">Nombre</label>
          <input v-model="missionForm.name" class="form-control" placeholder="Ej: Completa 3 servicios" />
        </div>
        <div class="col-4">
          <label class="form-label">Icono (MDI)</label>
          <input v-model="missionForm.icon" class="form-control" placeholder="mdi:target" />
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">Descripción</label>
        <textarea v-model="missionForm.description" class="form-control" rows="2" placeholder="Descripción de la misión"></textarea>
      </div>
      <div class="row g-2 mb-3">
        <div class="col-6">
          <label class="form-label">Tipo de misión</label>
          <select v-model="missionForm.missionType" class="form-select">
            <option value="complete_services">Completar servicios</option>
            <option value="respond_fast">Responder rápido</option>
            <option value="get_reviews">Obtener reseñas</option>
            <option value="take_leads">Tomar leads</option>
            <option value="maintain_rating">Mantener rating</option>
            <option value="no_cancellations">Sin cancelaciones</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div class="col-6">
          <label class="form-label">Valor objetivo</label>
          <input v-model.number="missionForm.targetValue" type="number" min="1" class="form-control" placeholder="Ej: 3" />
        </div>
      </div>
      <div class="row g-2 mb-3">
        <div class="col-4">
          <label class="form-label">Reward XP</label>
          <input v-model.number="missionForm.rewardXP" type="number" min="0" class="form-control" />
        </div>
        <div class="col-4">
          <label class="form-label">Créditos MXN</label>
          <input v-model.number="missionForm.rewardCredit" type="number" min="0" class="form-control" />
        </div>
        <div class="col-4">
          <label class="form-label">Plan mínimo</label>
          <select v-model="missionForm.minPlan" class="form-select">
            <option value="starter">Starter</option>
            <option value="normal">Normal</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>
      <div class="form-check mb-3">
        <input v-model="missionForm.isActive" type="checkbox" class="form-check-input" id="missionActive" />
        <label class="form-check-label" for="missionActive">Activa</label>
      </div>
      <template #footer>
        <button class="btn btn-outline-secondary btn-press" @click="showMissionModal = false">Cancelar</button>
        <button class="btn btn-primary btn-press" :disabled="saving" @click="saveMission">
          {{ saving ? 'Guardando...' : 'Guardar' }}
        </button>
      </template>
    </AppModal>

    <!-- ─── Delete Confirmation Modal ─── -->
    <AppModal v-model="showDeleteModal" title="Confirmar eliminación">
      <p class="mb-0">¿Estás seguro de eliminar <strong>{{ deleteTarget?.name }}</strong>? Esta acción no se puede deshacer.</p>
      <template #footer>
        <button class="btn btn-outline-secondary btn-press" @click="showDeleteModal = false">Cancelar</button>
        <button class="btn btn-danger btn-press" :disabled="saving" @click="executeDelete">
          {{ saving ? 'Eliminando...' : 'Eliminar' }}
        </button>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['role'] });
const gamStore = useGamificationStore();
const toast = useToast();
const mounted = ref(false);
const tab = ref('levels');
const saving = ref(false);

// ─── Level State ───
const showLevelModal = ref(false);
const editingLevel = ref<any>(null);
const levelForm = reactive({
  name: '',
  xpRequired: 0,
  matchScoreBonus: 0,
  perksDescription: '',
});

function openEditLevel(l: any) {
  editingLevel.value = l;
  Object.assign(levelForm, {
    name: l.name,
    xpRequired: l.xpRequired,
    matchScoreBonus: l.matchScoreBonus,
    perksDescription: l.perks?.description || '',
  });
  showLevelModal.value = true;
}

async function saveLevel() {
  saving.value = true;
  try {
    await gamStore.adminUpdateLevel(editingLevel.value.id, {
      name: levelForm.name,
      xpRequired: levelForm.xpRequired,
      matchScoreBonus: levelForm.matchScoreBonus,
      perks: { description: levelForm.perksDescription },
    });
    toast.success('Nivel actualizado');
    showLevelModal.value = false;
    gamStore.adminFetchLevels();
  } catch (e: any) {
    toast.error(e?.data?.error?.message || 'Error al guardar nivel');
  } finally {
    saving.value = false;
  }
}

// ─── Achievement State ───
const showAchievementModal = ref(false);
const editingAchievement = ref<any>(null);
const achForm = reactive({
  name: '',
  icon: 'mdi:trophy',
  description: '',
  triggerType: 'custom' as string,
  triggerConditionValue: '',
  rewardXP: 10,
  rewardCredit: 0,
  target: 'user' as string,
  isActive: true,
});

function resetAchForm() {
  Object.assign(achForm, {
    name: '', icon: 'mdi:trophy', description: '', triggerType: 'custom',
    triggerConditionValue: '', rewardXP: 10, rewardCredit: 0, target: 'user', isActive: true,
  });
}

function openCreateAchievement() {
  editingAchievement.value = null;
  resetAchForm();
  showAchievementModal.value = true;
}

function openEditAchievement(a: any) {
  editingAchievement.value = a;
  Object.assign(achForm, {
    name: a.name,
    icon: a.icon || 'mdi:trophy',
    description: a.description || '',
    triggerType: a.triggerType || 'custom',
    triggerConditionValue: a.triggerCondition?.value ?? '',
    rewardXP: a.reward?.xp || 0,
    rewardCredit: a.reward?.walletCreditMXN || 0,
    target: a.target || 'user',
    isActive: a.isActive ?? true,
  });
  showAchievementModal.value = true;
}

async function saveAchievement() {
  saving.value = true;
  try {
    const body = {
      name: achForm.name,
      icon: achForm.icon,
      description: achForm.description,
      triggerType: achForm.triggerType,
      triggerCondition: { value: achForm.triggerConditionValue },
      reward: { xp: achForm.rewardXP, walletCreditMXN: achForm.rewardCredit },
      target: achForm.target,
      isActive: achForm.isActive,
    };
    if (editingAchievement.value) {
      await gamStore.adminUpdateAchievement(editingAchievement.value.id, body);
    } else {
      await gamStore.adminCreateAchievement(body);
    }
    toast.success('Logro guardado');
    showAchievementModal.value = false;
    gamStore.adminFetchAchievements();
  } catch (e: any) {
    toast.error(e?.data?.error?.message || 'Error al guardar logro');
  } finally {
    saving.value = false;
  }
}

// ─── Mission State ───
const showMissionModal = ref(false);
const editingMission = ref<any>(null);
const missionForm = reactive({
  name: '',
  icon: 'mdi:target',
  description: '',
  missionType: 'complete_services' as string,
  targetValue: 3,
  rewardXP: 15,
  rewardCredit: 0,
  minPlan: 'normal' as string,
  isActive: true,
});

function resetMissionForm() {
  Object.assign(missionForm, {
    name: '', icon: 'mdi:target', description: '', missionType: 'complete_services',
    targetValue: 3, rewardXP: 15, rewardCredit: 0, minPlan: 'normal', isActive: true,
  });
}

function openCreateMission() {
  editingMission.value = null;
  resetMissionForm();
  showMissionModal.value = true;
}

function openEditMission(m: any) {
  editingMission.value = m;
  Object.assign(missionForm, {
    name: m.name,
    icon: m.icon || 'mdi:target',
    description: m.description || '',
    missionType: m.missionType || 'custom',
    targetValue: m.targetCondition?.targetValue || 1,
    rewardXP: m.reward?.xp || 0,
    rewardCredit: m.reward?.walletCreditMXN || 0,
    minPlan: m.minPlan || 'normal',
    isActive: m.isActive ?? true,
  });
  showMissionModal.value = true;
}

async function saveMission() {
  saving.value = true;
  try {
    const body = {
      name: missionForm.name,
      icon: missionForm.icon,
      description: missionForm.description,
      missionType: missionForm.missionType,
      targetCondition: { targetValue: missionForm.targetValue },
      reward: { xp: missionForm.rewardXP, walletCreditMXN: missionForm.rewardCredit },
      minPlan: missionForm.minPlan,
      isActive: missionForm.isActive,
    };
    if (editingMission.value) {
      await gamStore.adminUpdateMissionTemplate(editingMission.value.id, body);
    } else {
      await gamStore.adminCreateMissionTemplate(body);
    }
    toast.success('Misión guardada');
    showMissionModal.value = false;
    gamStore.adminFetchMissionTemplates();
  } catch (e: any) {
    toast.error(e?.data?.error?.message || 'Error al guardar misión');
  } finally {
    saving.value = false;
  }
}

// ─── Delete Logic ───
const showDeleteModal = ref(false);
const deleteTarget = ref<any>(null);
const deleteType = ref<'achievement' | 'mission'>('achievement');

function confirmDeleteAchievement(a: any) {
  deleteTarget.value = a;
  deleteType.value = 'achievement';
  showDeleteModal.value = true;
}

function confirmDeleteMission(m: any) {
  deleteTarget.value = m;
  deleteType.value = 'mission';
  showDeleteModal.value = true;
}

async function executeDelete() {
  saving.value = true;
  try {
    if (deleteType.value === 'achievement') {
      await gamStore.adminDeleteAchievement(deleteTarget.value.id);
      gamStore.adminFetchAchievements();
    } else {
      await gamStore.adminDeleteMissionTemplate(deleteTarget.value.id);
      gamStore.adminFetchMissionTemplates();
    }
    toast.success('Eliminado correctamente');
    showDeleteModal.value = false;
  } catch (e: any) {
    toast.error(e?.data?.error?.message || 'Error al eliminar');
  } finally {
    saving.value = false;
  }
}

// ─── Tab data fetching ───
watch(tab, (val) => {
  if (val === 'levels') gamStore.adminFetchLevels();
  if (val === 'achievements') gamStore.adminFetchAchievements();
  if (val === 'missions') gamStore.adminFetchMissionTemplates();
});

onMounted(() => {
  requestAnimationFrame(() => { mounted.value = true; });
  gamStore.adminFetchLevels();
});
useHead({ title: 'Gamificación - Admin CERCU' });
</script>

<style lang="scss" scoped>
.page-header { margin-bottom: 1.25rem; opacity: 0; transform: translateY(12px); transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); &.anim-in { opacity: 1; transform: translateY(0); } }
.page-title { font-family: $headings-font-family; font-size: 1.375rem; font-weight: 700; color: $neutral-900; margin-bottom: 0.25rem; }
.page-subtitle { font-size: 0.875rem; color: $neutral-600; margin-bottom: 0; }
.content-card { background: white; border: 1px solid $neutral-200; border-radius: 16px; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06); opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); &.anim-in { opacity: 1; transform: translateY(0); } }
.content-card-title { display: flex; align-items: center; font-size: 1rem; font-weight: 600; color: $neutral-800; }
.text-indigo { color: $cercu-indigo; }
.admin-tabs { display: flex; gap: 0.5rem; opacity: 0; transform: translateY(12px); transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); &.anim-in { opacity: 1; transform: translateY(0); } }
.tab-btn { padding: 0.5rem 1.25rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; border: 1px solid $neutral-200; background: white; color: $neutral-600; cursor: pointer; transition: all 0.2s ease; &:hover { color: $cercu-indigo; border-color: rgba($cercu-indigo, 0.3); } &.active { color: white; background: $cercu-indigo; border-color: $cercu-indigo; box-shadow: 0 2px 8px rgba($cercu-indigo, 0.3); } }
</style>
