import axios from "axios";
import fs from "fs-extra";

export default {
  name: "بنات",
  author: "حسين يعقوبي",
  role: "member",
  description: "الحصول على فيديو عشوائي من TikTok",
  async execute({ api, event }) {
    let videoPath = process.cwd() + "/cache/random_video.mp4";

    try {
      const response = await axios.get("https://random-tiktok-video-girl.onrender.com/random", { responseType: "stream" });

      if (response.data) {
        const videoResponse = response.data;
        videoResponse.pipe(fs.createWriteStream(videoPath));

        videoResponse.on("end", () => {
          api.sendMessage({ attachment: fs.createReadStream(videoPath) }, event.threadID, () => fs.unlinkSync(videoPath), event.messageID);
        });
      } else {
        api.sendMessage("فشل في جلب فيديو عشوائي من TikTok. يرجى المحاولة مرة أخرى.", event.threadID, event.messageID);
      }
    } catch (error) {
      api.sendMessage("حدث خطأ أثناء جلب الفيديو العشوائي من TikTok. يرجى المحاولة مرة أخرى.", event.threadID, event.messageID);
      console.error(error);
    }
  },
};