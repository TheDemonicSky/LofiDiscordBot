const { SlashCommandBuilder } = require("@discordjs/builders");
const ytdl = require("ytdl-core");
const play = require("play-dl");
const {
  StreamType,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnectionStatus,
  entersState,
} = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lofi")
    .setDescription("Will play lofi hip hop beats to study/relax to"),
  async execute(interaction) {
    const voiceChannel = interaction.member.voice.channelId;

    if (voiceChannel) {
      await interaction.reply("Playing lofi hip hop beats to study/relax to");
      const connection = joinVoiceChannel({
        channelId: voiceChannel,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      const URL = "https://www.youtube.com/watch?v=5qap5aO4i9A";

      const { stream } = await play.stream(URL, {
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
      connection.subscribe(player);

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
      await interaction.reply("You aren't connected to a voice channel.");
    }
  },
};
