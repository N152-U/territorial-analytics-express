module.exports = {
  apps : [{
    name: "analiticast",
    script: 'main.js',
    watch: '.'
    env: {
      NODE_ENV: "development",
      DEBUG: true,
      APP_PORT: 3016,
      APP_NAME: "territorial-analytics-express",
      APP_VERSION: 1,
      HOST_PSQL: "10.11.11.207",
      PORT_PSQL: 5432,
      USER_PSQL: "postgres_sec",
      PASSWORD_PSQL: "Dt1c-s4cm3x_p0stgr3s_s3c",
      DB_PSQL: "sacmex_terr_back",
      JWT_SECRET: "secretillo",
    },
  }, {
    script: './service-worker/',
    watch: ['./service-worker']
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
