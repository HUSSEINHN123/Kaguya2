import axios from "axios";
import fs from "fs-extra";

export default {
  name: "إيموجي",
  author: "حسين يعقوبي",
  role: "member",
  description: "تحويل إيموجي إلى صورة متحركة",
  async execute({ api, args, event }) {
    const emoji = args.join(" ");

    if (!emoji) {
      return api.sendMessage("ℹ️ | يرجى إدخال إيموجي لتحويله إلى صورة متحركة.", event.threadID, event.messageID);
    }

    try {
      const { threadID, messageID } = event;
      let path = process.cwd() + "/cache/animated_image.gif"; 

      const response = await axios.get(`https://apis-samir.onrender.com/egif?emoji=${encodeURIComponent(emoji)}`, { responseType: "arraybuffer" });

      fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));

      api.setMessageReaction("✅", event.messageID, (err) => {}, true);

      api.sendMessage({ 
        body: "✅ | تم تحويل الإيموجي إلى صورة متحركة بنجاح",
        attachment: fs.createReadStream(path)
      }, threadID, () => fs.unlinkSync(path), messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("⚠️ | حدث خطأ أثناء تحويل الإيموجي إلى صورة متحركة. يرجى المحاولة مرة أخرى.", event.threadID);
    }
  },
};