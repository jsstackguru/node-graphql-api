module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'API',
      script    : 'npm',
      args      : 'run serve',
      instances: 'max',
      cwd: '/home/deploy/istory_api/production/current',
      env: {
        // COMMON_VARIABLE: 'true',
        NODE_ENV: 'production',
        PRODUCTION: 'production',
        PORT: 9001,
      }
    },

    // Second application
    {
      name      : 'API_STAGE',
      script    : 'npm',
      args      : 'run serve',
      instances: 'max',
      cwd: '/home/deploy/istory_api/stage/current',
      env: {
        // COMMON_VARIABLE: 'true',
        NODE_ENV: 'production',
        PRODUCTION: 'production',
        PORT: 9002,
      }
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'deploy',
      host : '3.83.220.83',
      ref  : 'origin/master',
      repo : 'git@bitbucket.org:nikcom/rekordr-api.git',
      path : '/home/deploy/istory_api/production',
      'post-setup' : 'cp ./config.js.dist ./config.js',
      'post-deploy' : 'npm install && pm2 startOrRestart ecosystem.config.js --env production'
    },
    dev : {
      user : 'node',
      host : '3.83.220.83',
      ref  : 'origin/dev',
      repo : 'git@bitbucket.org:nikcom/rekordr-api.git',
      path : '/home/deploy/istory_api/production',
      'post-setup' : 'cp /home/deploy/istory_api/production/config.js.dist /home/deploy/istory_api/production/config.js',
      'post-deploy' : 'npm install && pm2 startOrRestart ecosystem.config.js --env dev',
      env  : {
        NODE_ENV: 'dev'
      }
    }
  }
};
