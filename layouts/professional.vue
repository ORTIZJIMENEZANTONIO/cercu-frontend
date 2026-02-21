<template>
  <div class="layout-professional">
    <AppHeader />
    <div class="layout-body">
      <ProSidebar />
      <main class="layout-main">
        <slot />
      </main>
    </div>
    <XpGainToast
      :amount="xpEvents.currentXp.value?.amount || 0"
      :visible="xpEvents.visible.value"
      @done="xpEvents.onDone"
    />
  </div>
</template>

<script setup lang="ts">
const xpEvents = useXpEvents();
</script>

<style lang="scss" scoped>
.layout-professional {
  min-height: 100vh;
  min-height: 100dvh;
}

.layout-body {
  display: flex;
}

.layout-main {
  flex: 1;
  min-height: calc(100vh - 56px);
  min-height: calc(100dvh - 56px);
  background: #F7F7FB;
  padding: 1.25rem;

  @media (min-width: 768px) {
    min-height: calc(100vh - 64px);
    margin-left: 260px;
    padding: 1.5rem 2rem;
  }
}
</style>
