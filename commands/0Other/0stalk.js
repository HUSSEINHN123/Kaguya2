import jimp from 'jimp';
import fs from 'fs';

async function getProfilePicture(userID) {
    const url = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const img = await jimp.read(url);
    const profilePath = `profile_${userID}.png`;
    await img.writeAsync(profilePath);
    return profilePath;
}

export default {
  name: "ايدي",
  author: "Kaguya Project",
  role: "member",
  description: "جلب معلومات العضو.",
  execute: async function({ api, event, args, Economy }) {
    try {
      const uid = event?.messageReply?.senderID || (Object.keys(event.mentions).length > 0 ? Object.keys(event.mentions)[0] : event.senderID);
      const userInfo = await api.getUserInfo(parseInt(uid));
      if (!userInfo[uid]) {
        api.sendMessage(`⚠️ | قم بعمل منشن للشخص ما.`, event.threadID, event.messageID);
        return;
      }
      const { firstName, name, gender, profileUrl } = userInfo[uid];
      const userIsFriend = userInfo[uid].isFriend ? "✅ نعم" : "❌ لا";
      const isBirthdayToday = userInfo[uid].isBirthdayToday ? "✅ نعم" : "❌ لا";
      const profilePath = await getProfilePicture(uid);

      // استخدام Economy.getBalance لجلب الرصيد
      const balanceResult = await Economy.getBalance(uid); // تأكد من أن Economy مُعرّفة ومستوردة بشكل صحيح
      const money = balanceResult.data; // افتراض أن البيانات تُرجع بصيغة { data: amount }

      // جلب تاريخ المحادثة
      const threadHistory = await api.getThreadHistory(event.threadID);
      const userMessageCount = threadHistory.filter(message => message.senderID === uid).length;

      const message = `
•——[معلومات]——•\n\n✨ مــﻋــڷــﯡمــاٺ ؏ــن : 『${firstName}』\n❏اسمك👤: 『${name}』\n❏جنسك♋: 『${gender === 1 ? "أنثى" : "ذكر"}』\n❏💰 رصيدك : ${money} دولار\n❏📩 عدد الرسائل : ${userMessageCount}\n❏صديق؟: 『${userIsFriend}』\n❏عيد ميلاد اليوم؟: 『${isBirthdayToday}』\n❏🌟 المعرف  : 『${uid}』\n❏رابط البروفايل🔮: ${profileUrl}`;

      api.sendMessage({
        body: message,
        attachment: fs.createReadStream(profilePath)
      }, event.threadID, event.messageID);

    } catch (err) {
      console.error('Error:', err);
      api.sendMessage('❌ | حدث خطأ أثناء المطاردة. الرجاء معاودة المحاولة في وقت لاحق.', event.threadID, event.messageID);
    }
  }
};