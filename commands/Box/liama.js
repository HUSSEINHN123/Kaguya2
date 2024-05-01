import fs from 'fs';
import path from 'path';
import PastebinAPI from 'pastebin-js';

export default {
  name: 'مشاركة',
  author: 'ChatGPT',
  description: 'رفع ملف إلى Pastebin وإرسال رابط المشاركة.',
  role: 'member',
  execute: async ({ api, event, args }) => {
    const pastebin = new PastebinAPI({
      api_dev_key: 'LFhKGk5aRuRBII5zKZbbEpQjZzboWDp9',
      api_user_key: 'LFhKGk5aRuRBII5zKZbbEpQjZzboWDp9',
    });

    if (!args || args.length === 0) {
      return api.sendMessage('الرجاء تحديد اسم الملف!', event.threadID);
    }

    const fileName = args[0];
    const commandPath = findCommandPath(fileName);

    if (!commandPath) {
      return api.sendMessage('لم يتم العثور على الملف!', event.threadID);
    }

    fs.readFile(commandPath, 'utf8', async (err, data) => {
      if (err) {
        console.error(err);
        return api.sendMessage('حدث خطأ أثناء قراءة الملف!', event.threadID);
      }

      const paste = await pastebin
        .createPaste({
          text: data,
          title: fileName,
          format: null,
          privacy: 1,
        })
        .catch((error) => {
          console.error(error);
          api.sendMessage('حدث خطأ أثناء رفع الملف!', event.threadID);
        });

      if (paste) {
        const rawPaste = paste.replace("pastebin.com", "pastebin.com/raw");
        api.sendMessage(`تم رفع الملف إلى pastebin: ${rawPaste}`, event.threadID);
      }
    });
  },
};

function findCommandPath(commandName) {
  const dir = fs.readdirSync("./commands");
  for (const dirName of dir) {
    const commandsInDir = fs.readdirSync(`./commands/${dirName}`);
    for (const fileName of commandsInDir) {
      if (fileName === `${commandName}.js`) {
        return path.join(process.cwd(), 'commands', dirName, fileName);
      }
    }
  }
  return null;
}