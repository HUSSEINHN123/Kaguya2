import jimp from 'jimp';
import fs from 'fs';

async function getProfilePicture(userID) {
    const url = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const img = await jimp.read(url);
    const profilePath = `profile_${userID}.png`;
    await img.writeAsync(profilePath);
    return profilePath;
}

export default {
    name: "بروفايل",
    author: "ChatGPT",
    role: "member",
    description: "يرسل صورة البروفايل الخاصة بك على فيسبوك",
    execute: async function ({ api, event, args }) {
        const mentionedUserID = event?.messageReply?.senderID || (Object.keys(event.mentions).length > 0 ? Object.keys(event.mentions)[0] : event.senderID);
        try {
            const profilePath = await getProfilePicture(mentionedUserID);
            const user = event?.messageReply?.senderID ? await api.getUserInfo(mentionedUserID) : null;
            const name = user ? user[mentionedUserID].name : ""; 
            const message = `تفضل صورة بروفايل ${name} :`;
            return api.sendMessage({ body: message, attachment: fs.createReadStream(profilePath) }, event.threadID, event.messageID);
        } catch (error) {
            console.error(error);
            return api.sendMessage("حدث خطأ أثناء جلب صورة البروفايل.", event.threadID);
        }
    },
    onReply: async function ({ api, event, reply }) {
        const senderID = event.senderID;
        try {
            const profilePath = await getProfilePicture(senderID);
            return api.sendMessage({ body: "هذه صورتك الشخصية:", attachment: fs.createReadStream(profilePath) }, event.threadID, event.messageID);
        } catch (error) {
            console.error(error);
            return api.sendMessage("حدث خطأ أثناء جلب صورة البروفايل.", event.threadID);
        }
    }
};