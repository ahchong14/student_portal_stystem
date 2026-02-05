const app = require('./app');
const { sequelize } = require('./models');

const port = process.env.PORT || 4000;

const start = async () => {
  await sequelize.authenticate();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

start();

process.on('SIGTERM', () => {
  console.log('Graceful shutdown');
  process.exit(0);
});
