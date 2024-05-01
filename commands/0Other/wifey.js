import axios from 'axios';
import fs from 'fs';
import path from 'path';

async function playVoice({ api, event, args, message }) {
    api.setMessageReaction("🕐", event.messageID, (err) => {}, true);
    const categories = ["jjk", "naruto", "ds", "aot", "bleach", "onepiece"];

    if (args.length !== 1 || !categories.includes(args[0].toLowerCase())) {
      return message.reply(` ⚠️ | الرجاء تحديد فئة صالحة. الفئات المتاحة: ${categories.join(", ")}`);
    }

    try {
      const category = args[0].toLowerCase();
      const response = await axios.get(`https://voice-kshitiz.onrender.com/kshitiz/${category}`, { responseType: "arraybuffer" });

      const tempVoicePath = path.join(process.cwd(), "cache", `${Date.now()}.mp3`);
      fs.writeFileSync(tempVoicePath, Buffer.from(response.data, 'binary'));

      const stream = fs.createReadStream(tempVoicePath);
      message.reply({ attachment: stream });

      api.setMessageReaction("✅", event.messageID, (err) => {}, true);
    } catch (error) {
      console.error(error);
      message.reply("عذرًا، حدث خطأ أثناء معالجة طلبك.");
    }
}

export default {
    name: "صوت_أنمي",
    author: "مثال",
    role: "member",
    description: "يشغل صوتًا من فئة معينة.",
    execute: playVoice
};