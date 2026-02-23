#!/bin/sh
# ============================================================
# Cercu VPS Setup - Hostinger KVM 2 (Alpine Linux)
# Ejecutar como root: sh setup-vps.sh
# ============================================================
set -e

echo "========================================="
echo "  CERCU - Setup VPS Hostinger (Alpine)"
echo "========================================="

# 1. Actualizar sistema
echo "-> Actualizando sistema..."
apk update && apk upgrade

# 2. Instalar dependencias base
echo "-> Instalando dependencias base..."
apk add --no-cache \
  curl git bash nano \
  nodejs npm \
  nginx \
  mysql mysql-client \
  certbot certbot-nginx \
  openssl \
  python3 make g++ \
  iptables ip6tables

# 3. Instalar Yarn + PM2 global
echo "-> Instalando Yarn y PM2..."
npm install -g yarn pm2

# 4. Habilitar servicios en boot
echo "-> Habilitando servicios..."
rc-update add nginx default
rc-update add mariadb default

# 5. Iniciar MySQL (MariaDB en Alpine)
echo "-> Inicializando MySQL..."
/etc/init.d/mariadb setup
rc-service mariadb start

echo ""
echo "-> MySQL listo. Ahora ejecuta:"
echo "   mysql_secure_installation"
echo ""
echo "   mysql -e \"CREATE DATABASE cercu_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\""
echo "   mysql -e \"CREATE USER 'cercu'@'localhost' IDENTIFIED BY 'TU_PASSWORD_SEGURO';\""
echo "   mysql -e \"GRANT ALL PRIVILEGES ON cercu_db.* TO 'cercu'@'localhost'; FLUSH PRIVILEGES;\""

# 6. Iniciar Nginx
rc-service nginx start

# 7. Crear directorios
echo "-> Creando directorios..."
mkdir -p /var/www/cercu-backend
mkdir -p /var/www/cercu-frontend
mkdir -p /var/log/pm2

# 8. Firewall con iptables
echo "-> Configurando firewall..."
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -j DROP
rc-update add iptables default
/etc/init.d/iptables save

# 9. PM2 startup para OpenRC
pm2 startup openrc -u root --hp /root
rc-update add pm2-root default

echo ""
echo "========================================="
echo "  Setup base completado!"
echo ""
echo "  Proximos pasos:"
echo "  1. Configura MySQL (ver arriba)"
echo "  2. Sube tu codigo a /var/www/"
echo "  3. Configura Nginx y SSL"
echo "========================================="