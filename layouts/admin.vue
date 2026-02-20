<template>
  <div class="layout-admin">
    <AppHeader :is-admin="true" />
    <div class="layout-body">
      <AdminSidebar />
      <main class="layout-main">
        <slot />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-admin {
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
  background: $neutral-50;
  padding: 1.25rem;

  @media (min-width: 768px) {
    min-height: calc(100vh - 64px);
    margin-left: 260px;
    padding: 1.5rem 2rem;
  }
}
</style>