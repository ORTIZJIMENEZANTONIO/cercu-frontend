<template>
  <Teleport to="body">
    <Transition name="xp-float">
      <div v-if="visible" class="xp-toast">
        <Icon name="mdi:star-four-points" size="16" class="me-1" />
        +{{ amount }} XP
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  amount: number;
  visible: boolean;
}>();

const emit = defineEmits<{
  done: [];
}>();

watch(() => props.visible, (val) => {
  if (val) {
    setTimeout(() => emit('done'), 2000);
  }
});
</script>

<style lang="scss" scoped>
.xp-toast {
  position: fixed;
  top: 80px;
  right: 24px;
  z-index: 9999;
  display: flex;
  align-items: center;
  padding: 0.625rem 1.25rem;
  border-radius: 12px;
  font-family: $headings-font-family;
  font-size: 1rem;
  font-weight: 700;
  color: $cercu-indigo;
  background: $neu-bg;
  box-shadow: $neu-shadow-lg;
}

.xp-float-enter-active {
  animation: xpFloatIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.xp-float-leave-active {
  animation: xpFloatOut 0.4s ease forwards;
}

@keyframes xpFloatIn {
  0% { transform: translateY(20px) scale(0.8); opacity: 0; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}

@keyframes xpFloatOut {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-30px) scale(0.8); opacity: 0; }
}
</style>
