<template>
  <div class="cuenta-page">
    <div class="container py-4">
      <div class="page-header" :class="{ 'anim-in': mounted }">
        <h1 class="page-title">Mi cuenta</h1>
        <p class="page-subtitle">Administra tu informacion personal</p>
      </div>

      <div class="row g-3 g-lg-4">
        <!-- Profile Picture -->
        <div class="col-12 col-md-4">
          <div class="content-card text-center" :class="{ 'anim-in': mounted }" style="transition-delay: 0.1s">
            <div class="avatar-wrapper mx-auto mb-3" @click="triggerFileInput">
              <img
                v-if="previewUrl || authStore.user?.profilePicture"
                :src="previewUrl || fullPictureUrl"
                class="avatar-img"
                alt="Foto de perfil"
              />
              <div v-else class="avatar-placeholder">
                <Icon name="mdi:account" size="48" />
              </div>
              <div class="avatar-overlay">
                <Icon name="mdi:camera" size="20" />
              </div>
            </div>
            <input
              ref="fileInput"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              class="d-none"
              @change="handleFileSelect"
            />
            <AppButton
              v-if="selectedFile"
              variant="primary"
              size="sm"
              :loading="uploadingPic"
              @click="uploadPicture"
            >
              <Icon name="mdi:upload" class="me-1" size="16" />
              Subir foto
            </AppButton>
            <p class="text-muted small mt-2 mb-0">JPG, PNG o WebP. Max 5MB</p>

            <!-- Trust Score -->
            <div v-if="trustScore !== null" class="mt-3 pt-3 border-top">
              <TrustGauge :score="trustScore" :animate="mounted" />
            </div>
          </div>
        </div>

        <!-- Profile Form -->
        <div class="col-12 col-md-8">
          <div class="content-card" :class="{ 'anim-in': mounted }" style="transition-delay: 0.15s">
            <h5 class="content-card-title">
              <Icon name="mdi:account-edit" size="20" class="me-2 text-indigo" />
              Datos personales
            </h5>
            <AppInput v-model="form.name" label="Nombre completo" class="mb-3" />
            <AppInput v-model="form.email" label="Correo electronico" type="email" class="mb-3" />
            <AppDateInput
              v-model="form.dateOfBirth"
              label="Fecha de nacimiento"
              :max-date="maxDob"
              class="mb-3"
            />
            <div class="app-input mb-3">
              <label class="form-label">Telefono</label>
              <input
                :value="authStore.user?.phone"
                class="form-control"
                disabled
              />
              <div class="form-text">El telefono no se puede cambiar</div>
            </div>
            <AppButton variant="primary" :loading="saving" @click="saveProfile">
              <Icon name="mdi:content-save" class="me-1" size="18" />
              Guardar cambios
            </AppButton>
          </div>
        </div>
      </div>

      <!-- Logout -->
      <div class="content-card mt-3" :class="{ 'anim-in': mounted }" style="transition-delay: 0.25s">
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <h6 class="mb-1">Cerrar sesion</h6>
            <p class="text-muted small mb-0">Saldras de tu cuenta en este dispositivo</p>
          </div>
          <AppButton variant="outline" @click="handleLogout">
            <Icon name="mdi:logout" class="me-1" size="18" />
            Salir
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const authStore = useAuthStore()
const gamStore = useGamificationStore()
const toast = useToast()
const config = useRuntimeConfig()
const mounted = ref(false)
const trustScore = ref<number | null>(null)
const saving = ref(false)
const uploadingPic = ref(false)
const selectedFile = ref<File | null>(null)
const previewUrl = ref('')
const fileInput = ref<HTMLInputElement>()

const form = reactive({
  name: '',
  email: '',
  dateOfBirth: '',
})

const maxDob = computed(() => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 18)
  return d.toISOString().split('T')[0]
})

const fullPictureUrl = computed(() => {
  const pic = authStore.user?.profilePicture
  if (!pic) return ''
  if (pic.startsWith('http')) return pic
  const origin = (config.public.apiBase as string).replace(/\/api\/v1$/, '')
  return `${origin}${pic}`
})

onMounted(async () => {
  requestAnimationFrame(() => { mounted.value = true })
  await authStore.fetchMe()
  if (authStore.user) {
    form.name = authStore.user.name || ''
    form.email = authStore.user.email || ''
    form.dateOfBirth = authStore.user.dateOfBirth || ''
  }
  try {
    await gamStore.fetchTrustScore()
    trustScore.value = gamStore.trustScore?.score ?? null
  } catch { /* Trust score not available */ }
})

async function saveProfile() {
  saving.value = true
  try {
    await $fetch(`${config.public.apiBase}/users/profile`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: { name: form.name, email: form.email, dateOfBirth: form.dateOfBirth },
    })
    await authStore.fetchMe()
    toast.success('Perfil actualizado')
  } catch {
    toast.error('Error al guardar')
  } finally {
    saving.value = false
  }
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

function handleLogout() {
  authStore.logout()
  navigateTo('/auth/login')
}

useHead({ title: 'Mi cuenta - CERCU' })
</script>

<style lang="scss" scoped>
.cuenta-page {
  min-height: 100vh;
  background: $neu-bg;
}

.page-header {
  margin-bottom: 1.25rem;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-title {
  font-family: $headings-font-family;
  font-size: 1.5rem;
  font-weight: 700;
  color: $neutral-900;
  margin-bottom: 0.25rem;
}

.page-subtitle {
  font-size: 0.875rem;
  color: $neutral-500;
  margin-bottom: 0;
}

.content-card {
  background: $neu-bg;
  border: none;
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: $neu-shadow-md;
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

// ─── Avatar ───
.avatar-wrapper {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  box-shadow: $neu-shadow-sm;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: $neu-shadow-lg;

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
  background: $neu-bg-dark;
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

</style>
