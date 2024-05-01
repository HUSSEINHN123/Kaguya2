import axios from "axios";
import fs from "fs";
import path from "path";

export default {
  name: "شاذ",
  author: "ChatGPT",
  role: "admin",
  description: "البحث عن شاذ في المجموعة وإظهاره",
  execute: async ({ api, event }) => {
    const groupId = event.threadID;
    const groupMembers = await api.getThreadInfo(groupId);

    const friends = groupMembers.participantIDs.filter(userId => !groupMembers.nicknames[userId]);

    if (friends.length === 0) {
      api.sendMessage("✅ | المجموعة نظيفة ليس هناك أي شاذ في المجموعة.", groupId);
      return;
    }

    const randomIndex = Math.floor(Math.random() * friends.length);
    const randomUserId = friends[randomIndex];

    const userInfo = await api.getUserInfo([randomUserId]);
    const realName = userInfo[randomUserId].name;

    const url = "https://drive.google.com/uc?export=download&id=1K8F9J7Y44Ja0OKCI9uknnnqYJCSPQZIw";

    const loadingMessage = await api.sendMessage("⏱️ | جاري البحث عن شاذ في المجموعة......", groupId);

    try {
      const videoPath = path.join(process.cwd(), "cache", "shaz.mp4");
      const response = await axios.get(url, { responseType: "stream" });

      if (response.data) {
        const videoResponse = response.data;
        videoResponse.pipe(fs.createWriteStream(videoPath));

        videoResponse.on("end", () => {
          api.sendMessage({
            body: `⚠️ | تم تحديد شاذ في المجموعة\nهذا الشخص المسمى بـ ${realName} هو شاذ 🏳️‍🌈`,
            attachment: fs.createReadStream(videoPath)
          }, groupId, () => fs.unlinkSync(videoPath), loadingMessage.messageID);
        });
      }
    } catch (error) {
      console.error("حدث خطأ أثناء تنفيذ الأمر:", error);
      api.sendMessage("حدث خطأ أثناء تنفيذ الأمر.", groupId);
    }
  }
};