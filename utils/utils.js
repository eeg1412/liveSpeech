const sdk = require('microsoft-cognitiveservices-speech-sdk')
const { Buffer } = require('buffer')
const { PassThrough } = require('stream')
const fs = require('fs')

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

    synthesizer.speakTextAsync(
      text,
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
