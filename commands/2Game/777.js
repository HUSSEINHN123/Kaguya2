class JackpotGame {
  name = "رهان";
  author = "Kaguya Project";
  cooldowns = 10;
  description = "مغامرة رهانات فاكهية مع فرص الفوز بالجائزة الكبرى !";
  role = "member";
  aliases = [];

  async execute({ event, Economy, args }) {
    const MIN_BET_AMOUNT = 100;
    const MAX_BET_AMOUNT = 1000;
    const SLOT_ITEMS = ["🍇", "🍉", "🍊", "🍏", "7⃣", "🍓", "🍒", "🍌", "🥝", "🥑", "🌽"];
    const { increase, decrease, getBalance } = Economy;

    const userMoney = (await getBalance(event.senderID)).data;

    const [moneyBet] = args;

    if (isNaN(moneyBet) || moneyBet <= 0) {
      return kaguya.reply(" ⚠️ |مبلغ الرهان غير صالح! \n أنزر إلى رصيدك");
    }

    if (moneyBet > userMoney) {
      return kaguya.reply(`أنت تحتاح  ${kaguya.formatCurrency(moneyBet - userMoney)} دولار من أحل بدأ الرهان `);
    }

    if (moneyBet < MIN_BET_AMOUNT || moneyBet > MAX_BET_AMOUNT) {
      return kaguya.reply(` ⚠️ |مبلغ الرهان غير صالح!\n على الأقل قم بالمراهنة ب : ${kaguya.formatCurrency(MIN_BET_AMOUNT)}\nالحد الأقصى : ${kaguya.formatCurrency(MAX_BET_AMOUNT)}`);
    }

    const spins = Array.from({ length: 3 }, () => SLOT_ITEMS[Math.floor(Math.random() * SLOT_ITEMS.length)]);

    var winMultiplier = calculateWinMultiplier(spins);

    const hasJackpot = Math.random() < 0.05;

    if (hasJackpot) {
      winMultiplier = 10;
    }

    const winnings = moneyBet * winMultiplier;
    const isWin = winMultiplier > 1;

    if (isWin) {
      await increase(winnings, event.senderID);
      kaguya.reply(`🎰 ${spins.join(" | ")} 🎰\n تهانينا 🥳🥳! لقد فزت ب ${kaguya.formatCurrency(winnings)}.`);
    } else {
      await decrease(moneyBet, event.senderID);
      kaguya.reply(`🎰 ${spins.join(" | ")} 🎰\nآسف، لقد خسرت ${kaguya.formatCurrency(moneyBet)}.`);
    }

    if (hasJackpot) {
      kaguya.reply("🎉🎉🎉 لقد فزت بالجائزة الكبرى! 🎉🎉🎉\nلقد فزت بجائزة رائعة!");
    }
  }
}

function calculateWinMultiplier(spins) {
  if (spins.every((symbol) => symbol === "7⃣")) {
    return 10;
  } else if (spins[0] === spins[1] && spins[1] === spins[2]) {
    return 3;
  } else if (spins[0] === spins[1] || spins[0] === spins[2] || spins[1] === spins[2]) {
    return 2;
  } else {
    return 1;
  }
}

export default new JackpotGame();
