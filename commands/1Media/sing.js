import axios from 'axios';
import fs from 'fs-extra';
import moment from 'moment-timezone';

export default {
  name: "بانتريست",
  author: "kaguya project",
  cooldowns: 30,
  description: "البحث عن الصور في بينتيرست باستخدام الكلمة الرئيسية المحددة وعرض عدد معين من النتائج.",
  role: "member",
  aliases: ["بنتريست", "بحث_صور"],
  execute: async ({ api, event, args }) => {
    try {
      const keySearch = args.join(" ");
      if (!keySearch.includes("-")) {
        return api.sendMessage('الرجاء إدخال النص بالشكل الصحيح، مثال: بينتيرست Naruto - 10 (تعتمد على عدد الصور التي تريد ظهورها في النتيجة)', event.threadID, event.messageID);
      }

      const keySearchs = keySearch.substr(0, keySearch.indexOf('-'));
      const numberSearch = keySearch.split("-").pop() || 6;

      // ترجمة الاستعلام من العربية إلى الإنجليزية
      const translatedQuery = await translateToEnglish(keySearchs);

      const res = await axios.get(`https://hazee-social-downloader-9080f854bdab.herokuapp.com/pinterest?search=${encodeURIComponent(translatedQuery)}`);
      const data = res.data.data;

      var num = 0;
      var imgData = [];

      for (var i = 0; i < parseInt(numberSearch); i++) {
        let path = process.cwd() + `/cache/${num+=1}.jpg`;
        let getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
        imgData.push(fs.createReadStream(process.cwd() + `/cache/${num}.jpg`));
      }

      const timestamp = moment.tz("Africa/Casablanca");
      const dateString = timestamp.format("YYYY-MM-DD");
      const timeString = timestamp.format("HH:mm:ss");

      api.sendMessage({
        attachment: imgData,
        body: `✿━━━━━━━━━━━━━━━━━✿\n✅ | تم التحميل بنجاح \nعدد الصور 💹 : ${numberSearch} \nالمراد البحث عنه  : ${keySearchs}\n📆 | التاريخ : ${dateString}\n⏰ | الوقت : ${timeString}\n✿━━━━━━━━━━━━━━━━━✿`
      }, event.threadID, event.messageID);

      for (let ii = 1; ii < parseInt(numberSearch); ii++) {
        fs.unlinkSync(process.cwd() + `/cache/${ii}.jpg`);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage("حدث خطأ أثناء معالجة طلبك. الرجاء المحاولة مرة أخرى في وقت لاحق.", event.threadID, event.messageID);
    }
  }
};

async function translateToEnglish(query) {
  try {
    const translationResponse = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(query)}`);
    const translatedQuery = translationResponse?.data?.[0]?.[0]?.[0];
    return translatedQuery || query; // استخدام النص الأصلي إذا لم يتم العثور على ترجمة
  } catch (error) {
    console.error('حدث خطأ أثناء ترجمة النص:', error);
    return query; // استخدام النص الأصلي في حالة حدوث خطأ
  }
}