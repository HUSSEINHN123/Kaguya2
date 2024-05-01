import axios from 'axios';
import path from 'path';
import fs from 'fs';

export default {
  config: {
    name: 'اعلام',
    version: '1.0',
    author: 'Your Name',
    role: 0,
    description: "لعبة خمن صورة العلم يعود لأي دولة ؟",

    execute: async function ({ api, event, Threads }) {
      const tempImageFilePath = path.join(process.cwd(), 'cache', 'tempImage.jpg');

      const questions = [
        { image: 'https://i.pinimg.com/originals/6f/a0/39/6fa0398e640e5545d94106c2c42d2ff8.jpg', answer: 'العراق', emoji: '🇮🇶' },
        { image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/256px-Flag_of_Brazil.svg.png', answer: 'البرازيل', emoji: '🇧🇷' },
        // يمكنك إضافة المزيد من الأسئلة هنا...
      ];

      // اختيار سؤال عشوائي
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      const correctAnswer = randomQuestion.answer;

      try {
        // جلب الصورة من الرابط المحدد في السؤال
        const imageResponse = await axios.get(randomQuestion.image, { responseType: 'arraybuffer' });
        fs.writeFileSync(tempImageFilePath, Buffer.from(imageResponse.data, 'binary'));

        // إرسال الصورة مع السؤال إلى المحادثة
        const attachment = [fs.createReadStream(tempImageFilePath)];
        const message = `ما اسم علم هذه الدولة؟\nاختر الإجابة الصحيحة بالضغط على الإيموجي المناسب: ${randomQuestion.emoji}`;

        api.sendMessage({ body: message, attachment }, event.threadID, async (error, info) => {
          if (!error) {
            // حفظ بيانات الرد للاستخدام في معالجة الإجابة الصحيحة
            await Threads.setData(event.threadID, 'handleReply.messageID', info.messageID);
          }
        });
      } catch (error) {
        console.error('Error sending question:', error);
        api.sendMessage('⚠️ | حدث خطأ أثناء إرسال السؤال. يرجى المحاولة مرة أخرى.', event.threadID);
      }
    },

    events: async function ({ api, event, Threads, Economy }) {
      var reaction = ["♥️"];
      if (event.reaction && event.senderID == api.getCurrentUserID() && reaction.includes(event.reaction)) {
        api.unsendMessage(event.messageID);
      }
    },
  },
};