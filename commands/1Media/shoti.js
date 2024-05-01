import axios from "axios";
import fs from "fs";
import path from "path";

export default {
  name: "شوتي",
  author: "kaguya project",
  role: "member",
  description: "يقوم بإرسال مقاطع فيديو من رابط معين.",
  async execute({ event, api }) {
    api.setMessageReaction("⏱️", event.messageID, (err) => { }, true);

    const apiUrl = 'https://shoti-server-v2.vercel.app/api/v1/get';
    const videoPath = path.join(process.cwd(), 'temp');

    // التأكد من وجود مجلد temp وإنشاؤه إذا لم يكن موجودًا
    if (!fs.existsSync(videoPath)) {
      fs.mkdirSync(videoPath, { recursive: true });
    }

    const filePath = path.join(videoPath, 'shoti.mp4');

    try {
      const response = await axios.post(apiUrl, {
        apikey: "$shoti-1hjvb0q3sokk2bvme",
      });

      if (response.data && response.data.data && response.data.data.url) {
        const videoUrl = response.data.data.url;
        const writer = fs.createWriteStream(filePath);

        const videoResponse = await axios({
          method: 'GET',
          url: videoUrl,
          responseType: 'stream',
        });

        videoResponse.data.pipe(writer);

        writer.on('finish', () => {
          api.setMessageReaction("✅", event.messageID, (err) => { }, true);
          api.sendMessage({
            body: `✅ |تم تحميل المقطع بنجاح.\n🔗 | رابط المقطع: ${videoUrl}\n\n👥 | إسم المستخدم: @${response.data.data.user.username}\n👤 | اللقب: ${response.data.data.user.nickname}\n🧿 | المعرف: ${response.data.data.user.userID}\n⏰ | المدة: ${response.data.data.duration}`,
            attachment: fs.createReadStream(filePath),
          }, event.threadID);
        });

        writer.on('error', (err) => {
          console.error(`Error writing video file: ${err}`);
          api.sendMessage(`❌ | حدث خطأ أثناء تحميل الفيديو.`, event.threadID);
        });
      } else {
        throw new Error('Invalid response data');
      }
    } catch (error) {
      console.error(`Error fetching video: ${error}`);
      api.sendMessage(`❌ | حدث خطأ أثناء إنشاء الفيديو. خطأ: ${error}`, event.threadID);
    }
  },
};