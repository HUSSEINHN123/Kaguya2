class Kick {
  name = "اطرديني";
  author = "Anonymous";
  description = "يمكن لأي شخص طرد نفسه من المجموعة";
  role = "member"; // يمكن لأي عضو استخدام هذا الأمر
  cooldowns = 60;

  async execute({ api, event }) {
    try {
      const targetUserID = event.senderID;

      // طرد العضو الذي يستخدم الأمر
      await api.removeUserFromGroup(targetUserID, event.threadID);
      api.sendMessage("طلباتك اوامر ! ابلع", event.threadID);
    } catch (err) {
      console.error(err);
      api.sendMessage("⚠️ | حدث خطأ غير متوقع!", event.threadID);
    }
  }
}

export default new Kick();