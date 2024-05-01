import axios from "axios";
import fs from "fs-extra";

export default {
  name: "زوجة",
  author: "حسين يعقوبي",
  role: "member",
  description: "الحصول على صورة عشوائية لشخصية أنمي",
  async execute({ api, event }) {
    let path = process.cwd() + "/cache/waifu_image.png"; // يمكنك استخدام process.cwd() بدلاً من __dirname

    let tid = event.threadID;
    let mid = event.messageID;

    try {
      let response = await axios.get("https://deku-rest-api.replit.app/waifu", { responseType: "stream" });

      if (response.data) {
        let imageResponse = response.data;
        imageResponse.pipe(fs.createWriteStream(path));

        imageResponse.on("end", () => {

          api.setMessageReaction("😘", event.messageID, (err) => {}, true)

          
          api.sendMessage({ attachment: fs.createReadStream(path) }, tid, () => fs.unlinkSync(path), mid);
        });
      } else {
        return api.sendMessage("فشل في جلب صورة عشوائية لشخصية أنمي. يرجى المحاولة مرة أخرى.", tid, mid);
      }
    } catch (e) {
      return api.sendMessage(e.message, tid, mid);
    }
  },
};