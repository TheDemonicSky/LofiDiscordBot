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
        connection.subscribe(player);

        const info = await ytdl.getBasicInfo(url);

        const musicPlayerEmbed = new MessageEmbed()
          .setColor("BLUE")
          .setTitle(info.videoDetails.title)
          .setThumbnail(info.videoDetails.thumbnails[0].url);

        const sentMusicPlayerEmbed = await interaction.channel.send({
          embeds: [musicPlayerEmbed],
        });
        sentMusicPlayerEmbed.react("⏹");
        sentMusicPlayerEmbed.react("⏸");

        const filter = (user) => !user.bot;
        const collector = sentMusicPlayerEmbed.createReactionCollector({
          filter,
        });

        testCollector = interaction.createReactionCollector({ filter });

        testCollector.on("collect", (reaction, user) => {
          console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
        });

        collector.on("collect", (reaction) => {
          if (reaction.emoji.name === "⏸") {
            resource.pause();
            reaction.remove();
            sentMusicPlayerEmbed.react("▶️");
          } else if (reaction.emoji.name === "▶️") {
            resource.resume();
            reaction.remove();
            sentMusicPlayerEmbed.react("⏸");
          } else if (reaction.emoji.name === "⏹") {
            connection.destroy();
            sentMusicPlayerEmbed.delete();
          } else {
            reaction.remove();
          }
        });

        player.on("finish", () => {
          connection.destroy();
          sentMusicPlayerEmbed.delete();
        });
      } else {
        interaction.reply("Provide a valid YouTube link");
      }
    } else {
      interaction.reply("You need to join a voice channel first");
    }
  },
};
