<template>
  <div class="mission-card" :class="{ 'mission-card--completed': isCompleted }">
    <div class="mission-icon">
      <Icon :name="mission.missionTemplate?.icon || 'mdi:target'" size="20" />
    </div>
    <div class="mission-body">
      <h6 class="mission-name">{{ mission.missionTemplate?.name }}</h6>
      <div class="mission-progress-track">
        <div class="mission-progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <div class="mission-meta">
        <span class="mission-progress-text">{{ Number(mission.currentProgress) }}/{{ Number(mission.targetValue) }}</span>
        <span v-if="mission.missionTemplate?.reward?.xp" class="mission-reward">+{{ mission.missionTemplate.reward.xp }} XP</span>
      </div>
    </div>
    <div v-if="isCompleted" class="mission-check">
      <Icon name="mdi:check-circle" size="24" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  mission: any;
}>();

const isCompleted = computed(() => props.mission.status === 'completed');
const progressPercent = computed(() => {
  const target = Number(props.mission.targetValue) || 1;
  const current = Number(props.mission.currentProgress) || 0;
  return Math.min(100, (current / target) * 100);
});
</script>

<style lang="scss" scoped>
.mission-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 14px;
  background: $neu-bg;
  box-shadow: $neu-shadow-sm;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: $neu-shadow-md;
  }

  &--completed {
    opacity: 0.7;
  }
}

.mission-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $neu-bg;
  color: $cercu-indigo;
  box-shadow: $neu-shadow-sm;
  flex-shrink: 0;
}

.mission-body {
  flex: 1;
  min-width: 0;
}

.mission-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: $neutral-800;
  margin-bottom: 0.375rem;
}

.mission-progress-track {
  height: 6px;
  border-radius: 999px;
  background: $neu-bg;
  box-shadow: $neu-inset-sm;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.mission-progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, $cercu-indigo, $cercu-coral);
  transition: width 0.4s ease;
}

.mission-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mission-progress-text {
  font-size: 0.65rem;
  color: $neutral-400;
}

.mission-reward {
  font-size: 0.65rem;
  font-weight: 600;
  color: $cercu-indigo;
}

.mission-check {
  color: $success;
  flex-shrink: 0;
}
</style>
