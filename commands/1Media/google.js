import axios from "axios";
import fs from "fs";
import path from "path";

const commandName = "جوجل";

export default {
  name: commandName,
  author: "Anonymous",
  role: "member",
  description: "بحث عن الصور على الإنترنت.",
  execute: async ({ api, event, args }) => {
    let searchQuery = args.join(' ');

    if (searchQuery) {
        try {
            const response = await axios.get(`https://apis-samir.onrender.com/google/imagesearch?q=${encodeURIComponent(searchQuery)}`);
            const data = response.data.data;
            const imgData = [];

            for (let i = 0; i < Math.min(6, data.length); i++) {
                const imgResponse = await axios.get(data[i], { responseType: 'arraybuffer' });
                const imgPath = path.join(process.cwd(), 'cache', `${i + 1}.jpg`);
                await fs.promises.writeFile(imgPath, imgResponse.data);
                imgData.push(fs.createReadStream(imgPath));
            }

            await api.sendMessage({
                attachment: imgData,
                body: ` 🌟 | إليك الصور الخاصة بك  "${searchQuery}"`
            }, event.threadID, event.messageID);

        } catch (error) {
            console.error("Failed to fetch or send images:", error.message);
            api.sendMessage({ body: "Failed to get random images." }, event.threadID);
        }
    } else {
        let links = [];

        for (let attachment of event.messageReply.attachments) {
            links.push(attachment.url);
        }

        try {
            const shortLink1 = await uploadImgbb(links[0]);
            const imageUrl = shortLink1.image.url;
            const response = await axios.get(`https://apis-samir.onrender.com/find?imageUrl=${imageUrl}`);
            const data = response.data.data;
            const imgData = [];

            for (let i = 0; i < Math.min(6, data.length); i++) {
                const imgResponse = await axios.get(data[i], { responseType: 'arraybuffer' });
                const imgPath = path.join(process.cwd(), 'cache', `${i + 1}.jpg`);
                await fs.promises.writeFile(imgPath, imgResponse.data);
                imgData.push(fs.createReadStream(imgPath));
            }

            await api.sendMessage({
                attachment: imgData,
                body: ` 🌟 | إليك الصور الخاصة بك  `
            }, event.threadID, event.messageID);

        } catch (error) {
            console.error("Failed to fetch or send images:", error.message);
            api.sendMessage({ body: "Failed to get random images." }, event.threadID);
        }
    }
  }
};