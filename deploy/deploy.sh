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
echo "→ [1/4] Actualizando backend..."
cd $BACKEND_DIR
git pull origin main
npm install --production=false
npm run build
npm run migration:run

# ── Frontend ──
echo ""
echo "→ [2/4] Actualizando frontend..."
cd $FRONTEND_DIR
git pull origin main
npm install
npm run build

# ── Reiniciar servicios ──
echo ""
echo "→ [3/4] Reiniciando PM2..."
pm2 reload ecosystem.config.cjs

# ── Guardar estado PM2 ──
echo ""
echo "→ [4/4] Guardando estado PM2..."
pm2 save

echo ""
echo "══════════════════════════════════════"
echo "  ✓ Deploy completado!"
echo "  → pm2 status    (ver procesos)"
echo "  → pm2 logs      (ver logs)"
echo "══════════════════════════════════════"
