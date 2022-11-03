const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { Guilds, GuildMembers, GuildMessages, GuildMessageReactions } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, GuildMessageReactions],
  partials: [User, Message, GuildMember, ThreadMember],
});

require('./Systems/giveawaySystem')(client);

const { loadEvents } = require('./Handlers/eventHandler');

client.config = require('./config.json');
client.commands = new Collection();
client.events = new Collection();

loadEvents(client);

client.login(client.config.token);

// TODO PERMISSIONS, CUSTOMIZE EMBEDS
