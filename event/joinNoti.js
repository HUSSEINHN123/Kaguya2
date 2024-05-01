import axios from 'axios';
import fs from 'fs';
import moment from 'moment-timezone';
import jimp from 'jimp';

async function execute({ api, event, threadsData, usersData }) {
  switch (event.logMessageType) {
    case "log:unsubscribe": {
      const { leftParticipantFbId, reason } = event.logMessageData;
      if (leftParticipantFbId == api.getCurrentUserID()) {
        return;
      }
      const userInfo = await api.getUserInfo(leftParticipantFbId);
      const profileName = userInfo[leftParticipantFbId]?.name || "Unknown";
      const farewellReason = getFarewellReason(reason);
      const farewellMessage = `❏إسم العضو 👤 : 『${profileName}』 \n❏ سبب المغادرة 📝 : 『${farewellReason}』.`;
      const profilePicturePath = await getProfilePicture(leftParticipantFbId);
      await sendWelcomeOrFarewellMessage(api, event.threadID, farewellMessage, profilePicturePath);
      break;
    }
    case "log:subscribe": {
      const { addedParticipants } = event.logMessageData;
      let threadName = "Unknown";
      const threadInfo = await api.getThreadInfo(event.threadID);
      if (threadInfo) {
        threadName = threadInfo.threadName || "Unknown";
      }
      const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
      const participantNames = [];
      for (const participant of addedParticipants) {
        const userInfo = await api.getUserInfo(participant.userFbId);
        const profileName = userInfo[participant.userFbId]?.name || "Unknown";
        participantNames.push(`『${profileName}』`);
      }
      const welcomeMessage = `✿━━━━━━━━━━━━━━━━━✿\n❏أعضاء جدد إنضموا إلى المجموعة 🎉:\n${participantNames.join("\n")}\n❏إسم المجموعة 🧭 : 『${threadName}』\n❏ 📅 |تاريخ الإنضمام : ${moment().tz("Africa/Casablanca").format("YYYY-MM-DD")}
❏⏰ | وقت الإنضمام : ${moment().tz("Africa/Casablanca").format("HH:mm:ss")}\n🔖 | لا تنسى اللفظ وإن ضاق بك الرد\n✿━━━━━━━━━━━━━━━━━✿`;
      await sendWelcomeOrFarewellMessage(api, event.threadID, welcomeMessage, "cache/hi.gif");
      break;
    }
  }
}

async function sendWelcomeOrFarewellMessage(api, threadID, message, attachmentPath) {
  try {
    await api.sendMessage({
      body: message,
      attachment: fs.createReadStream(attachmentPath),
    }, threadID);
  } catch (error) {
    console.error('Error sending welcome or farewell message:', error);
  }
}

async function getProfilePicture(userID) {
  const url = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  const img = await jimp.read(url);
  const profilePath = `profile_${userID}.png`;
  await img.writeAsync(profilePath);
  return profilePath;
}

function getFarewellReason(reason) {
  return reason === "leave" ? "غادر من تلقاء نفسه" : "غادر بكرامته 🙂";
}

export default {
  name: "welcomeAndFarewell",
  description: "يتم استدعاء هذا الأمر عندما ينضم شخص جديد إلى المجموعة أو يغادرها.",
  execute,
};