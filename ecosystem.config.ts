module.exports = {
  apps: [
    {
      name: 'node-backend',
      script: 'dist/app.js',
      instances: 1,
      exec_mode: 'fork',
    }
  ]
};
