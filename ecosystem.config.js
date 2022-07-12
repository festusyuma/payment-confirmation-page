require('dotenv').config()

const pm2App = (name, port) => ({
  name,
  instances: 1,
  script: 'serve',
  env: {
    PM2_SERVE_PATH: './.output/public',
    PM2_SERVE_PORT: port,
    PM2_SERVE_SPA: 'true',
  }
})

module.exports = {
  apps: [
    pm2App(process.env.APP_NAME, process.env.PORT),
  ]
}