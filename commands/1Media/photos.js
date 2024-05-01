import axios from 'axios';

class PickupLine {
  name = "اعجاب";
  author = "مجهول";
  role = "member";
  description = "اجعل فتاة تحبك باستخدام منشن";
  aliases = ["خط"];

  async execute({ api, event }) {
    try {
      const mention = Object.keys(event.mentions);

      if (mention.length !== 1) {
        api.sendMessage(' ⚠️ | قم بعمل منشن لفتاة ما', event.threadID, event.messageID);
        return;
      }

      const targetID = mention[0];
      const userInfo = await api.getUserInfo(targetID);
      const mentionName = userInfo[targetID]?.name;

      if (!mentionName) {
        api.sendMessage('Failed to get user info.', event.threadID, event.messageID);
        return;
      }

      const response = await axios.get('https://vinuxd.vercel.app/api/pickup');

      if (response.status !== 200 || !response.data || !response.data.pickup) {
        throw new Error('Invalid or missing response from pickup line API');
      }

      const pickupline = response.data.pickup.replace('{name}', mentionName);
      const message = `${mentionName}, ${pickupline} ?`;

      // Translate message from English to Arabic
      const translationResponse = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(message)}`);
      const translatedMessage = translationResponse?.data?.[0]?.[0]?.[0] || message;

      const attachment = await api.sendMessage({
        body: translatedMessage,
        mentions: [{
          tag: event.senderID,
          id: event.senderID,
          fromIndex: translatedMessage.indexOf(mentionName),
          toIndex: translatedMessage.indexOf(mentionName) + mentionName.length,
        }],
      }, event.threadID, event.messageID);

      if (!attachment || !attachment.messageID) {
        throw new Error('Failed to send message');
      }

      console.log(`Sent pickup line as a reply with message ID ${attachment.messageID}`);
    } catch (error) {
      console.error(`Failed to send pickup line: ${error.message}`);
      api.sendMessage('Sorry, something went wrong while trying to impress. Please try again later.', event.threadID);
    }
  }
}

export default new PickupLine();