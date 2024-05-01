// استيراد الوحدات النمطية اللازمة
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export default {
  name: 'المطور', // اسم الأمر
  author: 'حسين يعقوبي', // مؤلف الأمر
  role: 'member', // الدور المطلوب لاستخدام الأمر
  description: 'يعرض معلومات عن مالك الأمر.', // وصف الأمر
  async execute({ api, event }) {
    try {
      // معلومات المالك
      const ownerInfo = {
        name: 'حسين يعقوبي',
        gender: 'ذكر',
        age: '18',
        height: '180',
        facebookLink: 'https://www.facebook.com/profile.php?id=100093589771272',
        nick: 'صاིئدّ اིلཻأرٰوٰ໑ٰاིح᪽',
      };

      const videoLink = 'https://i.imgur.com/ss0wqqy.mp4'; // الرابط الخاص بالفيديو

      // مسار مجلد مؤقت لتخزين الفيديو باستخدام process.cwd()
      const tmpFolderPath = path.join(process.cwd(), 'tmp');

      // إنشاء المجلد إذا لم يكن موجودًا
      if (!fs.existsSync(tmpFolderPath)) {
        fs.mkdirSync(tmpFolderPath);
      }

      // جلب الفيديو وحفظه
      const videoResponse = await axios.get(videoLink, { responseType: 'arraybuffer' });
      const videoPath = path.join(tmpFolderPath, 'owner_video.mp4');
      fs.writeFileSync(videoPath, Buffer.from(videoResponse.data, 'binary'));

      api.setMessageReaction('🚀', event.messageID, (err) => {}, true);

      // تنسيق رسالة المعلومات
      const message = `࿇ ══━━━━✥◈✥━━━━══ ࿇
      •——[معلومات حول المالك]——•
      ❏ الاسم: 『${ownerInfo.name}』
      ❏ الجنس: 『${ownerInfo.gender}』
      ❏ العمر: 『${ownerInfo.age}』
      ❏ الطول: 『${ownerInfo.height}』 سم
      ❏ رابط الفيسبوك: 『${ownerInfo.facebookLink}』
      ❏ اللقب:『${ownerInfo.nick}』\n ࿇ ══━━━━✥◈✥━━━━══ ࿇`;

      // إرسال الرسالة والفيديو كمرفق
      await api.sendMessage({
        body: message,
        attachment: fs.createReadStream(videoPath)
      }, event.threadID, event.messageID);

      // رد فعل على الرسالة إذا كانت تحتوي على "ownerinfo"
      if (event.body.toLowerCase().includes('المطور')) {
        api.setMessageReaction('🚀', event.messageID, (err) => {}, true);
      }
    } catch (error) {
      console.error('حدث خطأ في أمر ownerinfo:', error);
      api.sendMessage('حدث خطأ أثناء معالجة الأمر.', event.threadID);
    }
  },
};