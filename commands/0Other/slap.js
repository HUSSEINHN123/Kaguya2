export default {
  name: "كنية",
  author: "kaguya project",
  role: 0,
  description: "يقوم هذا الأمر بتغيير اسم المستخدم المحدد في المحادثة إلى الاسم المعطى.",

  execute: async function ({ api, event, args }) {
    const name = args.join(" ");
    const mention = Object.keys(event.mentions)[0];

    if (!name) {
      api.sendMessage("⚠️ | يرجى إدخال اسم صالح.", event.threadID);
      return;
    }

    if (!mention) {
      api.changeNickname(name, event.threadID, event.senderID);
    } else {
      const mentionedUserID = event.mentions[mention];
      const mentionedUserName = event?.mentions[mention]?.split("/")[1] || "Unknown";
      api.changeNickname(name.replace(mentionedUserID, ""), event.threadID, mentionedUserID);
      api.sendMessage(` ✅ |تم تغيير كنية العضو ${mentionedUserName} إلى ${name}`, event.threadID);
    }
  },
};