const { SlashCommandBuilder } = require("@discordjs/builders");
const ytdl = require("ytdl-core");
const {
  StreamType,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  generateDependencyReport,
} = require("@discordjs/voice");
const musicList = [
  "https://www.youtube.com/watch?v=Mu3BfD6wmPg&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=1&t=14s",
  "https://www.youtube.com/watch?v=guhAfOxt5gg&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=2",
  "https://www.youtube.com/watch?v=XoX6zS5-jOY&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=3",
  "https://www.youtube.com/watch?v=doxeMNXYFqk&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=4",
  "https://www.youtube.com/watch?v=kHI9hnC-pnI&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=5&t=14s",
  "https://www.youtube.com/watch?v=RY89j1qdKvo&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=6",
  "https://www.youtube.com/watch?v=pIOZVb97dSk&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=7",
  "https://www.youtube.com/watch?v=eEXEEuSLjEo&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=8",
  "https://www.youtube.com/watch?v=Bksv9OEj1j8&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=9",
  "https://www.youtube.com/watch?v=nXKDQflDgTo&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=10",
  "https://www.youtube.com/watch?v=gl5DYoxkI20&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=11",
  "https://www.youtube.com/watch?v=Lsr7bJk4zAY&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=12",
  "https://www.youtube.com/watch?v=wVgj3o9k7eY&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=13",
  "https://www.youtube.com/watch?v=YqcN2xmPngc&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=14",
  "https://www.youtube.com/watch?v=-0o37zLDsWo&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=15",
  "https://www.youtube.com/watch?v=0h6a07yVacY&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=16",
  "https://www.youtube.com/watch?v=l9QSIDvbVos&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=17",
  "https://www.youtube.com/watch?v=iH7bdQxXlJI&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=18",
  "https://www.youtube.com/watch?v=T_QWejmgwGg&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=19",
  "https://www.youtube.com/watch?v=yumRWK7XuR4&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=20",
  "https://www.youtube.com/watch?v=4X_uoKF2Wvo&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=21",
  "https://www.youtube.com/watch?v=ozS8auVro70&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=22",
  "https://www.youtube.com/watch?v=uP2X50NrKHQ&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=23",
  "https://www.youtube.com/watch?v=1sPZhg-30ao&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=24",
  "https://www.youtube.com/watch?v=q4V5cvQWWeY&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=25",
  "https://www.youtube.com/watch?v=mjoXkcdGPTM&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=26",
  "https://www.youtube.com/watch?v=XyN-LascAL0&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=27",
  "https://www.youtube.com/watch?v=nV8eAWmVEk4&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=28",
  "https://www.youtube.com/watch?v=yBOv-4ndFGw&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=29",
  "https://www.youtube.com/watch?v=XcUoDrI2BwU&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=30",
  "https://www.youtube.com/watch?v=8NRAOg1c2l0&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=31",
  "https://www.youtube.com/watch?v=XGn4_-ylcaI&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=32",
  "https://www.youtube.com/watch?v=IauSZrpfgLI&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=33",
  "https://www.youtube.com/watch?v=iunocgt3c3E&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=34",
  "https://www.youtube.com/watch?v=J7w58QcrSDc&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=35",
  "https://www.youtube.com/watch?v=4722D_KdAa0&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=36",
  "https://www.youtube.com/watch?v=Fd-2C-ue0h4&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=37",
  "https://www.youtube.com/watch?v=Yu8-JBPhNr8&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=38",
  "https://www.youtube.com/watch?v=zEOnXL9Jo0A&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=39",
  "https://www.youtube.com/watch?v=rRKZ9XAXDKg&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=40",
  "https://www.youtube.com/watch?v=Vjzs4M0wAV0&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=41",
  "https://www.youtube.com/watch?v=4uCNdTiB4Us&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=42",
  "https://www.youtube.com/watch?v=EwREEj3UZT8&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=43",
  "https://www.youtube.com/watch?v=uVem4rbFVrE&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=44",
  "https://www.youtube.com/watch?v=ArqZ1dnXpYs&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=45",
  "https://www.youtube.com/watch?v=UPMgJeYsOLo&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=46",
  "https://www.youtube.com/watch?v=SNq9pPG-Qn0&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=47",
  "https://www.youtube.com/watch?v=BYyPga-3g3k&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=48",
  "https://www.youtube.com/watch?v=h2Hl1uNwDz4&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=49",
  "https://www.youtube.com/watch?v=KKjFdk3KLh8&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=50",
  "https://www.youtube.com/watch?v=WHTjyAaS-9E&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=51",
  "https://www.youtube.com/watch?v=YbPZnbeDN_Q&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=52",
  "https://www.youtube.com/watch?v=JwsBuk0Wqds&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=53",
  "https://www.youtube.com/watch?v=oeYxT2RJjno&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=54",
  "https://www.youtube.com/watch?v=8I4f-kIIl5w&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=55",
  "https://www.youtube.com/watch?v=KNuMnNjnOGg&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=56",
  "https://www.youtube.com/watch?v=J5ZjBZgtSsQ&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=57",
  "https://www.youtube.com/watch?v=lNGD5sYC6gM&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=58",
  "https://www.youtube.com/watch?v=v_LPm6P-du4&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=59",
  "https://www.youtube.com/watch?v=xlfcE02hfiU&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=60",
  "https://www.youtube.com/watch?v=QU_1o5j2PhU&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=61",
  "https://www.youtube.com/watch?v=7mlCZxWZZYg&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=62",
  "https://www.youtube.com/watch?v=SmBLBgPxYO8&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=63",
  "https://www.youtube.com/watch?v=l__PHAF-q_8&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=64",
  "https://www.youtube.com/watch?v=5M_I3Zatkpc&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=65",
  "https://www.youtube.com/watch?v=z6lRK67CuzU&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=66",
  "https://www.youtube.com/watch?v=d1ro0OdM-yI&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=67",
  "https://www.youtube.com/watch?v=7jOiZsMlPpc&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=68",
  "https://www.youtube.com/watch?v=oPwdPTBABiQ&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=69",
  "https://www.youtube.com/watch?v=ydqla2glb44&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=70",
  "https://www.youtube.com/watch?v=PLlydS1Ljqs&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=71",
  "https://www.youtube.com/watch?v=A1mg93SxcBw&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=72",
  "https://www.youtube.com/watch?v=-hhupUvTnyA&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=73",
  "https://www.youtube.com/watch?v=Ex9sCj4du14&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=74",
  "https://www.youtube.com/watch?v=0WmlBQTFSPY&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=75",
  "https://www.youtube.com/watch?v=vrwG_pCf1Sc&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=76",
  "https://www.youtube.com/watch?v=u87DZdy4Nbw&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=77",
  "https://www.youtube.com/watch?v=B450vnT44rs&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=78",
  "https://www.youtube.com/watch?v=w0XuZntwpF4&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=79",
  "https://www.youtube.com/watch?v=y0a-1BTFWi4&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=80",
  "https://www.youtube.com/watch?v=J_-kbxwmCWU&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=81",
  "https://www.youtube.com/watch?v=SnO8bTZFEjs&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=82",
  "https://www.youtube.com/watch?v=kFSnq1f7s00&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=83",
  "https://www.youtube.com/watch?v=CRayvP0BSP8&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=84",
  "https://www.youtube.com/watch?v=9DtbUpSIawM&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=85",
  "https://www.youtube.com/watch?v=6ihSc8VufOs&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=86",
  "https://www.youtube.com/watch?v=Z7U1EZC74X0&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=87",
  "https://www.youtube.com/watch?v=FTMX-XKfm2w&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=88",
  "https://www.youtube.com/watch?v=2m-91UTAbY0&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=89",
  "https://www.youtube.com/watch?v=BOHa1EfnGlg&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=90",
  "https://www.youtube.com/watch?v=zC2BRxHG7is&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=91",
  "https://www.youtube.com/watch?v=ln1MFF0rbF4&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=92",
  "https://www.youtube.com/watch?v=1pN4Sc42aOc&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=93",
  "https://www.youtube.com/watch?v=_lxmHWCU7PY&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=94",
  "https://www.youtube.com/watch?v=4UHXYPAFLgs&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=95",
  "https://www.youtube.com/watch?v=iP7G2pq1bq4&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=96",
  "https://www.youtube.com/watch?v=88bwGpJZiAM&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=97",
  "https://www.youtube.com/watch?v=D0mCtCnRx3I&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=98",
  "https://www.youtube.com/watch?v=sDC_ssw-eWI&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=99",
  "https://www.youtube.com/watch?v=p25O5XivzFM&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=100",
  "https://www.youtube.com/watch?v=gZCfgTH600w&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=101",
  "https://www.youtube.com/watch?v=tfpmAcdFmjw&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=102",
  "https://www.youtube.com/watch?v=Y2NxKdbXlwM&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=103",
  "https://www.youtube.com/watch?v=Al8KlHYw3lM&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=104",
  "https://www.youtube.com/watch?v=Au2R5jglcPY&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=105",
  "https://www.youtube.com/watch?v=TKSH6bFa7FQ&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=106",
  "https://www.youtube.com/watch?v=-Hl1a57X7Cg&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=107",
  "https://www.youtube.com/watch?v=L8UJ2fz-pNo&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=108",
  "https://www.youtube.com/watch?v=wX-7JjsJdLE&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=109",
  "https://www.youtube.com/watch?v=9sCo_bI3WfY&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=110",
  "https://www.youtube.com/watch?v=1pi9t3dnAXs&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=111",
  "https://www.youtube.com/watch?v=2J2ku3zXrWA&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=112",
  "https://www.youtube.com/watch?v=KYPn71uUdXk&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=113",
  "https://www.youtube.com/watch?v=8DN5ai3XJPk&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=114",
  "https://www.youtube.com/watch?v=CJs3pwGXJKQ&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=115",
  "https://www.youtube.com/watch?v=kfnCTMQD-zQ&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=116",
  "https://www.youtube.com/watch?v=tXwRYCht9AM&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=117",
  "https://www.youtube.com/watch?v=fkThAW1het8&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=118",
  "https://www.youtube.com/watch?v=l9ZEn_Z-y9M&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=119",
  "https://www.youtube.com/watch?v=uhfs3ceZ-Ho&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=120",
  "https://www.youtube.com/watch?v=VjTqCAF5F_g&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=121",
  "https://www.youtube.com/watch?v=9L9kBlabh_s&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=122",
  "https://www.youtube.com/watch?v=724KreFpOiw&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=123",
  "https://www.youtube.com/watch?v=Q53L9ip4Gl4&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=124",
  "https://www.youtube.com/watch?v=1-7Uo-alQNs&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=125",
  "https://www.youtube.com/watch?v=AELsPf7TJys&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=126",
  "https://www.youtube.com/watch?v=C68Q-z2UkI8&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=127",
  "https://www.youtube.com/watch?v=vWzgIWwQwV4&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=128",
  "https://www.youtube.com/watch?v=oaNmXmb41n8&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=129",
  "https://www.youtube.com/watch?v=BAzmZuaY_Lw&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=130",
  "https://www.youtube.com/watch?v=1YAoucoBKMo&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=131",
  "https://www.youtube.com/watch?v=1Qgq636Nxso&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=132",
  "https://www.youtube.com/watch?v=P9qCt5rUimw&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=133",
  "https://www.youtube.com/watch?v=X7ixhUbHxhg&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=134",
  "https://www.youtube.com/watch?v=MnHTL9Rl_4o&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=135",
  "https://www.youtube.com/watch?v=EfPrV851cpQ&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=136",
  "https://www.youtube.com/watch?v=VE-_L3A45jo&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=137",
  "https://www.youtube.com/watch?v=U97M6FBAmCo&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=138",
  "https://www.youtube.com/watch?v=iEamJeEwJUA&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=139",
  "https://www.youtube.com/watch?v=YuD1LESzoVM&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=140",
  "https://www.youtube.com/watch?v=UKI93s1yVDo&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=141",
  "https://www.youtube.com/watch?v=BYKbeTdb2g4&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=142",
  "https://www.youtube.com/watch?v=PE0lwTraRgA&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=143",
  "https://www.youtube.com/watch?v=SwiykNBkcSY&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=144",
  "https://www.youtube.com/watch?v=KOt0n0E3llw&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=145",
  "https://www.youtube.com/watch?v=QBI8KfNd6G8&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=146",
  "https://www.youtube.com/watch?v=rCZmH-NbCFI&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=147",
  "https://www.youtube.com/watch?v=8QO_LvaEfxM&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=148",
  "https://www.youtube.com/watch?v=zvmSONqJ8wE&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=149",
  "https://www.youtube.com/watch?v=ucRQph70hmc&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=150",
  "https://www.youtube.com/watch?v=Zw_dR6my7rc&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=151",
  "https://www.youtube.com/watch?v=p2JHOJCuRds&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=152",
  "https://www.youtube.com/watch?v=zDK2KJ8k-cs&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=153",
  "https://www.youtube.com/watch?v=Rkm2vYSESrQ&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=154",
  "https://www.youtube.com/watch?v=v68ZGCIDTvI&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=155",
  "https://www.youtube.com/watch?v=cOUoWAaGqJY&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=156",
  "https://www.youtube.com/watch?v=eL1S7NMHA1A&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=157",
  "https://www.youtube.com/watch?v=_y571ET8QBk&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=158",
  "https://www.youtube.com/watch?v=44-ki6-g-88&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=159",
  "https://www.youtube.com/watch?v=tEq6Cpc86Zg&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=160",
  "https://www.youtube.com/watch?v=Ys1Gv4DMAbE&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=161",
  "https://www.youtube.com/watch?v=JuXWp-ht4co&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=162",
  "https://www.youtube.com/watch?v=lIsT3fQfwdU&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=163",
  "https://www.youtube.com/watch?v=0JzYS26Hg0o&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=164",
  "https://www.youtube.com/watch?v=NGLZX2ysDKY&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=165",
  "https://www.youtube.com/watch?v=bRCtbLGb2as&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=166",
  "https://www.youtube.com/watch?v=Yym_Lw9Hkaw&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=167",
  "https://www.youtube.com/watch?v=NghzSmmkhKY&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=168",
  "https://www.youtube.com/watch?v=Xn0_TJ6zu3U&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=169",
  "https://www.youtube.com/watch?v=pcnbxGBsolc&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=170",
  "https://www.youtube.com/watch?v=YB9WbTF6fBE&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=171",
  "https://www.youtube.com/watch?v=vMP_qct9hL4&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=172",
  "https://www.youtube.com/watch?v=-C9ZJfE7Vjc&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=173",
  "https://www.youtube.com/watch?v=As9ajCTLT9I&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=174",
  "https://www.youtube.com/watch?v=ri8Y4vgvk2A&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=175",
  "https://www.youtube.com/watch?v=UakHkEFqiGs&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=176",
  "https://www.youtube.com/watch?v=D19GGG-SkBA&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=177",
  "https://www.youtube.com/watch?v=agTYiuAEH_s&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=178",
  "https://www.youtube.com/watch?v=VRU7wZFbap0&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=179",
  "https://www.youtube.com/watch?v=Dp11kVsuulM&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=180",
  "https://www.youtube.com/watch?v=q2d-PwUISdQ&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=181",
  "https://www.youtube.com/watch?v=7Wq-esXCmA4&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=182",
  "https://www.youtube.com/watch?v=-JhKm4xoXA4&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=183",
  "https://www.youtube.com/watch?v=4GB--JA80Cc&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=184",
  "https://www.youtube.com/watch?v=O3RgP69PaSo&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=185",
  "https://www.youtube.com/watch?v=kTxUcKKwrz0&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=186",
  "https://www.youtube.com/watch?v=eLkWRlPD_hY&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=187",
  "https://www.youtube.com/watch?v=wO_TWt2MWY0&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=188",
  "https://www.youtube.com/watch?v=iRx5fGKVL4I&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=189",
  "https://www.youtube.com/watch?v=vny2XZLfNHg&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=190",
  "https://www.youtube.com/watch?v=cl2l2Y4_hYs&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=191",
  "https://www.youtube.com/watch?v=QAKNR945cVk&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=192",
  "https://www.youtube.com/watch?v=ke5S8NNoJy8&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=193",
  "https://www.youtube.com/watch?v=zggkGmHp6rk&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=194",
  "https://www.youtube.com/watch?v=qdU7RgF8exI&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=195",
  "https://www.youtube.com/watch?v=XTYgwZeDNyQ&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=196",
  "https://www.youtube.com/watch?v=O_x6gERAhnE&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=197",
  "https://www.youtube.com/watch?v=rgq_Q9418cg&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=198",
  "https://www.youtube.com/watch?v=g4_bl8Y_C6U&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=199",
  "https://www.youtube.com/watch?v=zrUvwQKAixQ&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=200",
  "https://www.youtube.com/watch?v=18viTxgo3mM&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=201",
  "https://www.youtube.com/watch?v=Lw6hwZHzgsU&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=202",
  "https://www.youtube.com/watch?v=L4UFS-00Y0o&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=203",
  "https://www.youtube.com/watch?v=wmr_BB5EywI&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=204",
  "https://www.youtube.com/watch?v=Mn1QarzVA9s&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=205",
  "https://www.youtube.com/watch?v=C8_viGxisos&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=206",
  "https://www.youtube.com/watch?v=GWw7fYzkwGI&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=207",
  "https://www.youtube.com/watch?v=EvVIjeJch-c&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=208",
  "https://www.youtube.com/watch?v=0atAh63X_sU&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=209",
  "https://www.youtube.com/watch?v=JQJtqS83WFI&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=210",
  "https://www.youtube.com/watch?v=WaOZMNM6Oa4&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=211",
  "https://www.youtube.com/watch?v=bcRqz_b-XNs&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=212",
  "https://www.youtube.com/watch?v=xO8tv8B0afo&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=213",
  "https://www.youtube.com/watch?v=VmGgTYsLiPs&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=214",
  "https://www.youtube.com/watch?v=o7MPeCOgG7k&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=215",
  "https://www.youtube.com/watch?v=PegWc877xkk&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=216",
  "https://www.youtube.com/watch?v=bXpoqYhQp1o&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=217",
  "https://www.youtube.com/watch?v=J1BJScem0l4&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=218",
  "https://www.youtube.com/watch?v=FkgGD0O5pPM&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=219",
  "https://www.youtube.com/watch?v=pxPdsqrQByM&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=220",
  "https://www.youtube.com/watch?v=0Z6mzrxStk4&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=221",
  "https://www.youtube.com/watch?v=T0LBTvde71w&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=222",
  "https://www.youtube.com/watch?v=WPbCzdALF98&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=223",
  "https://www.youtube.com/watch?v=O9vZ6EhDT3o&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=224",
  "https://www.youtube.com/watch?v=Ov-CsgU-guk&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=225",
  "https://www.youtube.com/watch?v=jLjvS2JjosQ&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=226",
  "https://www.youtube.com/watch?v=S6zSCQskYl4&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=227",
  "https://www.youtube.com/watch?v=7na-xGfbOp8&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=228",
  "https://www.youtube.com/watch?v=tVpFOmGCxBQ&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=229",
  "https://www.youtube.com/watch?v=Re1m9O7q-9U&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=230",
  "https://www.youtube.com/watch?v=KZ3FowmUaY4&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=231",
  "https://www.youtube.com/watch?v=9owT8Qh-YRA&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=232",
  "https://www.youtube.com/watch?v=GcUcuckNj94&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=233",
  "https://www.youtube.com/watch?v=15dM62OMJE4&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=234",
  "https://www.youtube.com/watch?v=XFZmBSqNjro&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=235",
  "https://www.youtube.com/watch?v=pR2jzX5L1xU&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=236",
  "https://www.youtube.com/watch?v=wo4Z9QOD0H4&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=237",
  "https://www.youtube.com/watch?v=n5nscOfa18w&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=238",
  "https://www.youtube.com/watch?v=7vj4HLszl4w&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=239",
  "https://www.youtube.com/watch?v=R4FEaeOZqAo&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=240",
  "https://www.youtube.com/watch?v=fR0ZlSDUKCg&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=241",
  "https://www.youtube.com/watch?v=NHh6kMiZUA4&list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O&index=242",
];
/* const { MessageEmbed } = require("discord.js"); */

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lofi")
    .setDescription("Will play lofi hip hop beats to study/relax to"),
  async execute(interaction) {
    await interaction.reply("Playing lofi hip hop beats to study/relax to");

    console.log(generateDependencyReport());

    const connection = joinVoiceChannel({
      channelId: "971661298469314580",
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    const stream = ytdl(musicList[Math.floor(Math.random() * 242 + 1)], {
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

    /* 
    let musicLink = "https://www.youtube.com/watch?v=5qap5aO4i9A";

    let voiceChannel = message.member.voice.channel;

    if (voiceChannel) {
      let urlValidity = ytdl.validateURL(musicLink);
      if (urlValidity) {
        const connection = await voiceChannel.joinVoiceChannel();
        let dispatcher = connection.play(
          ytdl(musicLink, { filter: "audioonly" })
        );

        let deletedMessage = await message.delete();
        let info = await ytdl.getBasicInfo(musicLink);

        const musicPlayerEmbed = new MessageEmbed()
          .setColor("BLUE")
          .setTitle(info.videoDetails.title)
          .setThumbnail(info.videoDetails.thumbnail.thumbnails[0].url);

        let sentMusicPlayerEmbed = await deletedMessage.channel.send(
          musicPlayerEmbed
        );
        sentMusicPlayerEmbed.react("⏹");
        sentMusicPlayerEmbed.react("⏸");

        let filter = (reaction, user) =>
          !user.bot && user.id === message.author.id;
        const reactionCollector =
          sentMusicPlayerEmbed.createReactionCollector(filter);

        reactionCollector.on("collect", (reaction) => {
          if (reaction.emoji.name === "⏸") {
            dispatcher.pause();
            reaction.remove();
            sentMusicPlayerEmbed.react("▶️");
          } else if (reaction.emoji.name === "▶️") {
            dispatcher.resume();
            reaction.remove();
            sentMusicPlayerEmbed.react("⏸");
          } else if (reaction.emoji.name === "⏹") {
            connection.disconnect();
            sentMusicPlayerEmbed.delete();
          } else {
            reaction.remove();
          }
        });

        dispatcher.on("finish", () => {
          connection.disconnect();
          sentMusicPlayerEmbed.delete();
        });
      } else {
        message
          .delete()
          .then((m) =>
            m.channel.send(
              "Provide a valid YouTube link so that I can play some music."
            )
          );
      }
    } else {
      message
        .delete()
        .then((m) => m.channel.send("You need to join a voice channel first"));
    } */
  },
};