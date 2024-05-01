import axios from "axios";

export default {
  name: "علمني",
  author: "kaguya project",
  role: "member",
  description: "نموذج لتعليم سيم الرد على سؤال محدد",
  execute: async ({ api, event, args}) => {
    try {
      const text = args.join(" ");
      const text1 = text.substr(0, text.indexOf(' =» '));
      const text2 = text.split(" =» ").pop();

      if (!text1 || !text2) {
        return api.sendMessage(`❗ | كيفية الإستخدام : *علمني أهلا =» اهلا كيف الحال `, event.threadID, event.messageID);
      }

      const response = await axios.get(`https://sim-api-ctqz.onrender.com/teach?ask=${encodeURIComponent(text1)}&ans=${encodeURIComponent(text2)}`);
      api.sendMessage(` ✅ | تم تعليم سيم بنجاح \n ⁉️ | سؤالك : ${text1}\n 📝 | جواب سيم : ${text2}`, event.threadID, event.messageID);
    } catch (error) {
      console.error("An error occurred:", error);
      api.sendMessage(" ⚠️ | المرجو تعليم سيم بهذه الطريقة \nمثال : *علمني اهلا =» اهلا كيف الحال ", event.threadID, event.messageID);
    }
  },
};