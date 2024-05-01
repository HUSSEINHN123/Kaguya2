import axios from 'axios';
import fs from 'fs-extra';
import moment from 'moment-timezone';

export default {
    name: "صور",
    author: "kaguya project",
    cooldowns: 30,
    description: "البحث عن الصور في بينتيرست باستخدام الكلمة الرئيسية المحددة وعرض عدد محدد من النتائج.",
    role: "member",
    aliases: ["بنتريست", "بحث_صور"],
    execute: async ({ api, event, args }) => {

api.setMessageReaction("⚙️", event.messageID, (err) => {}, true);
      
        try {
            const keySearch = args.join(" ");
            if (!keySearch) {
                return api.sendMessage(' ⚠️ | قم بإدخال إستفسار', event.threadID, event.messageID);
            }

            // ترجمة الاستعلام من العربية إلى الإنجليزية
            const translatedQuery = await translateToEnglish(keySearch);

            const res = await axios.get(`https://gpt4withcustommodel.onrender.com/api/pin?title=${encodeURIComponent(translatedQuery)}`);
            const data = res.data.data;

            var num = 0;
            var imgData = [];

            // عرض عدد محدد من الصور (عدد افتراضي: 10)
            const numberSearch = 9;
            for (var i = 0; i < numberSearch && i < data.length; i++) {
                let path = process.cwd() + `/cache/${num += 1}.jpg`;
                let getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
                fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
                imgData.push(fs.createReadStream(process.cwd() + `/cache/${num}.jpg`));
            }

            const timestamp = moment.tz("Africa/Casablanca");
            const dateString = timestamp.format("YYYY-MM-DD");
            const timeString = timestamp.format("HH:mm:ss");

          api.setMessageReaction("✅", event.messageID, (err) => {}, true);

            api.sendMessage({
                attachment: imgData,
                body: `✿━━━━━━━━━━━━━━━━━✿\n✅ | تم التحميل بنجاح \nعدد الصور 💹 : ${numberSearch} \nالمراد البحث عنه  : ${keySearch}\n📆 | التاريخ : ${dateString}\n⏰ | الوقت : ${timeString}\n✿━━━━━━━━━━━━━━━━━✿`
            }, event.threadID, event.messageID);

            for (let ii = 1; ii < numberSearch; ii++) {
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