import axios from 'axios';
import fs from 'fs';
import path from 'path';

export default {
  name: 'كلب',
  author: 'ChatGPT',
  role: 'member',
  description: 'يقوم بإرسال صور لكلاب عشوائي',

  async execute({ api, event }) {
    try {
      // جلب صورة عشوائية لكلب
      const response = await axios.get('https://random.dog/woof.json');
      const imageUrl = response.data.url;
      const imageExt = path.extname(imageUrl);

      // جلب حقيقة عشوائية عن الكلاب
      const factResponse = await axios.get('https://deku-rest-api.replit.app/dogfact');
      const dogFact = factResponse.data.fact;

      // ترجمة الحقيقة إلى اللغة العربية
      const translatedFact = await translateToArabic(dogFact);

      // استخدام process.cwd() لتحديد مجلد temp بدلاً من __dirname
      const tempImagePath = path.join(process.cwd(), 'temp', `dog${imageExt}`);

      // تحميل الصورة من الرابط المحدد
      const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
      const writer = fs.createWriteStream(tempImagePath);
      imageResponse.data.pipe(writer);

      // انتظار اكتمال تحميل الصورة وترجمة الحقيقة قبل إرسال الرسالة
      writer.on('finish', () => {
        // إرسال الصورة والنص المترجم ملتصقين في رسالة واحدة
        api.sendMessage(
          {
            body: `━━━━━━━━━━━━━━━━━━━\n${translatedFact}\n━━━━━━━━━━━━━━━━━━━━`,
            attachment: fs.createReadStream(tempImagePath)
          },
          event.threadID,
          () => fs.unlinkSync(tempImagePath) // حذف الصورة المؤقتة بعد الإرسال
        );
      });
    } catch (error) {
      console.error('Error fetching dog image or fact:', error);
      api.sendMessage('عذرًا، حدث خطأ أثناء جلب صورة الكلب أو الحقيقة.', event.threadID);
    }
  },
};

async function translateToArabic(text) {
  try {
    const translationResponse = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(text)}`);
    return translationResponse?.data?.[0]?.[0]?.[0] || 'Unable to translate';
  } catch (error) {
    console.error('Error translating text:', error);
    return 'Unable to translate';
  }
}