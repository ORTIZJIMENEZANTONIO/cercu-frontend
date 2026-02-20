<template>
  <div class="step-indicator d-flex align-items-center justify-content-center gap-2 mb-4">
    <template v-for="step in totalSteps" :key="step">
      <div
        ref="stepDots"
        class="step-dot"
        :class="{
          'step-active': step === currentStep,
          'step-completed': step < currentStep,
        }"
      >
        <Transition name="pop" mode="out-in">
          <Icon v-if="step < currentStep" key="check" name="mdi:check" size="14" />
          <span v-else :key="step">{{ step }}</span>
        </Transition>
      </div>
      <div v-if="step < totalSteps" class="step-line" :class="{ 'step-line-active': step < currentStep }">
        <div class="step-line-fill" :class="{ active: step < currentStep }" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'

const props = defineProps<{
  currentStep: number
  totalSteps: number
}>()

const stepDots = ref<HTMLElement[]>([])

watch(() => props.currentStep, (newStep) => {
  nextTick(() => {
    const dot = stepDots.value?.[newStep - 1]
    if (dot) {
      gsap.fromTo(dot,
        { scale: 0.5 },
        { scale: 1, duration: 0.4, ease: 'back.out(2)' }
      )
    }
  })
})
</script>

<style lang="scss" scoped>
.step-dot {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  background-color: $neutral-200;
  color: $neutral-500;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;

  &.step-active {
    background-color: $cercu-indigo;
    color: white;
    box-shadow: 0 0 0 4px rgba($cercu-indigo, 0.15);
  }

  &.step-completed {
    background-color: $success;
    color: white;
  }
}

.step-line {
  width: 48px;
  height: 3px;
  background-color: $neutral-200;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.step-line-fill {
  position: absolute;
  inset: 0;
  background-color: $success;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);

  &.active {
    transform: scaleX(1);
  }
}
</style>
