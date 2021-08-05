<template>
  <main>
    <Panel header="语音获取" class="mb15">
      <div class="pb15">
        <div class="pb10">捕获模式：</div>
        <div class="flex justify-content-center">
          <div class="mr10">
            <label
              ><RadioButton
                name="getType"
                value="1"
                v-model="getType"
                @change="getTypeChange"
              />
              自由捕获</label
            >
          </div>
          <div class="mr10">
            <label
              ><RadioButton
                name="getType"
                value="2"
                v-model="getType"
                @change="getTypeChange"
              />
              按键捕获</label
            >
          </div>
          <div class="mr10">
            <label
              ><RadioButton
                name="getType"
                value="0"
                v-model="getType"
                @change="getTypeChange"
              />
              禁止捕获</label
            >
          </div>
        </div>
      </div>
      <div class="pb10">状态：{{ status }}</div>
      <div class="pb10">
        <Button
          :label="label"
          @mousedown="speechStart"
          @mouseup="speechStop"
          :class="{ 'p-button-help': mouseDownFlag }"
          v-show="getType === '2'"
        />
        <Button label="断句" @click="breakMessage" v-show="getType === '1'" />
      </div>
      <div class="p-inputgroup">
        <InputText placeholder="捕获语音" v-model="message" />
        <Button label="手动发送" @click="sendByUser" />
      </div>
    </Panel>
  </main>
</template>

<script>
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import RadioButton from 'primevue/radiobutton'
import Panel from 'primevue/panel'
import io from 'socket.io-client'

export default {
  name: 'SpeechControl',
  components: {
    Button,
    InputText,
    RadioButton,
    Panel,
  },
  data() {
    return {
      label: '按住说话',
      mouseDownFlag: false,
      socket: null,
      status: '未启动',
      getType: '0',
      message: '',
    }
  },
  mounted() {
    this.toSocket()
  },
  methods: {
    sendSpeechControlStatus() {
      this.socket.emit('sendSpeechControlStatus', { getType: this.getType })
    },
    getTypeChange() {
      this.sendSpeechControlStatus()
    },
    send(message) {
      this.socket.emit('send', { message: message })
    },
    sendByUser() {
      this.send(this.message)
      this.message = ''
    },
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
    breakMessage() {
      this.socket.emit('controlSpeech', false)
    },
    toSocket() {
      this.socket = io.connect('/socketchat')
      this.socket.on('connect', () => {
        console.log('已连接')
        this.socket.emit('wantHomeStatus')
        this.socket.on('getHomeStatus', (data) => {
          this.status = data.status
          this.getType = data.getType
        })
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
  text-align: center;
  text-transform: uppercase;
  width: 100%;
}
</style>
