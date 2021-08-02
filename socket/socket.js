const googleTTS = require('google-tts-api') // CommonJS
// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const fs = require('fs');
const util = require('util');
// Creates a client
const client = new textToSpeech.TextToSpeechClient();
async function quickStart (message) {
  // The text to synthesize
  const text = message;

  // Construct the request
  const request = {
    "audioConfig": {
      "audioEncoding": "MP3",
      "pitch": 0,
      "speakingRate": 1
    },
    "input": {
      "text": text
    },
    "voice": {
      "languageCode": "cmn-CN",
      "name": "cmn-CN-Wavenet-A"
    }
  }

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);
  return response.audioContent.toString('base64')
  // Write the binary audio content to a local file
  // const writeFile = util.promisify(fs.writeFile);
  // await writeFile('output.mp3', response.audioContent, 'binary');
  // console.log('Audio content written to file: output.mp3');
}

module.exports = (io) => {
  // console.log(io);
  const chat = io.of('/socketchat').on('connection', function (socket) {

    socket.emit('getSettingData', global.myAppConfig)
    socket.on('send', async (data) => {
      if (
        global.myAppConfig.cloudSel === 'googleNiang' &&
        global.myAppConfig.isSpeech
      ) {
        const url = await googleTTS.getAudioBase64(data.message, {
          lang: 'zh',
          slow: false,
          host: 'https://translate.google.com',
        })
        data['voiceUrl'] = 'data:audio/mp3;base64,' + url
      } else if (global.myAppConfig.cloudSel === 'googleCloud' &&
        global.myAppConfig.isSpeech) {
        url = await quickStart(data.message);
        data['voiceUrl'] = 'data:audio/mp3;base64,' + url
      }

      chat.emit('msg', data)
    })
    socket.on('settingData', (data) => {
      global.myAppConfig = data
      chat.emit('getSettingData', global.myAppConfig)
    })
  })
}
