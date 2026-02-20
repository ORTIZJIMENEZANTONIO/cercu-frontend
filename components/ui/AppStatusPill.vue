<template>
  <span :class="['badge-status', `badge-${statusClass}`]">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: string;
}>();

const statusMap: Record<string, { label: string; class: string }> = {
  pending: { label: 'Pendiente', class: 'pending' },
  viewed: { label: 'Visto', class: 'pending' },
  matched: { label: 'Matcheado', class: 'active' },
  taken: { label: 'Tomado', class: 'active' },
  in_progress: { label: 'En progreso', class: 'pending' },
  completed: { label: 'Completado', class: 'active' },
  cancelled: { label: 'Cancelado', class: 'inactive' },
  expired: { label: 'Expirado', class: 'inactive' },
  approved: { label: 'Aprobado', class: 'active' },
  rejected: { label: 'Rechazado', class: 'inactive' },
  active: { label: 'Activo', class: 'active' },
  inactive: { label: 'Inactivo', class: 'inactive' },
};

const label = computed(() => statusMap[props.status]?.label || props.status);
const statusClass = computed(() => statusMap[props.status]?.class || 'pending');
</script>
