<template>
  <div>
    <div class="page-header" :class="{ 'anim-in': mounted }">
      <h1 class="page-title">Profesionales</h1>
      <p class="page-subtitle">Aprueba y gestiona profesionales registrados</p>
    </div>

    <div class="content-card" :class="{ 'anim-in': mounted }" style="transition-delay: 0.1s">
        <div class="filter-bar">
          <select v-model="statusFilter" class="filter-select">
            <option value="">Todos</option>
            <option value="completed">Pendiente aprobacion</option>
            <option value="approved">Aprobados</option>
            <option value="rejected">Rechazados</option>
          </select>
        </div>

        <AppSpinner v-if="adminStore.loading" />
        <template v-else>
          <div v-if="adminStore.professionals.length === 0" class="empty-table">
            <AppEmptyState
              icon="mdi:account-hard-hat"
              title="Sin profesionales"
              description="No se encontraron profesionales con los filtros seleccionados."
            />
          </div>
          <div v-else class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <SortableHeader label="ID" sort-key="id" :active="sortKey === 'id'" :dir="sortDir" @sort="toggleSort" />
                  <SortableHeader label="Negocio" sort-key="businessName" :active="sortKey === 'businessName'" :dir="sortDir" @sort="toggleSort" />
                  <SortableHeader label="Telefono" sort-key="user.phone" :active="sortKey === 'user.phone'" :dir="sortDir" extra-class="d-none d-sm-table-cell" @sort="toggleSort" />
                  <SortableHeader label="Categorias" sort-key="categoryNames" :active="sortKey === 'categoryNames'" :dir="sortDir" extra-class="d-none d-md-table-cell" @sort="toggleSort" />
                  <SortableHeader label="Estado" sort-key="onboardingStatus" :active="sortKey === 'onboardingStatus'" :dir="sortDir" @sort="toggleSort" />
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pro in sortedPros" :key="pro.id">
                  <td class="text-muted" style="font-size:0.7rem">{{ pro.id }}</td>
                  <td class="fw-500">{{ pro.businessName || '-' }}</td>
                  <td class="text-muted d-none d-sm-table-cell">{{ pro.user?.phone }}</td>
                  <td class="d-none d-md-table-cell">
                    <div class="category-chips-inline">
                      <span v-for="cat in pro.categories" :key="cat.id" class="chip-inline">
                        {{ cat.category?.name }}
                      </span>
                    </div>
                  </td>
                  <td><AppStatusPill :status="pro.onboardingStatus" /></td>
                  <td>
                    <div class="action-group">
                      <button
                        v-if="pro.onboardingStatus === 'completed'"
                        class="btn btn-table-action btn-table-action--success"
                        @click="approve(pro)"
                      >
                        Aprobar
                      </button>
                      <button
                        v-if="pro.onboardingStatus === 'completed'"
                        class="btn btn-table-action btn-table-action--danger"
                        @click="reject(pro)"
                      >
                        Rechazar
                      </button>
                      <button
                        v-if="pro.onboardingStatus === 'approved'"
                        class="btn btn-table-action btn-table-action--warning"
                        @click="suspend(pro)"
                      >
                        Suspender
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>

    <!-- Pending Profile Changes -->
    <div class="content-card mt-3" :class="{ 'anim-in': mounted }" style="transition-delay: 0.2s">
      <h5 class="section-title">
        <Icon name="mdi:account-clock" size="20" class="me-2" />
        Cambios pendientes de aprobación
      </h5>
      <div v-if="adminStore.pendingChanges.length === 0" class="text-muted small py-2">
        No hay cambios pendientes.
      </div>
      <div v-else class="changes-list">
        <div v-for="change in adminStore.pendingChanges" :key="change.id" class="change-row">
          <div class="change-info">
            <span class="change-user">{{ change.user?.name || 'Usuario' }}</span>
            <span class="change-detail">
              {{ change.fieldName === 'name' ? 'Nombre' : 'Teléfono' }}:
              <span class="change-old">{{ change.currentValue }}</span>
              →
              <span class="change-new">{{ change.requestedValue }}</span>
            </span>
            <span class="change-date">{{ new Date(change.createdAt).toLocaleDateString() }}</span>
          </div>
          <div class="change-actions">
            <button class="btn btn-table-action btn-table-action--success" @click="approveChange(change)">
              Aprobar
            </button>
            <button class="btn btn-table-action btn-table-action--danger" @click="rejectChange(change)">
              Rechazar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['role'] })

const adminStore = useAdminStore()
const toast = useToast()
const mounted = ref(false)
const statusFilter = ref('')

const prosRef = computed(() => adminStore.professionals.map((p: any) => ({
  ...p,
  categoryNames: p.categories?.map((c: any) => c.category?.name).join(', ') || '',
})))
const { sortKey, sortDir, toggleSort, sorted: sortedPros } = useTableSort(prosRef)

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true
  })
  fetchPros()
  adminStore.fetchPendingChanges().catch(() => {})
})

watch(statusFilter, () => fetchPros())

function fetchPros() {
  adminStore.fetchProfessionals({ status: statusFilter.value }).catch(() => {})
}

async function approve(pro: any) {
  try {
    await adminStore.approveProfessional(pro.userId)
    toast.success('Profesional aprobado')
    fetchPros()
  } catch { toast.error('Error') }
}

async function reject(pro: any) {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  try {
    await $fetch(`${config.public.apiBase}/admin/professionals/${pro.userId}/reject`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: { reason: 'Rejected by admin' },
    })
    toast.success('Profesional rechazado')
    fetchPros()
  } catch { toast.error('Error') }
}

async function suspend(pro: any) {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  try {
    await $fetch(`${config.public.apiBase}/admin/professionals/${pro.userId}/suspend`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: { reason: 'Suspended by admin' },
    })
    toast.success('Profesional suspendido')
    fetchPros()
  } catch { toast.error('Error') }
}

async function approveChange(change: any) {
  try {
    await adminStore.approveChange(change.id)
    toast.success('Cambio aprobado')
    adminStore.fetchPendingChanges()
  } catch { toast.error('Error') }
}

async function rejectChange(change: any) {
  try {
    await adminStore.rejectChange(change.id)
    toast.success('Cambio rechazado')
    adminStore.fetchPendingChanges()
  } catch { toast.error('Error') }
}
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
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
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

// ─── Filter ───
.filter-bar {
  margin-bottom: 1.25rem;
}

.filter-select {
  padding: 0.6rem 0.875rem;
  font-size: 0.85rem;
  border: 1px solid $neutral-200;
  border-radius: 10px;
  background: white;
  color: $neutral-800;
  min-width: 180px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: $cercu-indigo-light;
    box-shadow: 0 0 0 3px rgba($cercu-indigo, 0.12);
  }
}

// ─── Data Table ───
.data-table {
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 0.75rem 0.625rem;
    font-size: 0.8rem;
    text-align: left;
    vertical-align: middle;
  }

  th {
    font-weight: 600;
    color: $neutral-600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    font-size: 0.7rem;
    border-bottom: 2px solid $neutral-200;
  }

  td {
    color: $neutral-700;
  }

  tbody tr {
    border-bottom: 1px solid $neutral-100;
    transition: background 0.15s ease;

    &:hover {
      background: $neutral-50;
    }

    &:last-child {
      border-bottom: none;
    }
  }
}

.fw-500 {
  font-weight: 500;
  color: $neutral-900;
}

.empty-table {
  padding: 2rem 0;
}

// ─── Inline Chips ───
.category-chips-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.chip-inline {
  display: inline-flex;
  padding: 0.15rem 0.45rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 500;
  background: $neutral-50;
  color: $neutral-700;
  border: 1px solid $neutral-200;
}

// ─── Action Buttons ───
.action-group {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.btn-table-action {
  padding: 0.3rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 8px;
  border: 1px solid $neutral-200;
  background: white;
  transition: background 0.2s ease, transform 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    background: $neutral-50;
  }

  &:active {
    background: $neutral-100;
    transform: translateY(0);
  }

  &--success { color: $success; border-color: rgba($success, 0.3); }
  &--danger { color: $danger; border-color: rgba($danger, 0.3); }
  &--warning { color: $warning; border-color: rgba($warning, 0.3); }
}

// ─── Pending Changes ───
.section-title {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  color: $neutral-800;
  margin-bottom: 0.75rem;
}

.changes-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.change-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem;
  background: $neutral-50;
  border-radius: 10px;
  border: 1px solid $neutral-100;
  flex-wrap: wrap;
}

.change-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.change-user {
  font-weight: 600;
  font-size: 0.85rem;
  color: $neutral-800;
}

.change-detail {
  font-size: 0.8rem;
  color: $neutral-600;
}

.change-old {
  text-decoration: line-through;
  color: $neutral-400;
}

.change-new {
  font-weight: 600;
  color: $cercu-indigo;
}

.change-date {
  font-size: 0.7rem;
  color: $neutral-400;
}

.change-actions {
  display: flex;
  gap: 0.375rem;
  flex-shrink: 0;
}
</style>
