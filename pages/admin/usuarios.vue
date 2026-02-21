<template>
  <div>
    <div class="page-header" :class="{ 'anim-in': mounted }">
      <h1 class="page-title">Usuarios</h1>
      <p class="page-subtitle">Gestiona todos los usuarios de la plataforma</p>
    </div>

    <div class="content-card" :class="{ 'anim-in': mounted }" style="transition-delay: 0.1s">
        <!-- Filters -->
        <div class="filter-bar">
          <div class="filter-search">
            <Icon name="mdi:magnify" class="filter-search-icon" size="18" />
            <input
              v-model="search"
              type="text"
              class="filter-search-input"
              placeholder="Buscar por nombre o telefono..."
            />
          </div>
          <select v-model="roleFilter" class="filter-select">
            <option value="">Todos</option>
            <option value="user">Usuarios</option>
            <option value="professional">Profesionales</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        <AppSpinner v-if="adminStore.loading" />
        <template v-else>
          <div v-if="adminStore.users.length === 0" class="empty-table">
            <AppEmptyState
              icon="mdi:account-group"
              title="Sin usuarios"
              description="No se encontraron usuarios con los filtros seleccionados."
            />
          </div>
          <div v-else class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <SortableHeader label="ID" sort-key="id" :active="sortKey === 'id'" :dir="sortDir" @sort="toggleSort" />
                  <SortableHeader label="Nombre" sort-key="name" :active="sortKey === 'name'" :dir="sortDir" @sort="toggleSort" />
                  <SortableHeader label="Telefono" sort-key="phone" :active="sortKey === 'phone'" :dir="sortDir" @sort="toggleSort" />
                  <SortableHeader label="Rol" sort-key="role" :active="sortKey === 'role'" :dir="sortDir" @sort="toggleSort" />
                  <SortableHeader label="Estado" sort-key="isActive" :active="sortKey === 'isActive'" :dir="sortDir" @sort="toggleSort" />
                  <SortableHeader label="Registro" sort-key="createdAt" :active="sortKey === 'createdAt'" :dir="sortDir" extra-class="d-none d-md-table-cell" @sort="toggleSort" />
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in sortedUsers" :key="user.id">
                  <td class="text-muted" style="font-size:0.7rem">{{ user.id.slice(0, 8) }}</td>
                  <td class="fw-500">{{ user.name || '-' }}</td>
                  <td class="text-muted">{{ user.phone }}</td>
                  <td>
                    <span class="role-badge" :class="`role-badge--${user.role}`">{{ user.role }}</span>
                  </td>
                  <td>
                    <AppStatusPill :status="user.isActive ? 'active' : 'inactive'" />
                  </td>
                  <td class="text-muted d-none d-md-table-cell">
                    {{ new Date(user.createdAt).toLocaleDateString() }}
                  </td>
                  <td>
                    <div class="action-group">
                      <button
                        class="btn btn-table-action btn-table-action--primary"
                        @click="openEdit(user)"
                      >
                        Editar
                      </button>
                      <button
                        v-if="user.isActive"
                        class="btn btn-table-action btn-table-action--danger"
                        @click="handleBlock(user)"
                      >
                        Bloquear
                      </button>
                      <button
                        v-else
                        class="btn btn-table-action btn-table-action--success"
                        @click="handleUnblock(user)"
                      >
                        Desbloquear
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>

        <AppPagination
          :current-page="adminStore.pagination.page"
          :total-pages="adminStore.pagination.totalPages"
          @change="(p: number) => fetchUsers(p)"
        />
      </div>

    <!-- Edit User Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="editingUser" class="modal-overlay" @click.self="editingUser = null">
          <div class="modal-card">
            <div class="modal-header">
              <h5 class="modal-title">Editar usuario</h5>
              <button class="btn-close-modal" @click="editingUser = null">
                <Icon name="mdi:close" size="20" />
              </button>
            </div>
            <div class="modal-body">
              <AppInput v-model="editForm.name" label="Nombre" class="mb-3" />
              <AppInput v-model="editForm.email" label="Email" type="email" class="mb-3" />
              <AppInput v-model="editForm.phone" label="Telefono" class="mb-3" />
              <AppDateInput v-model="editForm.dateOfBirth" label="Fecha de nacimiento" class="mb-3" />
              <div class="app-input mb-3">
                <label class="form-label">Rol</label>
                <select v-model="editForm.role" class="form-control">
                  <option value="user">Usuario</option>
                  <option value="professional">Profesional</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-sm btn-outline-secondary" @click="editingUser = null">Cancelar</button>
              <AppButton variant="primary" size="sm" :loading="editSaving" @click="saveEditUser">
                Guardar
              </AppButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['role'] })

const adminStore = useAdminStore()
const toast = useToast()
const mounted = ref(false)
const search = ref('')
const roleFilter = ref('')

const usersRef = computed(() => adminStore.users)
const { sortKey, sortDir, toggleSort, sorted: sortedUsers } = useTableSort(usersRef)

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true
  })
  fetchUsers()
})

let debounceTimer: ReturnType<typeof setTimeout>
watch([search, roleFilter], () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => fetchUsers(), 300)
})

function fetchUsers(page = 1) {
  adminStore.fetchUsers({ page, search: search.value, role: roleFilter.value }).catch(() => {})
}

const editingUser = ref<any>(null)
const editSaving = ref(false)
const editForm = reactive({
  name: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  role: 'user',
})

function openEdit(user: any) {
  editingUser.value = user
  editForm.name = user.name || ''
  editForm.email = user.email || ''
  editForm.phone = user.phone || ''
  editForm.dateOfBirth = user.dateOfBirth || ''
  editForm.role = user.role || 'user'
}

async function saveEditUser() {
  editSaving.value = true
  try {
    const authStore = useAuthStore()
    const config = useRuntimeConfig()
    await $fetch(`${config.public.apiBase}/admin/users/${editingUser.value.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: { ...editForm },
    })
    toast.success('Usuario actualizado')
    editingUser.value = null
    fetchUsers()
  } catch {
    toast.error('Error al actualizar')
  } finally {
    editSaving.value = false
  }
}

async function handleBlock(user: any) {
  try {
    await adminStore.blockUser(user.id, 'Blocked by admin')
    toast.success('Usuario bloqueado')
    fetchUsers()
  } catch {
    toast.error('Error')
  }
}

async function handleUnblock(user: any) {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  try {
    await $fetch(`${config.public.apiBase}/admin/users/${user.id}/unblock`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    toast.success('Usuario desbloqueado')
    fetchUsers()
  } catch {
    toast.error('Error')
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

// ─── Filter Bar ───
.filter-bar {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;

  @media (min-width: 576px) {
    flex-direction: row;
  }
}

.filter-search {
  position: relative;
  flex: 1;
}

.filter-search-icon {
  position: absolute;
  top: 50%;
  left: 0.875rem;
  transform: translateY(-50%);
  color: $neutral-400;
  pointer-events: none;
}

.filter-search-input {
  width: 100%;
  padding: 0.6rem 0.875rem 0.6rem 2.5rem;
  font-size: 0.85rem;
  border: 1px solid $neutral-200;
  border-radius: 10px;
  background: white;
  color: $neutral-800;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder {
    color: $neutral-400;
  }

  &:focus {
    outline: none;
    border-color: $cercu-indigo-light;
    box-shadow: 0 0 0 3px rgba($cercu-indigo, 0.12);
  }
}

.filter-select {
  padding: 0.6rem 0.875rem;
  font-size: 0.85rem;
  border: 1px solid $neutral-200;
  border-radius: 10px;
  background: white;
  color: $neutral-800;
  min-width: 140px;
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

// ─── Role Badge ───
.role-badge {
  display: inline-flex;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;

  &--user {
    background: rgba($cercu-indigo, 0.08);
    color: $cercu-indigo;
  }

  &--professional {
    background: rgba($success, 0.1);
    color: $success;
  }

  &--admin {
    background: rgba($warning, 0.1);
    color: $warning;
  }
}

// ─── Action Group ───
.action-group {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

// ─── Table Actions ───
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

  &--danger { color: $danger; border-color: rgba($danger, 0.3); }
  &--success { color: $success; border-color: rgba($success, 0.3); }
  &--primary { color: $cercu-indigo; border-color: rgba($cercu-indigo, 0.3); }
}

// ─── Modal ───
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

  &:hover {
    box-shadow: $neu-inset-sm;
    color: $neutral-700;
  }
}

.modal-body {
  padding: 1.25rem 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0 1.5rem 1.25rem;
}
</style>
