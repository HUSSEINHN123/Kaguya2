import axios from "axios";
import fs from "fs";
import path from "path";

const animeImageLinks = [
  "https://i.imgur.com/mNesqCm.jpg",
  "https://i.imgur.com/ChtMmje.jpg",
  "https://i.imgur.com/2oTwWjZ.png",
  "https://i.imgur.com/ZOcTTvR.jpg",
  "https://i.imgur.com/ccLl6Ym.png",
  "https://i.imgur.com/bdQ5fK9.png",
  "https://i.imgur.com/zyqGxHc.png",
  "https://i.imgur.com/1dFL3ZI.png",
  "https://i.imgur.com/SKsfMCE.jpg",
  "https://i.imgur.com/vhinUxm.png",
  "https://i.imgur.com/5QXTkQr.jpg",
  "https://i.imgur.com/cMeEbZe.jpg",
  "https://i.imgur.com/HRDcYSW.jpg",
  "https://i.imgur.com/sp1SnE4.jpg",
  "https://i.imgur.com/Ki3hy27.jpg",
  "https://i.imgur.com/8bxgU0f.jpg",
  "https://i.imgur.com/7iDnRg6.jpg",
  "https://i.imgur.com/shKYOem.png",
  "https://i.imgur.com/MGNxYj4.jpg",
  "https://i.imgur.com/1DTrdAl.jpg",
  "https://i.imgur.com/xAKKpfT.png",
  "https://i.imgur.com/ChtMmje.jpg",
  "https://i.imgur.com/ujo6Yvu.jpg",
  "https://i.imgur.com/dVcSVDs.jpg",
  "https://i.imgur.com/rpdXJEa.jpg",
  "https://i.imgur.com/sToM2cj.png",
  "https://i.imgur.com/wzUFRb9.png",
  "https://i.imgur.com/n378ZMT.png",
  "https://i.imgur.com/A8dKVOY.jpg",
  "https://i.imgur.com/6a7lQUa.jpg",
  "https://i.imgur.com/Oc1XLXW.jpg",
  "https://i.imgur.com/MpQ7qN3.png",
  "https://i.imgur.com/GK2iXnb.jpg",
  "https://i.imgur.com/cwHOc0j.jpg",
  "https://i.imgur.com/NHRGsp6.jpg",
  "https://i.imgur.com/Ia9ugv3.jpg",
  "https://i.imgur.com/CqszBU7.jpg",
  "https://i.imgur.com/JHm5muL.jpg",
  "https://i.imgur.com/509DTo9.png",
  "https://i.imgur.com/JjvzvuI.jpg",
  "https://i.imgur.com/hMljgoy.jpg",
  "https://i.imgur.com/lOn0Vru.jpg",
  "https://i.imgur.com/eDFtiW3.jpg",
  "https://i.imgur.com/JYKT9Uv.jpg",
  "https://i.imgur.com/pG0YTtt.jpg",
  "https://i.imgur.com/tZP3MMz.png",
  "https://i.imgur.com/RM9ukif.jpg",
  "https://i.imgur.com/gMRKKyj.png",
  "https://i.imgur.com/m4WWhGW.png",
  "https://i.imgur.com/3XcAUud.jpg",
  "https://i.imgur.com/ycnn0HV.png",
  "https://i.imgur.com/8VjmAbA.jpg",
  "https://i.imgur.com/vXgbs3j.jpg",
  "https://i.imgur.com/OQ3d05j.jpg",
  "https://i.imgur.com/bXGDK0Y.jpg",
  "https://i.imgur.com/UcvGgH7.jpg",
  "https://i.imgur.com/Ei4JcHB.jpg",
  "https://i.imgur.com/jHcd7na.jpg",
  "https://i.imgur.com/FaN7cnv.png",
  "https://i.imgur.com/hH0of56.png",
  "https://i.imgur.com/pmUdyLW.jpg",
  "https://i.imgur.com/gpsqjlX.jpg",
  "https://i.imgur.com/ohpsz0U.jpg",
  "https://i.imgur.com/Ar8ioUD.png",
  "https://i.imgur.com/WsVWcq2.jpg",
  "https://i.imgur.com/XzQTER5.jpg",
  "https://i.imgur.com/0t1yKln.jpg",
  "https://i.imgur.com/iXAHEqa.jpg",
  "https://i.imgur.com/7yAtWmQ.png",
  "https://i.imgur.com/71f21Ix.png",
  "https://i.imgur.com/x0bcEFl.png",
  "https://i.imgur.com/lH7lYVc.png",
  "https://i.imgur.com/ba8LkRB.png",
  "https://i.imgur.com/FsP5lSm.jpg",
  "https://i.imgur.com/X25um8b.jpg",
  "https://i.imgur.com/rSBexdO.png",
  "https://i.imgur.com/tTTXPgb.png",
  "https://i.imgur.com/MaBiBiD.png",
  "https://i.imgur.com/cZwQjP7.jpg",
  "https://i.imgur.com/iCFsBHc.jpg",
  "https://i.imgur.com/dTZGPiM.jpg",
  "https://i.imgur.com/bQ5xRTG.png",
  "https://i.imgur.com/aFXDHWL.jpg",
  "https://i.imgur.com/tdU2fbU.png",
  "https://i.imgur.com/faRtrw6.png",
  "https://i.imgur.com/id08VTo.png",
  "https://i.imgur.com/heLM5yF.png",
  "https://i.imgur.com/qwRAAlu.png",
  "https://i.imgur.com/7lR2uR3.png",
  "https://i.imgur.com/vL15U0T.jpg",
  "https://i.imgur.com/jhuTb7V.png",        
];

export default {
  name: "هينتاي",
  author: "Kaguya Project",
  role: "member",
  description: "يقوم بعرض صور هينتاي منحرفة عشوائية مقابل 1000 دولار",
  async execute({ api, event, Economy }) {
    try {
      // التحقق مما إذا كان لديه الرصيد الكافي
      const userMoney = (await Economy.getBalance(event.senderID)).data;
      const cost = 1000;
      if (userMoney < cost) {
        return api.sendMessage(`تحتاح إلى  ${cost} دولار من أجل أن ترى الصور 😏` , event.threadID);
      }

      // الخصم من الرصيد
      await Economy.decrease(cost, event.senderID);

      // اختيار صورة عشوائية
      const randomIndex = Math.floor(Math.random() * animeImageLinks.length);
      const imageUrl = animeImageLinks[randomIndex];

      // جلب الصورة
      const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });

      // حفظ الصورة مؤقتًا
      const tempImagePath = path.join(process.cwd(), `./temp/anime_image_${randomIndex + 1}.jpg`);
      fs.writeFileSync(tempImagePath, Buffer.from(imageResponse.data));

      // إرسال الصورة
      api.setMessageReaction("🔞", event.messageID, () => {}, true);
      const message = {
        body: `✿━━━━━━━━━━━━━━━━━✿\nصور هينتاي 🔞 \n عدد الصور: ${animeImageLinks.length}\nتم الخصم منك 100 دولار\n✿━━━━━━━━━━━━━━━━━✿`,
        attachment: fs.createReadStream(tempImagePath),
      };
      api.sendMessage(message, event.threadID, () => {
        fs.unlinkSync(tempImagePath); // حذف الملف المؤقت للصورة بعد إرسال الرسالة
      });
    } catch (error) {
      console.error("حدث خطأ: ", error);
      api.sendMessage("❌ | حدث خطأ أثناء جلب صورة أنمي.", event.threadID);
    }
  },
};