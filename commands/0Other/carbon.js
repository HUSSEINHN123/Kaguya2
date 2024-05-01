import axios from "axios";
import fs from "fs-extra";

export default {
  name: "دمج2",
  author: "Kaguya Project",
  role: "member",
  description: "تبديل الصور بينها",
  execute: async ({ api, event }) => {

    const args = event.body.split(/\s+/);
    args.shift();

    const reply = (message) => api.sendMessage(message, event.threadID, event.messageID);

    if (event.type === "message_reply") {
      const attachments = event.messageReply.attachments.filter(attachment => attachment.type === "photo");

      if (attachments.length >= 2) {
        const [url1, url2] = attachments.map(attachment => attachment.url);
        const path = process.cwd() + `/cache/swapped_image.jpg`;

        api.sendMessage("🔮 | جاري دمج الصورتين يرجى الإنتظار...", event.threadID, event.messageID);

        try {
          const response = await axios.get('https://haze-faceswap.replit.app/swap', {
            params: {
              swap_image: url1,
              target_image: url2
            }
          });

          const processedImageURL = response.data.hazeswap;
          const { data } = await axios.get(processedImageURL, { responseType: "stream" });

          const writer = fs.createWriteStream(path);
          data.pipe(writer);

          writer.on('finish', () => {
            api.sendMessage({
              body: "🔮 | تم دمج الصورتين بنجاح ",
              attachment: fs.createReadStream(path)
            }, event.threadID, (err, messageInfo) => {
              if (err) {
                reply("🤖 خطأ في إرسال الرسالة: " + err);
              } else {
                fs.unlinkSync(path);
              }
            });
          });
        } catch (error) {
          reply(`🤖 خطأ في معالجة الصور: ${error}`);
        }
      } else {
        reply("🔮 تبديل الصور\n\nاستخدام: خلط [ الصورة 1 والصورة 2 ]");
      }
    }
  },
};