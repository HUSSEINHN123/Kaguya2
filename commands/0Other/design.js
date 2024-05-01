import axios from "axios";

export default {
  name: "بريد2",
  author: "Sakibin_X_Imtiaz",
  role: "member",
  description: "إنشاء بريد إلكتروني مؤقت أو التحقق من البريد الوارد",
  execute: async ({ api, event, args }) => {
    if (args[0] === "إنشاء") {
      try {
        const response = await axios.get("https://tempmail-api-r6cw.onrender.com/gen");
        const responseData = response.data.email;
        api.sendMessage(`✅ | إليك البريد المؤقع الخاص بك :\n💌 |البريد : ${responseData}\n`, event.threadID);
      } catch (error) {
        console.error("🔴 Error", error);
        api.sendMessage("🔴 خطأ غير متوقع، يرجى المحاولة مرة أخرى في وقت لاحق...", event.threadID);
      }
    } else if (args[0].toLowerCase() === "الوارد" && args.length === 2) {
      const email = args[1];
      try {
        const response = await axios.get(`https://tempmail-api-r6cw.onrender.com/get/${email}`);
        const data = response.data;
        const inboxMessages = data[0].body;
        const inboxFrom = data[0].from;
        const inboxSubject = data[0].subject;
        const inboxDate = data[0].date;
        api.sendMessage(`•=====[صندوق الورائد]=====•\n👤 | من طرف : ${inboxFrom}\n🔖 | الموضوع: ${inboxSubject}\n\n💌 | الرسالة : ${inboxMessages}\n🗓️ | التاريخ: ${inboxDate}`, event.threadID);
      } catch (error) {
        console.error("🔴 Error", error);
        api.sendMessage("🔴 لا يوجد اي بريد حتى الآن في صندوق الورائد", event.threadID);
      }
    } else {
      api.sendMessage("🔴 إستخدم 'بريد إنشاء' من أجل الحصول على بريد مؤقت 'برسد الوارد {البريد اللذي قمت بالحصول عليه}' من أجل تفقد صندوق الورائد ", event.threadID);
    }
  },
};