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
                :disabled="mouseDownFlag"
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
                :disabled="mouseDownFlag"
                @change="getTypeChange"
              />
              鼠标按住</label
            >
          </div>
          <div class="mr10">
            <label
              ><RadioButton
                name="getType"
                value="3"
                v-model="getType"
                :disabled="mouseDownFlag"
                @change="getTypeChange"
              />
              鼠标移入</label
            >
          </div>
          <div class="mr10">
            <label
              ><RadioButton
                name="getType"
                value="4"
                v-model="getType"
                :disabled="mouseDownFlag"
                @change="getTypeChange"
              />
              按住空格</label
            >
          </div>
          <div class="mr10">
            <label
              ><RadioButton
                name="getType"
                value="0"
                v-model="getType"
                :disabled="mouseDownFlag"
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
        <Button
          label="鼠标移入说话"
          @mouseenter="speechStart"
          @mouseleave="speechStop"
          :class="{ 'p-button-help': mouseDownFlag }"
          v-show="getType === '3'"
        />
        <Button
          label="按住空格说话"
          :class="{ 'p-button-help': mouseDownFlag }"
          v-show="getType === '4'"
        />
      </div>
      <div class="p-inputgroup pb15">
        <InputText
          v-model="message"
          @focus="inputIsFocus = true"
          @blur="inputIsFocus = false"
        />
        <Button label="手动发送" @click="sendByUser" />
      </div>
      <div class="pb15 tl">
        <div class="pb10">发送队列：</div>
        <div v-show="messageList.length > 0">
          <ProgressBar
            class="countdown-progressbar"
            :value="(messageCountDown / messageMaxCountDown) * 100"
            :showValue="false"
          />
        </div>
        <div v-for="item in messageList" :key="item.id">
          <div class="message-list-message">{{ item.message }}</div>
          <Button
            label="删除"
            @click="deleteMessageList(item.id)"
            class="p-button-link"
          />
        </div>
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
import ProgressBar from 'primevue/progressbar'

export default {
  name: 'SpeechControl',
  components: {
    Button,
    InputText,
    RadioButton,
    Panel,
    ProgressBar,
  },
  data() {
    return {
      label: '按住说话',
      mouseDownFlag: false,
      socket: null,
      status: '未启动',
      getType: '0',
      message: '',
      keypressFlag: false,
      inputIsFocus: false,
      messageList: [],
      messageCountDown: 0,
      messageMaxCountDown: 0,
      messageCountDownTimer: null,
    }
  },
  mounted() {
    this.toSocket()
    this.initDocumentPress()
    this.initTimer()
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.keydownSpeechStart)
    document.removeEventListener('keyup', this.keyupSpeechStop)
    clearInterval(this.messageCountDownTimer)
  },
  methods: {
    deleteMessageList(id) {
      this.socket.emit('sendDeletMessageListId', { id: id })
    },
    initTimer() {
      this.messageCountDownTimer = setInterval(() => {
        if (this.messageCountDown !== 0 && !this.mouseDownFlag) {
          let newCount = this.messageCountDown - 66
          if (newCount < 0) {
            newCount = 0
          }
          this.messageCountDown = newCount
        }
      }, 66)
    },
    initDocumentPress() {
      document.addEventListener('keydown', this.keydownSpeechStart)
      document.addEventListener('keyup', this.keyupSpeechStop)
    },
    keydownSpeechStart(event) {
      if (
        !this.keypressFlag &&
        event.keyCode === 32 &&
        !this.inputIsFocus &&
        this.getType === '4'
      ) {
        this.speechStart()
        this.keypressFlag = true
      }
    },
    keyupSpeechStop(event) {
      if (
        this.keypressFlag &&
        event.keyCode === 32 &&
        !this.inputIsFocus &&
        this.getType === '4'
      ) {
        this.speechStop()
        this.keypressFlag = false
      }
    },
    sendSpeechControlStatus() {
      this.socket.emit('sendSpeechControlStatus', { getType: this.getType })
    },
    getTypeChange() {
      this.sendSpeechControlStatus()
    },
    send(message) {
      this.socket.emit('sendSpeechControlText', { message: message })
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
        this.socket.on('getMessageListData', (data) => {
          this.messageCountDown = data.messageCountDown
          this.messageMaxCountDown = data.messageMaxCountDown
          this.messageList = data.messageList
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
