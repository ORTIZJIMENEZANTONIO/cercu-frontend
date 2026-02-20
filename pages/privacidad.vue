<template>
  <div class="legal-page">
    <div class="container">
      <div class="legal-container">
        <div class="legal-header" :class="{ 'anim-in': mounted }">
          <div class="legal-icon">
            <Icon name="mdi:shield-lock-outline" size="28" />
          </div>
          <h1 class="legal-title">Aviso de Privacidad</h1>
          <p class="legal-date">Ultima actualizacion: Febrero 2026</p>
        </div>

        <div class="legal-card" :class="{ 'anim-in': mounted }">
          <div class="legal-section">
            <h5 class="legal-section-title">1. Datos que recopilamos</h5>
            <p>Recopilamos numero de telefono, nombre, ubicacion y datos relacionados con los servicios solicitados.</p>
          </div>

          <div class="legal-section">
            <h5 class="legal-section-title">2. Uso de los datos</h5>
            <p>Tus datos se utilizan exclusivamente para conectarte con profesionales y mejorar el servicio.</p>
          </div>

          <div class="legal-section">
            <h5 class="legal-section-title">3. Proteccion de datos</h5>
            <p>Implementamos medidas de seguridad para proteger tu informacion personal.</p>
          </div>

          <div class="legal-section">
            <h5 class="legal-section-title">4. Tus derechos</h5>
            <p>Puedes solicitar acceso, rectificacion o eliminacion de tus datos personales en cualquier momento.</p>
          </div>

          <div class="legal-section">
            <h5 class="legal-section-title">5. Contacto</h5>
            <p class="mb-0">Para ejercer tus derechos ARCO o cualquier duda, contactanos a traves de la plataforma.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const mounted = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true
  })
})

useHead({ title: 'Aviso de Privacidad - CERCU' })
</script>

<style lang="scss" scoped>
.legal-page {
  padding: 2rem 0 3rem;

  @media (min-width: 768px) {
    padding: 3rem 0 4rem;
  }
}

.legal-container {
  max-width: 680px;
  margin: 0 auto;
}

.legal-header {
  text-align: center;
  margin-bottom: 1.5rem;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.legal-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgba($cercu-indigo, 0.08);
  color: $cercu-indigo;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.legal-title {
  font-family: $headings-font-family;
  font-size: 1.5rem;
  font-weight: 700;
  color: $neutral-900;
  margin-bottom: 0.375rem;

  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
}

.legal-date {
  font-size: 0.8rem;
  color: $neutral-400;
  margin-bottom: 0;
}

.legal-card {
  background: white;
  border: 1px solid $neutral-100;
  border-radius: 16px;
  padding: 1.5rem;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease 0.1s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.1s;

  @media (min-width: 768px) {
    padding: 2rem;
  }

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.legal-section {
  padding: 1rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid $neutral-50;
  }

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  p {
    font-size: 0.9rem;
    color: $neutral-600;
    line-height: 1.7;
    margin-bottom: 0.5rem;
  }
}

.legal-section-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: $neutral-800;
  margin-bottom: 0.5rem;
}
</style>
