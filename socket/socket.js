const googleTTS = require('google-tts-api') // CommonJS

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
      }

      chat.emit('msg', data)
    })
    socket.on('settingData', (data) => {
      global.myAppConfig = data
      chat.emit('getSettingData', global.myAppConfig)
    })
  })
}
