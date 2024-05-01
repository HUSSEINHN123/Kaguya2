export default {
  name: "رابط",
  author: "حسين يعقوبي",
  role: "member",
  description: "إرسال رابط إنطلاقا من المرفق",
  execute: async ({ api, event, getText }) => {
    const { messageReply } = event;

    // التحقق من أن الرسالة هي رسالة مُعاد توجيهها وأن لديها مرفق واحد على الأقل
    if (event.type !== "message_reply" || !messageReply.attachments || messageReply.attachments.length !== 1) {
      return api.sendMessage(getText("invalidFormat"), event.threadID, event.messageID);
    }

    // إرسال رابط المرفق في الرسالة المُعاد توجيهها
    return api.sendMessage(messageReply.attachments[0].url, event.threadID, event.messageID);
  },
};