import axios from "axios";
import fs from "fs";
import path from "path";

export default {
  name: "كودم",
  author: "مجهول",
  role: "member",
  description: "إرسال فيديو من Call of Duty Mobile.",
  execute: async ({ api, event }) => {
    try {
      api.sendMessage(` ⏱️ |جاري إرسال مقطع ل كودم ، الرجاء الانتظار...`, event.threadID, event.messageID);
      const response = await axios.post(`https://codm-cutie.onrender.com/api/request/f`);
      const video = response.data.url;
      const username = response.data.username;
      const nickname = response.data.nickname;
      const title = response.data.title;

      let codmPath = path.join(process.cwd(), "cache", "codm.mp4");

      const dl = await axios.get(video, { responseType: "arraybuffer" });

      fs.writeFileSync(codmPath, Buffer.from(dl.data, "utf-8"));

      api.setMessageReaction("✅", event.messageID, (err) => {}, true);
      

      api.sendMessage({
        body: `Call of Duty Mobile\n\n👤 | اسم المستخدم: ${username}\n 👥 | اللقب: ${nickname}\n 🖇️ | العنوان: ${title}`,
        attachment: fs.createReadStream(codmPath)
      }, event.threadID, event.messageID);
    } catch (err) {
      console.error(err);
      api.sendMessage(`حدث خطأ أثناء معالجة طلبك.`, event.threadID, event.messageID);
    }
  }
};