import axios from "axios";
import fs from "fs-extra";

export default {
  name: "إقتراح_أنمي",
  author: "Anonymous",
  role: "member",
  description: " يقوم بإرسال إقتراح الأنيمي بناءً على النوع.",
  execute: async ({ api, event, message }) => {
    const messageBody = event.body.toLowerCase().trim();
    if (messageBody === 'anime') {
      await api.sendMessage(' ⚠️ | المرجو تحديد النوع .\n{p}إقتراح_أنمي {النوع}:- شونين | سينين | ايسيكاي', event.threadID);
      return;
    }

    let genre;
    if (messageBody.includes('شونين')) {
      genre = 'shonen';
    } else if (messageBody.includes('سينين')) {
      genre = 'seinen';
    } else if (messageBody.includes('ايسيكاي')) {
      genre = 'isekai';
    } else {
      await api.sendMessage('⚠️ | المرجو تحديد النوع .\n{p}إقتراح_أنمي {النوع}:- شونين | سينين | ايسيكاي', event.threadID);
      return;
    }

    try {
      const loadingMessage = await api.sendMessage(' ⬇️ | جاري تحميل المقطع...', event.threadID);

      const apiUrl = `https://anime-reco.vercel.app/anime?genre=${genre}`;
      const response = await axios.get(apiUrl);

      if (response.data.anime && response.data.videoLink) {
        const animeName = response.data.anime;
        const videoUrl = response.data.videoLink;

        const cacheFilePath = process.cwd() + `/cache/anime_${Date.now()}.mp4`;
        await downloadVideo(videoUrl, cacheFilePath);

        if (fs.existsSync(cacheFilePath)) {
          await api.sendMessage({
            body: ` ✅ | تم تحميل المقطع بنجاح \n 🧿 | أنمي مقترح : ${animeName}`,
            attachment: fs.createReadStream(cacheFilePath),
          }, event.threadID);

          fs.unlinkSync(cacheFilePath);
        } else {
          await api.sendMessage("Error downloading the video.", event.threadID);
        }
      } else {
        await api.sendMessage("API issue. Please try again later.", event.threadID);
      }

      await api.unsendMessage(loadingMessage.messageID);
    } catch (err) {
      console.error(err);
      await api.sendMessage("An error occurred while processing the anime command.", event.threadID);
    }
  }
};

async function downloadVideo(url, cacheFilePath) {
  try {
    const response = await axios({
      method: "GET",
      url: url,
      responseType: "stream"
    });

    const writer = fs.createWriteStream(cacheFilePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (err) {
    console.error(err);
  }
}