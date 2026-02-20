<template>
  <div>
    <div class="page-header" :class="{ 'anim-in': mounted }">
      <h1 class="page-title">Dashboard Admin</h1>
      <p class="page-subtitle">Resumen general de la plataforma</p>
    </div>

    <!-- Summary Stats -->
    <div v-if="adminStore.summary" class="stats-row" :class="{ 'anim-in': mounted }">
        <div class="stat-card">
          <div class="stat-card-icon stat-card-icon--indigo">
            <Icon name="mdi:account-group" size="22" />
          </div>
          <div class="stat-card-value">{{ adminStore.summary.totalUsers }}</div>
          <div class="stat-card-label">Usuarios</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon stat-card-icon--green">
            <Icon name="mdi:account-hard-hat" size="22" />
          </div>
          <div class="stat-card-value">{{ adminStore.summary.totalProfessionals }}</div>
          <div class="stat-card-label">Profesionales</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon stat-card-icon--coral">
            <Icon name="mdi:file-document-multiple" size="22" />
          </div>
          <div class="stat-card-value">{{ adminStore.summary.totalLeads }}</div>
          <div class="stat-card-label">Leads</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon stat-card-icon--warning">
            <Icon name="mdi:clock-alert" size="22" />
          </div>
          <div class="stat-card-value">{{ adminStore.summary.pendingApprovals }}</div>
          <div class="stat-card-label">Pendientes</div>
        </div>
      </div>

      <!-- Cards row -->
      <div class="row g-3">
        <div class="col-12 col-md-6">
          <div class="content-card" :class="{ 'anim-in': mounted }" style="transition-delay: 0.15s">
            <h5 class="content-card-title">
              <Icon name="mdi:inbox-arrow-down" size="20" class="me-2 text-indigo" />
              Leads recientes
            </h5>
            <div class="info-rows">
              <div class="info-row">
                <span class="info-row-label">Pendientes</span>
                <span class="info-row-value">{{ adminStore.summary?.pendingLeads }}</span>
              </div>
              <div class="info-row">
                <span class="info-row-label">Completados</span>
                <span class="info-row-value info-row-value--green">{{ adminStore.summary?.completedLeads }}</span>
              </div>
            </div>
            <NuxtLink to="/admin/leads" class="btn btn-action btn-press mt-3">
              Ver todos los leads
              <Icon name="mdi:arrow-right" class="ms-1" size="16" />
            </NuxtLink>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="content-card" :class="{ 'anim-in': mounted }" style="transition-delay: 0.2s">
            <h5 class="content-card-title">
              <Icon name="mdi:lightning-bolt" size="20" class="me-2 text-indigo" />
              Acciones rapidas
            </h5>
            <div class="quick-actions">
              <NuxtLink to="/admin/profesionales" class="btn btn-quick btn-press">
                <Icon name="mdi:account-check" class="me-2" size="18" />
                Aprobar profesionales
              </NuxtLink>
              <NuxtLink to="/admin/usuarios" class="btn btn-quick btn-press">
                <Icon name="mdi:account-group" class="me-2" size="18" />
                Gestionar usuarios
              </NuxtLink>
              <NuxtLink to="/admin/reportes" class="btn btn-quick btn-press">
                <Icon name="mdi:flag" class="me-2" size="18" />
                Ver reportes
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['role'] })

const adminStore = useAdminStore()
const mounted = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true
  })
  adminStore.fetchSummary().catch(() => {})
})

useHead({ title: 'Admin Dashboard - CERCU' })
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
  margin-bottom: 1.5rem;
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
  }
}

.stat-card {
  flex-shrink: 0;
  min-width: 130px;
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

  &--indigo {
    background: rgba($cercu-indigo, 0.08);
    color: $cercu-indigo;
  }

  &--green {
    background: rgba($success, 0.1);
    color: $success;
  }

  &--coral {
    background: rgba($cercu-coral, 0.1);
    color: $cercu-coral;
  }

  &--warning {
    background: rgba($warning, 0.1);
    color: $warning;
  }
}

.stat-card-value {
  font-family: $headings-font-family;
  font-size: 1.5rem;
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
  height: 100%;
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

// ─── Info Rows ───
.info-rows {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid $neutral-50;
  }
}

.info-row-label {
  font-size: 0.875rem;
  color: $neutral-600;
}

.info-row-value {
  font-weight: 600;
  color: $neutral-800;

  &--green {
    color: $success;
  }
}

// ─── Buttons ───
.btn-action {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: $cercu-indigo;
  background: rgba($cercu-indigo, 0.06);
  border: 1px solid rgba($cercu-indigo, 0.15);
  border-radius: 10px;
  text-decoration: none;
  transition: background 0.2s ease;

  &:hover {
    background: rgba($cercu-indigo, 0.1);
    color: $cercu-indigo;
  }
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-quick {
  display: flex;
  align-items: center;
  padding: 0.625rem 0.875rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: $neutral-700;
  background: $neutral-50;
  border: 1px solid $neutral-100;
  border-radius: 10px;
  text-decoration: none;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: rgba($cercu-indigo, 0.04);
    border-color: rgba($cercu-indigo, 0.15);
    color: $cercu-indigo;
  }
}
</style>
