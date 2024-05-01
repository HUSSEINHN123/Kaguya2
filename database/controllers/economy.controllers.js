import usersController from "./users.controllers.js";

export default function ({ api, event }) {
  const formatCurrency = (number) => new Intl.NumberFormat("ar-MA", { style: "currency", currency: "MAD", maximumFractionDigits: 9 }).format(number);

  const performTransaction = async ({ action, uid, coins }) => {
    try {
      const data = usersController({ api });
      const user = await data.find(uid);
      const sender = await data.find(event.senderID);
      const actionMessage = action === "increase" ? "cộng" : action === "decrease" ? "trừ" : "chuyển";

      if (!user.status || !sender.status) return { status: false, data: `No information found in database` };

      const isInvalidCoins = !coins || isNaN(coins) || coins <= 0;
      const notEnoughCoins = action === "pay" && sender.data.data.money < coins;
      const negativeTotal = (action === "increase" || action === "pay") && user.data.data.money + coins < 0;

      if (isInvalidCoins || notEnoughCoins || negativeTotal) return { status: false, data: `Number of coins desired ${actionMessage} invalid or invalid or insifisant` };

      const total = action === "increase" || action === "pay" ? user.data.data.money + coins : user.data.data.money - coins;
      const senderMoney = sender.data.data.money;

      await data.update(event.senderID, { money: action === "pay" ? senderMoney - coins : senderMoney });
      await data.update(uid, { money: total });

      return {
        status: true,
        data: ` ${actionMessage} success ${formatCurrency(coins)} on the user: ${user.data.data.name}`,
      };
    } catch (err) {
      console.log(err);
      return { status: false, data: "An error occurred at controllers economy" };
    }
  };

  const increase = async (coins, uid) => performTransaction({ action: "increase", uid, coins });
  const decrease = async (coins, uid) => performTransaction({ action: "decrease", uid, coins });
  const pay = async (coins, uid) => performTransaction({ action: "pay", uid, coins });

  const getBalance = async (uid) => {
    try {
      const data = usersController({ api });
      const user = await data.find(uid);

      return user.status ? { status: true, data: user.data.data.money } : { status: false, data: "User not found in database" };
    } catch (err) {
      console.log(err);
      return { status: false, data: "An error occurred at controllers economy" };
    }
  };

  return { performTransaction, increase, decrease, pay, getBalance };
}
