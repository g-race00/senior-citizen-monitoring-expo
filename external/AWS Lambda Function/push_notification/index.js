const { Expo } = require('expo-server-sdk')

module.exports.handler = async (event, context, callback) => {
  
  console.log(event);

    const { recipients, sound, title, body, data } = event;
  
    // Request requires recipitents and body
    if (!recipients || !recipients.length || !body) {
      const response = {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Notifications require a list of recipients and a body message'
        })
      };
      return callback(null, response);
    }
  
    // Create a new Expo SDK client
    const expo = new Expo()
  
    let messages = []
    for (let pushToken of recipients) {
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }
  
      const messageData = {
        to: pushToken,
        body
      };
      if (sound) messageData.sound = sound;
      if (title) messageData.title = title;
      if (data) messageData.data = data;
  
      // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
      messages.push(messageData);
    }
  
    const chunks = expo.chunkPushNotifications(messages);
  
    const sendNotifications = async () => {
      for (let chunk of chunks) {
        await expo.sendPushNotificationsAsync(chunk);
      }
    };
  
    await sendNotifications()
      .then(() => {
        const response = {
          statusCode: 200,
          body: JSON.stringify({ message: 'Notifications sent successfully' })
        };
        return callback(null, response);
      }).catch(error => {
        console.log('error: ', error);
        const response = {
          statusCode: 500,
          body: JSON.stringify({ message: `There was an error: ${error.message}` })
        };
        return callback(null, response);
      })
}
  