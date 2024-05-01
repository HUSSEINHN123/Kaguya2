import axios from "axios";
import fs from "fs-extra";
import moment from "moment-timezone";

export default {
  name: "تخيلي3",
  author: "حسين يعقوبي",
  cooldowns: 60,
  description: "توليد صورة استنادًا إلى النص المدخل",
  role: "member",
  aliases: ["توليد_صورة", "تخيلي"],
  async execute({ api, args, event }) {

    api.setMessageReaction("⚙️", event.messageID, (err) => {}, true);

    const query = args.join(" ");

    try {
      const translationResponse = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(query)}`);
      const translatedQuery = translationResponse?.data?.[0]?.[0]?.[0];

      if (!translatedQuery) {
        throw new Error("فشل الترجمة أو الناتج كان فارغًا.");
      }

      const startTime = moment();

      const emiResponse = (await axios.get(`https://deku-rest-api.replit.app/emi?prompt=${encodeURIComponent(translatedQuery)}`, {
        responseType: "arraybuffer",
      })).data;

      const { threadID, messageID } = event;
      const endTime = moment();
      const executionTime = endTime.diff(startTime, 'seconds');

      const timestamp = moment.tz("Africa/Casablanca");
      const dateString = timestamp.format("YYYY-MM-DD");
      const timeString = timestamp.format("HH:mm:ss");

      const path = `./cache/emi.png`;
      fs.writeFileSync(path, Buffer.from(emiResponse, "utf-8"));

      api.setMessageReaction("✓", event.messageID, (err) => {}, true);

      api.sendMessage({
        body: `✿━━━━━━━━━━━━━━━━━✿\n 🌸 | تفضل النتيجة \n 📅 | التاريخ: ${dateString} \n 🕒 | الوقت: ${timeString}\n ⏳ | وقت التنفيذ: ${executionTime} ثانية\n✿━━━━━━━━━━━━━━━━━✿`,
        attachment: fs.createReadStream(path)
      }, threadID, () => fs.unlinkSync(path), messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("⚠️ |يرجى إدخال وصف.", event.threadID);
    }
  },
};