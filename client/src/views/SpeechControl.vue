<template>
  <main>
    <Button
      :label="label"
      @mousedown="speechStart"
      @mouseup="speechStop"
      :class="{ 'p-button-help': mouseDownFlag }"
    />
  </main>
</template>

<script>
import Button from 'primevue/button'
import io from 'socket.io-client'

export default {
  name: 'SpeechControl',
  components: {
    Button,
  },
  data() {
    return {
      label: '按住说话',
      mouseDownFlag: false,
      socket: null,
    }
  },
  mounted() {
    this.toSocket()
  },
  methods: {
    speechStart() {
      this.label = '松开闭麦'
      this.mouseDownFlag = true
      this.socket.emit('controlSpeech', true)
    },
    speechStop() {
      this.label = '按住说话'
      this.mouseDownFlag = false
      this.socket.emit('controlSpeech', false)
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
  },
}
</script>

<style scoped>
main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  padding: 15px 30px;
  color: #fff;
  text-align: center;
  font-size: 22px;
  text-transform: uppercase;
  width: 300px;
}
</style>
