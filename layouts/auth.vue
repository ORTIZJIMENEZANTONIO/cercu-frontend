<template>
  <div class="layout-auth">
    <div class="auth-wrapper">
      <div class="auth-container">
        <div class="text-center mb-4">
          <NuxtLink to="/" class="auth-logo">
            <div class="auth-logo-mark">
              <Icon name="mdi:map-marker-check" size="22" />
            </div>
            <span class="auth-logo-text">CERCU</span>
          </NuxtLink>
        </div>
        <slot />
        <p class="auth-footer-text">
          <Icon name="mdi:shield-check" size="14" />
          Tus datos estan protegidos
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-auth {
  min-height: 100vh;
  min-height: 100dvh;
  background: $neutral-50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.auth-wrapper {
  width: 100%;
  max-width: 420px;
}

.auth-container {
  width: 100%;
}

.auth-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.auth-logo-mark {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: $cercu-indigo;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-logo-text {
  font-family: $headings-font-family;
  font-size: 1.5rem;
  font-weight: 700;
  color: $neutral-900;
}

.auth-footer-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  margin-top: 1.5rem;
  font-size: 0.75rem;
  color: $neutral-400;
}
</style>