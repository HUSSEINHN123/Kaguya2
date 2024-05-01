import axios from "axios";

export default {
    name: "توب_أنمي",
    author: "Samir",
    role: "member",
    description: "يقوم بجلب أفضل خمسة أنميات الأكثر تقييماً وشعبيةً.",
    async execute({ api, event }) {
        try {
            const apiUrl = "https://apis-samir.onrender.com/mal/top/airing";
            const response = await axios.get(apiUrl);

            if (response.data && response.data.status === 200 && response.data.data && response.data.data.length > 0) {
                const animeList = response.data.data;
                let message = "أفضل خمسة أنميات هذا الأسبوع :\n\n";

                animeList.slice(0, 5).forEach((anime) => {
                    message += `المرتبة: ${anime.rank}\n`;
                    message += `العنوان: ${anime.title}\n`;
                    message += `التقييم: ${anime.score}\n`;
                    message += `الرابط: ${anime.link}\n`;
                    message += "\n";
                });

                api.sendMessage(message, event.threadID);
            } else {
                api.sendMessage("لا يوجد بيانات متاحة حاليًا.", event.threadID);
            }
        } catch (error) {
            console.error("Error fetching top anime:", error);
            api.sendMessage("حدث خطأ أثناء جلب قائمة أفضل الأنميات.", event.threadID);
        }
    }
};