<template>
  <div>
    <!-- Hero -->
    <section class="hero-section">
      <div class="hero-bg" />
      <div class="container hero-container">
        <div class="row align-items-center min-vh-hero">
          <div class="col-lg-6 hero-content">
            <div class="hero-badge mb-3" :class="{ 'anim-in': mounted }">
              <Icon name="mdi:map-marker-check" size="16" />
              <span>Servicios verificados en tu zona</span>
            </div>
            <h1 class="hero-title" :class="{ 'anim-in': mounted }">
              Encuentra profesionales
              <span class="hero-title-accent">cerca de ti</span>
            </h1>
            <p class="hero-subtitle" :class="{ 'anim-in': mounted }">
              Plomeros, electricistas, cerrajeros y mas.
              Agenda en minutos, sin complicaciones.
            </p>
            <div class="hero-search" :class="{ 'anim-in': mounted }">
              <div class="position-relative">
                <Icon name="mdi:magnify" class="search-icon" size="22" />
                <input
                  v-model="searchQuery"
                  type="text"
                  class="search-input"
                  placeholder="Que servicio necesitas?"
                  @keyup.enter="goToSearch"
                  @focus="searchFocused = true"
                  @blur="searchFocused = false"
                />
              </div>
            </div>
            <div class="hero-actions" :class="{ 'anim-in': mounted }">
              <NuxtLink to="/solicitar" class="btn btn-hero-primary btn-press">
                Solicitar servicio
                <Icon name="mdi:arrow-right" class="ms-2 cta-arrow" size="18" />
              </NuxtLink>
              <NuxtLink to="/categorias" class="btn btn-hero-secondary btn-press">
                Ver categorias
              </NuxtLink>
            </div>
          </div>
          <div class="col-lg-6 d-none d-lg-block">
            <div class="hero-map-visual" :class="{ 'anim-in': mounted }">
              <!-- Map illustration -->
              <div class="map-frame">
                <!-- Real map background -->
                <ClientOnly>
                  <LMap
                    :zoom="14"
                    :center="[19.4326, -99.1332]"
                    :min-zoom="12"
                    :max-zoom="16"
                    :max-bounds="[[19.15, -99.45], [19.65, -98.85]]"
                    :max-bounds-viscosity="1.0"
                    :use-global-leaflet="false"
                    :options="{ zoomControl: false, attributionControl: false, dragging: true, scrollWheelZoom: false, doubleClickZoom: false, touchZoom: true, boxZoom: false, keyboard: false }"
                    class="map-leaflet-bg"
                  >
                    <LTileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                  </LMap>
                </ClientOnly>
                <!-- Indigo overlay to blend with theme -->
                <div class="map-tint" />
                <!-- Radius circle -->
                <div class="map-radius" />
                <!-- Pins -->
                <div class="map-pin map-pin--center">
                  <Icon name="mdi:home" size="16" />
                </div>
                <div class="map-pin map-pin--1 float" style="animation-delay: 0s">
                  <Icon name="mdi:wrench" size="12" />
                </div>
                <div class="map-pin map-pin--2 float" style="animation-delay: 0.5s">
                  <Icon name="mdi:lightning-bolt" size="12" />
                </div>
                <div class="map-pin map-pin--3 float" style="animation-delay: 1s">
                  <Icon name="mdi:key" size="12" />
                </div>
                <div class="map-pin map-pin--4 float" style="animation-delay: 1.5s">
                  <Icon name="mdi:hammer" size="12" />
                </div>
                <!-- Distance label -->
                <div class="map-label map-label--distance">
                  <Icon name="mdi:map-marker-distance" size="14" />
                  <span>2.3 km</span>
                </div>
                <div class="map-label map-label--area">
                  <span>CDMX + Edomex</span>
                </div>
              </div>
              <!-- Floating stats -->
              <div class="hero-stat hero-stat--1">
                <div class="hero-stat-icon">
                  <Icon name="mdi:shield-check" size="18" />
                </div>
                <div>
                  <strong>Verificados</strong>
                  <span>ID + reseñas</span>
                </div>
              </div>
              <div class="hero-stat hero-stat--2">
                <div class="hero-stat-icon hero-stat-icon--coral">
                  <Icon name="mdi:clock-fast" size="18" />
                </div>
                <div>
                  <strong>En minutos</strong>
                  <span>Respuesta rapida</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Grid -->
    <section ref="categoriesSection" class="section-padding">
      <div class="container">
        <div class="section-header mb-4">
          <h2 ref="categoriesTitle" class="h3 fw-bold mb-1">Servicios populares</h2>
          <p class="text-muted mb-0">Selecciona una categoria para empezar</p>
        </div>
        <div class="row g-3">
          <div
            v-for="cat in displayCategories"
            :key="cat.id || cat.slug"
            class="col-6 col-md-4 col-lg-3 category-item"
          >
            <NuxtLink :to="`/categorias/${cat.slug}`" class="text-decoration-none">
              <div class="card category-card h-100 text-center p-4">
                <div class="category-icon mx-auto mb-3">
                  <Icon :name="cat.icon || 'mdi:wrench'" size="28" />
                </div>
                <h6 class="fw-semibold mb-1">{{ cat.name }}</h6>
                <span class="small text-muted">{{ cat.chips?.length || 0 }} servicios</span>
              </div>
            </NuxtLink>
          </div>
        </div>
        <div v-if="categoriesStore.categories.length > 8" class="text-center mt-4">
          <NuxtLink to="/categorias" class="btn btn-outline-primary btn-press">
            Ver todas las categorias
            <Icon name="mdi:arrow-right" class="ms-1" size="16" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section ref="howSection" class="section-padding how-section">
      <div class="container">
        <h2 class="h3 fw-bold text-center mb-2">Como funciona</h2>
        <p class="text-center text-muted mb-5">En 3 simples pasos</p>
        <div class="row g-4">
          <div v-for="(step, i) in howItWorks" :key="i" class="col-md-4 text-center how-step">
            <div class="mb-3">
              <div class="how-number">{{ i + 1 }}</div>
              <div class="how-icon-circle mx-auto">
                <Icon :name="step.icon" size="28" />
              </div>
            </div>
            <h5 class="fw-semibold">{{ step.title }}</h5>
            <p class="text-muted small">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust Signals -->
    <section ref="trustSection" class="trust-section">
      <div class="container">
        <div class="row g-4 text-center">
          <div v-for="(stat, i) in trustStats" :key="i" class="col-6 col-md-3 trust-stat">
            <h3 ref="trustNumbers" class="trust-number">{{ stat.display }}</h3>
            <p class="trust-label">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="section-padding text-center">
      <div class="container">
        <div class="cta-box">
          <h2 class="h3 fw-bold text-white mb-3">Listo para resolver tu problema?</h2>
          <p class="text-white-75 mb-4">Describe lo que necesitas y encuentra profesionales verificados cerca de ti.</p>
          <NuxtLink to="/solicitar" class="btn btn-cta-light btn-press">
            Solicitar servicio gratis
            <Icon name="mdi:arrow-right" class="ms-2" size="18" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'

// Redirect logged-in regular users to their solicitudes dashboard
const authStore = useAuthStore()
if (import.meta.client && authStore.isAuthenticated && !authStore.isProfessional && !authStore.isAdmin) {
  navigateTo('/solicitudes', { replace: true })
}

const categoriesStore = useCategoriesStore()
const { countUp } = useAnimations()
const { revealChildren, reveal } = useScrollReveal()

const searchQuery = ref('')
const searchFocused = ref(false)
const mounted = ref(false)

const categoriesSection = ref<HTMLElement>()
const categoriesTitle = ref<HTMLElement>()
const howSection = ref<HTMLElement>()
const trustSection = ref<HTMLElement>()
const trustNumbers = ref<HTMLElement[]>([])

const howItWorks = [
  { icon: 'mdi:clipboard-text', title: 'Describe tu necesidad', desc: 'Selecciona el servicio, describe el problema y sube fotos si quieres.' },
  { icon: 'mdi:map-marker-radius', title: 'Encontramos profesionales', desc: 'Buscamos los mejores profesionales verificados cerca de tu ubicacion.' },
  { icon: 'mdi:handshake', title: 'Agenda y resuelve', desc: 'El profesional te contacta, coordinan la visita y resuelven tu problema.' },
]

const trustStats = [
  { value: 500, display: '500+', label: 'Profesionales verificados', prefix: '', suffix: '+' },
  { value: 12, display: '12', label: 'Categorias de servicio', prefix: '', suffix: '' },
  { value: 0, display: 'CDMX', label: 'y Estado de Mexico', isText: true },
  { value: 0, display: '24/7', label: 'Emergencias disponibles', isText: true },
]

const displayCategories = computed(() =>
  categoriesStore.categories.slice(0, 8)
)

onMounted(() => {
  // Trigger hero animations immediately
  requestAnimationFrame(() => {
    mounted.value = true
  })

  // Fetch categories in background (don't block UI)
  categoriesStore.fetchAll().catch(() => {})

  animateScrollSections()
})

function animateScrollSections() {
  if (categoriesTitle.value) {
    reveal(categoriesTitle.value, 'fadeUp')
  }
  if (categoriesSection.value) {
    revealChildren(categoriesSection.value, '.category-item', 0.08)
  }
  if (howSection.value) {
    revealChildren(howSection.value, '.how-step', 0.15)
  }

  if (trustSection.value) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateTrustNumbers()
          io.unobserve(entry.target)
        }
      })
    }, { threshold: 0.3 })
    io.observe(trustSection.value)
  }
}

function animateTrustNumbers() {
  if (!trustNumbers.value?.length) return
  trustNumbers.value.forEach((el, i) => {
    const stat = trustStats[i]
    if (stat.isText) {
      gsap.fromTo(el, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5, delay: i * 0.1, ease: 'back.out(1.7)' })
    } else if (stat.value > 0) {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: i * 0.1 })
      countUp(el, stat.value, { duration: 1.2, delay: i * 0.1, prefix: stat.prefix, suffix: stat.suffix })
    }
  })
}

function goToSearch() {
  navigateTo({ path: '/buscar', query: { q: searchQuery.value } })
}

useHead({
  title: 'CERCU - Oficios a domicilio en CDMX',
  meta: [
    { name: 'description', content: 'Encuentra profesionales de confianza para servicios a domicilio en CDMX y Estado de Mexico.' },
  ],
})
</script>

<style lang="scss" scoped>
// ─── Hero Section ───
.hero-section {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, $cercu-indigo 0%, darken($cercu-indigo, 8%) 50%, $cercu-indigo-dark 100%);
  color: white;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 70% 50%, rgba(white, 0.06) 0%, transparent 60%),
    radial-gradient(circle at 20% 80%, rgba($cercu-coral, 0.08) 0%, transparent 40%);
  pointer-events: none;
}

.hero-container {
  position: relative;
  z-index: 1;
}

.min-vh-hero {
  min-height: 520px;
  padding: 3rem 0;

  @media (min-width: 992px) {
    min-height: 560px;
    padding: 4rem 0;
  }
}

// ─── Hero Content (left column) ───
.hero-content {
  position: relative;
  z-index: 2;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  background: rgba(white, 0.12);
  border: 1px solid rgba(white, 0.18);
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(white, 0.9);
  backdrop-filter: blur(4px);
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.5s ease 0.1s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.1s;

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  font-family: $headings-font-family;
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: white;
  margin-bottom: 1rem;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease 0.2s, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s;

  @media (min-width: 992px) {
    font-size: 2.75rem;
  }

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title-accent {
  display: block;
  color: $cercu-coral-light;
}

.hero-subtitle {
  font-size: 1.05rem;
  line-height: 1.6;
  color: rgba(white, 0.75);
  margin-bottom: 1.5rem;
  max-width: 440px;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease 0.35s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.35s;

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

// ─── Hero Search ───
.hero-search {
  margin-bottom: 1.5rem;
  max-width: 440px;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease 0.45s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.45s;

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: $neutral-400;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  font-size: 1rem;
  border: 2px solid rgba(white, 0.2);
  border-radius: $border-radius-lg;
  background: rgba(white, 0.1);
  color: white;
  backdrop-filter: blur(4px);
  transition: border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;

  &::placeholder {
    color: rgba(white, 0.5);
  }

  &:focus {
    outline: none;
    border-color: rgba(white, 0.5);
    background: rgba(white, 0.15);
    box-shadow: 0 0 0 4px rgba(white, 0.08);
  }
}

// ─── Hero Actions ───
.hero-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease 0.55s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.55s;

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn-hero-primary {
  display: inline-flex;
  align-items: center;
  padding: 0.8rem 1.75rem;
  font-weight: 600;
  font-size: 1rem;
  border-radius: $border-radius-lg;
  background: white;
  color: $cercu-indigo;
  border: none;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    color: $cercu-indigo-dark;
  }

  .cta-arrow {
    transition: transform 0.2s ease;
  }

  &:hover .cta-arrow {
    transform: translateX(3px);
  }
}

.btn-hero-secondary {
  display: inline-flex;
  align-items: center;
  padding: 0.8rem 1.75rem;
  font-weight: 600;
  font-size: 1rem;
  border-radius: $border-radius-lg;
  background: transparent;
  color: white;
  border: 2px solid rgba(white, 0.3);
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: rgba(white, 0.1);
    border-color: rgba(white, 0.5);
    color: white;
  }
}

// ─── Hero Map Visual (right column) ───
.hero-map-visual {
  position: relative;
  height: 400px;
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  transition: opacity 0.7s ease 0.4s, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.4s;

  &.anim-in {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.map-frame {
  position: absolute;
  top: 10px;
  left: 20px;
  right: 20px;
  bottom: 40px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 3px solid rgba(white, 0.15);
}

.map-leaflet-bg {
  position: absolute;
  inset: 0;
  z-index: 0;

  :deep(.leaflet-container) {
    background: transparent;
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  :deep(.leaflet-tile-pane) {
    filter: saturate(0.3) brightness(0.85);
  }
}

.map-tint {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba($cercu-indigo, 0.45);
  pointer-events: none;
}

.map-radius {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 2px dashed rgba(white, 0.3);
  background: rgba(white, 0.06);
  animation: pulseRadius 3s ease-in-out infinite;
  z-index: 2;
  pointer-events: none;
}

@keyframes pulseRadius {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
  50% { transform: translate(-50%, -50%) scale(1.05); opacity: 1; }
}

.map-pin {
  position: absolute;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 2;
  color: white;
  pointer-events: none;

  &--center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    background: $cercu-indigo;
    border: 3px solid white;
    z-index: 3;
  }

  &--1 {
    top: 25%;
    left: 65%;
    width: 30px;
    height: 30px;
    background: $cercu-coral;
  }

  &--2 {
    top: 60%;
    left: 30%;
    width: 30px;
    height: 30px;
    background: $warning;
  }

  &--3 {
    top: 35%;
    left: 25%;
    width: 28px;
    height: 28px;
    background: $success;
  }

  &--4 {
    top: 70%;
    left: 68%;
    width: 28px;
    height: 28px;
    background: $info;
  }
}

.map-label {
  position: absolute;
  background: $neu-bg;
  border-radius: 8px;
  padding: 0.25rem 0.625rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: $neutral-800;
  box-shadow: $neu-shadow-md;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  z-index: 4;
  pointer-events: none;

  &--distance {
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    color: $cercu-indigo;
  }

  &--area {
    top: 8%;
    right: 8%;
    font-size: 0.65rem;
    color: $neutral-500;
  }
}

// ─── Hero Floating Stats ───
.hero-stat {
  position: absolute;
  background: $neu-bg;
  border-radius: 14px;
  padding: 0.625rem 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  box-shadow: $neu-shadow-lg;
  z-index: 5;

  strong {
    display: block;
    font-size: 0.8rem;
    color: $neutral-800;
    line-height: 1.2;
  }

  span {
    font-size: 0.7rem;
    color: $neutral-500;
  }

  &--1 {
    bottom: 25px;
    left: 0;
    animation: floatStat 4s ease-in-out infinite;
  }

  &--2 {
    top: 0;
    right: 0;
    animation: floatStat 4s ease-in-out infinite 1s;
  }
}

@keyframes floatStat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.hero-stat-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: $neu-bg;
  box-shadow: $neu-shadow-sm;
  color: $cercu-indigo;
  display: flex;
  align-items: center;
  justify-content: center;

  &--coral {
    color: $cercu-coral;
  }
}

// ─── Categories Section ───
.section-header {
  display: flex;
  flex-direction: column;
}

.category-card {
  background: $neu-bg;
  border: none;
  border-radius: $border-radius-lg;
  box-shadow: $neu-shadow-md;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $neu-shadow-xl;
  }

  &:active {
    transform: translateY(0);
    box-shadow: $neu-inset-sm;
    transition-duration: 0.1s;
  }
}

.category-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: $neu-bg;
  box-shadow: $neu-shadow-sm;
  color: $cercu-indigo;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
}

.category-card:hover .category-icon {
  transform: scale(1.12) rotate(5deg);
  box-shadow: $neu-shadow-md;
}

// ─── How It Works ───
.how-section {
  background: $neu-bg;
}

.how-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: $cercu-indigo;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.how-icon-circle {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: $neu-bg;
  box-shadow: $neu-shadow-md;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $cercu-indigo;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
}

.how-step:hover .how-icon-circle {
  transform: scale(1.1) rotate(5deg);
  box-shadow: $neu-shadow-lg;
}

// ─── Trust Signals ───
.trust-section {
  background: $cercu-indigo;
  padding: 3rem 0;
  color: white;

  @media (min-width: 768px) {
    padding: 4rem 0;
  }
}

.trust-number {
  font-family: $headings-font-family;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
}

.trust-label {
  color: rgba(white, 0.7);
  font-size: 0.875rem;
  margin-bottom: 0;
}

.trust-stat {
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

// ─── CTA Box ───
.cta-box {
  background: linear-gradient(135deg, $cercu-indigo 0%, $cercu-indigo-dark 100%);
  border-radius: 20px;
  padding: 3rem 2rem;
  box-shadow: 0 12px 40px rgba($cercu-indigo, 0.25);

  @media (min-width: 768px) {
    padding: 4rem 3rem;
  }
}

.text-white-75 {
  color: rgba(white, 0.75);
}

.btn-cta-light {
  display: inline-flex;
  align-items: center;
  padding: 0.875rem 2rem;
  font-weight: 600;
  font-size: 1rem;
  border-radius: $border-radius-lg;
  background: white;
  color: $cercu-indigo;
  border: none;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    color: $cercu-indigo-dark;
  }
}

// ─── Section padding ───
.section-padding {
  padding: 4rem 0;

  @media (min-width: 768px) {
    padding: 5rem 0;
  }
}
</style>
