<template>
  <div class="main">
    <transition name="fade">
      <div class="l2d_message" v-if="chatShow">{{ chat }}</div>
    </transition>
    <canvas id="canvas" width="200" height="240"></canvas>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
window.PIXI = PIXI
const { Live2DModel } = require('pixi-live2d-display')
import io from 'socket.io-client'

export default {
  name: 'Live2d',
  components: {},
  data() {
    return {
      mouthOpen: false,
      sleepTimer: null,
      chatTimer: null,
      mode: null,
      chat: '',
      chatShow: false,
      chatShowTimer: null,
      socket: null,
      isSpeech: false,
      cloudSel: 'googleNiang',
      appkey: '',
      AccessToken: '',
      voice: 'xiaoyun',
    }
  },
  mounted() {
    this.live2dInit()
    this.toSocket()
    // setTimeout(() => {
    //   this.mouthOpen = false
    // }, 5000)
  },
  methods: {
    randomMotion() {
      this.model.internalModel.motionManager.startRandomMotion('sleep', 1)
      this.sleepTimer = setTimeout(() => {
        this.randomMotion()
      }, 5000)
    },
    playVoice(voiceUrl) {
      clearTimeout(this.sleepTimer)
      this.model.internalModel.motionManager.stopAllMotions()
      if (this.isSpeech) {
        let url = ''
        switch (this.cloudSel) {
          case 'aliyun':
            url = `https://nls-gateway.cn-shanghai.aliyuncs.com/stream/v1/tts?appkey=${
              this.appkey
            }&token=${this.AccessToken}&text=${encodeURI(
              this.chat
            )}&format=mp3&sample_rate=16000&voice=${this.voice}`
            break
          case 'googleNiang':
            url = voiceUrl
            break
          case 'googleCloud':
            url = voiceUrl
            break
          default:
            break
        }
        if (url) {
          const speech = new Audio(url)
          speech.load()
          speech.play()
          this.mouthOpen = true
          speech.onended = () => {
            this.mouthOpen = false
            this.randomMotion()
          }
        }
      } else {
        clearTimeout(this.chatTimer)
        this.mouthOpen = true
        this.chatTimer = setTimeout(() => {
          this.mouthOpen = false
          this.randomMotion()
        }, this.chat.length * 500)
      }
    },
    toSocket() {
      this.socket = io.connect('/socketchat')
      this.socket.on('msg', (data) => {
        console.log(data)
        this.chat = data.message
        this.$nextTick(() => {
          this.chatShow = true
          this.playVoice(data.voiceUrl)
        })
        clearTimeout(this.chatShowTimer)
        this.chatShowTimer = setTimeout(() => {
          this.chatShow = false
        }, this.chat.length * 1000)
      })
      this.socket.on('getSettingData', (data) => {
        console.log(data)
        this.isSpeech = data.isSpeech ? true : false

        this.cloudSel = data.cloudSel || 'googleNiang'
        this.appkey = data.appkey || ''
        this.AccessToken = data.AccessToken || ''
        this.voice = data.voice || 'xiaoyun'
      })
      this.socket.on('connect', () => {
        console.log('已连接')
      })
      this.socket.on('disconnect', () => {
        console.log('已断开')
      })
    },
    async live2dInit() {
      const PIXI = window.PIXI

      const app = new PIXI.Application({
        view: document.getElementById('canvas'),
        width: 400,
        height: 575,
        transparent: true,
      })

      const model = await Live2DModel.from(
        '/live2d/hiyori/hiyori_pro_t10.model3.json'
      )
      this.model = model
      app.stage.addChild(model)

      // transforms
      console.log(model.width)
      const scaleX = 400 / model.width
      const scaleY = 575 / model.height

      // fit the window
      model.scale.set(Math.min(scaleX, scaleY))

      //   model.y = innerHeight * 0.1

      console.log(model)
      window.l2dmodel = model

      //   let mouthValue = 0
      app.ticker.add(() => {
        // model.internalModel.coreModel._model.parameters.values[4] = 0
        if (this.mouthOpen) {
          model.internalModel.coreModel.setParameterValueByIndex(
            19,
            Math.sin(performance.now() / 100) / 2 + 0.5
          )
          model.internalModel.coreModel.setParameterValueByIndex(
            18,
            Math.sin(performance.now() / 150) / 2 + 0.5
          )
        } else {
          model.internalModel.coreModel.setParameterValueByIndex(19, 0)
        }
      })

      console.log(Live2DModel)
    },
  },
}
</script>

<style scoped>
.l2d_message {
  color: #fff;
  box-sizing: border-box;
  width: 400px;
  height: auto;
  margin: auto;
  padding: 7px;
  bottom: 548px;
  transform: translate(-50%, 0);
  left: 50%;
  text-align: center;
  border: 2px solid rgb(150 134 122);
  border-radius: 5px;
  background-color: rgb(81 88 101);
  font-size: 24px;
  text-transform: uppercase;
  overflow: hidden;
  position: absolute;
}
.main {
  position: absolute;
  left: 50%;
  bottom: 0px;
  transform: translate(-50%, 0);
  color: #fff;
  text-align: center;
  font-size: 22px;
  text-transform: uppercase;
  width: 400px;
}
/* 回り込み解除 */
.kaiwa:after,
.kaiwa:before {
  clear: both;
  content: '';
  display: block;
}
.fade-leave-active,
.fade-enter-active {
  transition: all 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
