<template>
  <div>
    <div class="page-header" :class="{ 'anim-in': mounted }">
      <h1 class="page-title">Mi Perfil Profesional</h1>
      <p class="page-subtitle">Administra la informacion de tu negocio</p>
    </div>

    <AppSpinner v-if="proStore.loading" />

  <template v-else-if="proStore.profile">
    <!-- Stats Row (mobile: scroll horizontal, desktop: grid) -->
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

    <!-- Profile Picture -->
    <div class="content-card mb-3" :class="{ 'anim-in': mounted }" style="transition-delay: 0.1s">
      <div class="d-flex align-items-center gap-3">
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
        <div>
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
            Categorias
          </h5>
          <div class="category-chips">
            <span
              v-for="cat in proStore.profile.categories"
              :key="cat.id"
              class="category-chip"
            >
              {{ cat.category?.name }}
            </span>
            <span v-if="!proStore.profile.categories?.length" class="text-muted small">
              Sin categorias asignadas
            </span>
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
const toast = useToast()
const config = useRuntimeConfig()
const mounted = ref(false)
const saving = ref(false)
const uploadingPic = ref(false)
const selectedFile = ref<File | null>(null)
const previewUrl = ref('')
const fileInput = ref<HTMLInputElement>()

const form = reactive({
  businessName: '',
  description: '',
})

const fullPictureUrl = computed(() => {
  const pic = authStore.user?.profilePicture
  if (!pic) return ''
  if (pic.startsWith('http')) return pic
  const origin = (config.public.apiBase as string).replace(/\/api\/v1$/, '')
  return `${origin}${pic}`
})

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

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true
  })
  loadProfile()
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
  }
}

async function saveProfile() {
  saving.value = true
  try {
    await proStore.updateProfile(form)
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

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }

  @media (min-width: 768px) {
    margin-bottom: 1.5rem;
  }
}

.page-title {
  font-family: $headings-font-family;
  font-size: 1.375rem;
  font-weight: 700;
  color: $neutral-900;
  margin-bottom: 0.25rem;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
}

.page-subtitle {
  font-size: 0.875rem;
  color: $neutral-500;
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

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }

  &::-webkit-scrollbar {
    display: none;
  }

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
  border: 1px solid $neutral-100;
  border-radius: 14px;
  padding: 1rem;
  text-align: center;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
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

  &--rating {
    background: rgba($warning, 0.1);
    color: $warning;
  }

  &--jobs {
    background: rgba($success, 0.1);
    color: $success;
  }

  &--time {
    background: rgba($cercu-indigo, 0.08);
    color: $cercu-indigo;
  }

  &--radius {
    background: rgba($cercu-coral, 0.1);
    color: $cercu-coral;
  }
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
  border: 1px solid $neutral-100;
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);

  @media (min-width: 768px) {
    padding: 1.5rem;
  }

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.content-card-title {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  color: $neutral-800;
  margin-bottom: 1rem;
}

.text-indigo {
  color: $cercu-indigo;
}

// ─── Category Chips ───
.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

// ─── Avatar ───
.avatar-wrapper {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid $neutral-100;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: $cercu-indigo;

    .avatar-overlay {
      opacity: 1;
    }
  }
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

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

.category-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
  background: rgba($cercu-indigo, 0.06);
  color: $cercu-indigo;
}
</style>
