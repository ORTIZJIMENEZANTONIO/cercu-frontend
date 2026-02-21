<template>
  <div class="boost-card" :class="{ 'boost-card--active': isActive }">
    <div class="boost-icon">
      <Icon :name="boostType.icon || 'mdi:rocket-launch'" size="24" />
    </div>
    <h5 class="boost-name">{{ boostType.name }}</h5>
    <p class="boost-desc">{{ boostType.description }}</p>
    <div class="boost-stats">
      <div class="boost-stat">
        <span class="boost-stat-value">+{{ boostType.scoreBonus }}</span>
        <span class="boost-stat-label">Score</span>
      </div>
      <div class="boost-stat">
        <span class="boost-stat-value">{{ boostType.durationHours }}h</span>
        <span class="boost-stat-label">Duracion</span>
      </div>
    </div>
    <button v-if="!isActive" class="boost-buy btn-press" @click="$emit('purchase', boostType)">
      ${{ Number(boostType.priceMXN) }} MXN
    </button>
    <BoostCountdown v-else :expires-at="expiresAt!" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  boostType: any;
  isActive?: boolean;
  expiresAt?: string;
}>();

defineEmits<{
  purchase: [boostType: any];
}>();
</script>

<style lang="scss" scoped>
.boost-card {
  background: $neu-bg;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: $neu-shadow-md;
  text-align: center;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: $neu-shadow-lg;
  }

  &--active {
    background: linear-gradient(135deg, rgba($cercu-indigo, 0.04), rgba($success, 0.04));
    border: 1px solid rgba($success, 0.2);
  }
}

.boost-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
  background: $neu-bg;
  color: $cercu-coral;
  box-shadow: $neu-shadow-sm;
}

.boost-name {
  font-family: $headings-font-family;
  font-size: 1rem;
  font-weight: 700;
  color: $neutral-900;
  margin-bottom: 0.375rem;
}

.boost-desc {
  font-size: 0.75rem;
  color: $neutral-500;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.boost-stats {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.25rem;
}

.boost-stat {
  text-align: center;
}

.boost-stat-value {
  display: block;
  font-family: $headings-font-family;
  font-size: 1.25rem;
  font-weight: 700;
  color: $cercu-indigo;
}

.boost-stat-label {
  font-size: 0.65rem;
  font-weight: 500;
  color: $neutral-400;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.boost-buy {
  width: 100%;
  padding: 0.625rem 1rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.85rem;
  border: none;
  cursor: pointer;
  background: $cercu-coral;
  color: white;
  box-shadow: 0 3px 10px rgba($cercu-coral, 0.3);
  transition: background 0.2s ease;

  &:hover {
    background: $cercu-coral-dark;
  }
}
</style>
