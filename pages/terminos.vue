<template>
  <div class="legal-page">
    <div class="container">
      <div class="legal-container">
        <div class="legal-header" :class="{ 'anim-in': mounted }">
          <div class="legal-icon">
            <Icon name="mdi:file-document-outline" size="28" />
          </div>
          <h1 class="legal-title">Terminos y Condiciones</h1>
          <p class="legal-date">Ultima actualizacion: Febrero 2026</p>
        </div>

        <div class="legal-card" :class="{ 'anim-in': mounted }">
          <div class="legal-section">
            <h5 class="legal-section-title">1. Aceptacion de los terminos</h5>
            <p>Al utilizar la plataforma CERCU, aceptas estos terminos y condiciones en su totalidad.</p>
          </div>

          <div class="legal-section">
            <h5 class="legal-section-title">2. Descripcion del servicio</h5>
            <p>CERCU es una plataforma que conecta usuarios con profesionales de oficios a domicilio en la zona metropolitana de CDMX y Estado de Mexico.</p>
          </div>

          <div class="legal-section">
            <h5 class="legal-section-title">3. Responsabilidad</h5>
            <p>CERCU actua como intermediario. No somos responsables directos del trabajo realizado por los profesionales.</p>
          </div>

          <div class="legal-section">
            <h5 class="legal-section-title">4. Uso aceptable</h5>
            <p>Los usuarios se comprometen a proporcionar informacion veraz y a utilizar la plataforma de manera responsable.</p>
          </div>

          <div class="legal-section">
            <h5 class="legal-section-title">5. Contacto</h5>
            <p class="mb-0">Para cualquier duda sobre estos terminos, contactanos a traves de la plataforma.</p>
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

useHead({ title: 'Terminos y Condiciones - CERCU' })
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
