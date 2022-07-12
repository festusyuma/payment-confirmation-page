require('dotenv').config()

const pm2App = (name) => ({
  name,
  instances: 1,
  script: './.output/server/index.mjs',
})

module.exports = {
  apps: [
    pm2App(process.env.APP_NAME),
  ]
}