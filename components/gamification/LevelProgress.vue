<template>
  <div class="level-progress">
    <div class="level-header">
      <div class="level-icon-wrapper">
        <Icon :name="icon" size="24" />
      </div>
      <div class="level-info">
        <div class="level-label">Nivel {{ level }}</div>
        <div class="level-name">{{ name }}</div>
      </div>
      <div class="level-xp">
        <span class="level-xp-current">{{ totalXP.toLocaleString() }}</span>
        <span class="level-xp-separator"> / </span>
        <span class="level-xp-target">{{ nextXP ? nextXP.toLocaleString() : 'MAX' }} XP</span>
      </div>
    </div>
    <div class="xp-bar-track">
      <div ref="xpBarRef" class="xp-bar-fill" :style="{ width: progress + '%' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap';

const props = defineProps<{
  level: number;
  name: string;
  icon: string;
  totalXP: number;
  currentLevelXP: number;
  nextXP: number | null;
  progress: number;
}>();

const xpBarRef = ref<HTMLElement>();

onMounted(() => {
  if (xpBarRef.value) {
    gsap.fromTo(xpBarRef.value,
      { width: '0%' },
      { width: props.progress + '%', duration: 1.2, ease: 'power2.out', delay: 0.3 }
    );
  }
});
</script>

<style lang="scss" scoped>
.level-progress {
  background: $neu-bg;
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: $neu-shadow-md;
}

.level-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.level-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $neu-bg;
  color: $cercu-indigo;
  box-shadow: $neu-shadow-sm;
}

.level-info {
  flex: 1;
}

.level-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: $neutral-400;
}

.level-name {
  font-family: $headings-font-family;
  font-size: 1.125rem;
  font-weight: 700;
  color: $neutral-900;
}

.level-xp {
  text-align: right;
}

.level-xp-current {
  font-family: $headings-font-family;
  font-size: 1.125rem;
  font-weight: 700;
  color: $cercu-indigo;
}

.level-xp-separator {
  color: $neutral-300;
}

.level-xp-target {
  font-size: 0.8rem;
  color: $neutral-400;
}

.xp-bar-track {
  height: 10px;
  border-radius: 999px;
  background: $neu-bg;
  box-shadow: $neu-inset-sm;
  overflow: hidden;
}

.xp-bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, $cercu-indigo, $cercu-indigo-light);
  box-shadow: 0 0 8px rgba($cercu-indigo, 0.4);
  transition: width 0.6s ease;
}
</style>
