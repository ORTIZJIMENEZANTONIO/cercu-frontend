<template>
  <div class="countdown" :class="{ 'countdown--urgent': isUrgent }">
    <Icon name="mdi:timer-outline" size="16" class="me-1" />
    <span>{{ timeLeft }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  expiresAt: string;
}>();

const timeLeft = ref('');
const isUrgent = ref(false);
let interval: ReturnType<typeof setInterval>;

function updateCountdown() {
  const now = Date.now();
  const end = new Date(props.expiresAt).getTime();
  const diff = end - now;

  if (diff <= 0) {
    timeLeft.value = 'Expirado';
    isUrgent.value = true;
    clearInterval(interval);
    return;
  }

  isUrgent.value = diff < 5 * 60 * 1000; // less than 5 min

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (hours > 0) {
    timeLeft.value = `${hours}h ${minutes}m`;
  } else {
    timeLeft.value = `${minutes}m ${seconds}s`;
  }
}

onMounted(() => {
  updateCountdown();
  interval = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<style lang="scss" scoped>
.countdown {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  background: rgba($success, 0.08);
  color: $success;

  &--urgent {
    background: rgba($danger, 0.08);
    color: $danger;
    animation: pulseGlow 2s ease-in-out infinite;
  }
}
</style>
