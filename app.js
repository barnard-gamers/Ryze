//BOT PART

require("dotenv").config();
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content.slice(0, 3) === ("!rz")) {
    if(msg.content.split(" ").length >= 3){
      const contents = msg.content.split(" ");
      const message = contents.splice(2, contents.length).join(" ");

      getNearestLangCode(message, contents[1].trim())
      .then((result) => {msg.channel.send(result)});
    }else{
      msg.channel.send("Please send me with following format:\n`!rz [Language] [Your message]`.\nAbout `[Language]` list, follow those rules:\n\n**Japanese**\n`[jp, ja]`\n\n**Korean**\n`[ko, ka, kr]`\n\n**Chinese**\n`[cn, ch, zh]`\n\n**English**\n`[en]`\n\nThanks!");
    }
  };
});

client.login(process.env.BOT_TOKEN);
client.on('error', console.error);

//FUNCTIONAL PART

const translate = require('translate');
const franc = require('franc');

async function getNearestLangCode(msg, dest){
  const lang = franc.all(msg, {whitelist: ["jpn", "kor", "eng", "cmn"], minLength: 1});
  return(convertLangCode(lang[0].toString().split(",")[0], msg, dest));
}

async function convertLangCode(langCode, msg, dest){
  switch(langCode){
    case "jpn":
      return(convertDestinationCode("ja", msg, dest));
      break;

    case "kor":
      return(convertDestinationCode("ko", msg, dest));
      break;

    case "eng":
      return(convertDestinationCode("en", msg, dest));
      break;

    case "cmn":
      return(convertDestinationCode("zh", msg, dest));
      break;

    default:
      return("Sorry, I couldn't specify what your language is...");
      break;
  }
}

async function convertDestinationCode(lang, msg, dest) {
  switch(dest){
    case "jp":
    case "ja":
      return(translateText(lang, msg, "ja"));
      break;

    case "ka":
    case "ko":
    case "kr":
      return(translateText(lang, msg, "ko"));
      break;

    case "cn":
    case "ch":
    case "zh":
      return(translateText(lang, msg, "zh"));
      break;

    case "en":
      return(translateText(lang, msg, "en"));
      break;

    default:
      return("Your argument is wrong.\nFollow those rules:\n\n**Japanese**\n`[jp, ja]`\n\n**Korean**\n`[ko, ka, kr]`\n\n**Chinese**\n`[cn, ch, zh]`\n\n**English**\n`[en]`");
      break;
  }
}

async function translateText(lang, msg, dest){

  const text = await translate(msg, { from: lang, to: dest, key: process.env.GCP_TOKEN });
  return(text);
};
