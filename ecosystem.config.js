module.exports = {
  apps : [{
    name        : "dev_api_halosis_id",
    script      : "./server.js",
    watch       : false,
    env: {
      "NODE_ENV": "development",
    },
    env_production : {
       "NODE_ENV": "production"
    }
  }]
}
