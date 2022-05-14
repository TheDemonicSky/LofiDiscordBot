const { SlashCommandBuilder } = require("@discordjs/builders");
const ytdl = require("ytdl-core");
const {
  StreamType,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} = require("@discordjs/voice");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays requested YouTube audio")
    .addStringOption((option) =>
      option.setName("url").setDescription("Enter a valid YouTube URL")
    ),
  async execute(interaction) {
    const voiceChannel = interaction.member.voice.channelId;
    const url = interaction.options.getString("url");

    if (voiceChannel) {
      const urlValidity = ytdl.validateURL(url);
      if (urlValidity) {
        const connection = joinVoiceChannel({
          channelId: voiceChannel,
          guildId: interaction.guildId,
          adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        const stream = ytdl(url, {
          filter: "audio",
        });

        const resource = createAudioResource(stream, {
          inputType: StreamType.Arbitrary,
          mute: false,
          self_mute: false,
          deafen: false,
          self_deafen: false,
        });
        const player = createAudioPlayer();

        player.play(resource);
        player.on("error", (error) => console.error(error));
        connection.subscribe(player);

        const info = await ytdl.getBasicInfo(url);

        const musicPlayerEmbed = new MessageEmbed()
          .setColor("BLUE")
          .setTitle(info.videoDetails.title)
          .setThumbnail(info.videoDetails.thumbnails[0].url);

        interaction.channel
          .send({ embeds: [musicPlayerEmbed] })
          .then((sentMessage) => {
            sentMessage.react("⏹");
            sentMessage.react("⏸");
            const filter = (user) => !user.bot;
            const collector = sentMessage.createReactionCollector();

            collector.on("collect", (reaction) => {
              console.log("gay");
              if (reaction.emoji.name === "⏸") {
                resource.pause();
                reaction.remove();
                sentMessage.react("▶️");
              } else if (reaction.emoji.name === "▶️") {
                resource.resume();
                reaction.remove();
                sentMessage.react("⏸");
              } else if (reaction.emoji.name === "⏹") {
                connection.destroy();
                sentMessage.delete();
              } else {
                reaction.remove();
              }
            });

            connection.on("stateChange", (oldState, newState) => {
              console.log(
                `Connection transitioned from ${oldState.status} to ${newState.status}`
              );
            });

            player.on("stateChange", (oldState, newState) => {
              console.log(
                `Audio player transitioned from ${oldState.status} to ${newState.status}`
              );
            });

            player.on("finish", () => {
              connection.destroy();
              sentMessage.delete();
            });
          });

        connection.on(VoiceConnectionStatus.Disconnected, async () => {
          try {
            await Promise.race([
              entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
              entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
            ]);
            // Seems to be reconnecting to a new channel - ignore disconnect
          } catch (error) {
            // Seems to be a real disconnect which SHOULDN'T be recovered from
            console.error(error);
            connection.destroy();
          }
        });
      } else {
        interaction.reply("Provide a valid YouTube link");
      }
    } else {
      interaction.reply("You need to join a voice channel first");
    }
  },
};
