const sdk = require('microsoft-cognitiveservices-speech-sdk')
const { Buffer } = require('buffer')
const { PassThrough } = require('stream')
const fs = require('fs')

const escapeHTML = (text) => {
  var replacement = function (ch) {
    var characterReference = {
      '"': '&quot;',
      '&': '&amp;',
      "'": '&#39;',
      '<': '&lt;',
      '>': '&gt;',
    }

    return characterReference[ch]
  }

  return text.replace(/["&'<>]/g, replacement)
}

/**
 * Node.js server code to convert text to speech
 * @returns stream
 * @param {*} key your resource key
 * @param {*} region your resource region
 * @param {*} text text to convert to audio/speech
 * @param {*} filename optional - best for long text - temp file for converted speech/audio
 */
const azuretextToSpeech = async (key, region, voice, text, filename) => {
  // convert callback function to promise
  return new Promise((resolve, reject) => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(key, region)
    speechConfig.speechSynthesisOutputFormat = 4 // mp3
    speechConfig.speechSynthesisVoiceName = voice
    let audioConfig = null

    if (filename) {
      audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename)
    }

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig)
    let ssmlTem = fs.readFileSync('./utils/azureSSML.xml', 'utf8')
    const { azureRate, azurePitch } = global.myAppConfig
    ssmlTem = ssmlTem.replace('{{azureRate}}', azureRate / 100)
    ssmlTem = ssmlTem.replace('{{azureVoice}}', voice)
    ssmlTem = ssmlTem.replace(
      '{{azurePitch}}',
      azurePitch > 0 ? `+${azurePitch}Hz` : `${azurePitch}Hz`
    )
    ssmlTem = ssmlTem.replace('{{azureText}}', escapeHTML(text))

    synthesizer.speakSsmlAsync(
      ssmlTem,
      (result) => {
        const { audioData } = result

        synthesizer.close()

        if (filename) {
          // return stream from file
          const audioFile = fs.createReadStream(filename)
          resolve(audioFile)
        } else {
          // return stream from memory
          const data = Buffer.from(audioData).toString('base64')
          resolve(data)
        }
      },
      (error) => {
        synthesizer.close()
        reject(error)
      }
    )
  })
}

module.exports = {
  azuretextToSpeech,
}
