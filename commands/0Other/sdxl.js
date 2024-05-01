import axios from 'axios';
import fs from 'fs';
import path from 'path';

export default {
  name: "مثير",
  author: "ChatGPT",
  role: "member",
  description: "صةر مثيرة للفتيات في الأنمي.",
  async execute({ api, event }) {
    api.setMessageReaction("😏", event.messageID, (err) => {}, true);

    try {
      const response = await axios.get('https://ahegao.netlify.app/random');
      const ext = response.headers['content-type'].split('/')[1];
      // استخدام process.cwd() بدلاً من __dirname
      const tempFilePath = path.join(process.cwd(), 'cache', `hintai.${ext}`);

      const writer = fs.createWriteStream(tempFilePath);
      axios({
        method: 'get',
        url: response.request.res.responseUrl,
        responseType: 'stream',
      }).then(response => {
        response.data.pipe(writer);
        writer.on('finish', () => {
          api.sendMessage(
            {
              attachment: fs.createReadStream(tempFilePath)
            },
            event.threadID,
            () => fs.unlinkSync(tempFilePath),
            event.messageID
          );
        });
      });
    } catch (error) {
      console.error("Error fetching Siesta image:", error.message);
      api.sendMessage("حدث خطأ أثناء جلب الصورة. يرجى المحاولة مرة أخرى.", event.threadID);
    }
  }
};