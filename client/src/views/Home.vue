<!-- home -->
<template>
  <div class="home">
    <!-- <div>头像URL：<input v-model="avatar" @blur="changeAvatar" /></div> -->
    <Panel header="语音获取" class="mb15">
      <div class="pb10">状态：{{ status }}</div>
      <div class="p-inputgroup">
        <InputText placeholder="捕获语音" v-model="message" />
        <Button label="手动发送" @click="sendByUser" />
      </div>
    </Panel>
    <Panel header="设置">
      <div class="pb15">
        <div class="pb10">
          头像URL：<Avatar shape="circle" :image="avatarPre" v-if="avatarPre" />
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
        <div v-show="cloudSel === 'aliyun'">
          <div class="pb15">
            <div class="pb10">APPKEY：</div>
            <div><InputText class="input-text-full" v-model="appkey" /></div>
          </div>
          <div class="pb15">
            <div class="pb10">AccessToken：</div>
            <div>
              <InputText class="input-text-full" v-model="AccessToken" />
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
      <Button label="发送设置" @click="saveSetting" />
    </Panel>
    <Toast position="top-center" />
  </div>
</template>

<script>
import io from 'socket.io-client'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Panel from 'primevue/panel'
import Avatar from 'primevue/avatar'
import InputSwitch from 'primevue/inputswitch'
import SelectButton from 'primevue/selectbutton'
// import Listbox from 'primevue/listbox';
import Toast from 'primevue/toast'

export default {
  name: '',
  components: {
    InputText,
    Button,
    Panel,
    Avatar,
    InputSwitch,
    SelectButton,
    Toast,
  },
  data() {
    return {
      message: '',
      avatarPre: '',
      socket: null,
      status: '初始化中',
      cloudList: [
        {
          name: '谷歌娘',
          value: 'googleNiang',
        },
        {
          name: '谷歌云',
          value: 'googleCloud',
        },
        {
          name: '阿里云智能语音交互',
          value: 'aliyun',
        },
      ],
      isSpeech: false,
      avatar: '',
      cloudSel: 'googleNiang',
      appkey: '',
      AccessToken: '',
      voice: 'xiaoyun',
    }
  },
  computed: {},
  watch: {},
  methods: {
    saveSetting() {
      const settingData = {
        isSpeech: this.isSpeech,
        avatar: this.avatar,
        cloudSel: this.cloudSel,
        appkey: this.appkey,
        AccessToken: this.AccessToken,
        voice: this.voice,
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
      this.send(this.message)
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
        }
        this.socket.emit('settingData', settingData)
      })
      this.socket.on('disconnect', () => {
        console.log('已断开')
      })
    },
    send(message) {
      this.socket.emit('send', { message: message })
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
      }
      this.avatarPre = this.avatar
      this.toSocket()
      const rec = new window.webkitSpeechRecognition()
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
        const { transcript } = e.results[e.resultIndex][0]
        console.log(`Recognised: ${transcript}`)
        this.message = transcript
        this.send(this.message)
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
<style>
.home {
  padding: 30px;
}
.input-text-full {
  width: 100%;
}
</style>
