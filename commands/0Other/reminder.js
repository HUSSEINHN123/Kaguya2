export default {
  name: "ذكريني",
  author: "kaguya project",
  role: "member",
  description: "يستخدم لإرسال تذكير بعد فترة زمنية محددة.",
  execute: async ({ api, event, args }) => {
    const time = args[0];
    const text = args.slice(1).join(" ");
    if (isNaN(time)) return api.sendMessage(`كيفية الاستخدام؟\n${global.client.config.prefix}ذكريني [الوقت] [النص]\n\nمثال:\n${global.client.config.prefix}ذكريني 60 هذا البوت صنع بواسطة حسين\n\nملاحظة:\n59 يعادل الثانية\n60 يعادل الدقيقة، لذا يرجى استخدام أرقام كبيرة لإعداد تذكير دقيق بالدقائق\n\nمثال للدقائق:\n${global.client.config.prefix} ذكريني 99999 [النص]\n99999 يعادل 16 دقيقة`, event.threadID, event.messageID);
    const display = time > 59 ? `${time / 60} دقيقة` : `${time} ثانية`;
    api.sendMessage(`سأذكرك لاحقًا بعد ${display}`, event.threadID, event.messageID);
    await new Promise(resolve => setTimeout(resolve, time * 1000));
    const user = await api.getUserInfo(event.senderID);
    const name = user ? user[event.senderID].name : "";
    return api.sendMessage({
      body: `${(text) ? name + ",\nتلقيت طلبًا بتذكيرك بالقيام بشيء ما ، صحيح ؟: " + text : name + ", "}`,
      mentions: [{
        tag: name,
        id: event.senderID
      }]
    }, event.threadID, event.messageID);
  },
};