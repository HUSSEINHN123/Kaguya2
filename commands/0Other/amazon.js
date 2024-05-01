import axios from "axios";
import path from "path";
import fs from "fs";

export default {
    name: "أمازون",
    author: "Samir",
    role: "member",
    description: "يجلب معلومات حول منتج من أمازون ويترجمها إلى اللغة العربية.",
    async execute({ api, event, args }) {

api.setMessageReaction("🔍", event.messageID, (err) => {}, true);
      
        try {
            const searchTerm = args.join(" ");
            if (!searchTerm) {
                return api.sendMessage("يرجى تحديد مصطلح البحث.", event.threadID);
            }

            const apiUrl = `https://apis-samir.onrender.com/amazon/search?search=${encodeURIComponent(searchTerm)}`;
            const response = await axios.get(apiUrl);

            if (response.data && response.data.length > 0) {
                const productInfo = response.data[0];
                const translationResponse = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(productInfo.title)}`);
                const translatedTitle = translationResponse?.data?.[0]?.[0]?.[0];

              const message = `📝 | اسم المنتج: ${translatedTitle}\n💲 | السعر: ${productInfo.price}\n🌟 | التقييم: ${productInfo.rating}`;

              if (productInfo.link && productInfo.link !== "undefined") {
                  message += `\n📎 | رابط المنتج على الموقع : ${productInfo.link}`;
              }

              api.sendMessage(message, event.threadID);

                // Download image and send it as attachment
                const imagePath = path.join(process.cwd(), 'cache', 'amazon_product.jpg');
                const imageResponse = await axios.get(productInfo.image_url, { responseType: 'stream' });
                imageResponse.data.pipe(fs.createWriteStream(imagePath));


              api.setMessageReaction("✅", event.messageID, (err) => {}, true);

                setTimeout(() => {
                    api.sendMessage({
                        attachment: fs.createReadStream(imagePath),
                    }, event.threadID);
                }, 2000);
            } else {
                api.sendMessage("لم يتم العثور على نتائج للبحث.", event.threadID);
            }
        } catch (error) {
            console.error("Error fetching Amazon product info:", error);
            api.sendMessage("حدث خطأ أثناء جلب معلومات المنتج من أمازون.", event.threadID);
        }
    }
};