import axios from "axios";

export default {
  name: "رابط2",
  author: "Thiệu Trung Kiên",
  cooldowns: 10,
  description: "قم بتحويل الصورة إلى رابط",
  role: "member",
  aliases: ["uploadimage"],
  execute: async ({ event }) => {
    const clientId = "fc9369e9aea767c";
    const client = axios.create({
      baseURL: "https://api.imgur.com/3/",
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
    });

    const uploadImage = async (url) => {
      return (
        await client.post("image", {
          image: url,
        })
      ).data.data.link;
    };

    const array = [];

    if (event.type !== "message_reply" || event.messageReply.attachments.length === 0) {
      return kaguya.reply(" ⚠️ | قم بالرد على صورة");
    }

    for (const { url } of event.messageReply.attachments) {
      try {
        const res = await uploadImage(url);
        array.push(res);
      } catch (err) {
        console.log(err);
      }
    }

    kaguya.reply(`✅ | تم الرفع بنجاح ${array.length} صورة\nفشل : ${array.length - event.messageReply.attachments.length}\n» رابط الصورة :\n${array.join("\n")}`);
  },
};
