import axios from "axios";
import fs from "fs-extra";
import path from "path";
import moment from "moment-timezone";

export default {
  name: "ذكاء",
  author: "Joshua Apostol",
  role: "member",
  description: "نموذج للدردشة مع GPT-4 وإرفاق صورة ذات صلة",
  execute: async ({ api, event, args }) => {
    const question = args.join(' ');

    if (!question) return api.sendMessage("الرجاء تقديم السؤال أولاً.", event.threadID, event.messageID);

    try {
        api.sendMessage("🔎 |  يرجى الانتظار بينما أفكر في طلبك...", event.threadID, event.messageID);

        const userInput = encodeURIComponent(question);
        const uid = event.senderID;
        const apiUrl = `https://deku-rest-api.replit.app/gpt4?prompt=${userInput}&uid=${uid}`;

        const response = await axios.get(apiUrl);
        const answer = response.data.gpt4;

        // جلب الصورة من Pinterest
        const imageUrl = await getImage(question);

        // إنشاء ملف مؤقت للصورة
        const imageBuffer = await axios.get(imageUrl, {responseType: 'arraybuffer'});
        const imagePath = path.join(process.cwd(), 'cache', 'image.jpg');
        await fs.writeFile(imagePath, imageBuffer.data);

        const timeString = moment.tz('Africa/Casablanca').locale('ar').format('LLLL');
        const timeOnly = moment.tz('Africa/Casablanca').locale('en').format('LT');

        const message = `✅ | تم التنفيذ\n━━━━━━━━━━━━━━━━━━━\n📝 | إجابة البوت: ${answer}\n━━━━━━━━━━━━━━━━━━━\n📅 | التاريخ: ${timeString}\n━━━━━━━━━━━━━━━━━━━\n🕰️ | الوقت: ${timeOnly}\n━━━━━━━━━━━━━━━━━━━`;

        api.sendMessage({
            body: message,
            attachment: fs.createReadStream(imagePath)
        }, event.threadID, (error, info) => {
            if (error) {
                console.error(error);
                api.sendMessage("حدث خطأ أثناء إرسال الرسالة.", event.threadID);
            }
        });
    } catch (error) {
        console.error(error);
        api.sendMessage("حدث خطأ أثناء معالجة طلبك.", event.threadID);
    }
  }
};

async function getImage(searchText) {
  try {
    const apiUrl = `https://markdevsapi-2014427ac33a.herokuapp.com/pinterest?search=${encodeURIComponent(searchText)}`;
    const response = await axios.get(apiUrl);
    return response.data.data[0]; // نفترض هنا أن API يعيد قائمة من الصور، ونحن نأخذ الأولى
  } catch (error) {
    console.error('حدث خطأ أثناء جلب الصورة من بينتيرست:', error);
    return null;
  }
}