<!-- chat -->
<template>
  <div>
    <transition name="fade">
      <div class="kaiwa" v-if="chatShow">
        <figure class="kaiwa-img-right">
          <img :src="avatar" alt="no-img2" />
          <!-- <figcaption class="kaiwa-img-description">
          主播
        </figcaption> -->
        </figure>

        <div class="kaiwa-text-left">
          <p class="kaiwa-text">
            {{ chat || '...' }}
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import io from 'socket.io-client'

export default {
  name: 'chat',
  components: {},
  data() {
    return {
      chat: '',
      chatShow: false,
      chatShowTimer: null,
      socket: null,
      isSpeech: false,
      avatar: 'https://i.loli.net/2021/08/01/SFHndyel1UJx6wL.png',
      cloudSel: 'googleNiang',
      appkey: '',
      AccessToken: '',
      voice: 'xiaoyun',
    }
  },
  computed: {},
  watch: {},
  methods: {
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
          default:
            break
        }
        if (url) {
          const speech = new Audio(url)
          speech.load()
          speech.play()
        }
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
        this.avatar =
          data.avatar || 'https://i.loli.net/2021/08/01/SFHndyel1UJx6wL.png'
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
  },
  created() {
    this.toSocket()
  },
  mounted() {},
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeUnmount() {
    this.socket.close()
  },
  unmounted() {},
  activated() {},
}
</script>
<style>
.kaiwa {
  margin-bottom: 25px;
}
/* 左画像 */
.kaiwa-img-left {
  margin: 0;
  float: left;
  width: 60px;
  height: 60px;
  margin-right: -70px;
}
/* 右画像 */
.kaiwa-img-right {
  margin: 0;
  margin-right: 5px;
  float: right;
  width: 60px;
  height: 60px;
  margin-left: -70px;
}
.kaiwa figure img {
  width: 100%;
  height: 100%;
  border: 1px solid #aaa;
  border-radius: 50%;
  margin: 0;
}
/* 画像の下のテキスト */
.kaiwa-img-description {
  padding: 17px 0 0;
  font-size: 15px;
  text-align: center;
  position: relative;
  bottom: 15px;
}
/* 左からの吹き出しテキスト */
.kaiwa-text-right {
  position: relative;
  margin-left: 80px;
  padding: 10px;
  border-radius: 10px;
  background: #eee;
  margin-right: 12%;
  float: left;
}
/* 右からの吹き出しテキスト */
.kaiwa-text-left {
  position: relative;
  margin-right: 80px;
  padding: 10px;
  border-radius: 10px;
  background-color: rgb(254 244 255 / 80%);
  margin-left: 12px;
  min-height: 45px;
  font-size: 25px;
  float: right;
  box-sizing: border-box;
  opacity: 1;
}
p.kaiwa-text {
  margin: 0 0 20px;
}
p.kaiwa-text:last-child {
  margin-bottom: 0;
}
/* 左の三角形を作る */
.kaiwa-text-right:before {
  position: absolute;
  content: '';
  border: 10px solid transparent;
  top: 15px;
  left: -20px;
}
.kaiwa-text-right:after {
  position: absolute;
  content: '';
  border: 10px solid transparent;
  border-right: 10px solid #eee;
  top: 15px;
  left: -19px;
}
/* 右の三角形を作る */
.kaiwa-text-left:before {
  position: absolute;
  content: '';
  border: 10px solid transparent;
  top: 15px;
  right: -20px;
}
.kaiwa-text-left:after {
  position: absolute;
  content: '';
  border: 10px solid transparent;
  border-left: 10px solid rgb(254 244 255 / 80%);
  top: 15px;
  right: -20px;
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
