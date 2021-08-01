<!-- home -->
<template>
  <div class="home">
    <div>头像URL：<input v-model="avatar" @blur="changeAvatar" /></div>
    <div>状态：{{ status }}</div>
    <div>捕获语音：{{ message }}</div>
  </div>
</template>

<script>
import io from 'socket.io-client'

export default {
  name: '',
  components: {},
  data() {
    return {
      message: '',
      avatar: '',
      socket: null,
      status: '初始化',
    }
  },
  computed: {},
  watch: {},
  methods: {
    changeAvatar() {
      localStorage.setItem('liveSpeechAvatar', this.avatar)
    },
    toSocket() {
      this.socket = io.connect('/socketchat')
      this.socket.on('connect', () => {
        console.log('已连接')
      })
      this.socket.on('disconnect', () => {
        console.log('已断开')
      })
    },
    send(message) {
      this.socket.emit('send', { message: message, avatar: this.avatar })
    },
    init() {
      this.avatar = localStorage.getItem('liveSpeechAvatar') || ''
      this.toSocket()
      const rec = new window.webkitSpeechRecognition()
      rec.continuous = true
      rec.interimResults = false
      rec.lang = 'cmn-Hans-CN'

      rec.onresult = (e) => {
        console.log('on result')
        console.log(e)
        for (var i = e.resultIndex; i < e.results.length; i++) {
          if (!e.results[i].isFinal) continue

          const { transcript } = e.results[i][0]
          console.log(`Recognised: ${transcript}`)
          this.message = transcript
          this.send(this.message)
        }

        // rec.stop()
      }

      rec.onstart = () => {
        console.log('on start')
        this.status = '初始化'
      }
      rec.onerror = () => {
        console.log('on start')
        this.status = '发生错误'
      }
      rec.onend = () => {
        console.log('on end')
        rec.start()
      }

      rec.onspeechstart = () => {
        console.log('on speech start')
      }
      rec.onspeechend = () => {
        console.log('on speech end')
      }

      rec.onosundstart = () => {
        console.log('on sound start')
      }
      rec.onsoundend = () => {
        console.log('on sound end')
      }

      rec.onaudiostart = () => {
        console.log('on audio start')
        this.status = '监听中...'
      }
      rec.onaudioend = () => {
        console.log('on audio end')
      }

      rec.start()
    },
  },
  created() {},
  mounted() {
    this.init()
  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeUnmount() {},
  unmounted() {},
  activated() {},
}
</script>
<style></style>
