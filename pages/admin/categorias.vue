<template>
  <div>
    <div class="page-header" :class="{ 'anim-in': mounted }">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h1 class="page-title">Categorías</h1>
          <p class="page-subtitle">Gestiona categorías, chips, campos condicionales y precios</p>
        </div>
        <AppButton variant="primary" size="sm" icon="mdi:plus" @click="openCreate">
          Nueva categoría
        </AppButton>
      </div>
    </div>

    <AppSpinner v-if="adminStore.loading" />

    <template v-else>
      <div v-if="adminStore.categories.length === 0" class="content-card" :class="{ 'anim-in': mounted }">
        <AppEmptyState
          icon="mdi:shape"
          title="Sin categorías"
          description="Aún no hay categorías registradas."
        />
      </div>

      <div
        v-for="(cat, idx) in adminStore.categories"
        :key="cat.id"
        class="content-card mb-3"
        :class="{ 'anim-in': mounted }"
        :style="{ transitionDelay: `${0.05 * idx}s` }"
      >
        <!-- Category Header -->
        <div class="cat-header" @click="toggle(cat.id)">
          <div class="cat-header-left">
            <Icon :name="cat.icon || 'mdi:shape'" size="22" class="cat-icon" />
            <div>
              <div class="cat-name">{{ cat.name }}</div>
              <div class="cat-meta">
                <span class="cat-slug">{{ cat.slug }}</span>
                <span class="cat-type" :class="`cat-type--${cat.type}`">{{ cat.type }}</span>
                <AppStatusPill :status="cat.isActive ? 'active' : 'inactive'" />
              </div>
            </div>
          </div>
          <div class="cat-header-right">
            <span class="cat-stat">{{ cat.chips?.length || 0 }} chips</span>
            <span class="cat-stat">{{ cat.pricing?.length || 0 }} precios</span>
            <button class="btn-icon-sm" @click.stop="openEdit(cat)">
              <Icon name="mdi:pencil" size="16" />
            </button>
            <button class="btn-icon-sm btn-icon-sm--danger" @click.stop="confirmDelete(cat)">
              <Icon name="mdi:delete" size="16" />
            </button>
            <Icon
              name="mdi:chevron-down"
              size="20"
              class="cat-chevron"
              :class="{ 'cat-chevron--open': expanded.has(cat.id) }"
            />
          </div>
        </div>

        <!-- Expanded Content -->
        <Transition name="slide-down">
          <div v-if="expanded.has(cat.id)" class="cat-body">
            <!-- Chips -->
            <div class="cat-section">
              <div class="cat-section-header">
                <h6 class="cat-section-title">Chips (servicios)</h6>
                <button class="btn-add-sm" @click="openAddChip(cat)">
                  <Icon name="mdi:plus" size="14" /> Agregar
                </button>
              </div>
              <div v-if="cat.chips?.length" class="chips-list">
                <div v-for="chip in sortedChips(cat.chips)" :key="chip.id" class="chip-row">
                  <span class="chip-label">{{ chip.label }}</span>
                  <span class="chip-slug">{{ chip.slug }}</span>
                  <span class="chip-order">#{{ chip.sortOrder }}</span>
                  <button class="btn-icon-xs" @click="openEditChip(cat, chip)">
                    <Icon name="mdi:pencil" size="13" />
                  </button>
                  <button class="btn-icon-xs btn-icon-xs--danger" @click="handleDeleteChip(chip)">
                    <Icon name="mdi:close" size="13" />
                  </button>
                </div>
              </div>
              <p v-else class="text-muted small mb-0">Sin chips</p>
            </div>

            <!-- Conditional Fields -->
            <div class="cat-section">
              <div class="cat-section-header">
                <h6 class="cat-section-title">Campos condicionales</h6>
                <button class="btn-add-sm" @click="openAddField(cat)">
                  <Icon name="mdi:plus" size="14" /> Agregar
                </button>
              </div>
              <div v-if="cat.conditionalFields?.length" class="fields-list">
                <div v-for="field in cat.conditionalFields" :key="field.id" class="field-row">
                  <div class="field-info">
                    <span class="field-label">{{ field.label }}</span>
                    <span class="field-meta">{{ field.fieldKey }} · {{ field.fieldType }}{{ field.required ? ' · requerido' : '' }}</span>
                  </div>
                  <div v-if="field.options?.length" class="field-options">
                    <span v-for="(opt, i) in field.options" :key="i" class="field-option">{{ opt }}</span>
                  </div>
                  <div class="field-actions">
                    <button class="btn-icon-xs" @click="openEditField(cat, field)">
                      <Icon name="mdi:pencil" size="13" />
                    </button>
                    <button class="btn-icon-xs btn-icon-xs--danger" @click="handleDeleteField(field)">
                      <Icon name="mdi:close" size="13" />
                    </button>
                  </div>
                </div>
              </div>
              <p v-else class="text-muted small mb-0">Sin campos condicionales</p>
            </div>

            <!-- Pricing -->
            <div class="cat-section">
              <div class="cat-section-header">
                <h6 class="cat-section-title">Precios</h6>
                <button class="btn-add-sm" @click="openAddPricing(cat)">
                  <Icon name="mdi:plus" size="14" /> Agregar
                </button>
              </div>
              <div v-if="cat.pricing?.length" class="pricing-grid">
                <div v-for="p in cat.pricing" :key="p.id" class="pricing-card">
                  <div class="pricing-tier">{{ p.urgencyTier }}</div>
                  <div class="pricing-amount">${{ p.priceMXN }}</div>
                  <div v-if="Number(p.qualifiedSurchargeMXN)" class="pricing-surcharge">
                    +${{ p.qualifiedSurchargeMXN }} calificado
                  </div>
                  <button class="btn-icon-xs btn-icon-xs--danger pricing-delete" @click="handleDeletePricing(p)">
                    <Icon name="mdi:close" size="13" />
                  </button>
                </div>
              </div>
              <p v-else class="text-muted small mb-0">Sin precios configurados</p>
            </div>
          </div>
        </Transition>
      </div>
    </template>

    <!-- Category Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="catModal" class="modal-overlay" @click.self="catModal = false">
          <div class="modal-card">
            <div class="modal-header">
              <h5 class="modal-title">{{ editingCat ? 'Editar' : 'Nueva' }} categoría</h5>
              <button class="btn-close-modal" @click="catModal = false">
                <Icon name="mdi:close" size="20" />
              </button>
            </div>
            <div class="modal-body">
              <AppInput v-model="catForm.name" label="Nombre" class="mb-3" />
              <AppInput v-model="catForm.slug" label="Slug" hint="URL-friendly identifier" class="mb-3" />
              <AppInput v-model="catForm.icon" label="Icono (MDI)" hint="Ej: mdi:wrench" class="mb-3" />
              <div class="app-input mb-3">
                <label class="form-label">Tipo</label>
                <select v-model="catForm.type" class="form-control">
                  <option value="emergency">Emergencia</option>
                  <option value="project">Proyecto</option>
                </select>
              </div>
              <AppInput v-model.number="catForm.sortOrder" label="Orden" type="number" class="mb-3" />
              <div v-if="editingCat" class="form-check mb-3">
                <input id="catActive" v-model="catForm.isActive" type="checkbox" class="form-check-input" />
                <label for="catActive" class="form-check-label">Activa</label>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-sm btn-outline-secondary" @click="catModal = false">Cancelar</button>
              <AppButton variant="primary" size="sm" :loading="saving" @click="saveCat">
                {{ editingCat ? 'Guardar' : 'Crear' }}
              </AppButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Chip Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="chipModal" class="modal-overlay" @click.self="chipModal = false">
          <div class="modal-card modal-card--sm">
            <div class="modal-header">
              <h5 class="modal-title">{{ editingChip ? 'Editar' : 'Agregar' }} chip</h5>
              <button class="btn-close-modal" @click="chipModal = false">
                <Icon name="mdi:close" size="20" />
              </button>
            </div>
            <div class="modal-body">
              <AppInput v-model="chipForm.label" label="Label" class="mb-3" />
              <AppInput v-model="chipForm.slug" label="Slug" class="mb-3" />
              <AppInput v-model.number="chipForm.sortOrder" label="Orden" type="number" class="mb-3" />
            </div>
            <div class="modal-footer">
              <button class="btn btn-sm btn-outline-secondary" @click="chipModal = false">Cancelar</button>
              <AppButton variant="primary" size="sm" :loading="saving" @click="saveChip">
                {{ editingChip ? 'Guardar' : 'Agregar' }}
              </AppButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Field Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="fieldModal" class="modal-overlay" @click.self="fieldModal = false">
          <div class="modal-card">
            <div class="modal-header">
              <h5 class="modal-title">{{ editingField ? 'Editar' : 'Agregar' }} campo</h5>
              <button class="btn-close-modal" @click="fieldModal = false">
                <Icon name="mdi:close" size="20" />
              </button>
            </div>
            <div class="modal-body">
              <AppInput v-model="fieldForm.label" label="Label" class="mb-3" />
              <AppInput v-model="fieldForm.fieldKey" label="Field Key" class="mb-3" />
              <div class="app-input mb-3">
                <label class="form-label">Tipo</label>
                <select v-model="fieldForm.fieldType" class="form-control">
                  <option value="text">Texto</option>
                  <option value="number">Número</option>
                  <option value="select">Select</option>
                  <option value="multi_select">Multi-Select</option>
                  <option value="boolean">Booleano</option>
                </select>
              </div>
              <AppInput
                v-if="fieldForm.fieldType === 'select' || fieldForm.fieldType === 'multi_select'"
                v-model="fieldForm.optionsStr"
                label="Opciones (separadas por coma)"
                hint="Ej: Opción 1, Opción 2, Opción 3"
                class="mb-3"
              />
              <div class="form-check mb-3">
                <input id="fieldReq" v-model="fieldForm.required" type="checkbox" class="form-check-input" />
                <label for="fieldReq" class="form-check-label">Requerido</label>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-sm btn-outline-secondary" @click="fieldModal = false">Cancelar</button>
              <AppButton variant="primary" size="sm" :loading="saving" @click="saveField">
                {{ editingField ? 'Guardar' : 'Agregar' }}
              </AppButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Pricing Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="pricingModal" class="modal-overlay" @click.self="pricingModal = false">
          <div class="modal-card modal-card--sm">
            <div class="modal-header">
              <h5 class="modal-title">Configurar precio</h5>
              <button class="btn-close-modal" @click="pricingModal = false">
                <Icon name="mdi:close" size="20" />
              </button>
            </div>
            <div class="modal-body">
              <div class="app-input mb-3">
                <label class="form-label">Urgencia</label>
                <select v-model="pricingForm.urgencyTier" class="form-control">
                  <option value="standard">Estándar</option>
                  <option value="today">Hoy</option>
                  <option value="immediate">Inmediato</option>
                </select>
              </div>
              <AppInput v-model.number="pricingForm.priceMXN" label="Precio base (MXN)" type="number" class="mb-3" />
              <AppInput v-model.number="pricingForm.qualifiedSurchargeMXN" label="Recargo calificado (MXN)" type="number" class="mb-3" />
            </div>
            <div class="modal-footer">
              <button class="btn btn-sm btn-outline-secondary" @click="pricingModal = false">Cancelar</button>
              <AppButton variant="primary" size="sm" :loading="saving" @click="savePricing">
                Guardar
              </AppButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirm -->
    <AppConfirmDialog
      v-model="deleteConfirm"
      title="Eliminar categoría"
      :message="`¿Estás seguro de eliminar '${deletingCat?.name}'? Se eliminarán todos sus chips, campos y precios.`"
      type="danger"
      confirm-text="Eliminar"
      :loading="saving"
      @confirm="handleDeleteCat"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['role'] })

const adminStore = useAdminStore()
const toast = useToast()
const mounted = ref(false)
const saving = ref(false)
const expanded = ref(new Set<number>())

// ─── Category ───
const catModal = ref(false)
const editingCat = ref<any>(null)
const catForm = reactive({
  name: '', slug: '', icon: '', type: 'project', sortOrder: 0, isActive: true,
})

const deleteConfirm = ref(false)
const deletingCat = ref<any>(null)

// ─── Chip ───
const chipModal = ref(false)
const editingChip = ref<any>(null)
const chipCatId = ref(0)
const chipForm = reactive({ label: '', slug: '', sortOrder: 0 })

// ─── Field ───
const fieldModal = ref(false)
const editingField = ref<any>(null)
const fieldCatId = ref(0)
const fieldForm = reactive({
  label: '', fieldKey: '', fieldType: 'text', optionsStr: '', required: false,
})

// ─── Pricing ───
const pricingModal = ref(false)
const pricingCatId = ref(0)
const pricingForm = reactive({
  urgencyTier: 'standard', priceMXN: 0, qualifiedSurchargeMXN: 0,
})

onMounted(() => {
  requestAnimationFrame(() => { mounted.value = true })
  adminStore.fetchCategories().catch(() => {})
})

function toggle(id: number) {
  if (expanded.value.has(id)) {
    expanded.value.delete(id)
  } else {
    expanded.value.add(id)
  }
}

function sortedChips(chips: any[]) {
  return [...chips].sort((a, b) => a.sortOrder - b.sortOrder)
}

// ─── Category CRUD ───
function openCreate() {
  editingCat.value = null
  Object.assign(catForm, { name: '', slug: '', icon: '', type: 'project', sortOrder: 0, isActive: true })
  catModal.value = true
}

function openEdit(cat: any) {
  editingCat.value = cat
  Object.assign(catForm, {
    name: cat.name, slug: cat.slug, icon: cat.icon || '',
    type: cat.type, sortOrder: cat.sortOrder, isActive: cat.isActive,
  })
  catModal.value = true
}

async function saveCat() {
  saving.value = true
  try {
    if (editingCat.value) {
      await adminStore.updateCategory(editingCat.value.id, { ...catForm })
      toast.success('Categoría actualizada')
    } else {
      await adminStore.createCategory({ ...catForm })
      toast.success('Categoría creada')
    }
    catModal.value = false
    adminStore.fetchCategories()
  } catch (e: any) {
    toast.error(e?.data?.error?.message || 'Error')
  } finally {
    saving.value = false
  }
}

function confirmDelete(cat: any) {
  deletingCat.value = cat
  deleteConfirm.value = true
}

async function handleDeleteCat() {
  saving.value = true
  try {
    await adminStore.deleteCategory(deletingCat.value.id)
    toast.success('Categoría eliminada')
    deleteConfirm.value = false
    adminStore.fetchCategories()
  } catch (e: any) {
    toast.error(e?.data?.error?.message || 'Error al eliminar')
  } finally {
    saving.value = false
  }
}

// ─── Chip CRUD ───
function openAddChip(cat: any) {
  editingChip.value = null
  chipCatId.value = cat.id
  Object.assign(chipForm, { label: '', slug: '', sortOrder: (cat.chips?.length || 0) })
  chipModal.value = true
}

function openEditChip(cat: any, chip: any) {
  editingChip.value = chip
  chipCatId.value = cat.id
  Object.assign(chipForm, { label: chip.label, slug: chip.slug, sortOrder: chip.sortOrder })
  chipModal.value = true
}

async function saveChip() {
  saving.value = true
  try {
    if (editingChip.value) {
      await adminStore.updateChip(editingChip.value.id, { ...chipForm })
      toast.success('Chip actualizado')
    } else {
      await adminStore.addChip(chipCatId.value, { ...chipForm })
      toast.success('Chip agregado')
    }
    chipModal.value = false
    adminStore.fetchCategories()
  } catch (e: any) {
    toast.error(e?.data?.error?.message || 'Error')
  } finally {
    saving.value = false
  }
}

async function handleDeleteChip(chip: any) {
  try {
    await adminStore.deleteChip(chip.id)
    toast.success('Chip eliminado')
    adminStore.fetchCategories()
  } catch (e: any) {
    toast.error(e?.data?.error?.message || 'Error')
  }
}

// ─── Field CRUD ───
function openAddField(cat: any) {
  editingField.value = null
  fieldCatId.value = cat.id
  Object.assign(fieldForm, { label: '', fieldKey: '', fieldType: 'text', optionsStr: '', required: false })
  fieldModal.value = true
}

function openEditField(cat: any, field: any) {
  editingField.value = field
  fieldCatId.value = cat.id
  Object.assign(fieldForm, {
    label: field.label, fieldKey: field.fieldKey, fieldType: field.fieldType,
    optionsStr: field.options?.join(', ') || '', required: field.required,
  })
  fieldModal.value = true
}

async function saveField() {
  saving.value = true
  try {
    const body: any = {
      label: fieldForm.label,
      fieldKey: fieldForm.fieldKey,
      fieldType: fieldForm.fieldType,
      required: fieldForm.required,
    }
    if (fieldForm.fieldType === 'select' || fieldForm.fieldType === 'multi_select') {
      body.options = fieldForm.optionsStr.split(',').map((s: string) => s.trim()).filter(Boolean)
    }
    if (editingField.value) {
      await adminStore.updateField(editingField.value.id, body)
      toast.success('Campo actualizado')
    } else {
      await adminStore.addField(fieldCatId.value, body)
      toast.success('Campo agregado')
    }
    fieldModal.value = false
    adminStore.fetchCategories()
  } catch (e: any) {
    toast.error(e?.data?.error?.message || 'Error')
  } finally {
    saving.value = false
  }
}

async function handleDeleteField(field: any) {
  try {
    await adminStore.deleteField(field.id)
    toast.success('Campo eliminado')
    adminStore.fetchCategories()
  } catch (e: any) {
    toast.error(e?.data?.error?.message || 'Error')
  }
}

// ─── Pricing CRUD ───
function openAddPricing(cat: any) {
  pricingCatId.value = cat.id
  Object.assign(pricingForm, { urgencyTier: 'standard', priceMXN: 0, qualifiedSurchargeMXN: 0 })
  pricingModal.value = true
}

async function savePricing() {
  saving.value = true
  try {
    await adminStore.setPricing(pricingCatId.value, { ...pricingForm })
    toast.success('Precio configurado')
    pricingModal.value = false
    adminStore.fetchCategories()
  } catch (e: any) {
    toast.error(e?.data?.error?.message || 'Error')
  } finally {
    saving.value = false
  }
}

async function handleDeletePricing(pricing: any) {
  try {
    await adminStore.deletePricing(pricing.id)
    toast.success('Precio eliminado')
    adminStore.fetchCategories()
  } catch (e: any) {
    toast.error(e?.data?.error?.message || 'Error')
  }
}
</script>

<style lang="scss" scoped>
// ─── Page Header ───
.page-header {
  margin-bottom: 1.25rem;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  &.anim-in { opacity: 1; transform: translateY(0); }
}

.page-title {
  font-family: $headings-font-family;
  font-size: 1.375rem;
  font-weight: 700;
  color: $neutral-900;
  margin-bottom: 0.25rem;
}

.page-subtitle {
  font-size: 0.875rem;
  color: $neutral-600;
  margin-bottom: 0;
}

// ─── Content Card ───
.content-card {
  background: white;
  border: 1px solid $neutral-200;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);

  &.anim-in { opacity: 1; transform: translateY(0); }
}

// ─── Category Header ───
.cat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover { background: $neutral-50; }
}

.cat-header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.cat-icon {
  color: $cercu-indigo;
  flex-shrink: 0;
}

.cat-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: $neutral-900;
}

.cat-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.15rem;
}

.cat-slug {
  font-size: 0.7rem;
  color: $neutral-400;
  font-family: monospace;
}

.cat-type {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;

  &--emergency { background: rgba($danger, 0.1); color: $danger; }
  &--project { background: rgba($info, 0.1); color: $info; }
}

.cat-header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.cat-stat {
  font-size: 0.7rem;
  color: $neutral-400;
  display: none;

  @media (min-width: 768px) { display: inline; }
}

.cat-chevron {
  color: $neutral-400;
  transition: transform 0.3s ease;

  &--open { transform: rotate(180deg); }
}

// ─── Category Body ───
.cat-body {
  border-top: 1px solid $neutral-100;
  padding: 1rem 1.25rem;
}

.cat-section {
  &:not(:last-child) {
    margin-bottom: 1.25rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid $neutral-100;
  }
}

.cat-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.cat-section-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: $neutral-700;
  margin: 0;
}

// ─── Chips List ───
.chips-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.chip-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.625rem;
  background: $neutral-50;
  border-radius: 8px;
  font-size: 0.8rem;
  border: 1px solid $neutral-100;
}

.chip-label {
  font-weight: 500;
  color: $neutral-800;
}

.chip-slug {
  font-size: 0.7rem;
  color: $neutral-400;
  font-family: monospace;
}

.chip-order {
  font-size: 0.65rem;
  color: $neutral-300;
  margin-left: auto;
}

// ─── Fields List ───
.fields-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.field-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.625rem;
  background: $neutral-50;
  border-radius: 8px;
  border: 1px solid $neutral-100;
  flex-wrap: wrap;
}

.field-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.field-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: $neutral-800;
}

.field-meta {
  font-size: 0.7rem;
  color: $neutral-400;
}

.field-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.field-option {
  font-size: 0.65rem;
  padding: 0.1rem 0.35rem;
  background: white;
  border: 1px solid $neutral-200;
  border-radius: 4px;
  color: $neutral-600;
}

.field-actions {
  display: flex;
  gap: 0.25rem;
  margin-left: auto;
}

// ─── Pricing Grid ───
.pricing-grid {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.pricing-card {
  position: relative;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid $neutral-200;
  border-radius: 10px;
  min-width: 120px;
  text-align: center;
}

.pricing-tier {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  color: $neutral-500;
  margin-bottom: 0.25rem;
}

.pricing-amount {
  font-size: 1.1rem;
  font-weight: 700;
  color: $cercu-indigo;
}

.pricing-surcharge {
  font-size: 0.7rem;
  color: $neutral-400;
  margin-top: 0.15rem;
}

.pricing-delete {
  position: absolute;
  top: 0.35rem;
  right: 0.35rem;
}

// ─── Small Buttons ───
.btn-icon-sm {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid $neutral-200;
  border-radius: 6px;
  background: white;
  color: $neutral-400;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover { background: $neutral-50; color: $neutral-700; }
  &--danger:hover { background: rgba($danger, 0.04); color: $danger; border-color: rgba($danger, 0.3); }
}

.btn-icon-xs {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid $neutral-200;
  border-radius: 5px;
  background: white;
  color: $neutral-400;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover { background: $neutral-50; color: $neutral-700; }
  &--danger:hover { background: rgba($danger, 0.04); color: $danger; border-color: rgba($danger, 0.3); }
}

.btn-add-sm {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid $neutral-200;
  border-radius: 6px;
  background: white;
  color: $neutral-500;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease;

  &:hover {
    color: $cercu-indigo;
    transform: translateY(-1px);
    background: $neutral-50;
  }
}

// ─── Modals ───
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-card {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;

  &--sm { max-width: 380px; }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem 0;
}

.modal-title {
  font-family: $headings-font-family;
  font-size: 1.1rem;
  font-weight: 700;
  color: $neutral-900;
  margin: 0;
}

.btn-close-modal {
  background: white;
  border: 1px solid $neutral-200;
  color: $neutral-400;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 8px;
  transition: background 0.15s ease;

  &:hover { background: $neutral-50; color: $neutral-700; }
}

.modal-body { padding: 1.25rem 1.5rem; }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0 1.5rem 1.25rem;
}

// ─── Transitions ───
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 1000px;
  opacity: 1;
}
</style>
