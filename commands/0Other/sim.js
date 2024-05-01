import axios from "axios";

export default {
  name: "سيم",
  author: "kaguya project",
  role: "member",
  description: "نموذج لمحاكاة الردود على الرسائل",
  execute: async ({ api, event, args }) => {
    const { threadID, messageID } = event;

    try {
      if (!args[0]) {
        return api.sendMessage("⚠️ |الرجاء كتابة رسالة...", threadID, messageID);
      }

      const content = encodeURIComponent(args.join(" "));
      const response = await axios.get(`https://sim-api-ctqz.onrender.com/sim?query=${content}`);

      if (response.data.error) {
        return api.sendMessage(`خطأ: ${response.data.error}`, threadID, messageID);
      } else {
        return api.sendMessage(response.data.respond, threadID, messageID);
      }
    } catch (error) {
      console.error(error);
      return api.sendMessage("حدث خطأ أثناء جلب البيانات.", threadID, messageID);
    }
  },
};