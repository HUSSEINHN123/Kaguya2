import axios from "axios";
import fs from "fs";
import path from "path";

async function randomImageAndUptime({ api, event }) {
    try {
        const searchQueries = ["zoro", "madara", "obito", "luffy", "boa", "kaguya", "hinata", "rim", "itashi", "nizko", "mikasa", "nami"]; // إضافة استعلامات البحث عن الصور هنا

        const randomQueryIndex = Math.floor(Math.random() * searchQueries.length);
        const searchQuery = searchQueries[randomQueryIndex];

        const apiUrl = `https://pin-two.vercel.app/pin?search=${encodeURIComponent(searchQuery)}`;

        const response = await axios.get(apiUrl);
        const imageLinks = response.data.result;

        const randomImageIndex = Math.floor(Math.random() * imageLinks.length);
        const imageUrl = imageLinks[randomImageIndex];

        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imagePath = path.join(process.cwd(), 'cache', `uptime_image.jpg`);
        await fs.promises.writeFile(imagePath, imageResponse.data);

        const uptime = process.uptime();
        const seconds = Math.floor(uptime % 60);
        const minutes = Math.floor((uptime / 60) % 60);
        const hours = Math.floor((uptime / (60 * 60)) % 24);
        const days = Math.floor(uptime / (60 * 60 * 24));

        let uptimeString = `${days} يوم, ${hours} ساعة, ${minutes} دقيقة, و ${seconds} ثانية`;
        if (days === 0) {
            uptimeString = `${hours} ساعة, ${minutes} دقيقة, و ${seconds} ثانية`;
            if (hours === 0) {
                uptimeString = `${minutes} دقيقة, و ${seconds} ثانية`;
                if (minutes === 0) {
                    uptimeString = `${seconds} ثانية`;
                }
            }
        }

        const message = `✿━━━━━━━━━━━━━━━━━✿\n 🔖 | تحياتي ! كاغويا البوت\nكانت شغالة منذ :\n${uptimeString}\n✿━━━━━━━━━━━━━━━━━✿`;
        const imageStream = fs.createReadStream(imagePath);

      api.setMessageReaction("🚀", event.messageID, (err) => {}, true);
      

        await api.sendMessage({
            body: message,
            attachment: imageStream
        }, event.threadID, event.messageID);

        await fs.promises.unlink(imagePath);
    } catch (error) {
        console.error(error);
        return api.sendMessage(`An error occurred.`, event.threadID, event.messageID);
    }
}

export default {
    name: "اوبتايم",
    description: "مدة تشغيل البوت.",
    execute: randomImageAndUptime
};