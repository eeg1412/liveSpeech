<template>
  <div class="main">
    <transition name="fade">
      <div class="l2d_message" :style="messageStyle" v-if="chatShow">
        {{ chat }}
      </div>
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
      selModel: 'LiveroiD_A-Y01',
      modelList: {
        'LiveroiD_A-Y01': {
          x: 40,
          y: 0,
          messageBottom: '560px',
          messageBackground: 'rgb(81 88 101)',
          messageBorderColor: 'rgb(150 134 122)',
          url: '/live2d/LiveroiD_A-Y01/LiveroiD_A-Y01.model3.json',
          haveMotion: false,
        },
        'LiveroiD_A-Y02': {
          x: 40,
          y: 0,
          messageBottom: '560px',
          messageBackground: 'rgb(81 88 101)',
          messageBorderColor: 'rgb(150 134 122)',
          url: '/live2d/LiveroiD_A-Y02/LiveroiD_A-Y02.model3.json',
          haveMotion: false,
        },
      },
    }
  },
  mounted() {
    this.live2dInit()
    this.toSocket()
    // setTimeout(() => {
    //   this.mouthOpen = false
    // }, 5000)
  },
  computed: {
    selModelData() {
      const data = this.modelList[this.selModel]
      if (data) {
        return data
      }
      return {
        x: 0,
        y: 0,
        messageBottom: '600px',
        messageBackground: 'rgb(81 88 101)',
        messageBorderColor: 'rgb(150 134 122)',
        url: '',
        haveMotion: false,
      }
    },
    messageStyle() {
      return {
        bottom: this.selModelData.messageBottom,
        borderColor: this.selModelData.messageBorderColor,
        backgroundColor: this.selModelData.messageBackground,
      }
    },
  },
  methods: {
    randomMotion() {
      this.model.internalModel.motionManager.startRandomMotion('sleep', 1)
      this.sleepTimer = setTimeout(() => {
        this.randomMotion()
      }, 5000)
    },
    playVoice(voiceUrl) {
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
          case 'azure':
            url = voiceUrl
            break
          default:
            break
        }
        if (url) {
          const speech = new Audio(url)
          speech.load()
          speech
            .play()
            .then(() => {
              clearTimeout(this.sleepTimer)
              this.model.internalModel.motionManager.stopAllMotions()
              console.log(123)
              this.$nextTick(() => {
                this.mouthOpen = true
              })
            })
            .catch(() => {
              this.mouthOpen = false
              this.randomMotion()
            })

          speech.onended = () => {
            this.mouthOpen = false
            this.randomMotion()
          }
        }
      } else {
        clearTimeout(this.sleepTimer)
        this.model.internalModel.motionManager.stopAllMotions()
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

      const model = await Live2DModel.from(this.selModelData.url)
      this.model = model
      model.x = this.selModelData.x
      model.y = this.selModelData.y
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
          model.internalModel.coreModel.setParameterValueById(
            'ParamMouthOpenY',
            (Math.sin(performance.now() / 100) / 2 + 0.5) / 2
          )
          // model.internalModel.coreModel.setParameterValueById(
          //   'ParamMouthForm',
          //   Math.sin(performance.now() / 150) / 2 + 0.5
          // )
        } else {
          model.internalModel.coreModel.setParameterValueById(
            'ParamMouthOpenY',
            0
          )
        }
      })
      this.randomMotion()
      console.log(Live2DModel)
    },
  },
}
</script>

<style scoped>
.l2d_message {
  color: #fff;
  box-sizing: border-box;
  width: 350px;
  height: auto;
  margin: auto;
  padding: 7px;
  bottom: 600px;
  transform: translate(-50%, 0);
  left: 50%;
  text-align: center;
  border: 2px solid;
  border-color: rgb(150 134 122);
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
