module.exports = {
  apps: [
    {
      name: "node-backend", // Name of your application
      script: "./dist/app.js", // Entry point of your application
      restart_delay: 5000, // Delay before restarting crashed instances
      watch: false, // Set to true if you want to watch for file changes
      // Uncomment and configure if needed:
      instance_var: "INSTANCE_ID",
      instances: 1, // Fixed number of instances
      max_memory_restart: "500M", // Restart if memory exceeds this limit
    },
  ],
};
