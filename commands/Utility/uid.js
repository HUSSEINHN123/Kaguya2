import axios from "axios";
import fs from "fs-extra";
import request from "request";

export default {
  name: "آيدي",
  author: "ChatGPT",
  role: "member",
  description: "الحصول على معلومات فيسبوك للمستخدمين",
  execute: async ({ event, api, args }) => {
    api.setMessageReaction("🔍", event.messageID, (err) => {}, true);

    try {
      const uid = event?.messageReply?.senderID || (Object.keys(event.mentions).length > 0 ? Object.keys(event.mentions)[0] : event.senderID);

      const profilePictureUrl = `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const imagePath = `${process.cwd()}/cache/1.png`;

      // Fetch user information
      const { [uid]: info } = await api.getUserInfo(uid);

      const genderString = info.gender === 1 ? "👧 أنثى" : "👦 ذكر";

      const callback = () => {
        api.sendMessage(
          {
            body: `=== [ آيدي المستخدم ] ===\n━━━━━━━━━━━━━━━━━━\n[ ▶️]➜ الآيدي: ${uid}\n[ ▶️]➜ رابط الدردشة: m.me/${uid}\n[ ▶️]➜ رابط فيسبوك: https://www.facebook.com/profile.php?id=${uid}\n[ ▶️]➜ الاسم: ${info.name}${info.vanity ? `\n[ ▶️]➜ الاسم المخصص: ${info.vanity}` : ""}${info.alternateName ? `\n[ ▶️]➜ اسم بديل: ${info.alternateName}` : ""}\n[ ▶️]➜ الجنس: ${genderString}\n━━━━━━━━━━━━━━━━━━`,
            attachment: fs.createReadStream(imagePath)
          },
          event.threadID,
          () => fs.unlinkSync(imagePath)
        );
      };

      api.sendMessage("",event.threadID); // إرسال رسالة فارغة لعرض الردود بشكل منفصل
      request(encodeURI(profilePictureUrl)).pipe(fs.createWriteStream(imagePath)).on('close', callback);
    } catch (error) {
      console.error("حدث خطأ:", error);
    }
  }
};