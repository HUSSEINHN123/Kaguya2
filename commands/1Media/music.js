import axios from 'axios';
import fs from 'fs-extra';
import ytdl from 'ytdl-core';
import yts from 'yt-search';

export default {
  name: "أغنية",
  author: "حسين يعقوبي",
  cooldowns: 60,
  description: "تنزيل أغنية من YouTube",
  role: "عضو",
  aliases: ["غني"],

  async execute({ api, event }) {
    const input = event.body;
    const text = input.substring(12);
    const data = input.split(" ");

    if (data.length < 2) {
      return api.sendMessage("⚠️ | أرجوك قم بإدخال اسم الأغنية.", event.threadID);
    }

    data.shift();
    const musicName = data.join(" ");

    try {
      api.sendMessage(`✔ | جاري البحث عن الأغنية المطلوبة"${musicName}". المرجو الانتظار...`, event.threadID);

      const searchResults = await yts(musicName);
      if (!searchResults.videos.length) {
        return api.sendMessage("⚠️ | لم يتم العثور على أي نتائج.", event.threadID);
      }

      const music = searchResults.videos[0];
      const musicUrl = music.url;

      const stream = ytdl(musicUrl, { filter: "audioonly" });

      const fileName = `${event.senderID}.mp3`;
      const filePath = `./cache/${fileName}`;

      stream.pipe(fs.createWriteStream(filePath));

      stream.on('response', () => {
        console.info('[DOWNLOADER]', 'بدء التنزيل الآن!');
      });

      stream.on('info', (info) => {
        console.info('[DOWNLOADER]', `تنزيل الأغنية: ${info.videoDetails.title}`);
      });

      stream.on('end', () => {
        console.info('[DOWNLOADER] تم التنزيل');

        if (fs.statSync(filePath).size > 26214400) {
          fs.unlinkSync(filePath);
          return api.sendMessage('❌ | لا يمكن إرسال الملف لأن حجمه أكبر من 25 ميغابايت.', event.threadID);
        }

        const message = {
          body: `✅ | تم التنزيل\n ❀ العنوان: ${music.title}\n المدة: ${music.duration.timestamp}`,
          attachment: fs.createReadStream(filePath)
        };

        api.sendMessage(message, event.threadID, () => {
          fs.unlinkSync(filePath);
        });
      });
    } catch (error) {
      console.error('[ERROR]', error);
      api.sendMessage('🥱 ❀ حدث خطأ أثناء معالجة الأمر.', event.threadID);
    }
  }
};