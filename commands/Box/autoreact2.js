import axios from "axios";
import fs from "fs-extra";
import path from "path";

export default {
  name: "مقطع",
  author: "Kaguya Project",
  description: "بحث عن مقطع فيديو",
  role: "member",
  execute: async ({ event, message, getLang, threadsData, api, args }) => {

api.setMessageReaction("⏱️", event.messageID, (err) => {}, true)
    
    global.api = { samirApi: "https://apis-samir.onrender.com" };

    let query = args.join(" ");
    if (!query) {
      kaguya.reply(" ⚠️ |يرجى تقديم مقولة من المقطع من أجل عرضه.");
      return;
    }

    try {
      // ترجمة البحث إلى الإنجليزية
      const translationResponse = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(query)}`);
      query = translationResponse?.data?.[0]?.[0]?.[0];

      const BASE_URL = `${global.api.samirApi}/clips?text=${encodeURIComponent(query)}`;
      const searchingMessage = await api.sendMessage("🔎 |جاري البحث عن مقطع الفيديو...");

      let res = await axios.get(BASE_URL);
      if (res.status === 200) {
        const apiResponse = res.data;
        if (apiResponse.length > 0) {
          const randomIndex = Math.floor(Math.random() * apiResponse.length);
          const randomClip = apiResponse[randomIndex];
          const vidUrl = randomClip.src;
          const title = randomClip.title;

          const response = await axios.get(vidUrl, { responseType: 'stream' });
          const videoPath = path.join(process.cwd(), 'clip.mp4');
          const videoStream = fs.createWriteStream(videoPath);

          response.data.pipe(videoStream);

          await new Promise((resolve, reject) => {
            videoStream.on('finish', resolve);
            videoStream.on('error', reject);
          });

          api.setMessageReaction("✅", event.messageID, (err) => {}, true)

          await api.sendMessage({
            attachment: fs.createReadStream(videoPath),
            body: `🎬 | العنوان : ${title}`
          }, event.threadID);

          fs.unlinkSync(videoPath);
        } else {
          api.sendMessage("حدث خطأ أثناء البحث عن الفيديو. يرجى المحاولة مرة أخرى.");
        }
      }
    } catch (e) {
      api.sendMessage("حدث خطأ أثناء البحث عن الفيديو. يرجى المحاولة مرة أخرى.");
      console.error("Error during API request:", e);
    } finally {
      api.unsendMessage(searchingMessage.messageID);
    }
  }
};