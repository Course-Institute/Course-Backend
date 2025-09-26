module.exports = {
  apps: [
    {
      name: 'node-backend',
      script: 'dist/app.js',
      interpreter: 'node',
      instances: 1,
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
