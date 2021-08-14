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
      <Divider type="dashed" />
      <div class="flex justify-content-center pb10">
        <div class="mr10">
          <label
            ><RadioButton
              name="statementSel"
              value="1"
              v-model="statementSel"
            />
            常用语句</label
          >
        </div>
        <div class="mr10">
          <label
            ><RadioButton
              name="statementSel"
              value="2"
              v-model="statementSel"
            />
            临时语句</label
          >
        </div>

        <div class="mr10">
          <label
            ><RadioButton
              name="statementSel"
              value="0"
              v-model="statementSel"
            />
            立刻发送</label
          >
        </div>
      </div>
      <div class="p-inputgroup">
        <InputText
          v-model="message"
          @focus="inputIsFocus = true"
          @blur="inputIsFocus = false"
        />
        <Button
          :label="statementSel === '0' ? '发送' : '添加'"
          @click="sendByUser"
        />
      </div>
      <Divider
        type="dashed"
        v-show="commonStatements.length > 0 || temporaryStatement.length > 0"
      />
      <div class="tl" v-show="commonStatements.length > 0">
        <div>常用语句：</div>
        <div v-for="(item, index) in commonStatements" :key="index">
          {{ item }}
          <Button
            label="立刻发送"
            class="p-button-text nopadding-btn"
            @click="sendCommonStatements(item)"
          />
          <Button
            label="删除"
            class="p-button-text p-button-danger nopadding-btn"
            @click="deleteCommonStatements(index)"
          />
        </div>
      </div>
      <Divider type="dashed" v-show="commonStatements.length > 0" />
      <div class="tl" v-show="temporaryStatement.length > 0">
        <div>临时语句：</div>
        <div v-for="(item, index) in temporaryStatement" :key="index">
          {{ item }}
          <Button
            label="立刻发送"
            class="p-button-text nopadding-btn"
            @click="sendTemporaryStatement(item, index)"
          />
          <Button
            label="删除"
            class="p-button-text p-button-danger nopadding-btn"
            @click="deleteTemporaryStatement(index)"
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
import Divider from 'primevue/divider'
import Panel from 'primevue/panel'
import io from 'socket.io-client'

export default {
  name: 'SpeechControl',
  components: {
    Button,
    InputText,
    RadioButton,
    Panel,
    Divider,
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
      statementSel: '0',
      commonStatements: [],
      temporaryStatement: [],
    }
  },
  mounted() {
    this.toSocket()
    this.initDocumentPress()
    this.initCommonStatements()
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.keydownSpeechStart)
    document.removeEventListener('keyup', this.keyupSpeechStop)
  },
  methods: {
    sendCommonStatements(text) {
      this.send(text)
    },
    sendTemporaryStatement(text, index) {
      this.send(text)
      this.deleteTemporaryStatement(index)
    },
    initCommonStatements() {
      const liveSpeechCommonStatementsStr =
        localStorage.getItem('liveSpeechCommonStatements') || '[]'
      this.commonStatements = JSON.parse(liveSpeechCommonStatementsStr)
    },
    deleteCommonStatements(i) {
      this.commonStatements.splice(i, 1)
      localStorage.setItem(
        'liveSpeechCommonStatements',
        JSON.stringify(this.commonStatements)
      )
    },
    deleteTemporaryStatement(i) {
      this.temporaryStatement.splice(i, 1)
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
      this.socket.emit('send', { message: message })
    },
    sendByUser() {
      switch (this.statementSel) {
        case '0':
          this.send(this.message)
          break
        case '1':
          this.commonStatements.push(this.message)
          localStorage.setItem(
            'liveSpeechCommonStatements',
            JSON.stringify(this.commonStatements)
          )
          break
        case '2':
          this.temporaryStatement.push(this.message)
          break

        default:
          break
      }

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
  width: 100%;
}
.nopadding-btn {
  padding: 0;
  margin-right: 8px;
}
</style>
