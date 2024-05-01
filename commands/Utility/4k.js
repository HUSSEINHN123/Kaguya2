import axios from "axios";

export default {
  name: "بريد",
  author: "kaguya project",
  description: "إدارة البريد الإلكتروني المؤقت لإنشاء صندوق الوارد واستعراضه",
  role: "member",
  execute: async ({ api, event, args }) => {
    try {
      if (!args[0]) {
        return api.sendMessage("⚠️ | يرجى تحديد 'وارد' أو 'إنشاء' كأول وسيطة.", event.threadID);
      }

      const command = args[0].toLowerCase();

      switch (command) {
        case 'وارد':
          await handleInbox(args[1], api, event);
          break;
        case 'إنشاء':
          await handleCreate(api, event);
          break;
        default:
          api.sendMessage("⚠️ | يرجى تحديد 'إنشاء' أو 'وارد'.", event.threadID);
          break;
      }
    } catch (error) {
      console.error('Error:', error);
      api.sendMessage("حدث خطأ.", event.threadID);
    }
  }
};

async function handleInbox(emailAddress, api, event) {
  if (!emailAddress) {
    return api.sendMessage(" ⚠️ |يرجى تقديم البريد الإلكتروني من أجل صندوق الورائد.", event.threadID);
  }

  const inboxResponse = await axios.get(`https://apis-samir.onrender.com/tempmail/inbox/${emailAddress}`);
  const messages = inboxResponse.data;

  if (!messages || messages.length === 0) {
    return api.sendMessage(` ⚠️ |لم يتم العثور على رسائل لـ ${emailAddress}.`, event.threadID);
  }

  let messageText = '📬 رسائل صندوق الوارد:\n\n';
  messages.forEach(message => {
    messageText += `📧 من: ${message.from}\n`;
    messageText += `📑 الموضوع: ${message.subject || 'فارغ'}\n`;
    messageText += `📩 الرسالة: ${message.body}\n\n`; // إضافة فاصل بين الرسائل
  });

  api.sendMessage(messageText, event.threadID);
}

async function handleCreate(api, event) {
  const tempMailResponse = await axios.get("https://apis-samir.onrender.com/tempmail/get");
  const tempMailData = tempMailResponse.data;

  if (!tempMailData.email) {
    return api.sendMessage("فشل في توليد بريد إلكتروني مؤقت.", event.threadID);
  }

  api.sendMessage(`📩 ها هو بريدك الإلكتروني المؤقت: ${tempMailData.email}`, event.threadID);
}