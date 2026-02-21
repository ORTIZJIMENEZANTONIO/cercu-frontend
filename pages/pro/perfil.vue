<template>
  <div>
    <div class="page-header" :class="{ 'anim-in': mounted }">
      <h1 class="page-title">Mi Perfil Profesional</h1>
      <p class="page-subtitle">Administra la informacion de tu negocio</p>
    </div>

    <AppSpinner v-if="proStore.loading" />

  <template v-else-if="proStore.profile">
    <!-- Stats Row -->
    <div class="stats-row" :class="{ 'anim-in': mounted }">
      <div class="stat-card">
        <div class="stat-card-icon stat-card-icon--rating">
          <Icon name="mdi:star" size="20" />
        </div>
        <div class="stat-card-value">{{ proStore.profile.rating || 0 }}/5</div>
        <div class="stat-card-label">Rating</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon stat-card-icon--jobs">
          <Icon name="mdi:briefcase-check" size="20" />
        </div>
        <div class="stat-card-value">{{ proStore.profile.completedJobs || 0 }}</div>
        <div class="stat-card-label">Trabajos</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon stat-card-icon--time">
          <Icon name="mdi:clock-fast" size="20" />
        </div>
        <div class="stat-card-value">{{ proStore.profile.avgResponseTimeMinutes || 0 }}m</div>
        <div class="stat-card-label">Respuesta</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon stat-card-icon--radius">
          <Icon name="mdi:map-marker-radius" size="20" />
        </div>
        <div class="stat-card-value">{{ proStore.profile.serviceRadiusKm || 0 }}km</div>
        <div class="stat-card-label">Cobertura</div>
      </div>
    </div>

    <!-- Profile Picture + Name/Phone -->
    <div class="content-card mb-3" :class="{ 'anim-in': mounted }" style="transition-delay: 0.1s">
      <div class="d-flex align-items-center gap-3 mb-3">
        <div class="avatar-wrapper" @click="triggerFileInput">
          <img
            v-if="previewUrl || authStore.user?.profilePicture"
            :src="previewUrl || fullPictureUrl"
            class="avatar-img"
            alt="Foto de perfil"
          />
          <div v-else class="avatar-placeholder">
            <Icon name="mdi:account" size="32" />
          </div>
          <div class="avatar-overlay">
            <Icon name="mdi:camera" size="16" />
          </div>
        </div>
        <div class="flex-grow-1">
          <h6 class="mb-1">{{ authStore.user?.name || 'Sin nombre' }}</h6>
          <p class="text-muted small mb-1">{{ authStore.user?.phone }}</p>
          <AppButton
            v-if="selectedFile"
            variant="primary"
            size="sm"
            :loading="uploadingPic"
            @click="uploadPicture"
          >
            Subir foto
          </AppButton>
          <button v-else class="btn btn-sm btn-outline-secondary" @click="triggerFileInput">
            Cambiar foto
          </button>
        </div>
      </div>

      <!-- Name/Phone change requests -->
      <div class="change-request-section">
        <h6 class="section-label">
          <Icon name="mdi:account-edit" size="16" class="me-1" />
          Cambiar nombre o teléfono
          <span class="hint-text">(requiere aprobación del admin)</span>
        </h6>
        <div class="d-flex flex-column flex-sm-row gap-2">
          <div class="flex-grow-1">
            <AppInput v-model="changeForm.name" label="Nuevo nombre" placeholder="Dejar vacío para no cambiar" />
          </div>
          <div class="flex-grow-1">
            <AppInput v-model="changeForm.phone" label="Nuevo teléfono" placeholder="Dejar vacío para no cambiar" />
          </div>
          <div class="d-flex align-items-end">
            <AppButton variant="outline-primary" size="sm" :loading="requestingChange" @click="submitChanges">
              Solicitar
            </AppButton>
          </div>
        </div>
        <div v-if="pendingChanges.length" class="pending-badges mt-2">
          <span v-for="pc in pendingChanges" :key="pc.id" class="pending-badge">
            <Icon name="mdi:clock-outline" size="13" class="me-1" />
            {{ pc.fieldName === 'name' ? 'Nombre' : 'Teléfono' }}: "{{ pc.requestedValue }}" — pendiente
          </span>
        </div>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        class="d-none"
        @change="handleFileSelect"
      />
    </div>

    <div class="row g-3 g-lg-4">
      <!-- Business Info -->
      <div class="col-12 col-lg-8">
        <div class="content-card" :class="{ 'anim-in': mounted }" style="transition-delay: 0.15s">
          <h5 class="content-card-title">
            <Icon name="mdi:store" size="20" class="me-2 text-indigo" />
            Informacion del negocio
          </h5>
          <AppInput
            v-model="form.businessName"
            label="Nombre del negocio"
            class="mb-3"
          />
          <AppTextarea
            v-model="form.description"
            label="Descripcion"
            :rows="3"
            class="mb-3"
          />

          <!-- Service Radius -->
          <div class="mb-3">
            <label class="form-label">Radio de servicio: {{ form.serviceRadiusKm }}km</label>
            <input
              v-model.number="form.serviceRadiusKm"
              type="range"
              class="form-range radius-slider"
              min="1"
              max="50"
              step="1"
            />
            <div class="d-flex justify-content-between">
              <span class="range-label">1km</span>
              <span class="range-label">50km</span>
            </div>
          </div>

          <AppButton variant="primary" :loading="saving" @click="saveProfile">
            <Icon name="mdi:content-save" class="me-1" size="18" />
            Guardar cambios
          </AppButton>
        </div>
      </div>

      <!-- Categories -->
      <div class="col-12 col-lg-4">
        <div class="content-card" :class="{ 'anim-in': mounted }" style="transition-delay: 0.25s">
          <h5 class="content-card-title">
            <Icon name="mdi:tag-multiple" size="20" class="me-2 text-indigo" />
            Categorías <span class="cat-count">({{ selectedCatIds.length }}/4)</span>
          </h5>
          <p class="text-muted small mb-3">Selecciona hasta 4 categorías en las que trabajas</p>
          <div class="category-selector">
            <button
              v-for="cat in allCategories"
              :key="cat.id"
              class="cat-option"
              :class="{ 'cat-option--active': selectedCatIds.includes(cat.id) }"
              @click="toggleCategory(cat.id)"
            >
              <Icon :name="cat.icon || 'mdi:shape'" size="16" class="me-1" />
              {{ cat.name }}
            </button>
          </div>
          <AppButton
            v-if="categoriesChanged"
            variant="primary"
            size="sm"
            class="mt-3"
            :loading="savingCats"
            @click="saveCategories"
          >
            Guardar categorías
          </AppButton>
        </div>
      </div>
    </div>

    <!-- Work Photos -->
    <div class="content-card mt-3" :class="{ 'anim-in': mounted }" style="transition-delay: 0.3s">
      <h5 class="content-card-title">
        <Icon name="mdi:image-multiple" size="20" class="me-2 text-indigo" />
        Fotos de trabajos
      </h5>
      <p class="text-muted small mb-3">Sube fotos de tus trabajos por categoría (máx 10 por categoría)</p>

      <div v-for="cat in proStore.profile.categories" :key="cat.id" class="work-photo-section">
        <div class="work-photo-header">
          <h6 class="work-photo-cat">{{ cat.category?.name }}</h6>
          <label class="btn-add-photo">
            <Icon name="mdi:plus" size="14" class="me-1" /> Agregar fotos
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              class="d-none"
              @change="(e: Event) => handleWorkPhotoUpload(e, cat.category?.id)"
            />
          </label>
        </div>
        <div class="work-photos-grid">
          <div
            v-for="photo in getPhotosForCategory(cat.category?.id)"
            :key="photo.id"
            class="work-photo-item"
          >
            <img :src="getPhotoUrl(photo.url)" alt="Trabajo" />
            <button class="work-photo-delete" @click="removeWorkPhoto(photo.id)">
              <Icon name="mdi:close" size="14" />
            </button>
          </div>
          <div v-if="!getPhotosForCategory(cat.category?.id).length" class="work-photo-empty">
            <Icon name="mdi:image-off" size="24" />
            <span>Sin fotos</span>
          </div>
        </div>
      </div>
    </div>
  </template>

  <!-- Error / empty state -->
  <div v-else class="content-card" :class="{ 'anim-in': mounted }">
    <AppEmptyState
      icon="mdi:account-alert"
      title="No se pudo cargar tu perfil"
      description="Verifica tu conexion e intenta de nuevo."
    >
      <template #action>
        <AppButton variant="primary" @click="loadProfile">
          <Icon name="mdi:refresh" class="me-1" size="18" />
          Reintentar
        </AppButton>
      </template>
    </AppEmptyState>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'professional', middleware: ['role'] })

const proStore = useProfessionalStore()
const authStore = useAuthStore()
const categoriesStore = useCategoriesStore()
const toast = useToast()
const config = useRuntimeConfig()
const mounted = ref(false)
const saving = ref(false)
const savingCats = ref(false)
const uploadingPic = ref(false)
const requestingChange = ref(false)
const selectedFile = ref<File | null>(null)
const previewUrl = ref('')
const fileInput = ref<HTMLInputElement>()
const workPhotos = ref<any[]>([])
const pendingChanges = ref<any[]>([])

const form = reactive({
  businessName: '',
  description: '',
  serviceRadiusKm: 10,
})

const changeForm = reactive({
  name: '',
  phone: '',
})

const selectedCatIds = ref<number[]>([])
const originalCatIds = ref<number[]>([])

const allCategories = computed(() => categoriesStore.categories)

const categoriesChanged = computed(() => {
  if (selectedCatIds.value.length !== originalCatIds.value.length) return true
  return !selectedCatIds.value.every(id => originalCatIds.value.includes(id))
})

const fullPictureUrl = computed(() => {
  const pic = authStore.user?.profilePicture
  if (!pic) return ''
  if (pic.startsWith('http')) return pic
  const origin = (config.public.apiBase as string).replace(/\/api\/v1$/, '')
  return `${origin}${pic}`
})

function getPhotoUrl(url: string) {
  if (url.startsWith('http')) return url
  const origin = (config.public.apiBase as string).replace(/\/api\/v1$/, '')
  return `${origin}${url}`
}

function getPhotosForCategory(categoryId: number) {
  return workPhotos.value.filter(p => p.categoryId === categoryId)
}

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    toast.error('La imagen no debe superar 5MB')
    return
  }
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

async function uploadPicture() {
  if (!selectedFile.value) return
  uploadingPic.value = true
  try {
    const formData = new FormData()
    formData.append('profilePicture', selectedFile.value)
    await $fetch(`${config.public.apiBase}/users/profile-picture`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: formData,
    })
    await authStore.fetchMe()
    selectedFile.value = null
    toast.success('Foto actualizada')
  } catch {
    toast.error('Error al subir foto')
  } finally {
    uploadingPic.value = false
  }
}

function toggleCategory(id: number) {
  const idx = selectedCatIds.value.indexOf(id)
  if (idx >= 0) {
    selectedCatIds.value.splice(idx, 1)
  } else {
    if (selectedCatIds.value.length >= 4) {
      toast.warning('Máximo 4 categorías permitidas')
      return
    }
    selectedCatIds.value.push(id)
  }
}

async function saveCategories() {
  savingCats.value = true
  try {
    await proStore.updateCategories(selectedCatIds.value)
    originalCatIds.value = [...selectedCatIds.value]
    toast.success('Categorías actualizadas')
    loadWorkPhotos()
  } catch (e: any) {
    toast.error(e?.data?.error?.message || 'Error al guardar categorías')
  } finally {
    savingCats.value = false
  }
}

async function handleWorkPhotoUpload(e: Event, categoryId: number) {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files || [])
  if (!files.length) return

  const oversized = files.some(f => f.size > 5 * 1024 * 1024)
  if (oversized) {
    toast.error('Las imágenes no deben superar 5MB')
    return
  }

  try {
    await proStore.uploadWorkPhotos(categoryId, files)
    toast.success('Fotos subidas')
    loadWorkPhotos()
  } catch (e: any) {
    toast.error(e?.data?.error?.message || 'Error al subir fotos')
  }
  target.value = '' // reset file input
}

async function removeWorkPhoto(photoId: number) {
  try {
    await proStore.deleteWorkPhoto(photoId)
    workPhotos.value = workPhotos.value.filter(p => p.id !== photoId)
    toast.success('Foto eliminada')
  } catch {
    toast.error('Error al eliminar foto')
  }
}

async function submitChanges() {
  requestingChange.value = true
  try {
    let submitted = 0
    if (changeForm.name.trim()) {
      await proStore.requestProfileChange('name', changeForm.name.trim())
      submitted++
    }
    if (changeForm.phone.trim()) {
      await proStore.requestProfileChange('phone', changeForm.phone.trim())
      submitted++
    }
    if (submitted === 0) {
      toast.warning('Escribe un nuevo nombre o teléfono')
      return
    }
    toast.success('Solicitud enviada. El admin revisará tu cambio.')
    changeForm.name = ''
    changeForm.phone = ''
    loadPendingChanges()
  } catch (e: any) {
    toast.error(e?.data?.error?.message || 'Error al enviar solicitud')
  } finally {
    requestingChange.value = false
  }
}

async function loadWorkPhotos() {
  try {
    workPhotos.value = await proStore.getWorkPhotos()
  } catch { /* ignore */ }
}

async function loadPendingChanges() {
  try {
    pendingChanges.value = await proStore.getPendingChanges()
  } catch { /* ignore */ }
}

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true
  })
  loadProfile()
  categoriesStore.fetchAll()
})

async function loadProfile() {
  try {
    await proStore.fetchProfile()
  } catch {
    // loading is set to false in finally block of store
  }
  if (proStore.profileMissing && !authStore.isAdmin) {
    return navigateTo('/pro/onboarding')
  }
  if (proStore.profile) {
    form.businessName = proStore.profile.businessName || ''
    form.description = proStore.profile.description || ''
    form.serviceRadiusKm = proStore.profile.serviceRadiusKm || 10
    const catIds = proStore.profile.categories?.map((c: any) => c.category?.id).filter(Boolean) || []
    selectedCatIds.value = [...catIds]
    originalCatIds.value = [...catIds]
    loadWorkPhotos()
    loadPendingChanges()
  }
}

async function saveProfile() {
  saving.value = true
  try {
    await proStore.updateProfile({
      businessName: form.businessName,
      description: form.description,
      serviceRadiusKm: form.serviceRadiusKm,
    })
    toast.success('Perfil actualizado')
  } catch {
    toast.error('Error al guardar')
  } finally {
    saving.value = false
  }
}

useHead({ title: 'Mi Perfil - CERCU Pro' })
</script>

<style lang="scss" scoped>
// ─── Page Header ───
.page-header {
  margin-bottom: 1.25rem;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  &.anim-in { opacity: 1; transform: translateY(0); }

  @media (min-width: 768px) { margin-bottom: 1.5rem; }
}

.page-title {
  font-family: $headings-font-family;
  font-size: 1.375rem;
  font-weight: 700;
  color: $neutral-900;
  margin-bottom: 0.25rem;

  @media (min-width: 768px) { font-size: 1.5rem; }
}

.page-subtitle {
  font-size: 0.875rem;
  color: $neutral-600;
  margin-bottom: 0;
}

// ─── Stats Row ───
.stats-row {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s ease 0.05s, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.05s;

  &.anim-in { opacity: 1; transform: translateY(0); }
  &::-webkit-scrollbar { display: none; }

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    overflow: visible;
    margin-bottom: 1.5rem;
  }
}

.stat-card {
  flex-shrink: 0;
  min-width: 120px;
  background: white;
  border: 1px solid $neutral-200;
  border-radius: 14px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
}

.stat-card-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.625rem;
  background: $neutral-50;
  border: 1px solid $neutral-100;

  &--rating { color: $warning; }
  &--jobs { color: $success; }
  &--time { color: $cercu-indigo; }
  &--radius { color: $cercu-coral; }
}

.stat-card-value {
  font-family: $headings-font-family;
  font-size: 1.25rem;
  font-weight: 700;
  color: $neutral-900;
  line-height: 1.2;
}

.stat-card-label {
  font-size: 0.7rem;
  font-weight: 500;
  color: $neutral-400;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-top: 0.125rem;
}

// ─── Content Card ───
.content-card {
  background: white;
  border: 1px solid $neutral-200;
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);

  @media (min-width: 768px) { padding: 1.5rem; }

  &.anim-in { opacity: 1; transform: translateY(0); }
}

.content-card-title {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  color: $neutral-800;
  margin-bottom: 1rem;
}

.text-indigo { color: $cercu-indigo; }

// ─── Avatar ───
.avatar-wrapper {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid $neutral-200;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: $cercu-indigo-light;
    .avatar-overlay { opacity: 1; }
  }
}

.avatar-img { width: 100%; height: 100%; object-fit: cover; }

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $neutral-100;
  color: $neutral-400;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  opacity: 0;
  transition: opacity 0.2s ease;
}

// ─── Change Request ───
.change-request-section {
  border-top: 1px solid $neutral-100;
  padding-top: 1rem;
}

.section-label {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: $neutral-700;
  margin-bottom: 0.75rem;
}

.hint-text {
  font-weight: 400;
  font-size: 0.75rem;
  color: $neutral-400;
  margin-left: 0.5rem;
}

.pending-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.pending-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 500;
  background: rgba($warning, 0.1);
  color: $warning;
}

// ─── Radius Slider ───
.radius-slider {
  width: 100%;
  accent-color: $cercu-indigo;
}

.range-label {
  font-size: 0.7rem;
  color: $neutral-400;
}

// ─── Category Selector ───
.cat-count {
  font-size: 0.8rem;
  font-weight: 400;
  color: $neutral-400;
  margin-left: 0.375rem;
}

.category-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.cat-option {
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid $neutral-200;
  background: white;
  color: $neutral-600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: $cercu-indigo;
    transform: translateY(-1px);
    border-color: rgba($cercu-indigo, 0.3);
  }

  &--active {
    color: $cercu-indigo;
    font-weight: 600;
    background: rgba($cercu-indigo, 0.06);
    border-color: rgba($cercu-indigo, 0.3);
  }
}

// ─── Work Photos ───
.work-photo-section {
  &:not(:last-child) {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px dashed $neutral-100;
  }
}

.work-photo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.work-photo-cat {
  font-size: 0.9rem;
  font-weight: 600;
  color: $neutral-800;
  margin: 0;
}

.btn-add-photo {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.625rem;
  border: 1px solid $neutral-200;
  border-radius: 8px;
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

.work-photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.625rem;
}

.work-photo-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid $neutral-200;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
}

.work-photo-delete {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;

  .work-photo-item:hover & {
    opacity: 1;
  }
}

.work-photo-empty {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  color: $neutral-300;
  font-size: 0.8rem;
}
</style>
