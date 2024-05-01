export default {
  name: "تحليل",
  author: "مجهول",
  role: "member",
  description: "تحليل النص وعد الكلمات والفقرات والأحرف الأبجدية والرقمية.",
  execute: function ({ api, event, args }) {
    const inputStr = args.join(" ");
    const wordCount = inputStr.split(" ").length;
    const paragraphCount = (inputStr.match(/\n\n/g) || []).length + 1;
    const alphanumericCount = (inputStr.match(/[a-zA-Z0-9]/g) || []).length;

    api.sendMessage(`❯ هناك ${wordCount} كلمة/كلمات، ${paragraphCount} فقرة/فقرات، و ${alphanumericCount} حرفًا أبجديًا/رقميًا في النص الخاص بك.`, event.threadID);
  }
};