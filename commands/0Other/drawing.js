import axios from "axios";
import fs from "fs-extra";
import path from "path";
import moment from "moment-timezone";

const KievRPSSecAuth = process.env.KievRPSSecAuth || "FABSBBRaTOJILtFsMkpLVWSG6AN6C/svRwNmAAAEgAAACDZVIGtfXpGmEASE6kUb1TabaAxlytZ/tC0vAQr9jh5I8Yrib5gxCnkOF5a4+ix/mF108N0pDNf3ZDEoUe9xhjDhmipGkPKD+bPIgQO/LSefDult8hBYJ2Zrx8ahsEJMCJUfnGfYkm6y/utpqwr0oBxP7Xl7VNkxrkbxfFPRKqvidgdKoBP/dYcDtTAVLWxVZjARWhwxro4KDMkLfD/baxZpFXFsbBZuFLzB6z0Nl2teLHjzMOFnaE4q2a8fcd3SghDb/TMc9S7+kSnTfmBvI5IR/OXhrbGzZxP1tXMJlb+ntJyAe/A+7cfGDyBdbTkBs6ENouD5ECDVrK5llxbdTM60XKAL9XMoqVSg+slQkScbrzG8rbsPwJyUU4AyMrsoYqWqW9Z5MShQIG5DCt/10PHnvTS57UBn/syaE0xj0CacsGGimSZma5mB5Bhbp/vloFLDhLBvyXsRXKtwOXh/tsRxMD1fGnnKhKAIZVFp5ssk8Mkh0gdZaO2uEl/Rk4Ze01462gk7FSCPCryafap7Zh5CMBXBF+2ElBIidyYcJ+DI0OQs/Wa7AC8RWggqnaHWt3fpwM2CW/rmHmk1ljLktlvg0L8qnA1WzMPgsZnBThLng2ghvQHOwodw0xs7M4rIfDtlWBrNmrUjHf5uaQlJ68wmnkHk2wKhSkt+sCHNKvusM7jwPUJrCkeJJFMzoR75cvMHmPWuwiTu1+SlfSZWfq1EOoofCNFR9PSjs45URlenpQQk4w6vdw+OBPDnHLwwq11/tc7bNtajlA1kmUFeqoFuB9cqDIfcN4pxwaaOnM63V2OOs0yvQ6ihxolwAb3Q71M5JJqsFvvgUHWkoJoJGajn9UkfmVoL4F0s4AE0uIPfBiM9J2Q9rukMrN7B6NLsQEVuBYKEVz4SmxwRK3pREbsdj76SbFpxy/jBBoa6u8gpm9PqJXRAngtw2nTJXH21ouu6NEFAGXUJtoGLlVInDgswsI69caXHYhY8rnasM3xo97Gl1mXuJDcSGHy9w2Hkfb1H6AThPLANJSckRkTCHPY1sWN+PdHacOlsn4m5kwoWFtbLNDbgOJWMxeUBGVAQs3KHZoxHhY8njQwHevrL8wmO69WJ1tWcCsXx36BnD+y4K52H5FjWqlfG0/9UWQDDCYgK9Kj8fL/M3SGFn3i52YXcA7DZoWGYmRAquyWfwGUH43U7Zov9a/neMMMLsI9spBq7vT06wmh5w/iB3E1CtT4hwYRau33wYqiRhG+WxFGALk4oLx0YDhG15FG9gJt0U7lBLVegHunZUj3HPCkQyiifskCUMNnFSTKAgnHC3xTr3PQprMibFiejzyAvFP6jgf0ViVUHVVdIhhVIbEQ8wWjkqFdKQLaHpjXy4yteXdfnLYufZLIqpm+LfhQAM/+G0tpUD9eDL1TBHJx+Hjq5ZbI=";
const _U = process.env._U || "1hmZ7G0WD8Fowcm9dFVAnvA1ON0NzHG2aiR12vx3hQiN3hRji_R8V8wpV_JTJrVRsKO3lrnKKizXnVr85MnBJoPUWJHFtBz9LAPeqTwlCKoV4Vgbgo_lWMMJpaGsg69DMf9J_0MEp7jEI-E9IccoUxnlbBgqHn5CpY5F63qEE0aK_o4QJkeyq90qmBOwVUX7CsA9LdvLmsW18bdHZ85TmSA";

export default {
  name: "تخيلي",
  author: "kaguya project",
  cooldowns: 50,
  description: "فم بتوليد ثور بإستخدام الذكاء الإصطناعي dalle",
  role: "member",
  aliases: ["dalle", "دايل"],
  execute: async ({ api, event, args }) => {

    api.setMessageReaction("⚙️", event.messageID, (err) => {}, true);
    
    const prompt = args.join(" ");
    const senderID = event.senderID;

    try {
      const translationResponse = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(prompt)}`);
      const translatedText = translationResponse?.data?.[0]?.[0]?.[0];

      const res = await axios.get(`https://apis-dalle-gen.onrender.com/dalle3?auth_cookie_U=${encodeURIComponent(_U)}&auth_cookie_KievRPSSecAuth=${encodeURIComponent(KievRPSSecAuth)}&prompt=${encodeURIComponent(translatedText)}`);
      const data = res.data.results.images;

      if (!data || data.length === 0) {
        api.sendMessage("⚠️ | إنتهت كل الكوكيزة الخاصة بتوليد الصور يرجى إنتظار المطور ريثما يقوم بشحن الأمر بكوكيز جديدة من أجل إستعمال هذا الأمر مجددا", event.threadID, event.messageID);
        return;
      }

      const imgData = [];
      for (let i = 0; i < Math.min(4, data.length); i++) {
        const imgResponse = await axios.get(data[i].url, { responseType: 'arraybuffer' });
        const imgPath = path.join(process.cwd(), 'cache', `${i + 1}.jpg`);
        await fs.outputFile(imgPath, imgResponse.data);
        imgData.push(fs.createReadStream(imgPath));
      }

      // استخدام moment-timezone لجلب الوقت والتاريخ
      const now = moment().tz("Africa/Casablanca");
      const timeString = now.format("HH:mm:ss");
      const dateString = now.format("YYYY-MM-DD");
      const executionTime = ((Date.now() - event.timestamp) / 1000).toFixed(2);

      api.getUserInfo(senderID, async (err, userInfo) => {
        if (err) {
          console.log(err);
          return;
        }
        const userName = userInfo[senderID].name;


        await api.sendMessage({
          attachment: imgData,
          body: `✿━━━━━━━━━━━━━━━━━✿\n✅ | تفضل نتيجة الوصف الخاصة بك \nتم التنفيذ من طرف: ${userName}\n⏰ | ❏ الوقت: ${timeString}\n📅 | ❏ التاريخ: ${dateString}\n⏳ | ❏ وقت التنفيذ: ${executionTime} ثانية\n📝 | ❏الوصف: ${prompt}\n✿━━━━━━━━━━━━━━━━━✿`
        }, event.threadID, event.messageID);
      }); 

      api.setMessageReaction("✓", event.messageID, (err) => {}, true);

    } catch (error) {
      api.sendMessage("⚠️ | إنتهت كل الكوكيزة الخاصة بتوليد الصور يرجى إنتظار المطور ريثما يقوم بشحن الأمر بكوكيز جديدة من أجل إستعمال هذا الأمر مجددا", event.threadID, event.messageID);
    }
  }
};