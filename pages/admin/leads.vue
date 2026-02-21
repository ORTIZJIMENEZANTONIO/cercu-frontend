<template>
  <div>
    <div class="page-header" :class="{ 'anim-in': mounted }">
      <h1 class="page-title">Leads</h1>
      <p class="page-subtitle">Monitorea todos los leads de la plataforma</p>
    </div>

    <div class="content-card" :class="{ 'anim-in': mounted }" style="transition-delay: 0.1s">
        <div class="filter-bar">
          <select v-model="statusFilter" class="filter-select">
            <option value="">Todos</option>
            <option value="pending">Pendiente</option>
            <option value="matched">Matcheado</option>
            <option value="taken">Tomado</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        <AppSpinner v-if="adminStore.loading" />
        <template v-else>
          <div v-if="adminStore.leads.length === 0" class="empty-table">
            <AppEmptyState
              icon="mdi:file-document-multiple"
              title="Sin leads"
              description="No se encontraron leads con los filtros seleccionados."
            />
          </div>
          <div v-else class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <SortableHeader label="ID" sort-key="id" :active="sortKey === 'id'" :dir="sortDir" @sort="toggleSort" />
                  <SortableHeader label="Categoria" sort-key="category.name" :active="sortKey === 'category.name'" :dir="sortDir" @sort="toggleSort" />
                  <SortableHeader label="Solicitante" sort-key="user.name" :active="sortKey === 'user.name'" :dir="sortDir" @sort="toggleSort" />
                  <SortableHeader label="Profesional" sort-key="takenByPro" :active="sortKey === 'takenByPro'" :dir="sortDir" extra-class="d-none d-md-table-cell" @sort="toggleSort" />
                  <SortableHeader label="Urgencia" sort-key="urgencyOrder" :active="sortKey === 'urgencyOrder'" :dir="sortDir" @sort="toggleSort" />
                  <SortableHeader label="Estado" sort-key="status" :active="sortKey === 'status'" :dir="sortDir" @sort="toggleSort" />
                  <SortableHeader label="Precio" sort-key="priceMXN" :active="sortKey === 'priceMXN'" :dir="sortDir" extra-class="d-none d-lg-table-cell" @sort="toggleSort" />
                  <SortableHeader label="Fecha" sort-key="createdAt" :active="sortKey === 'createdAt'" :dir="sortDir" extra-class="d-none d-lg-table-cell" @sort="toggleSort" />
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="lead in sortedLeads" :key="lead.id">
                  <td class="text-muted">#{{ lead.id }}</td>
                  <td class="fw-500">{{ lead.category?.name }}</td>
                  <td>
                    <div class="cell-user">
                      <span class="fw-500">{{ lead.user?.name || '-' }}</span>
                      <span class="text-muted small">{{ lead.user?.phone }}</span>
                    </div>
                  </td>
                  <td class="d-none d-md-table-cell">
                    <template v-if="lead.takenByProfile">
                      <div class="cell-user">
                        <span class="fw-500">{{ lead.takenByProfile.user?.name || lead.takenByProfile.businessName || '-' }}</span>
                        <span class="text-muted small">{{ lead.takenByProfile.user?.phone }}</span>
                      </div>
                    </template>
                    <span v-else class="text-muted">—</span>
                  </td>
                  <td>
                    <span class="urgency-badge" :class="`urgency-badge--${lead.urgencyTier}`">
                      {{ lead.urgencyTier }}
                    </span>
                  </td>
                  <td><AppStatusPill :status="lead.status" /></td>
                  <td class="fw-500 d-none d-md-table-cell">${{ lead.priceMXN }}</td>
                  <td class="text-muted d-none d-lg-table-cell">
                    {{ new Date(lead.createdAt).toLocaleDateString() }}
                  </td>
                  <td>
                    <button
                      v-if="lead.status !== 'cancelled'"
                      class="btn btn-table-action btn-table-action--danger"
                      @click="cancelLead(lead)"
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>

        <AppPagination
          :current-page="adminStore.pagination.page"
          :total-pages="adminStore.pagination.totalPages"
          @change="(p: number) => fetchLeads(p)"
        />
      </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['role'] })

const adminStore = useAdminStore()
const toast = useToast()
const mounted = ref(false)
const statusFilter = ref('')

const urgencyOrder: Record<string, number> = { immediate: 0, today: 1, standard: 2 }

const leadsRef = computed(() => adminStore.leads.map((l: any) => ({
  ...l,
  urgencyOrder: urgencyOrder[l.urgencyTier] ?? 3,
  takenByPro: l.takenByProfile?.businessName || l.takenByProfile?.user?.name || '',
})))
const { sortKey, sortDir, toggleSort, sorted: sortedLeads } = useTableSort(leadsRef)

// Default sort by urgency (immediate first)
sortKey.value = 'urgencyOrder'
sortDir.value = 'asc'

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true
  })
  fetchLeads()
})

watch(statusFilter, () => fetchLeads())

function fetchLeads(page = 1) {
  adminStore.fetchLeads({ page, status: statusFilter.value }).catch(() => {})
}

async function cancelLead(lead: any) {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  try {
    await $fetch(`${config.public.apiBase}/admin/leads/${lead.id}/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: { reason: 'Cancelled by admin' },
    })
    toast.success('Lead cancelado')
    fetchLeads()
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
  min-width: 150px;
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

.cell-user {
  display: flex;
  flex-direction: column;
  line-height: 1.3;

  .small {
    font-size: 0.7rem;
  }
}

.empty-table {
  padding: 2rem 0;
}

// ─── Urgency Badge ───
.urgency-badge {
  display: inline-flex;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: capitalize;

  &--standard {
    background: rgba($info, 0.1);
    color: $info;
  }

  &--today {
    background: rgba($warning, 0.1);
    color: $warning;
  }

  &--immediate {
    background: rgba($danger, 0.1);
    color: $danger;
  }
}

// ─── Action Buttons ───
.btn-table-action {
  padding: 0.3rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 8px;
  border: 1px solid $neutral-200;
  background: white;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: $neutral-50;
  }

  &:active {
    background: $neutral-100;
  }

  &--danger {
    color: $danger;
    border-color: rgba($danger, 0.3);
    &:hover { background: rgba($danger, 0.04); }
  }
}
</style>
