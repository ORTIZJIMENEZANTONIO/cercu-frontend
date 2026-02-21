<template>
  <div class="toast-container">
    <TransitionGroup name="toast-slide" tag="div">
      <div
        v-for="toast in uiStore.toasts"
        :key="toast.id"
        class="cercu-toast"
        :class="`cercu-toast--${toast.type || 'info'}`"
        role="alert"
      >
        <div class="cercu-toast-icon">
          <Icon :name="iconForType(toast.type)" size="18" />
        </div>
        <span class="cercu-toast-message">{{ toast.message }}</span>
        <button class="cercu-toast-close" @click="uiStore.removeToast(toast.id)">
          <Icon name="mdi:close" size="16" />
        </button>
        <div class="cercu-toast-progress" :style="{ animationDuration: `${toast.duration || 5000}ms` }" />
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
const uiStore = useUiStore()

function iconForType(type?: string) {
  switch (type) {
    case 'success': return 'mdi:check-circle'
    case 'danger': return 'mdi:alert-circle'
    case 'warning': return 'mdi:alert'
    default: return 'mdi:information'
  }
}
</script>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1090;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 380px;
  width: calc(100vw - 2rem);
}

.cercu-toast {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  background: $neu-bg;
  border-radius: 12px;
  box-shadow: $neu-shadow-lg;
  border: none;
  position: relative;
  overflow: hidden;

  &--success {
    .cercu-toast-icon { color: $success; box-shadow: $neu-inset-sm; }
    .cercu-toast-progress { background: $success; }
  }

  &--danger {
    .cercu-toast-icon { color: $danger; box-shadow: $neu-inset-sm; }
    .cercu-toast-progress { background: $danger; }
  }

  &--warning {
    .cercu-toast-icon { color: $warning; box-shadow: $neu-inset-sm; }
    .cercu-toast-progress { background: $warning; }
  }

  &--info {
    .cercu-toast-icon { color: $cercu-indigo; box-shadow: $neu-inset-sm; }
    .cercu-toast-progress { background: $cercu-indigo; }
  }
}

.cercu-toast-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: $neu-bg;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  animation: toastIconPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
}

@keyframes toastIconPop {
  0% { transform: scale(0) rotate(-45deg); }
  100% { transform: scale(1) rotate(0); }
}

.cercu-toast-message {
  flex: 1;
  font-size: 0.85rem;
  font-weight: 500;
  color: $neutral-800;
  line-height: 1.3;
}

.cercu-toast-close {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $neu-bg;
  border: none;
  color: $neutral-400;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: $neu-shadow-sm;
  transition: box-shadow 0.15s ease, color 0.15s ease;

  &:hover {
    box-shadow: $neu-inset-sm;
    color: $neutral-700;
  }
}

.cercu-toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 100%;
  opacity: 0.35;
  animation: toastProgress linear forwards;
  transform-origin: left;
}

@keyframes toastProgress {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

// ─── Transitions ───
.toast-slide-enter-active {
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease;
}

.toast-slide-leave-active {
  transition: transform 0.25s ease-in, opacity 0.25s ease;
}

.toast-slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-slide-move {
  transition: transform 0.3s ease;
}
</style>
