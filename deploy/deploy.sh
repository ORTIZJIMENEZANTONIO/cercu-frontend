#!/bin/bash
# ============================================================
# Cercu Deploy Script — ejecutar en el VPS
# Uso: bash deploy.sh
# ============================================================
set -e

echo "══════════════════════════════════════"
echo "  CERCU — Deploy"
echo "══════════════════════════════════════"

BACKEND_DIR="/var/www/cercu-backend"
FRONTEND_DIR="/var/www/cercu-frontend"

# ── Backend ──
echo ""
echo "→ [1/5] Actualizando backend..."
cd $BACKEND_DIR
git pull origin main
npm install --production=false
npm run build
npm run migration:run

# ── Frontend ──
echo ""
echo "→ [2/5] Actualizando frontend..."
cd $FRONTEND_DIR
git pull origin main
npm install
npm run build

# ── Observatorio ──
echo ""
echo "→ [3/5] Actualizando observatorio..."
cd $FRONTEND_DIR/observatorio
npm install
npm run build

# ── Reiniciar servicios ──
echo ""
echo "→ [4/5] Reiniciando PM2..."
cd $FRONTEND_DIR/deploy
pm2 reload ecosystem.config.cjs

# ── Guardar estado PM2 ──
echo ""
echo "→ [5/5] Guardando estado PM2..."
pm2 save

echo ""
echo "══════════════════════════════════════"
echo "  ✓ Deploy completado!"
echo "  → pm2 status    (ver procesos)"
echo "  → pm2 logs      (ver logs)"
echo "══════════════════════════════════════"
