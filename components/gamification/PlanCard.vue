<template>
  <div
    class="plan-card"
    :class="{ 'plan-card--current': isCurrent, 'plan-card--featured': plan.slug === 'premium' }"
  >
    <div v-if="plan.profileBadge" class="plan-badge">{{ plan.profileBadge }}</div>
    <div class="plan-icon">
      <Icon :name="planIcon" size="28" />
    </div>
    <h4 class="plan-name">{{ plan.name }}</h4>
    <div class="plan-price">
      <span class="plan-price-amount">${{ Number(plan.priceMXN).toLocaleString() }}</span>
      <span v-if="Number(plan.priceMXN) > 0" class="plan-price-period">/mes</span>
      <span v-else class="plan-price-period">Gratis</span>
    </div>
    <p class="plan-description">{{ plan.description }}</p>
    <ul class="plan-features">
      <li>
        <Icon name="mdi:check-circle" size="16" class="feature-icon" />
        {{ plan.maxLeadsPerDay === -1 ? 'Leads ilimitados' : `${plan.maxLeadsPerDay} leads/día` }}
      </li>
      <li v-if="plan.matchPriorityBoost > 0">
        <Icon name="mdi:check-circle" size="16" class="feature-icon" />
        +{{ plan.matchPriorityBoost }} prioridad en matching
      </li>
      <li v-if="plan.boostSlotsIncluded > 0">
        <Icon name="mdi:check-circle" size="16" class="feature-icon" />
        {{ plan.boostSlotsIncluded }} boost{{ plan.boostSlotsIncluded > 1 ? 's' : '' }} gratis/mes
      </li>
      <li>
        <Icon name="mdi:check-circle" size="16" class="feature-icon" />
        Analytics {{ plan.analyticsLevel }}
      </li>
      <li>
        <Icon name="mdi:check-circle" size="16" class="feature-icon" />
        Soporte {{ plan.supportLevel }}
      </li>
    </ul>
    <button
      v-if="!isCurrent"
      class="plan-cta btn-press"
      :class="plan.slug === 'premium' ? 'plan-cta--primary' : 'plan-cta--outline'"
      @click="$emit('select', plan)"
    >
      {{ isUpgrade ? 'Mejorar plan' : 'Seleccionar' }}
    </button>
    <div v-else class="plan-current-label">
      <Icon name="mdi:check-decagram" size="16" class="me-1" />
      Plan actual
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  plan: any;
  currentPlanSlug?: string;
}>();

defineEmits<{
  select: [plan: any];
}>();

const isCurrent = computed(() => props.currentPlanSlug === props.plan.slug);
const isUpgrade = computed(() => {
  if (!props.currentPlanSlug) return false;
  const order: Record<string, number> = { starter: 0, normal: 1, premium: 2 };
  return (order[props.plan.slug] || 0) > (order[props.currentPlanSlug] || 0);
});

const planIcon = computed(() => {
  const icons: Record<string, string> = {
    starter: 'mdi:account-circle',
    normal: 'mdi:star-circle',
    premium: 'mdi:crown',
  };
  return icons[props.plan.slug] || 'mdi:star';
});
</script>

<style lang="scss" scoped>
.plan-card {
  background: $neu-bg;
  border-radius: 20px;
  padding: 1.75rem 1.5rem;
  box-shadow: $neu-shadow-md;
  text-align: center;
  position: relative;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $neu-shadow-lg;
  }

  &--current {
    box-shadow: $neu-inset-md;
    &:hover { transform: none; box-shadow: $neu-inset-md; }
  }

  &--featured {
    background: linear-gradient(135deg, rgba($cercu-indigo, 0.03), rgba($cercu-coral, 0.03));
    border: 2px solid rgba($cercu-indigo, 0.15);
  }
}

.plan-badge {
  position: absolute;
  top: -10px;
  right: 16px;
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: white;
  background: linear-gradient(135deg, $cercu-indigo, $cercu-indigo-light);
  box-shadow: 0 2px 8px rgba($cercu-indigo, 0.3);
}

.plan-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  background: $neu-bg;
  color: $cercu-indigo;
  box-shadow: $neu-shadow-sm;
}

.plan-name {
  font-family: $headings-font-family;
  font-size: 1.25rem;
  font-weight: 700;
  color: $neutral-900;
  margin-bottom: 0.5rem;
}

.plan-price {
  margin-bottom: 0.75rem;
}

.plan-price-amount {
  font-family: $headings-font-family;
  font-size: 2rem;
  font-weight: 700;
  color: $cercu-indigo;
}

.plan-price-period {
  font-size: 0.875rem;
  color: $neutral-400;
  margin-left: 0.25rem;
}

.plan-description {
  font-size: 0.8rem;
  color: $neutral-500;
  margin-bottom: 1.25rem;
  line-height: 1.5;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
  text-align: left;

  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0;
    font-size: 0.8rem;
    color: $neutral-700;
  }
}

.feature-icon {
  color: $success;
  flex-shrink: 0;
}

.plan-cta {
  width: 100%;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &--primary {
    background: $cercu-indigo;
    color: white;
    box-shadow: 0 4px 12px rgba($cercu-indigo, 0.3);
    &:hover { background: $cercu-indigo-dark; }
  }

  &--outline {
    background: $neu-bg;
    color: $cercu-indigo;
    box-shadow: $neu-shadow-sm;
    &:hover { box-shadow: $neu-shadow-md; transform: translateY(-1px); }
  }
}

.plan-current-label {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: $success;
  background: rgba($success, 0.08);
}
</style>
