import axios from "axios";
import fs from "fs";
import path from "path";

async function sendRandomAudioClip({ api, event }) {
    const sentMessage = await api.sendMessage("⏱️ |يرجى الإنتظار....", event.threadID);

    try {
        const audioLinks = [
          "https://i.imgur.com/Wa2VUrS.mp4",
            "https://i.imgur.com/SdrwPKy.mp4",
            "https://i.imgur.com/OcrjYUs.mp4",
            "https://i.imgur.com/qr3dpO7.mp4",
            "https://i.imgur.com/TyamPKB.mp4",
            "https://i.imgur.com/aFMRBKc.mp4",
            "https://i.imgur.com/O9lgXeM.mp4",
            "https://i.imgur.com/hhh0u2B.mp4",
            "https://i.imgur.com/GzRLYC4.mp4",
            "https://i.imgur.com/PrkTYWr.mp4",
            "https://i.imgur.com/AKzdvYp.mp4",
            "https://i.imgur.com/pDMl0Ow.mp4",
            "https://i.imgur.com/zgw8N63.mp4",
            "https://i.imgur.com/MhQVUi1.mp4",
            "https://i.imgur.com/OWKqgcT.mp4",
            "https://i.imgur.com/KgrU0vX.mp4",
            "https://i.imgur.com/XFPf9xJ.mp4",
            "https://i.imgur.com/nER9hZ7.mp4",
            "https://i.imgur.com/SjqcH8V.mp4",
            "https://i.imgur.com/TUYvUZz.mp4",
            "https://i.imgur.com/dc4VmJv.mp4",
            "https://i.imgur.com/QGseVBF.mp4",
            "https://i.imgur.com/lnmNDQ9.mp4",
            "https://i.imgur.com/3ZGYTa4.mp4",
          "https://i.imgur.com/kRm333j.mp4",
          "https://i.imgur.com/vl6WBYo.mp4",
          "https://i.imgur.com/37oOGP2.mp4"
        ];
      

        const randomIndex = Math.floor(Math.random() * audioLinks.length);
        const randomAudio = audioLinks[randomIndex];
      const tempAudioPath = path.join(process.cwd(), "temp", "sigma.mp4");
              const response = await axios.get(randomAudio, { responseType: "stream" });
              const writeStream = fs.createWriteStream(tempAudioPath);
              response.data.pipe(writeStream);

              writeStream.on("finish", async () => {

api.setMessageReaction("✅", event.messageID, (err) => {}, true);

                  await api.sendMessage({
                      body: '࿇ ══━━━━✥◈✥━━━━══ ࿇\nتفضل مقطع السيجما 🧿\t\t\t\n࿇ ══━━━━✥◈✥━━━━══ ࿇',
                      attachment: fs.createReadStream(tempAudioPath),
                  }, event.threadID);

                  fs.unlinkSync(tempAudioPath); // Delete the temporary file after sending
                  api.unsendMessage(sentMessage.messageID);
              });

              writeStream.on("error", (error) => {
                  console.error("Error downloading audio:", error);
                  api.sendMessage("حدث خطأ أثناء تحميل المقطع الصوتي.", event.threadID);
                  api.unsendMessage(sentMessage.messageID);
              });
          } catch (error) {
              console.error("Error:", error);
              api.sendMessage("حدث خطأ أثناء إرسال المقطع الصوتي.", event.threadID);
              api.unsendMessage(sentMessage.messageID);
          }
      }

      export default {
          name: "سيجما",
          author: "kaguya project",
          role: "member",
          description: "يرسل مقاطع سيجما",
          execute: sendRandomAudioClip
      };
