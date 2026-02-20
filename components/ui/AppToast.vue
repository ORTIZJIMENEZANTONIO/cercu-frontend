<template>
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1090;">
    <TransitionGroup name="toast-bounce" tag="div">
      <div
        v-for="toast in uiStore.toasts"
        :key="toast.id"
        class="toast show"
        :class="`border-${toast.type || 'primary'}`"
        role="alert"
      >
        <div class="toast-body d-flex align-items-center gap-2">
          <div class="toast-icon-wrapper" :class="`text-${toast.type || 'primary'}`">
            <Icon :name="iconForType(toast.type)" size="20" />
          </div>
          <span class="flex-grow-1">{{ toast.message }}</span>
          <button type="button" class="btn-close btn-close-sm" @click="uiStore.removeToast(toast.id)" />
        </div>
        <div class="toast-progress" :class="`bg-${toast.type || 'primary'}`" :style="{ animationDuration: `${toast.duration || 4000}ms` }" />
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
.toast {
  border-left: 4px solid;
  background: white;
  box-shadow: $box-shadow-lg;
  border-radius: $border-radius;
  overflow: hidden;
  position: relative;
}

.toast-icon-wrapper {
  display: flex;
  align-items: center;
  animation: toastIconPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
}

@keyframes toastIconPop {
  0% { transform: scale(0) rotate(-45deg); }
  100% { transform: scale(1) rotate(0); }
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 100%;
  opacity: 0.3;
  animation: toastProgress linear forwards;
  transform-origin: left;
}

@keyframes toastProgress {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}
</style>
