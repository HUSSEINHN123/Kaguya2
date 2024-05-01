class Afk {
  name = "مشغول";
  author = "Kaguya Project";
  cooldowns = 10;
  description = "يرسل البوت تقرير إليك في حالة تم عمل منشن لك أو تحدث عليك شخص ما.";
  role = "member";
  dataUser = {};

  async execute({ api, event, args, Users }) {
    var reason = args.join(" ") || "بدون سبب";
    try {
      var nameUser = (await Users.find(event.senderID))?.data?.data?.name || event.senderID;
      this.dataUser[event.senderID] = { reason, nameUser, tag: [] };
      return api.sendMessage(`قام بتشغيل ميزة عدم الإزعاج والسبب : ${reason}`, event.threadID, event.messageID);
    } catch (err) {
      console.log(err);
    }
  }

  async events({ event, api }) {
    try {
      if (event.senderID in this.dataUser) {
        return api.sendMessage(`مرحبا الأشخاص اللذين قامو بعمل منشن حين كنت غائبا هم كالتالي :\n\n${this.dataUser[event.senderID].tag.join(`\n` + '-'.repeat(30) + "\n")}`, event.threadID, () => {
          delete this.dataUser[event.senderID];
        }, event.messageID);
      }

      if (!event.mentions) return;

      for (let id of Object.keys(event.mentions)) {
        if (id in this.dataUser) {
          this.dataUser[id].tag.push(`الآيدي 🧿 : ${event.senderID}\nمحتوى 📝 : ${event.body}\nوقت ⏰ : ${new Date().toLocaleString("ar-EA", { timeZone: "Africa/Casablanca" })}`);
          api.sendMessage(`المستخدم ${this.dataUser[id].nameUser} مشغول مع السبب : ${this.dataUser[id].reason}`, event.threadID, event.messageID);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}

export default new Afk();