import fs from "fs";
import path from "path";

export default {
  name: "بنك",
  author: "YourName",
  role: "member",
  description: "Bank commands for registration, deposit, withdraw, and balance check.",
  async execute({ api, event, args, Economy }) {
    const { threadID, messageID, senderID } = event;
    const userDataFile = path.join(process.cwd(), 'userData.json');

    // Ensure the existence of the user data file
    if (!fs.existsSync(userDataFile)) {
      fs.writeFileSync(userDataFile, '{}');
    }

    // Load existing user data from the JSON file
    let userData = JSON.parse(fs.readFileSync(userDataFile, 'utf8'));

    const MIN_DEPOSIT_AMOUNT = 50;
    const MIN_WITHDRAW_AMOUNT = 50;

    // Check if the user is registered, if not, prompt them to register
    if (!userData[senderID]) {
      userData[senderID] = { balance: 0 }; // Initialize balance for new users
      fs.writeFileSync(userDataFile, JSON.stringify(userData, null, 2));
      return api.sendMessage("[ بنك كاغويا ] » لقد تم تسجيلك بنجاح في بنك كاغويا. يمكنك الآن القيام بعمليات الإيداع والسحب.", threadID, messageID);
    }

    if (args[0] === 'ادخال' || args[0] === 'deposit') {
      const depositAmount = parseInt(args[1]);

      // Check if the deposit amount is valid
      if (isNaN(depositAmount) || depositAmount < MIN_DEPOSIT_AMOUNT) {
        return api.sendMessage(`[ بنك كاغويا ] » يجب أن يكون مبلغ الإيداع رقم واحد وأكبر من ${MIN_DEPOSIT_AMOUNT} دولار. 💰`, threadID, messageID);
      }

      // Update user balance
      userData[senderID].balance += depositAmount;
      fs.writeFileSync(userDataFile, JSON.stringify(userData, null, 2));

      // Perform the deposit using Economy's increase function
      await Economy.increase(senderID, depositAmount);

      return api.sendMessage(`[ بنك كاغويا ] » تم إيداع ${depositAmount}$ في حسابك بنجاح. 💵`, threadID, messageID);
    }

    if (args[0] === 'سحب' || args[0] === 'withdraw') {
      const withdrawAmount = parseInt(args[1]);

      // Check if the withdraw amount is valid
      if (isNaN(withdrawAmount) || withdrawAmount < MIN_WITHDRAW_AMOUNT) {
        return api.sendMessage(`[ بنك كاغويا ] » يجب أن يكون مبلغ السحب رقم واحد وأكبر من ${MIN_WITHDRAW_AMOUNT} دولار. 💰`, threadID, messageID);
      }

      // Check if the user has sufficient balance
      if (userData[senderID].balance < withdrawAmount) {
        return api.sendMessage('[ بنك كاغويا ] » رصيدك لا يكفي لإجراء هذه العملية. 💸', threadID, messageID);
      }

      // Update user balance
      userData[senderID].balance -= withdrawAmount;
      fs.writeFileSync(userDataFile, JSON.stringify(userData, null, 2));

      // Perform the withdraw using Economy's decrease function
      await Economy.decrease(senderID, withdrawAmount);

      return api.sendMessage(`[ بنك كاغويا ] » تم سحب ${withdrawAmount}$ بنجاح. 💵`, threadID, messageID);
    }

    if (args[0] === 'رصيدي' || args[0] === 'balance') {
      return api.sendMessage(`[ بنك كاغويا ] » الرصيد الحالي في حسابك ببنك كاغويا هو: ${userData[senderID].balance}$. 💳`, threadID, messageID);
    }
    
        return 

    
    api.sendMessage(`
    ✿━━━━━━━━━━━━━━━━━✿
    [🏦 بنك كاغويا 🏦] » يرجى استخدام أحد الأوامر التالية:
    [بنك تسجيل] - للتسجيل في بنك كاغويا وبدء التداول.
    [بنك رصيدي] - لعرض رصيدك الحالي في بنك كاغويا.
    [بنك ادخال] - لإيداع الأموال في بنك كاغويا.
    [بنك سحب] - لسحب الأموال من بنك كاغويا
    ✿━━━━━━━━━━━━━━━━━✿
    `, threadID, messageID);