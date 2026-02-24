// PM2 Ecosystem — manages both cercu-backend and cercu-frontend
module.exports = {
  apps: [
    {
      name: 'cercu-backend',
      cwd: '/var/www/cercu-backend',
      script: 'dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3003,
      },
      max_memory_restart: '300M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/var/log/pm2/cercu-backend-error.log',
      out_file: '/var/log/pm2/cercu-backend-out.log',
    },
    {
      name: 'cercu-frontend',
      cwd: '/var/www/cercu-frontend',
      script: '.output/server/index.mjs',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        NUXT_PUBLIC_API_BASE: 'https://cercu.com.mx/api/v1',
      },
      max_memory_restart: '300M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/var/log/pm2/cercu-frontend-error.log',
      out_file: '/var/log/pm2/cercu-frontend-out.log',
    },
  ],
};
