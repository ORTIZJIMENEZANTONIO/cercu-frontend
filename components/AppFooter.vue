<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-top">
        <div class="row g-4">
          <div class="col-12 col-md-4">
            <NuxtLink to="/" class="footer-logo">
              <div class="footer-logo-mark">
                <Icon name="mdi:map-marker-check" size="16" />
              </div>
              <span class="footer-logo-text">CERCU</span>
            </NuxtLink>
            <p class="footer-desc">
              Encuentra profesionales de confianza para servicios
              a domicilio en CDMX y Estado de Mexico.
            </p>
          </div>
          <div class="col-6 col-md-2">
            <h6 class="footer-heading">Servicios</h6>
            <ul class="footer-links">
              <li><NuxtLink to="/categorias">Categorias</NuxtLink></li>
              <li><NuxtLink to="/buscar">Buscar</NuxtLink></li>
              <li><NuxtLink to="/solicitar">Solicitar</NuxtLink></li>
            </ul>
          </div>
          <div class="col-6 col-md-2">
            <h6 class="footer-heading">Profesionales</h6>
            <ul class="footer-links">
              <li><NuxtLink to="/auth/registro-profesional">Registrate</NuxtLink></li>
              <li><NuxtLink to="/pro">Dashboard</NuxtLink></li>
            </ul>
          </div>
          <div class="col-6 col-md-2">
            <h6 class="footer-heading">Legal</h6>
            <ul class="footer-links">
              <li><NuxtLink to="/terminos">Terminos</NuxtLink></li>
              <li><NuxtLink to="/privacidad">Privacidad</NuxtLink></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; {{ new Date().getFullYear() }} CERCU. Todos los derechos reservados.</span>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.app-footer {
  background: $neutral-900;
  color: rgba(white, 0.7);
  margin-top: auto;
}

.footer-top {
  padding: 2.5rem 0 2rem;

  @media (min-width: 768px) {
    padding: 3.5rem 0 2.5rem;
  }
}

.footer-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  margin-bottom: 1rem;
}

.footer-logo-mark {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: $cercu-indigo;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-logo-text {
  font-family: $headings-font-family;
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
}

.footer-desc {
  font-size: 0.85rem;
  line-height: 1.6;
  color: rgba(white, 0.5);
  max-width: 280px;
}

.footer-heading {
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(white, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 0.5rem;
  }

  a {
    font-size: 0.875rem;
    color: rgba(white, 0.65);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: white;
    }
  }
}

.footer-bottom {
  padding: 1.25rem 0;
  border-top: 1px solid rgba(white, 0.08);
  font-size: 0.8rem;
  color: rgba(white, 0.35);
  text-align: center;
}
</style>