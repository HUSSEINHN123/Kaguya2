class Example {
  name = "طلبات";
  author = "Thiệu Trung Kiên";
  cooldowns = 50;
  description = "نموذج الأمر الأساسي";
  role = "member";
  handleReply = []; // تعريف handleReply كمصفوفة

  async execute({ api, event }) {
    const { threadID, messageID } = event;
    const commandName = "approve";
    var msg = "", index = 1;

    try {
      var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
      var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
    } catch (e) {
      return api.sendMessage("لا يمكن الحصول على قائمة الانتظار", threadID, messageID);
    }

    const list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);

    for (const single of list) {
      msg += `${index++}/ ${single.name}(${single.threadID})\n`;
    }

    if (list.length != 0) {
      return api.sendMessage(`إجمالي عدد المجموعات المحتاجة للموافقة هو: ${list.length} مجموعة \n\n${msg}`, threadID, (error, info) => {
        this.handleReply.push({
          name: commandName,
          messageID: info.messageID,
          author: event.senderID,
          pending: list
        })
      }, messageID);
    } else {
      return api.sendMessage("لا توجد مجموعات في قائمة الانتظار", threadID, messageID);
    }
  }

  async onReply({ api, event }) {
    const { senderID, body, threadID, messageID } = event;
    var count = 0;

    if (String(senderID) !== String(this.handleReply.author)) return; // استخدام this.handleReply بدلاً من handleReply

    if (isNaN(body) && (body.indexOf("c") == 0 || body.indexOf("cancel") == 0)) {
      const index = (body.slice(1, body.length)).split(/\s+/);
      for (const singleIndex of index) {
        if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > this.handleReply.pending.length) return api.sendMessage(`${singleIndex} ليس رقمًا صحيحًا`, threadID, messageID); // استخدام this.handleReply بدلاً من handleReply
        api.removeUserFromGroup(api.getCurrentUserID(), this.handleReply.pending[singleIndex - 1].threadID);
        count+=1;
      }
      return api.sendMessage(`تم رفض ${count} مجموعة`, threadID, messageID);
    } else if (body.indexOf("موافقة") == 0) {
      const groupID = body.split(/\s+/)[1];
      if (!groupID || !/^\d+$/.test(groupID)) {
        return api.sendMessage("الرجاء إدخال معرف صحيح للمجموعة.", threadID, messageID);
      }

      try {
        await api.sendMessage("تمت الموافقة على المجموعة بنجاح.", groupID);
        // إزالة المجموعة من قائمة المعلقة
        this.handleReply.pending = this.handleReply.pending.filter(group => group.threadID !== groupID);
        return api.sendMessage("تمت الموافقة على المجموعة بنجاح وتمت إزالتها من قائمة الانتظار.", threadID, messageID);
      } catch (error) {
        console.error("حدث خطأ أثناء الموافقة على المجموعة:", error);
        return api.sendMessage("حدث خطأ أثناء الموافقة على المجموعة.", threadID, messageID);
      }
    } else {
      const index = body.split(/\s+/);
      for (const singleIndex of index) {
        if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > this.handleReply.pending.length) return api.sendMessage(`${singleIndex} ليس رقمًا صحيحًا`, threadID, messageID); // استخدام this.handleReply بدلاً من handleReply
        api.sendMessage("✅ |تمت الموافقة على المجموعة من طرف المطور \n----------- \n---------------------\nأكتب *أوامر لترى قائمة الأوامر \n----------------\nرابط حساب المطور : https://www.facebook.com/profile.php?id=100076269693499\n-----------------\nإذا كان هناك أي مشاكل يرجى التواصل معي\nنهاركم سعيد 🤙 ", this.handleReply.pending[singleIndex - 1].threadID);
        count+=1;
        // Aquí se añade el código para aceptar la solicitud y enviar un mensaje de aprobación a la conversación
        const threadData = this.handleReply.pending[singleIndex - 1];
        await api.sendMessage("✅ تمت الموافقة على الطلب بنجاح.", threadData.threadID);
        // Quitar la conversación de la lista de pendientes
        this.handleReply.pending.splice(singleIndex - 1, 1);
      }
      return api.sendMessage(`تمت الموافقة بنجاح على ${count} مجموعة`, threadID, messageID);
    }
  }

  async onReaction({ api, event }) {
    // Ở đây là nơi bạn viết code cho handle reaction
  } 
}

export default new Example();