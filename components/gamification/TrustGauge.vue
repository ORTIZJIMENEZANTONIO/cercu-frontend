<template>
  <div class="trust-gauge">
    <svg viewBox="0 0 120 80" class="gauge-svg">
      <path
        class="gauge-bg"
        :d="arcPath"
        fill="none"
        stroke-width="10"
        stroke-linecap="round"
      />
      <path
        ref="gaugeRef"
        class="gauge-fill"
        :d="arcPath"
        fill="none"
        :stroke="gaugeColor"
        stroke-width="10"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <div class="gauge-value">{{ displayScore }}</div>
    <div class="gauge-label">Trust Score</div>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap';

const props = defineProps<{
  score: number;
}>();

const gaugeRef = ref<SVGPathElement>();
const displayScore = ref(0);

const arcPath = 'M 15 70 A 45 45 0 1 1 105 70';
const circumference = 45 * Math.PI; // semi-circle

const dashOffset = computed(() => {
  const progress = props.score / 100;
  return circumference * (1 - progress);
});

const gaugeColor = computed(() => {
  if (props.score >= 70) return '#10B981';
  if (props.score >= 40) return '#F59E0B';
  return '#EF4444';
});

onMounted(() => {
  gsap.to(displayScore, {
    value: props.score,
    duration: 1.5,
    ease: 'power2.out',
    onUpdate: () => {
      displayScore.value = Math.round(displayScore.value);
    },
  });
});

watch(() => props.score, (newVal) => {
  gsap.to(displayScore, {
    value: newVal,
    duration: 1,
    ease: 'power2.out',
    onUpdate: () => {
      displayScore.value = Math.round(displayScore.value);
    },
  });
});
</script>

<style lang="scss" scoped>
.trust-gauge {
  text-align: center;
  padding: 1rem;
}

.gauge-svg {
  width: 140px;
  height: 90px;
  margin-bottom: 0.25rem;
}

.gauge-bg {
  stroke: $neu-bg;
  filter: drop-shadow(inset 2px 2px 4px rgba(174, 174, 204, 0.4));
  stroke: $neutral-200;
}

.gauge-fill {
  transition: stroke-dashoffset 1.5s ease;
}

.gauge-value {
  font-family: $headings-font-family;
  font-size: 1.75rem;
  font-weight: 700;
  color: $neutral-900;
  margin-top: -0.5rem;
}

.gauge-label {
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: $neutral-400;
}
</style>
