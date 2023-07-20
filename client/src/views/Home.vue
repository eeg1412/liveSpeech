<!-- home -->
<template>
  <div class="home">
    <ConfirmDialog></ConfirmDialog>
    <!-- <div>头像URL：<input v-model="avatar" @blur="changeAvatar" /></div> -->
    <Panel header="语音获取" class="mb15">
      <!-- 选择语言 -->
      <div class="pb15">
        <div class="pb10">捕获语言：</div>
        <div class="flex">
          <div class="mr10">
            <label
              ><RadioButton
                name="lang"
                value="zh-cmn-Hans"
                v-model="speechLang"
                @change="speechLangChange"
              />
              中文</label
            >
          </div>
          <div class="mr10">
            <label
              ><RadioButton
                name="lang"
                value="en-US"
                v-model="speechLang"
                @change="speechLangChange"
              />
              英文</label
            >
          </div>
          <div class="mr10">
            <label
              ><RadioButton
                name="lang"
                value="ja-JP"
                v-model="speechLang"
                @change="speechLangChange"
              />
              日语</label
            >
          </div>
        </div>
      </div>
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
    <Panel header="chatGPT设置" class="mb15">
      <!-- 密钥 -->
      <div class="pb15">
        <div class="pb10">密钥：</div>
        <div>
          <Password
            :feedback="false"
            class="input-text-full"
            v-model="chatGPTKey"
            toggleMask
          />
        </div>
      </div>
      <!-- 直播内容托管开关 -->
      <div class="pb15">
        <div class="pb10">直播内容托管开关：</div>
        <div>
          <!-- InputSwitch -->
          <InputSwitch v-model="chatGPTLiver" />
        </div>
      </div>
      <!-- 提示语句 -->
      <div class="pb15">
        <div class="pb10">直播托管提示语句：</div>
        <div>
          <Textarea class="input-text-full" rows="5" v-model="chatGPTTips" />
          <div>${comment}为描述内容</div>
        </div>
      </div>
      <!-- 评论自动回复 -->
      <div class="pb15">
        <div class="pb10">评论自动回复开关：</div>
        <div>
          <!-- InputSwitch -->
          <InputSwitch v-model="chatGPTComment" />
        </div>
      </div>
      <Panel header="哔哩哔哩自动回复设置" class="mb15" v-show="chatGPTComment">
        <!-- 房间ID InputText -->
        <div class="pb15">
          <div class="pb10">房间ID：</div>
          <div>
            <InputText class="input-text-full" v-model.number="bilibiRoomId" />
          </div>
        </div>
        <!-- 回复提示语句 -->
        <div class="pb15">
          <div class="pb10">回复提示语句：</div>
          <div>
            <Textarea
              class="input-text-full"
              rows="5"
              v-model="chatGPTReplyTips"
            />
            <div>${comment}为描述内容</div>
          </div>
        </div>
      </Panel>
      <!-- 开关 -->
      <div class="pb15">
          <div class="pb10">动态随机内容播报开关（每次启动需要手动开启）：</div>
          <div>
            <InputSwitch v-model="dynamicSwitch" />
          </div>
        </div>
      <Panel header="动态随机内容播报设置" class="mb15">
        <!-- 播报间隔时间 -->
        <div class="pb15">
          <div class="pb10">播报间隔时间（秒）：</div>
          <div>
            <InputNumber 
              v-model.number="dynamicInterval"  
              showButtons
              buttonLayout="horizontal"
              :step="1"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
              :min="10" />
          </div>
        </div>
        
        <!-- 播报内容 -->
        <div class="pb15">
          <div class="pb10">播报内容：</div>
          <div>
            <div v-for="(content, index) in dynamicContents" :key="index">
              <Textarea
                class="input-text-full"
                rows="5"
                v-model="dynamicContents[index]"
              />
              <div class="clearfix mb10">
                <Button label="删除" class="p-button-danger p-button-sm fr" @click="removeDynamicContent(index)" />
              </div>
              
            </div>
            <Button label="添加" class="p-button-sm" @click="addDynamicContent" />
            
          </div>
        </div>
      </Panel>
      <Button label="发送设置" class="p-button-sm" @click="saveSetting" />
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
import Textarea from 'primevue/textarea'
import ChatClientDirect from '@/utils/bilibili'

let dynamicContentTimer = null
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
    Textarea,
  },
  data() {
    return {
      rec: null,
      message: '',
      avatarPre: '',
      socket: null,
      status: '未启动',
      getType: '0',
      speechLang: localStorage.getItem('speechLang') || 'zh-cmn-Hans',
      cloudList: [
        {
          name: '微软Azure',
          value: 'azure',
        },
      ],
      isSpeech: false,
      avatar: '',
      cloudSel: 'azure',
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
      chatGPTKey: '',
      chatGPTTips: '',
      chatGPTLiver: false,
      chatGPTReplyTips: '',
      chatGPTComment: false,

      bilibiRoomId: localStorage.getItem('bilibiRoomId')
        ? Number(localStorage.getItem('bilibiRoomId'))
        : null,
      chatClient: null,
      dynamicContents: localStorage.getItem('dynamicContents') ? JSON.parse(localStorage.getItem('dynamicContents')) : [],
      dynamicInterval : localStorage.getItem('dynamicInterval') ? Number(localStorage.getItem('dynamicInterval')) : 120,
      dynamicSwitch:  false,
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
    bilibiRoomId(v) {
      console.log(v)
      localStorage.setItem('bilibiRoomId', v)
    },
    dynamicContents: {
      handler(newValue) {
        console.log(newValue)
        localStorage.setItem('dynamicContents', JSON.stringify(newValue))
      },
      deep: true
    },
    dynamicInterval (v) {
      console.log(v)
      this.setDynamicContentTimer()
      localStorage.setItem('dynamicInterval', v)
    },
  
    dynamicSwitch (v) {
      console.log(v)
      if (v) {
        this.setDynamicContentTimer()
      } else {
        clearInterval(dynamicContentTimer)
      }
      localStorage.setItem('dynamicSwitch', v)
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
        chatGPTKey: this.chatGPTKey,
        chatGPTTips: this.chatGPTTips,
        chatGPTReplyTips: this.chatGPTReplyTips,
        chatGPTLiver: this.chatGPTLiver,
        chatGPTComment: this.chatGPTComment,
      }
      this.socket.emit('settingData', settingData)
      this.$toast.add({
        severity: 'success',
        summary: '发送成功',
        detail: '发送成功',
        life: 3000,
      })
      localStorage.setItem('liveSpeechSetting', JSON.stringify(settingData))
      this.initChatClient()
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
          chatGPTKey: this.chatGPTKey,
          chatGPTTips: this.chatGPTTips,
          chatGPTReplyTips: this.chatGPTReplyTips,
          chatGPTLiver: this.chatGPTLiver,
          chatGPTComment: this.chatGPTComment,
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
      // chatGPTMessage
      this.socket.on('chatGPTMessage', (data) => {
        this.addToSendList(data, true)
      })
      this.socket.on('disconnect', () => {
        console.log('已断开')
      })
    },
    addToSendList(message, isChatGPTMessage, isComment) {
      console.log(message)
      if (
        this.chatGPTLiver &&
        this.chatGPTKey &&
        message.trim() !== '' &&
        !isChatGPTMessage
      ) {
        this.socket.emit('toChatGPTMessage', message, isComment)
      } else if(
        this.chatGPTKey &&
        this.dynamicSwitch &&
        message.trim() !== '' &&
        !isChatGPTMessage){
        this.socket.emit('toChatGPTMessage', message, isComment)
        }
       else {
        this.sendList.push({
          id:
            String(new Date().getTime()) +
            '-' +
            String(Math.floor(Math.random() * 1000)),
          message: message,
          addTime: new Date().getTime(),
          sendTime: new Date().getTime() + this.sendTimeDaly,
        })
      }
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
      rec.lang = this.speechLang

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
        this.cloudSel = settingData.cloudSel || 'azure'
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
        this.chatGPTKey = settingData.chatGPTKey || ''
        this.chatGPTTips = settingData.chatGPTTips || ''
        this.chatGPTReplyTips = settingData.chatGPTReplyTips || ''
        this.chatGPTLiver = settingData.chatGPTLiver || false
        this.chatGPTComment = settingData.chatGPTComment || false
      }
      this.avatarPre = this.avatar
      this.toSocket()
      this.initSpeech()
    },
    speechLangChange() {
      this.rec.stop()
      this.rec.lang = this.speechLang
      localStorage.setItem('speechLang', this.speechLang)
      this.getTypeChange()
    },
    // bilibili
    initChatClient() {
      if (this.chatClient !== null) {
        this.chatClient.stop()
        this.chatClient = null
      }
      if (this.bilibiRoomId && this.chatGPTLiver && this.chatGPTComment) {
        this.chatClient = new ChatClientDirect(this.bilibiRoomId)
        this.chatClient.onAddText = this.onAddText
        // this.chatClient.onAddGift = this.onAddText
        // this.chatClient.onAddMember = this.onAddText
        // this.chatClient.onAddSuperChat = this.onAddText
        // this.chatClient.onDelSuperChat = this.onAddText
        // this.chatClient.onUpdateTranslation = this.onAddText
        this.chatClient.start()
      }
    },
    onAddText(data) {
      console.log(data)
      const content = data?.content
      if (content) {
        this.addToSendList(content, false, true)
      }
    },
    // 动态随机内容播报
    removeDynamicContent(i) {
      this.dynamicContents.splice(i, 1)
    },
    addDynamicContent () {
      this.dynamicContents.push('')
    },
    setDynamicContentTimer () {
      if (dynamicContentTimer) {
        clearInterval(dynamicContentTimer)
        dynamicContentTimer = null
      }
      if (this.dynamicContents.length > 0) {
        dynamicContentTimer = setInterval(() => {
          const index = Math.floor(Math.random() * this.dynamicContents.length)
          const content = this.dynamicContents[index]
          if (content) {
            this.addToSendList(content, false, false)
          }
        }, this.dynamicInterval * 1000)
      }
    },
  },
  created() {},
  mounted() {
    this.init()
    this.initTime()
    this.initChatClient()
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
