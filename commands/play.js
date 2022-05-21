const play = require("play-dl");
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  StreamType,
} = require("@discordjs/voice");
const { MessageEmbed } = require("discord.js");

const queue = new Map();
// queue(message.guild.id, queue_constructor object { voice channel, text channel, connection, song})

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Will add your song to a queue")
    .addStringOption((option) =>
      option.setName("song").setDescription("Enter a valid URL or Song name")
    ),
  async execute(interaction) {
    const args = interaction.options.getString("song");
    const voiceChannel = interaction.member.voice.channelId;
    if (!voiceChannel)
      return interaction.reply(
        "You need to be in a voice channel to execute this command!"
      );

    const serverQueue = queue.get(interaction.guild.id);

    let song = {};

    if (ytdl.validateURL(args)) {
      const songInfo = await ytdl.getInfo(args);
      song = {
        thumbnail: songInfo.videoDetails.thumbnails[0].url,
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
      };
    } else {
      //If the song is not a URL then use keywords to find that song
      const videoFinder = async (query) => {
        const videoResult = await ytSearch(query);
        return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
      };

      const video = await videoFinder(args);
      if (video) {
        song = {
          thumbnail: video.thumbnail,
          title: video.title,
          url: video.url,
        };
      } else {
        interaction.reply("Error finding video.");
      }
    }

    if (!serverQueue) {
      const queueConstructor = {
        voiceChannel: voiceChannel,
        textChannel: interaction.channel,
        connection: null,
        songs: [],
      };

      queue.set(interaction.guild.id, queueConstructor);
      queueConstructor.songs.push(song);

      try {
        const connection = joinVoiceChannel({
          channelId: voiceChannel,
          guildId: interaction.guildId,
          adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        queueConstructor.connection = connection;
        videoPlayer(interaction.guild, queueConstructor.songs[0]);
        return interaction.reply(`Now playing **${song.title}**`);
      } catch (err) {
        queue.delete(interaction.guild.id);
        interaction.reply("There was an error connecting!");
        throw err;
      }
    } else {
      serverQueue.songs.push(song);
      return interaction.reply(
        `👍 **${song.title}** has been added to the queue!`
      );
    }
  },
};

const videoPlayer = async (guild, song, sentMessage) => {
  const songQueue = queue.get(guild.id);

  if (!song) {
    songQueue.connection.destroy();
    queue.delete(guild.id);
    return;
  }
  const { stream } = await play.stream(song.url, {
    discordPlayerCompatibility: true,
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
  player.on("idle", () => {
    songQueue.songs.shift();
    videoPlayer(guild, songQueue.songs[0]);
  });
  songQueue.connection.subscribe(player);

  embed(guild, song, player);
};

const embed = async (guild, song, player) => {
  const songQueue = queue.get(guild.id);
  const info = await ytdl.getBasicInfo(song.url);

  const musicPlayerEmbed = new MessageEmbed()
    .setColor("BLUE")
    .setTitle(info.videoDetails.title)
    .setThumbnail(info.videoDetails.thumbnails[0].url);

  songQueue.textChannel
    .send({ embeds: [musicPlayerEmbed] })
    .then((sentMessage) => {
      sentMessage.react("⏹");
      sentMessage.react("⏸");
      sentMessage.react("⏭");
      const filter = (reaction, user) => {
        return !user.bot;
      };
      const collector = sentMessage.createReactionCollector({ filter });

      collector.on("collect", (reaction) => {
        if (reaction.emoji.name === "⏸") {
          player.pause();
          reaction.remove();
          sentMessage.react("▶️");
        } else if (reaction.emoji.name === "▶️") {
          player.unpause();
          reaction.remove();
          sentMessage.react("⏸");
        } else if (reaction.emoji.name === "⏹") {
          queue.delete(guild.id);
          songQueue.connection.destroy();
          sentMessage.delete();
        } else if (reaction.emoji.name === "⏭") {
          sentMessage.delete();
          songQueue.songs.shift();
          videoPlayer(guild, songQueue.songs[0], sentMessage);
        } else {
          reaction.remove();
        }

        player.on("idle", () => {
          sentMessage.delete();
        });
      });
    });
};
