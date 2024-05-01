import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';

export default {
  name: "تيك",
  author: "حسين يعقوبي",
  cooldowns: 60,
  description: "البحث عن مقاطع فيديو TikTok",
  role: "member",
  aliases: ["tiktok"],

  async execute({ api, event, args }) {
    api.setMessageReaction("🕐", event.messageID, () => {}, true);

    try {
      const query = args.join(" ");
      const apiUrl = `https://last-api-30a30f1ae341.herokuapp.com/api/tiksearch?search=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);

      if (response.data.code === 0 && response.data.data.videos.length > 0) {
        const videoData = response.data.data.videos[0];
        const videoUrl = videoData.play;
        const videoFileName = `${videoData.video_id}.mp4`;

        const tempVideoPath = `./cache/${videoFileName}`;
        const writer = fs.createWriteStream(tempVideoPath);

        const videoResponse = await axios.get(videoUrl, { responseType: "stream" });
        videoResponse.data.pipe(writer);

        writer.on("finish", () => {
          const videoStream = fs.createReadStream(tempVideoPath);
          const userName = videoData.author.unique_id;
          const messageBody = `إسم المستخدم : ${userName}`;
          api.sendMessage({ body: messageBody, attachment: videoStream }, event.threadID, () => {
            fs.unlinkSync(tempVideoPath);
          }, event.messageID);
          api.setMessageReaction("✅", event.messageID, () => {}, true);
        });
      } else {
        api.sendMessage("⚠️ | لم يتم العثور على مقاطع فيديو TikTok للاستعلام المحدد.", event.threadID);
        api.setMessageReaction("❌", event.messageID, () => {}, true);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage("❌ | عذرًا، حدث خطأ أثناء معالجة طلبك.", event.threadID);
    }
  }
};