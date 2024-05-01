// SellAnimalFood.js

// دالة لاختيار عنصر عشوائي من مصفوفة
function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

class SellAnimalFood {
  constructor() {
    this.name = "بيع";
    this.author = "Anonymous";
    this.role = "member";
    this.description = "قم ببيع الحيوانات مع الطعام";
    this.aliases = ["بيعي"];
  }

  async execute({ api, event, Economy }) {
    const { threadID, senderID } = event;

    const animals = [
      { name: "الأيل", emoji: "🦌" },
      { name: "الأرنب", emoji: "🐇" },
      { name: "الثعلب", emoji: "🦊" },
      { name: "الدب", emoji: "🐻" },
      { name: "سنجاب", emoji: "🐿️" },
      { name: "حشرة", emoji: "🪳" },
      { name: "دودة", emoji: "🪱" },
      { name: "كلب", emoji: "🦮" },
      { name: "الكسلان", emoji: "🦥" },
      { name: "جاموس", emoji: "🐃" },
      { name: "خروف", emoji: "🐑" },
      { name: "طاووس", emoji: "🦚" },
      { name: "باعوضة", emoji: "🦟" },
      { name: "ببغاء", emoji: "🦜" },
      { name: "سلطعون", emoji: "🦀" },
      { name: "القرش", emoji: "🦈" },
      { name: "سمكة منتفخة", emoji: "🐡" }
    ];

    const animalFoods = [
      { name: "الماء", emoji: "🥤" },
      { name: "عصير تفاح", emoji: "🥫" },
      { name: "جوز الهند", emoji: "🥥" },
      { name: "الدونات", emoji: "🍩" },
      { name: "حلوى الكريمة", emoji: "🍰" },
      { name: "كعكة الأرز", emoji: "🍘" },
      { name: "سوشي", emoji: "🍣" },
      { name: "قريدس", emoji: "🍤" },
      { name: "بطاطا حلوة", emoji: "🍠" }
    ];

    // اختيار حيوان وطعام عشوائيين باستخدام الدالة getRandomElement
    const randomAnimal = getRandomElement(animals);
    const { name: animalName, emoji: animalEmoji } = randomAnimal;

    const randomFood = getRandomElement(animalFoods);
    const { name: foodName, emoji: foodEmoji } = randomFood;

    // توليد سعر وربح عشوائيين
    const minPrice = 1;
    const maxPrice = 80000;
    const minProfit = 6;
    const maxProfit = 1350;

    const animalPrice = Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;
    const animalProfit = Math.floor(Math.random() * (maxProfit - minProfit + 1)) + minProfit;

    const totalPrice = animalPrice + animalProfit;

    // إنشاء رسالة البيع
    const message = `
      لقد قمت ببيع الحيوان ${animalName} ${animalEmoji} مع الأكل ${foodName} ${foodEmoji}!\n
      📦 الثمن : دولار ${animalPrice}\n
      💰 العائدات : دولار ${animalProfit}\n
      📈 الثمن الإجمالي : دولار ${totalPrice}
    `;

    // إرسال رسالة البيع
    api.sendMessage(message, threadID);

    // إضافة قيمة البيع إلى رصيد المستخدم في الاقتصاد
    await Economy.increase(totalPrice, event.senderID);
  }
}

export default new SellAnimalFood();