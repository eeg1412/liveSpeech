const googleTTS = require('google-tts-api') // CommonJS
// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech')
const { azuretextToSpeech } = require('../utils/utils')

// Import other required libraries
const fs = require('fs')
const util = require('util')
// Creates a client
const client = new textToSpeech.TextToSpeechClient()
async function quickStart (message) {
  // The text to synthesize
  const text = message

  // Construct the request
  const request = {
    audioConfig: {
      audioEncoding: 'MP3',
      pitch: Number(global.myAppConfig.googlePitch),
      speakingRate: Number(global.myAppConfig.googleSpeakingRate),
    },
    input: {
      text: text,
    },
    voice: {
      languageCode: 'cmn-CN',
      name: global.myAppConfig.googleVoice || 'cmn-CN-Wavenet-A',
    },
  }

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request)
  return response.audioContent.toString('base64')
  // Write the binary audio content to a local file
  // const writeFile = util.promisify(fs.writeFile);
  // await writeFile('output.mp3', response.audioContent, 'binary');
  // console.log('Audio content written to file: output.mp3');
}

function deleteSystemSetting (setting) {
  const str = JSON.stringify(setting)
  const obj = JSON.parse(str)
  delete obj.azureKey
  delete obj.azureRegion
  // console.log(obj)
  return obj
}

let chatList = []

async function sendData (chat) {
  const data = chatList[0]
  if (global.myAppConfig.isSpeech) {
    let url = ''
    switch (global.myAppConfig.cloudSel) {
      case 'googleNiang':
        url = await googleTTS.getAudioBase64(data.message, {
          lang: 'zh',
          slow: false,
          host: 'https://translate.google.com',
        })
        data['voiceUrl'] = 'data:audio/mp3;base64,' + url
        break
      case 'googleCloud':
        url = await quickStart(data.message)
        data['voiceUrl'] = 'data:audio/mp3;base64,' + url
        break
      case 'azure':
        url = await azuretextToSpeech(
          global.myAppConfig.azureKey,
          global.myAppConfig.azureRegion,
          global.myAppConfig.azureVoice,
          data.message
        )
        data['voiceUrl'] = 'data:audio/mp3;base64,' + url
        break
      default:
        break
    }
  }
  chat.emit('msg', JSON.parse(JSON.stringify(data)))
  chatList = chatList.filter((item) => {
    return item.id !== data.id
  })
  if (chatList.length > 0) {
    sendData(chat)
  }
}

module.exports = (io) => {
  // console.log(io);
  const chat = io.of('/socketchat').on('connection', function (socket) {
    socket.emit('getSettingData', deleteSystemSetting(global.myAppConfig))
    socket.on('send', async (data) => {
      data["id"] = String(new Date().getTime()) + "-" + String(Math.floor(Math.random() * 1000))
      chatList.push(data)
      if (chatList.length === 1) {
        sendData(chat)
      }
    })
    socket.on('controlSpeech', (data) => {
      chat.emit('getControlSpeech', data)
    })
    socket.on('settingData', (data) => {
      global.myAppConfig = data
      chat.emit('getSettingData', deleteSystemSetting(global.myAppConfig))
    })

    socket.on('sendHomeStatus', (data) => {
      chat.emit('getHomeStatus', data)
    })
    socket.on('wantHomeStatus', (data) => {
      chat.emit('speechWantHomeStatus', data)
    })
    socket.on('sendSpeechControlStatus', (data) => {
      chat.emit('getSpeechControlStatus', data)
    })
    socket.on('sendMessageListData', (data) => {
      chat.emit('getMessageListData', data)
    })
    socket.on('sendSpeechControlText', (data) => {
      chat.emit('getSpeechControlText', data)
    })
    socket.on('sendMessageListId', (data) => {
      chat.emit('getMessageListId', data)
    })
  })
}
