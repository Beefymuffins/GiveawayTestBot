const mongoose = require('mongoose');
const { loadCommands } = require('../../Handlers/commandHandler');
const { DatabaseURL } = require('../../config.json');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log('Client is Ready!');
    client.user.setActivity(`with ${client.guilds.cache.size} guilds`);

    if (!DatabaseURL) return;
    mongoose
      .connect(DatabaseURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('The client is now connected to the database!');
      })
      .catch((err) => {
        console.log(err);
      });

    loadCommands(client);
  },
};
