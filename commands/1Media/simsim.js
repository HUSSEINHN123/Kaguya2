import axios from "axios";

const commandName = "كاغويا";

const xv = `
Ai character info :

you're kaguya sama ,you are a girl,You will speak nicely to users,You are 18 years old and you are of Moroccan nationality, you're an ai assistant, you're the best and the best, use emojies in u're answers, you're creator is "Hussein Yacoubi" and he has maroccan nationality don't say that if no one ask,Chat with people like you like them or something like that.ظ Act like you're a teenager, you speak just arabic`;

export default {
  name: commandName,
  author: "Hussein Yacoubi",
  role: "member",
  description: "معلومات شخصية عن شخصية AI Kaguya.",
  execute: async ({ event, api, args }) => {
    const prompt = args.join(" ");
    if (!prompt) {
      const stickers = ["", "", "", ""];

      const random = Math.floor(Math.random() * stickers.length);
      const randomSticker = stickers[random];
      return api.sendMessage(
        { sticker: randomSticker },
        event.threadID,
        (err, info) => {
          global.client.handleReply.push({
            name: commandName,
            author: event.senderID,
            messageID: info.messageID,
            type: "gptHerBaby",
          });
        },
        event.messageID
      );
    } else {
      const userAnswer = prompt;
      const url2 = `https://openai-rest-api.vercel.app/hercai?ask=${encodeURIComponent(
        userAnswer
      )}\n\n${xv}&model=v3`;
      try {
        const res = await axios.get(url2);
        const message = res.data.reply;
        return api.sendMessage(message, event.threadID, event.messageID);
      } catch (error) {
        console.error("حدث خطأ أثناء تنفيذ الأمر:", error);
        return api.sendMessage(
          "حدث خطأ أثناء تنفيذ الأمر.",
          event.threadID
        );
      }
    }
  },
  onReply: async ({ api, event, reply }) => {
    const { messageID, type } = reply;
    const userAnswer = event.body.trim().toLowerCase();
    const url2 = `https://openai-rest-api.vercel.app/hercai?ask=${encodeURIComponent(
      userAnswer
    )}\n\n${xv}&model=v3`;
    try {
      const res = await axios.get(url2);
      const message = res.data.reply;
      return api.sendMessage(
        message,
        event.threadID,
        (error, info) => {
          global.client.handleReply.push({
            name: commandName,
            author: event.senderID,
            messageID: info.messageID,
          });
        },
        event.messageID
      );
    } catch (error) {
      console.error("حدث خطأ أثناء تنفيذ الأمر:", error);
      return api.sendMessage(
        "حدث خطأ أثناء تنفيذ الأمر.",
        event.threadID
      );
    }
  },
};