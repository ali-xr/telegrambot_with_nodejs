import request from "request";
import fetch from "node-fetch";
import TelegramBot from "node-telegram-bot-api";
import gTranslate  from'@vitalets/google-translate-api'

async function translate(word) {
  let data = await fetch(
    "https://api.dictionaryapi.dev/api/v2/entries/en/" + word
  );
  data = await data.json();
  const res = {
    audio: "https:" + data[0]?.phonetics[0]?.audio,
    text: data[0]?.phonetic,
  };
  return res;
}

const bot = new TelegramBot("2113300126:AAGDQK_vH_juUVzmUDsbYP_3amuqHJXl02M", {
  polling: true,
});

bot.on("message", async (msg) => {
  let {
    chat: { id },
    text,
  } = msg;

  if (!text) {
    bot.sendMessage(id, "Iltimos o'zbekcha matn yoki so'z jo'nating!");
  } else if (text == "/start") {
    bot.sendMessage(id, "Botga xush kelibsiz!", {
        
    });
  } else if (text == "English word to English audio") {
    bot.sendMessage(id, "hali bu qism qilinmadi");
  } else if (
    text &&
    text != "/start" &&
    text != "Uzbek word to English audio"
  ) {
    try {
      
          let md = await gTranslate(text, {from: "uz", to: "en"});
          const rest = await translate(md.text);
          
          if (md && rest?.audio && rest?.text) {
            bot.sendVoice(id, rest.audio, {
              caption: rest.text,
            });
          } else {
            bot.sendMessage(
              id,
              "Bu so'zni tarjima qilib bo'lmadi yoki audioga o'girib bo'lmadi"
            );
          }
      
    } catch (error) {
      console.log(error);
    }
  }
});
