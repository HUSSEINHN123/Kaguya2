import axios from 'axios';

async function generateDescriptionFromPrompt(promptText) {
    try {
        // تحويل النص إلى الإنجليزية
        const translationResponse = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(promptText)}`);
        const translatedText = translationResponse?.data?.[0]?.[0]?.[0];

        // استخراج الكلمات الرئيسية من النص المُترجم
        const keywords = translatedText.split(' ');

        // إعادة بناء النص باللغة العربية
        const descriptionResponse = await axios.get(`https://apis-samir.onrender.com/prompt?text=${encodeURIComponent(translatedText)}`);
        const descriptionData = descriptionResponse.data;

        return {
            prompt: descriptionData.prompt,
            keywords: keywords
        };
    } catch (error) {
        console.error("حدث خطأ أثناء جلب الوصف:", error);
        return null;
    }
}

export default {
    name: "برومبت",
    author: "kaguya project",
    role: "member",
    description: "قم بتوليد وصف للكلمة من خلال برومبت",
    execute: async ({ api, event, args }) => {
        const promptText = args.join(" ");
        if (!promptText) {
            api.sendMessage("⚠️ | المرجو  ادخال كلمة ك برومبت.", event.threadID, event.messageID);
            return;
        }

        const description = await generateDescriptionFromPrompt(promptText);
        if (description) {
            const message = `الوصف 📝 : \n${description.prompt}`;
            api.sendMessage(message, event.threadID, event.messageID);
        } else {
            api.sendMessage("حدث خطأ أثناء جلب الوصف.", event.threadID, event.messageID);
        }
    }
};