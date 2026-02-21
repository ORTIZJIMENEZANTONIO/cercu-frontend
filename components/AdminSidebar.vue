<template>
  <aside class="sidebar">
    <nav class="sidebar-nav">
      <div class="sidebar-section-label">Admin</div>
      <ul class="sidebar-list">
        <li v-for="item in navItems" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="sidebar-item"
            :exact-active-class="item.exact ? 'active' : ''"
            :active-class="item.exact ? '' : 'active'"
          >
            <div class="sidebar-icon">
              <Icon :name="item.icon" size="18" />
            </div>
            <span>{{ item.label }}</span>
          </NuxtLink>
        </li>
      </ul>

      <div class="sidebar-section-label mt-3">Monetización</div>
      <ul class="sidebar-list">
        <li v-for="item in monetItems" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="sidebar-item"
            :exact-active-class="item.exact ? 'active' : ''"
            :active-class="item.exact ? '' : 'active'"
          >
            <div class="sidebar-icon">
              <Icon :name="item.icon" size="18" />
            </div>
            <span>{{ item.label }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
const navItems = [
  { to: '/admin', icon: 'mdi:view-dashboard', label: 'Dashboard', exact: true },
  { to: '/admin/usuarios', icon: 'mdi:account-group', label: 'Usuarios', exact: false },
  { to: '/admin/profesionales', icon: 'mdi:account-hard-hat', label: 'Profesionales', exact: false },
  { to: '/admin/leads', icon: 'mdi:file-document-multiple', label: 'Leads', exact: false },
  { to: '/admin/categorias', icon: 'mdi:shape', label: 'Categorías', exact: false },
  { to: '/admin/reportes', icon: 'mdi:flag', label: 'Reportes', exact: false },
]

const monetItems = [
  { to: '/admin/planes', icon: 'mdi:crown', label: 'Planes', exact: false },
  { to: '/admin/boosts', icon: 'mdi:rocket-launch', label: 'Boosts', exact: false },
  { to: '/admin/gamificacion', icon: 'mdi:trophy', label: 'Gamificación', exact: false },
  { to: '/admin/configuracion', icon: 'mdi:cog', label: 'Configuración', exact: false },
]
</script>

<style lang="scss" scoped>
.sidebar {
  width: 260px;
  min-height: calc(100vh - 56px);
  position: fixed;
  top: 56px;
  left: 0;
  z-index: 1020;
  overflow-y: auto;
  background: white;
  border-right: 1px solid $neutral-200;

  @media (min-width: 768px) {
    top: 64px;
    min-height: calc(100vh - 64px);
  }

  @media (max-width: 767.98px) {
    display: none;
  }
}

.sidebar-nav {
  padding: 1.25rem 0.75rem;
}

.sidebar-section-label {
  padding: 0 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: $neutral-500;
}

.sidebar-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.875rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: $neutral-700;
  text-decoration: none;
  border-radius: 10px;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: $neutral-50;
    color: $neutral-900;
  }

  &.active {
    background: rgba($cercu-indigo, 0.06);
    color: $cercu-indigo-dark;
    font-weight: 600;

    .sidebar-icon {
      background: $cercu-indigo;
      color: white;
    }
  }
}

.sidebar-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: $neutral-100;
  color: $neutral-600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, color 0.2s ease;
}
</style>