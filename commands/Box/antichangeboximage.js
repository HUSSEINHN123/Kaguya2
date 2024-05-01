class AntiBoxImage {
  name = "حماية_الصورة";
  author = "Kaguya Project";
  cooldowns = 60;
  description = "حماية المجموعة من تغيير صورتها!";
  role = "admin";
  aliases = [];

  async execute({ api, event, Threads }) {
    try {
      const threads = (await Threads.find(event.threadID))?.data?.data;
      let currentImage = null;
      if (threads?.image) {
        currentImage = threads.image; // احفظ الصورة الحالية إذا كانت موجودة
      }

      const status = threads?.anti?.imageBox ? false : true;
      await Threads.update(event.threadID, {
        anti: {
          imageBox: status,
        },
      });

      if (status && currentImage) {
        // إذا تم تشغيل الميزة وكانت هناك صورة محفوظة، استعد الصورة الحالية
        await api.changeGroupImage(currentImage, event.threadID);
      }

      await api.sendMessage(`تم ${status ? "تشغيل" : "إيقاف"} ميزة حماية تغيير صورة المجموعة`, event.threadID);
    } catch (err) {
      console.error(err);
      await api.sendMessage("حدث خطأ غير متوقع!", event.threadID);
    }
  }
}

export default new AntiBoxImage();