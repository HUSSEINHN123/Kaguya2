import { log } from "../logger/index.js";
import moment from "moment-timezone";
import fs from "fs";

export default {
  name: "subscribe",
  execute: async ({ api, event, Threads, Users }) => {
    var threads = (await Threads.find(event.threadID))?.data?.data || {};
    if (!threads) {
      await Threads.create(event.threadID);
    }
    switch (event.logMessageType) {
      case "log:unsubscribe":
        {
          if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) {
            await Threads.remove(event.threadID);
            return log([
              {
                message: "[ THREADS ]: ",
                color: "yellow",
              },
              {
                message: ` ❌ | المجموعة  مع المعرف : ${event.threadID} قامت بطرد البوت خارجا `,
                color: "green",
              },
            ]);
          }
          await Threads.update(event.threadID, {
            members: +threads.members - 1,
          });
          kaguya.reply(event.logMessageBody);
          break;
        }
      case "log:subscribe": {
        if (event.logMessageData.addedParticipants.some((i) => i.userFbId == api.getCurrentUserID())) {
          api.changeNickname(
            `❏ الرمز : 『${global.client.config.prefix}』\n❏إسم البوت : 『كاغويا ساما』\n❏إسم المطور : 『حسين يعقوبي』\n❏رابط المطور : https://www.facebook.com/profile.php?id=100076269693499`,
            event.threadID,
            api.getCurrentUserID()
          );

          // تزيين رسالة الدخول
          const currentTime = moment().tz("Africa/Casablanca").format("YYYY-MM-DD HH:mm:ss");
          const welcomeMessagePart1 = `
✿━━━━━━━━━━━━━━━━━✿\n
✅ | تم توصيل كاغويا البوت بنجاح
❏ الرمز : 『${global.client.config.prefix}』
❏ إسم البوت : 『كاغويا ساما』
❏ إسم المطور : 『حسين يعقوبي』
❏ رابط المطور : https://www.facebook.com/profile.php?id=100076269693499\n✿━━━━━━━━━━━━━━━━━✿`;

          const welcomeMessagePart2 = `✿━━━━━━━━━━━━━━━━━✿\n ⚙️  | جاري توصيل كاغويا البوت في المجموعة..... \n
❏ التاريخ : ${moment().tz("Africa/Casablanca").format("YYYY-MM-DD")}
❏ الوقت : ${moment().tz("Africa/Casablanca").format("HH:mm:ss")}
\n✿━━━━━━━━━━━━━━━━━✿`;

          // إرسال رسالة الدخول
          const videoPath = "cache/kaguya.mp4";
          api.sendMessage(
            {
              body: welcomeMessagePart1,
              attachment: fs.createReadStream(videoPath),
            },
            event.threadID
          );
          api.sendMessage(welcomeMessagePart2, event.threadID);
        } else {
          for (let i of event.logMessageData.addedParticipants) {
            await Users.create(i.userFbId);
          }
          await Threads.update(event.threadID, {
            members: +threads.members + +event.logMessageData.addedParticipants.length,
          });

          // إرسال رسالة الدخول
          return kaguya.send(event.logMessageBody);
        }
      }
    }
  },
};