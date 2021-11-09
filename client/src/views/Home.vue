<!-- home -->
<template>
  <div class="home">
    <ConfirmDialog></ConfirmDialog>
    <!-- <div>头像URL：<input v-model="avatar" @blur="changeAvatar" /></div> -->
    <Panel header="语音获取" class="mb15">
      <div class="pb15">
        <div class="pb10">捕获模式：</div>
        <div class="flex">
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
              鼠标按住</label
            >
          </div>
          <div class="mr10">
            <label
              ><RadioButton
                name="getType"
                value="3"
                v-model="getType"
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
                @change="getTypeChange"
              />
              禁止捕获</label
            >
          </div>
        </div>
        <div v-if="analyser && getType === '1'">
          <div class="mt10 mb10">
            <ProgressBar :value="volLevel / voiceSizeSensitivity" />
          </div>
          <div class="mb10">
            <div class="pb10">阈值({{ voiceThreshold }})：</div>
            <Slider
              v-model="voiceThreshold"
              :min="0"
              :max="100"
              @change="voiceThresholdChange"
            />
          </div>
          <div class="mb10">
            <div class="pb10">灵敏度({{ -minDecibels }}dB)：</div>
            <Slider
              v-model="minDecibels"
              @change="minDecibelsChange"
              :min="31"
              :max="100"
            />
          </div>
          <div class="mb10">
            <div class="pb10">断句延时(ms)：</div>
            <InputNumber
              v-model.number="breakTime"
              showButtons
              buttonLayout="horizontal"
              :step="1"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
              :min="100"
              :max="10000"
            />
          </div>

          <div class="mb10">
            <div class="pb10">
              立即发送语音控制：<InputSwitch v-model="speedSendFlag" />
            </div>
            <div v-show="speedSendFlag">
              <InputText
                placeholder="当语音说这个词的时候就会立即发送语音"
                v-model="speedSendText"
                class="input-text-full"
              />
            </div>
          </div>

          <div class="mb10">
            <div class="pb10">
              删除语音控制：<InputSwitch v-model="speedDeleteFlag" />
            </div>
            <div v-show="speedDeleteFlag">
              <InputText
                placeholder="当语音说这个词的时候就会删除语音"
                v-model="speedDeleteText"
                class="input-text-full"
              />
            </div>
          </div>
        </div>
        <div>
          <div class="mb10 mt10">
            <div class="pb10">延迟发送(ms)：</div>
            <InputNumber
              v-model.number="sendTimeDaly"
              showButtons
              buttonLayout="horizontal"
              :step="1"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
              :min="0"
            />
          </div>
        </div>
        <div class="pb10 pt10">
          <Button
            label="复制控制器URL"
            class="p-button-raised p-button-text p-button-sm p-button-mr10"
            @click="copyControlUrl('speechcontrol')"
          />
          <Button
            label="打开控制器"
            class="p-button-raised p-button-text p-button-sm"
            @click="openControlUrl('speechcontrol')"
          />
        </div>
      </div>
      <div class="pb10">状态：{{ status }}</div>
      <div class="p-inputgroup mb10">
        <InputText
          placeholder="编辑内容"
          v-model="message"
          @keypress.enter="sendByUser"
        />
        <Button
          label="手动发送"
          @click="sendByUser"
          @keypress.enter="sendByUser"
        />
      </div>
      <div v-show="sendTimeDaly > 0">
        <div>发送队列：</div>
        <div v-for="item in sendList" :key="item.id" class="send-list">
          <div>
            {{ item.message }}
            <Button
              label="立刻发送"
              class="p-button-text nopadding-btn"
              @click="quickSend(item)"
            />
            <Button
              label="编辑"
              class="p-button-text p-button-help nopadding-btn"
              @click="editMessage(item)"
            />
            <Button
              label="删除"
              class="p-button-text p-button-danger nopadding-btn"
              @click="deleteMessage(item.id)"
            />
          </div>
          <div class="pt5">
            <ProgressBar
              class="send-time-progress"
              :showValue="false"
              :value="
                (1 -
                  (item.sendTime - timeNow) / (item.sendTime - item.addTime)) *
                  100
              "
            />
          </div>
        </div>
      </div>
    </Panel>
    <Panel header="全局设置" class="mb15">
      <form>
        <div class="pb15">
          <div class="pb10">
            头像URL：<Avatar
              shape="circle"
              :image="avatarPre"
              v-if="avatarPre"
            />
          </div>

          <div>
            <InputText
              class="input-text-full"
              @blur="changeAvatar"
              placeholder="设置头像URL"
              v-model="avatar"
            />
          </div>
        </div>
        <div class="pb15">
          <div class="pb10">
            live2d模型：
          </div>

          <div class="flex">
            <div class="mr10">
              <label
                ><RadioButton
                  name="selModel"
                  value="LiveroiD_A-Y01"
                  v-model="selModel"
                />
                LiveroiD_A-Y01</label
              >
            </div>
            <div class="mr10">
              <label
                ><RadioButton
                  name="selModel"
                  value="LiveroiD_A-Y02"
                  v-model="selModel"
                />
                LiveroiD_A-Y02</label
              >
            </div>
            <div class="mr10">
              <label
                ><RadioButton
                  name="selModel"
                  value="hiyori"
                  v-model="selModel"
                />
                桃瀬ひより</label
              >
            </div>
          </div>
        </div>
        <div class="pb15">
          <div class="pb10">是否语音播报：</div>

          <div><InputSwitch v-model="isSpeech" /></div>
        </div>
        <div v-show="isSpeech">
          <div class="pb15">
            <div class="pb10">语音提供商：</div>
            <div>
              <SelectButton
                v-model="cloudSel"
                :options="cloudList"
                optionLabel="name"
                optionValue="value"
              />
            </div>
          </div>
          <div v-show="cloudSel === 'azure'">
            <div class="pb15">
              <div class="pb10">
                声源（参考<a
                  href="https://docs.microsoft.com/zh-cn/azure/cognitive-services/speech-service/language-support#text-to-speech"
                  target="_blank"
                  >Azure文档</a
                >）：
              </div>
              <div>
                <InputText class="input-text-full" v-model="azureVoice" />
              </div>
            </div>
            <div class="pb15">
              <div class="pb10">密钥：</div>
              <div>
                <Password
                  :feedback="false"
                  class="input-text-full"
                  v-model="azureKey"
                  toggleMask
                />
              </div>
            </div>
            <div class="pb15">
              <div class="pb10">位置/区域：</div>
              <div>
                <Password
                  :feedback="false"
                  class="input-text-full"
                  v-model="azureRegion"
                  toggleMask
                />
              </div>
            </div>
            <div class="pb15">
              <div class="pb10">语速({{ azureRate }}%)：</div>
              <div>
                <InputNumber
                  v-model.number="azureRate"
                  showButtons
                  buttonLayout="horizontal"
                  :step="1"
                  incrementButtonIcon="pi pi-plus"
                  decrementButtonIcon="pi pi-minus"
                  :min="10"
                  :max="300"
                />
              </div>
            </div>
            <div class="pb15">
              <div class="pb10">
                语调({{
                  azurePitch > 0 ? `+${azurePitch}` : `${azurePitch}`
                }}Hz)：
              </div>
              <div>
                <InputNumber
                  v-model.number="azurePitch"
                  showButtons
                  buttonLayout="horizontal"
                  :step="1"
                  incrementButtonIcon="pi pi-plus"
                  decrementButtonIcon="pi pi-minus"
                  :min="-200"
                  :max="200"
                />
              </div>
            </div>
          </div>
          <div v-show="cloudSel === 'googleCloud'">
            <div class="pb15">
              <div class="pb10">
                声源（参考<a
                  href="https://cloud.google.com/text-to-speech"
                  target="_blank"
                  >谷歌云文档</a
                >）：
              </div>
              <div>
                <InputText class="input-text-full" v-model="googleVoice" />
              </div>
            </div>
            <div class="pb15">
              <div class="pb10">
                语速：
              </div>
              <div>
                <InputNumber
                  v-model.number="googleSpeakingRate"
                  showButtons
                  buttonLayout="horizontal"
                  :step="0.01"
                  incrementButtonIcon="pi pi-plus"
                  decrementButtonIcon="pi pi-minus"
                  :min="0.25"
                  :max="4"
                />
              </div>
            </div>
            <div class="pb15">
              <div class="pb10">
                语调：
              </div>
              <div>
                <InputNumber
                  v-model.number="googlePitch"
                  showButtons
                  buttonLayout="horizontal"
                  :step="1"
                  incrementButtonIcon="pi pi-plus"
                  decrementButtonIcon="pi pi-minus"
                  :min="-20"
                  :max="20"
                />
              </div>
            </div>
          </div>
          <div v-show="cloudSel === 'aliyun'">
            <div class="pb15">
              <div class="pb10">APPKEY：</div>
              <div>
                <Password
                  :feedback="false"
                  class="input-text-full"
                  v-model="appkey"
                  toggleMask
                />
              </div>
            </div>
            <div class="pb15">
              <div class="pb10">AccessToken：</div>
              <div>
                <Password
                  :feedback="false"
                  class="input-text-full"
                  v-model="AccessToken"
                  toggleMask
                />
              </div>
            </div>
            <div class="pb15">
              <div class="pb10">
                声源（参考<a
                  href="https://help.aliyun.com/document_detail/84435.htm?spm=a2c4g.11186623.2.22.28cf4a9c70HlT2#topic-2572243"
                  target="_blank"
                  >阿里云文档</a
                >）：
              </div>
              <div><InputText class="input-text-full" v-model="voice" /></div>
            </div>
          </div>
        </div>
        <Button label="发送设置" class="p-button-sm" @click="saveSetting" />
      </form>
    </Panel>
    <Panel header="获取地址">
      <div class="pb15">
        <div class="pb10">气泡聊天窗：</div>
        <div>
          <Button
            label="复制聊天窗URL"
            class="p-button-raised p-button-text p-button-sm p-button-mr10"
            @click="copyControlUrl('chat')"
          />
          <Button
            label="打开聊天窗"
            class="p-button-raised p-button-text p-button-sm"
            @click="openControlUrl('chat')"
          />
        </div>
      </div>
      <div class="pb15">
        <div class="pb10">live2d：</div>
        <div>
          <Button
            label="复制live2d URL"
            class="p-button-raised p-button-text p-button-sm p-button-mr10"
            @click="copyControlUrl('live2d')"
          />
          <Button
            label="打开live2d"
            class="p-button-raised p-button-text p-button-sm"
            @click="openControlUrl('live2d')"
          />
        </div>
      </div>
    </Panel>
    <Toast position="top-center" />
  </div>
</template>

<script>
import io from 'socket.io-client'
import * as workerTimers from 'worker-timers'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Panel from 'primevue/panel'
import Avatar from 'primevue/avatar'
import InputSwitch from 'primevue/inputswitch'
import SelectButton from 'primevue/selectbutton'
// import Listbox from 'primevue/listbox';
import Toast from 'primevue/toast'
import RadioButton from 'primevue/radiobutton'
import useClipboard from 'vue-clipboard3'
import InputNumber from 'primevue/inputnumber'
import Password from 'primevue/password'
import AudioAPI from '../utils/AudioAPI.js'
import ProgressBar from 'primevue/progressbar'
import Slider from 'primevue/slider'
import ConfirmDialog from 'primevue/confirmdialog'

export default {
  name: 'Home',
  components: {
    InputText,
    Button,
    Panel,
    Avatar,
    InputSwitch,
    SelectButton,
    Toast,
    RadioButton,
    InputNumber,
    Password,
    ProgressBar,
    Slider,
    ConfirmDialog,
  },
  data() {
    return {
      rec: null,
      message: '',
      avatarPre: '',
      socket: null,
      status: '未启动',
      getType: '0',
      cloudList: [
        {
          name: '谷歌娘(仅海外)',
          value: 'googleNiang',
        },
        {
          name: '谷歌云(仅海外)',
          value: 'googleCloud',
        },
        {
          name: '阿里云智能语音交互',
          value: 'aliyun',
        },
        {
          name: '微软Azure',
          value: 'azure',
        },
      ],
      isSpeech: false,
      avatar: '',
      cloudSel: 'googleNiang',
      appkey: '',
      AccessToken: '',
      voice: 'xiaoyun',
      googleVoice: 'cmn-CN-Wavenet-A',
      googlePitch: 0,
      googleSpeakingRate: 1,
      azureKey: '',
      azureRegion: '',
      azureVoice: 'zh-CN-XiaoxiaoNeural',
      azureRate: 100,
      azurePitch: 0,
      selModel: 'LiveroiD_A-Y01',
      timer: null,
      voiceTimer: null,

      analyser: null,
      volLevel: 0,
      speechOn: false,

      voiceSizeSensitivity: 1000,
      startListenAudio: false,
      minDecibels: localStorage.getItem('minDecibels')
        ? Number(localStorage.getItem('minDecibels'))
        : 75,
      voiceThreshold: localStorage.getItem('voiceThreshold')
        ? Number(localStorage.getItem('voiceThreshold'))
        : 10,
      breakTime: localStorage.getItem('breakTime')
        ? Number(localStorage.getItem('breakTime'))
        : 800,

      sendList: [],
      sendTimeDaly: localStorage.getItem('sendTimeDaly')
        ? Number(localStorage.getItem('sendTimeDaly'))
        : 3000,
      timeNow: new Date().getTime(),

      speedSendText: localStorage.getItem('speedSendText') || '',
      speedSendFlag:
        localStorage.getItem('speedSendFlag') === 'true' ? true : false,
      speedDeleteText: localStorage.getItem('speedDeleteText') || '',
      speedDeleteFlag:
        localStorage.getItem('speedDeleteFlag') === 'true' ? true : false,
    }
  },
  computed: {},
  watch: {
    status() {
      this.sendHomeStatus()
    },
    sendTimeDaly(v) {
      localStorage.setItem('sendTimeDaly', v)
    },
    breakTime(v) {
      console.log(v)
      localStorage.setItem('breakTime', v)
    },

    speedSendFlag(v) {
      console.log(v)
      localStorage.setItem('speedSendFlag', v)
    },
    speedSendText(v) {
      console.log(v)
      localStorage.setItem('speedSendText', v)
    },
    speedDeleteFlag(v) {
      console.log(v)
      localStorage.setItem('speedDeleteFlag', v)
    },
    speedDeleteText(v) {
      console.log(v)
      localStorage.setItem('speedDeleteText', v)
    },

    sendList: {
      handler(v) {
        console.log(v)
        this.socket.emit('sendMessageListData', v)
      },
      deep: true,
    },
  },
  methods: {
    quickSend(item) {
      item['sendTime'] = this.timeNow
    },
    editMessage(item) {
      this.message = item.message
      this.deleteMessage(item.id)
    },
    deleteMessage(id) {
      this.sendList = this.sendList.filter((item) => {
        return item.id !== id
      })
    },
    initTime() {
      workerTimers.setInterval(() => {
        if (this.sendList.length > 0) {
          this.timeNow = new Date().getTime()
          this.doSendMessageList()
        }
      }, 42)
    },
    voiceThresholdChange() {
      localStorage.setItem('voiceThreshold', this.voiceThreshold)
    },
    initAudioListen() {
      AudioAPI.start().then((a) => {
        this.analyser = a
        this.minDecibelsChange()
        this.startGetVoiceSize()
      })
    },
    minDecibelsChange() {
      this.analyser.minDecibels = -this.minDecibels
      localStorage.setItem('minDecibels', this.minDecibels)
    },
    startGetVoiceSize() {
      this.timer = workerTimers.setInterval(() => {
        if (this.getType === '1') {
          const voiceSize = AudioAPI.getVoiceSize(this.analyser)
          if (voiceSize / this.voiceSizeSensitivity > this.voiceThreshold) {
            if (this.voiceTimer) {
              workerTimers.clearTimeout(this.voiceTimer)
              this.voiceTimer = null
            }
            this.speechOn = true
          } else {
            if (this.speechOn && !this.voiceTimer) {
              clearTimeout(this.voiceTimer)
              this.voiceTimer = null
              this.voiceTimer = workerTimers.setTimeout(() => {
                // 800ms后还没断句就强行断句
                if (this.speechOn) {
                  this.speechStop()
                  console.log('断句')
                }

                this.voiceTimer = null
              }, this.breakTime)
            }
          }
          this.volLevel = voiceSize
        }
      }, 30)
    },
    sendHomeStatus() {
      this.socket.emit('sendHomeStatus', {
        status: this.status,
        getType: this.getType,
      })
    },
    openControlUrl(url) {
      window.open(`${window.location.origin}/${url}`, '_blank')
    },
    async copyControlUrl(url) {
      const { toClipboard } = useClipboard()

      try {
        await toClipboard(`${window.location.origin}/${url}`)
        this.$toast.add({
          severity: 'success',
          summary: '成功',
          detail: '复制成功',
          life: 3000,
        })
      } catch (e) {
        this.$toast.add({
          severity: 'errro',
          summary: '失败',
          detail: '复制失败',
          life: 3000,
        })
      }
    },
    saveSetting() {
      const settingData = {
        isSpeech: this.isSpeech,
        avatar: this.avatar,
        cloudSel: this.cloudSel,
        appkey: this.appkey,
        AccessToken: this.AccessToken,
        voice: this.voice,
        googleVoice: this.googleVoice,
        googlePitch: this.googlePitch,
        googleSpeakingRate: this.googleSpeakingRate,
        azureKey: this.azureKey,
        azureRegion: this.azureRegion,
        azureVoice: this.azureVoice,
        azureRate: this.azureRate,
        azurePitch: this.azurePitch,
        selModel: this.selModel,
      }
      this.socket.emit('settingData', settingData)
      this.$toast.add({
        severity: 'success',
        summary: '发送成功',
        detail: '发送成功',
        life: 3000,
      })
      localStorage.setItem('liveSpeechSetting', JSON.stringify(settingData))
    },
    sendByUser() {
      if (this.message === '') {
        return false
      }
      this.addToSendList(this.message)
      this.message = ''
    },
    changeAvatar() {
      // console.log("aa")
      // localStorage.setItem('liveSpeechAvatar', this.avatar)
      this.avatarPre = this.avatar
    },
    toSocket() {
      this.socket = io.connect('/socketchat')
      this.socket.on('connect', () => {
        console.log('已连接')
        const settingData = {
          isSpeech: this.isSpeech,
          avatar: this.avatar,
          cloudSel: this.cloudSel,
          appkey: this.appkey,
          AccessToken: this.AccessToken,
          voice: this.voice,
          googleVoice: this.googleVoice,
          googlePitch: this.googlePitch,
          googleSpeakingRate: this.googleSpeakingRate,
          azureKey: this.azureKey,
          azureRegion: this.azureRegion,
          azureVoice: this.azureVoice,
          azureRate: this.azureRate,
          azurePitch: this.azurePitch,
          selModel: this.selModel,
        }
        this.socket.emit('settingData', settingData)
        this.socket.on('getControlSpeech', (data) => {
          if (
            this.getType === '2' ||
            this.getType === '3' ||
            this.getType === '4'
          ) {
            if (data) {
              this.speechStart()
            } else {
              this.speechStop()
            }
          } else if (this.getType === '1') {
            if (!data) {
              this.speechStop()
            }
          }
        })
        this.socket.on('speechWantHomeStatus', () => {
          this.sendHomeStatus()
        })
        this.socket.on('getSpeechControlText', (data) => {
          if (data) {
            this.addToSendList(data)
          }
        })
        this.socket.on('getMessageListId', (data) => {
          const { id, type } = data
          const item = this.sendList.find((el) => {
            return el.id === id
          })
          switch (type) {
            case 'editMessage':
            case 'deleteMessage':
              this.deleteMessage(id)
              break
            case 'quickSend':
              if (item) {
                this.quickSend(item)
              }
              break

            default:
              break
          }
        })
        this.socket.on('getSpeechControlStatus', (data) => {
          this.getType = data.getType
          switch (this.getType) {
            case '0':
              this.speechStop()
              break
            case '1':
              this.speechStart()
              break
            case '2':
              this.speechStop()
              break
            case '3':
              this.speechStop()
              break
            case '4':
              this.speechStop()
              break

            default:
              break
          }
        })
      })
      this.socket.on('disconnect', () => {
        console.log('已断开')
      })
    },
    addToSendList(message) {
      this.sendList.push({
        id:
          String(new Date().getTime()) +
          '-' +
          String(Math.floor(Math.random() * 1000)),
        message: message,
        addTime: new Date().getTime(),
        sendTime: new Date().getTime() + this.sendTimeDaly,
      })
    },
    doSendMessageList() {
      if (this.sendList.length > 0) {
        const time = this.timeNow
        let count = 0
        this.sendList.forEach((element) => {
          if (time >= element.sendTime) {
            this.send(element.message)
            count++
          }
        })
        if (count > 0) {
          this.sendList = this.sendList.filter((element) => {
            return time < element.sendTime
          })
        }
      }
    },
    send(message) {
      this.socket.emit('send', { message: message })
    },
    getTypeChange() {
      switch (this.getType) {
        case '0':
          this.speechStop()
          break
        case '1':
          this.speechStart()
          break
        case '2':
          this.speechStop()
          break
        case '3':
          this.speechStop()
          break
        case '4':
          this.speechStop()
          break
        default:
          break
      }
      this.sendHomeStatus()
    },
    speechStart() {
      this.rec.start()
    },
    speechStop() {
      this.rec.stop()
    },
    initSpeech() {
      const rec = new window.webkitSpeechRecognition()
      this.rec = rec
      rec.continuous = true
      rec.interimResults = false
      rec.lang = 'cmn-Hans-CN'

      rec.onresult = (e) => {
        console.log('on result')
        console.log(e)
        // for (var i = e.resultIndex; i < e.results.length; i++) {
        //   if (!e.results[i].isFinal) continue

        //   const { transcript } = e.results[i][0]
        //   console.log(`Recognised: ${transcript}`)
        //   this.message = transcript
        //   this.send(this.message)
        // }
        const { transcript, confidence } = e.results[e.resultIndex][0]
        console.log(`Recognised: ${transcript}`)
        console.log(`confidence: ${confidence}`)
        console.log(`speechOn: ${this.speechOn}`)
        if (this.getType === '1') {
          if (this.speechOn) {
            this.speechOn = false
            const firstSend = this.sendList[0]
            if (this.speedSendFlag) {
              // 快速发送判断
              if (
                transcript.replace(/[，。.,/#!$%^&*;:{}=\-_`~()]/g, '') ===
                this.speedSendText
              ) {
                if (firstSend) {
                  this.quickSend(firstSend)
                }
                return false
              }
            }
            if (this.speedDeleteFlag) {
              // 快速删除判断
              if (
                transcript.replace(/[，。.,/#!$%^&*;:{}=\-_`~()]/g, '') ===
                this.speedDeleteText
              ) {
                if (firstSend) {
                  this.deleteMessage(firstSend.id)
                }
                return false
              }
            }
            // this.message = transcript
            this.addToSendList(transcript)
          }
        } else {
          // this.message = transcript
          this.addToSendList(transcript)
        }

        // rec.stop()
      }

      rec.onstart = () => {
        console.log('on start')
        this.status = '初始化中'
      }
      rec.onerror = () => {
        console.log('on start')
        this.status = '发生错误'
      }
      rec.onend = () => {
        console.log('on end')
        if (this.getType === '1') {
          rec.start()
        } else {
          this.status = '未启动'
        }
        this.speechOn = false
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
    },
    init() {
      const settingDataStr = localStorage.getItem('liveSpeechSetting') || ''
      if (settingDataStr) {
        const settingData = JSON.parse(settingDataStr)
        this.isSpeech = settingData.isSpeech ? true : false
        this.avatar = settingData.avatar || ''
        this.cloudSel = settingData.cloudSel || 'googleNiang'
        this.appkey = settingData.appkey || ''
        this.AccessToken = settingData.AccessToken || ''
        this.voice = settingData.voice || 'xiaoyun'
        this.googleVoice = settingData.googleVoice || 'cmn-CN-Wavenet-A'
        this.googlePitch = Number.isNaN(Number(settingData.googlePitch))
          ? 0
          : Number(settingData.googlePitch)
        this.googleSpeakingRate = Number.isNaN(
          Number(settingData.googleSpeakingRate)
        )
          ? 1
          : Number(settingData.googleSpeakingRate)
        this.azureKey = settingData.azureKey || ''
        this.azureRegion = settingData.azureRegion || ''
        this.azureVoice = settingData.azureVoice || 'zh-CN-XiaoxiaoNeural'
        this.azureRate = settingData.azureRate || 100
        this.azurePitch = settingData.azurePitch || 0
        this.selModel = settingData.selModel || 'LiveroiD_A-Y01'
      }
      this.avatarPre = this.avatar
      this.toSocket()
      this.initSpeech()
    },
  },
  created() {},
  mounted() {
    this.init()
    this.initTime()
    this.$confirm.require({
      message: '点击获取权限！',
      header: '欢迎使用',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: '确定',
      rejectClass: 'nonoBtn',
      accept: () => {
        if (!this.startListenAudio) {
          this.initAudioListen()
        }
      },
      reject: () => {
        if (!this.startListenAudio) {
          this.initAudioListen()
        }
      },
    })
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
<style>
.home {
  padding: 30px;
}
.input-text-full {
  width: 100%;
}
.p-button.p-button-mr10 {
  margin-right: 10px;
}
.input-text-full .p-password-input {
  width: 100%;
}
</style>
