const { SlashCommandBuilder } = require("@discordjs/builders");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("disconnect")
    .setDescription("Disconnects the bot from a voice channel"),
  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);
    if (connection) {
      connection.destroy();
      interaction.reply("Thanks for listening");
    } else {
      interaction.reply("I am not connected to a voice channel.");
    }
  },
};

/* player.on(AudioPlayerStatus.Idle, () => connection.destroy()); */
