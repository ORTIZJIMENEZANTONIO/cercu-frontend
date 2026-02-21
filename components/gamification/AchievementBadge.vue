<template>
  <div class="achievement-badge" :class="{ 'achievement-badge--earned': earned }">
    <div class="achievement-icon">
      <Icon :name="icon || 'mdi:trophy'" size="24" />
    </div>
    <div class="achievement-info">
      <h6 class="achievement-name">{{ name }}</h6>
      <p class="achievement-desc">{{ description }}</p>
    </div>
    <div v-if="earned" class="achievement-earned-mark">
      <Icon name="mdi:check-circle" size="20" />
    </div>
    <div v-if="reward" class="achievement-reward">
      <span v-if="reward.xp" class="reward-tag reward-tag--xp">+{{ reward.xp }} XP</span>
      <span v-if="reward.walletCreditMXN" class="reward-tag reward-tag--money">${{ reward.walletCreditMXN }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  description: string;
  icon?: string;
  earned: boolean;
  reward?: { xp?: number; walletCreditMXN?: number; boostHours?: number } | null;
}>();
</script>

<style lang="scss" scoped>
.achievement-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 14px;
  background: $neu-bg;
  box-shadow: $neu-shadow-sm;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  position: relative;
  opacity: 0.5;
  filter: grayscale(1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: $neu-shadow-md;
  }

  &--earned {
    opacity: 1;
    filter: none;
    box-shadow: $neu-shadow-md;
  }
}

.achievement-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $neu-bg;
  box-shadow: $neu-inset-sm;
  color: $cercu-indigo;
  flex-shrink: 0;

  .achievement-badge--earned & {
    box-shadow: $neu-shadow-sm;
    color: $warning;
  }
}

.achievement-info {
  flex: 1;
  min-width: 0;
}

.achievement-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: $neutral-800;
  margin-bottom: 0.125rem;
}

.achievement-desc {
  font-size: 0.75rem;
  color: $neutral-500;
  margin: 0;
  line-height: 1.4;
}

.achievement-earned-mark {
  color: $success;
  flex-shrink: 0;
}

.achievement-reward {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.reward-tag {
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 600;

  &--xp {
    background: rgba($cercu-indigo, 0.1);
    color: $cercu-indigo;
  }

  &--money {
    background: rgba($success, 0.1);
    color: $success;
  }
}
</style>
