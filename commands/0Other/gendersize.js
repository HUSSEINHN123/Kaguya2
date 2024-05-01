import axios from 'axios';

const joinGroupCommand = async ({ api, event, args }) => {
  try {
    if (!args[0]) {
      const groupList = await api.getThreadList(10, null, ['INBOX']);
      const filteredList = groupList.filter(group => group.name !== null);

      if (filteredList.length === 0) {
        api.sendMessage('No group chats found.', event.threadID);
      } else {
        const formattedList = filteredList.map((group, index) =>
          `│${index + 1}. ${group.name}\n│𝐓𝐈𝐃: ${group.threadID}\n│𝐓𝐨𝐭𝐚𝐥 𝐦𝐞𝐦𝐛𝐞𝐫𝐬: ${group.participantIDs.length}\n│`
        );
        const message = `╭─╮\n│𝐋𝐢𝐬𝐭 𝐨𝐟 𝐠𝐫𝐨𝐮𝐩 𝐜𝐡𝐚𝐭𝐬:\n${formattedList.map(line => `${line}`).join("\n")}\n╰───────────ꔪ\nالحد الأقصى للأعضاء = 250\n\n  "إنضمام {معرف المجموعة}"\n\n مثال "إنضمام 6799332630181479" بعد الرد على هذه الرسالة`;

        const sentMessage = await api.sendMessage(message, event.threadID);
      }
    } else {
      const threadID = args[0];

      // If threadID is provided, try to join the group
      const selectedGroup = await api.getThreadInfo(threadID);

      if (!selectedGroup) {
        api.sendMessage('Invalid thread ID. Please provide a valid group chat ID.', event.threadID);
        return;
      }

      // Check if the user is already in the group
      const memberList = await api.getThreadInfo(threadID);
      if (memberList.participantIDs.includes(event.senderID)) {
        api.sendMessage(` ⚠️ | لا أستطيع إضافتك الى هذه المجموعة : \n${selectedGroup.name}`, event.threadID);
        return;
      }

      // Check if group is full
      if (memberList.participantIDs.length >= 250) {
        api.sendMessage(` ❗ | لا يمكن إضافتك إلى هذه المجموعة لانها ممتلئة: \n${selectedGroup.name}`, event.threadID);
        return;
      }

      await api.addUserToGroup(event.senderID, threadID);
      api.sendMessage(` ✅ | تمت إضافتك بنجاح الى هذه المجموعة : ${selectedGroup.name}`, event.threadID);
    }
  } catch (error) {
    console.error("Error joining group chat", error);
    api.sendMessage('حدث خطأ أثناء الانضمام إلى الدردشة الجماعية.\nيرجى المحاولة مرة أخرى لاحقًا.', event.threadID);
  }
};

 export default {
  name: "إنضمام",
  author: "Kshitiz",
  role: 1,
  description: "الإنضمام الى مجموعة محددة",
  execute: joinGroupCommand
};