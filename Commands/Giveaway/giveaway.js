const { CommandInteraction, MessageEmbed, Client, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('A complete giveaway system.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('start')
        .setDescription('Start a giveaway')
        .addStringOption((option) =>
          option
            .setName('duration')
            .setDescription('Provide a duration for this giveaway (1m, 1h, 1d)')
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option.setName('winners').setDescription('Select the amount of winners for this giveaway.').setRequired(true)
        )
        .addStringOption((option) =>
          option.setName('prize').setDescription('Provide the name of the prize.').setRequired(true)
        )
        .addChannelOption((option) =>
          option.setName('channel').setDescription('Select a channel to send the giveaway to.')
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('actions')
        .setDescription('Options for the giveaways')
        .addStringOption((option) =>
          option
            .setName('options')
            .setDescription('Select an option.')
            .addChoices(
              {
                name: 'end',
                value: 'end',
              },
              {
                name: 'pause',
                value: 'pause',
              },
              {
                name: 'unpause',
                value: 'unpause',
              },
              {
                name: 'reroll',
                value: 'reroll',
              },
              {
                name: 'delete',
                value: 'delete',
              }
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option.setName('message-id').setDescription('Provide the message id of the giveaway.').setRequired(true)
        )
    ),

  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    const { options } = interaction;

    const sub = options.getSubcommand();

    const errorEmbed = new EmbedBuilder().setColor('#DC143C');
    const successEmbed = new EmbedBuilder().setColor('#7FFF00');

    switch (sub) {
      case 'start':
        {
          const gchannel = options.get('channel')?.value || interaction.channel;
          const duration = options.get('duration').value;
          const winnerCount = options.get('winners').value;
          const prize = options.get('prize').value;

          client.giveawaysManager
            .start(gchannel, {
              duration: ms(duration),
              winnerCount,
              prize,
              messages: {
                giveaway: ' **MALICE GIVEAWAY** ',
                giveawayEnded: ' **MALICE GIVEAWAY ENDED** ',
                inviteToParticipate: 'React with 🎉 to participate!',
                winMessage: 'Congratulations, {winners}! You won **{this.prize}**!',
              },
            })
            .then(async () => {
              successEmbed.setDescription('Giveaway was successfully created!');
              return interaction.reply({ embeds: [successEmbed], ephemeral: true });
            })
            .catch((err) => {
              errorEmbed.setDescription(`An error has occurred\n\`${err}\``);
              return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            });
        }
        break;
      case 'actions':
        {
          const choice = options.get('options').value;
          const messageId = options.get('message-id').value;

          // Search with messageId
          const giveaway = client.giveawaysManager.giveaways.find(
            (g) => g.guildId === interaction.guildId && g.messageId === messageId
          );

          // If no giveaway was found
          if (!giveaway) {
            errorEmbed.setDescription(`Unable to find a giveaway for \`${messageId}\` in this guild.`);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
          }

          switch (choice) {
            case 'end':
              {
                client.giveawaysManager
                  .end(messageId)
                  .then(() => {
                    successEmbed.setDescription('Giveaway has been ended.');
                    return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                  })
                  .catch((err) => {
                    errorEmbed.setDescription(`An error has occurred\n\`${err}\``);
                    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                  });
              }
              break;
            case 'pause':
              {
                client.giveawaysManager
                  .pause(messageId)
                  .then(() => {
                    successEmbed.setDescription('Giveaway has been paused.');
                    return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                  })
                  .catch((err) => {
                    errorEmbed.setDescription(`An error has occurred\n\`${err}\``);
                    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                  });
              }
              break;
            case 'unpause':
              {
                client.giveawaysManager
                  .unpause(messageId)
                  .then(() => {
                    successEmbed.setDescription('Giveaway has been unpaused.');
                    return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                  })
                  .catch((err) => {
                    errorEmbed.setDescription(`An error has occurred\n\`${err}\``);
                    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                  });
              }
              break;
            case 'reroll':
              {
                client.giveawaysManager
                  .reroll(messageId)
                  .then(() => {
                    successEmbed.setDescription('Giveaway has been rerolled.');
                    return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                  })
                  .catch((err) => {
                    errorEmbed.setDescription(`An error has occurred\n\`${err}\``);
                    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                  });
              }
              break;
            case 'delete':
              {
                client.giveawaysManager
                  .delete(messageId)
                  .then(() => {
                    successEmbed.setDescription('Giveaway has been deleted.');
                    return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                  })
                  .catch((err) => {
                    errorEmbed.setDescription(`An error has occurred\n\`${err}\``);
                    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                  });
              }
              break;
          }
        }
        break;

      default: {
        console.log('Error in our Giveaway command.');
      }
    }
  },
};
