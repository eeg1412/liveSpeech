(function(e){function t(t){for(var o,c,r=t[0],s=t[1],i=t[2],u=0,p=[];u<r.length;u++)c=r[u],Object.prototype.hasOwnProperty.call(a,c)&&a[c]&&p.push(a[c][0]),a[c]=0;for(o in s)Object.prototype.hasOwnProperty.call(s,o)&&(e[o]=s[o]);d&&d(t);while(p.length)p.shift()();return l.push.apply(l,i||[]),n()}function n(){for(var e,t=0;t<l.length;t++){for(var n=l[t],o=!0,c=1;c<n.length;c++){var r=n[c];0!==a[r]&&(o=!1)}o&&(l.splice(t--,1),e=s(s.s=n[0]))}return e}var o={},c={app:0},a={app:0},l=[];function r(e){return s.p+"js/"+({SpeechControl:"SpeechControl",chat:"chat"}[e]||e)+"."+{SpeechControl:"3efc8c9c",chat:"6382a565"}[e]+".js"}function s(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.e=function(e){var t=[],n={SpeechControl:1,chat:1};c[e]?t.push(c[e]):0!==c[e]&&n[e]&&t.push(c[e]=new Promise((function(t,n){for(var o="css/"+({SpeechControl:"SpeechControl",chat:"chat"}[e]||e)+"."+{SpeechControl:"168935bf",chat:"79f1f898"}[e]+".css",a=s.p+o,l=document.getElementsByTagName("link"),r=0;r<l.length;r++){var i=l[r],u=i.getAttribute("data-href")||i.getAttribute("href");if("stylesheet"===i.rel&&(u===o||u===a))return t()}var p=document.getElementsByTagName("style");for(r=0;r<p.length;r++){i=p[r],u=i.getAttribute("data-href");if(u===o||u===a)return t()}var d=document.createElement("link");d.rel="stylesheet",d.type="text/css",d.onload=t,d.onerror=function(t){var o=t&&t.target&&t.target.src||a,l=new Error("Loading CSS chunk "+e+" failed.\n("+o+")");l.code="CSS_CHUNK_LOAD_FAILED",l.request=o,delete c[e],d.parentNode.removeChild(d),n(l)},d.href=a;var b=document.getElementsByTagName("head")[0];b.appendChild(d)})).then((function(){c[e]=0})));var o=a[e];if(0!==o)if(o)t.push(o[2]);else{var l=new Promise((function(t,n){o=a[e]=[t,n]}));t.push(o[2]=l);var i,u=document.createElement("script");u.charset="utf-8",u.timeout=120,s.nc&&u.setAttribute("nonce",s.nc),u.src=r(e);var p=new Error;i=function(t){u.onerror=u.onload=null,clearTimeout(d);var n=a[e];if(0!==n){if(n){var o=t&&("load"===t.type?"missing":t.type),c=t&&t.target&&t.target.src;p.message="Loading chunk "+e+" failed.\n("+o+": "+c+")",p.name="ChunkLoadError",p.type=o,p.request=c,n[1](p)}a[e]=void 0}};var d=setTimeout((function(){i({type:"timeout",target:u})}),12e4);u.onerror=u.onload=i,document.head.appendChild(u)}return Promise.all(t)},s.m=e,s.c=o,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)s.d(n,o,function(t){return e[t]}.bind(null,o));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/",s.oe=function(e){throw console.error(e),e};var i=window["webpackJsonp"]=window["webpackJsonp"]||[],u=i.push.bind(i);i.push=t,i=i.slice();for(var p=0;p<i.length;p++)t(i[p]);var d=u;l.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"0864":function(e,t,n){},1:function(e,t){},"4dcb":function(e,t,n){},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var o=n("7a23"),c={id:"nav"};function a(e,t){var n=Object(o["z"])("router-view");return Object(o["t"])(),Object(o["g"])("div",c,[Object(o["j"])(n)])}const l={};l.render=a;var r=l,s=n("9319"),i=(n("d3b7"),n("6c02")),u={class:"home"},p={class:"pb15"},d=Object(o["j"])("div",{class:"pb10"},"捕获模式：",-1),b={class:"flex"},h={class:"mr10"},j=Object(o["i"])(" 自由捕获"),f={class:"mr10"},v=Object(o["i"])(" 按键捕获"),m={class:"mr10"},g=Object(o["i"])(" 禁止捕获"),O={class:"pb10 pt10"},y={class:"pb10"},S={class:"p-inputgroup"},k={class:"pb15"},C={class:"pb10"},T=Object(o["i"])(" 头像URL："),w={class:"pb15"},V=Object(o["j"])("div",{class:"pb10"},"是否语音播报：",-1),U={class:"pb15"},x=Object(o["j"])("div",{class:"pb10"},"语音提供商：",-1),A={class:"pb15"},P=Object(o["j"])("div",{class:"pb10"},"APPKEY：",-1),_={class:"pb15"},B=Object(o["j"])("div",{class:"pb10"},"AccessToken：",-1),L={class:"pb15"},I=Object(o["j"])("div",{class:"pb10"},[Object(o["i"])(" 声源（参考"),Object(o["j"])("a",{href:"https://help.aliyun.com/document_detail/84435.htm?spm=a2c4g.11186623.2.22.28cf4a9c70HlT2#topic-2572243",target:"_blank"},"阿里云文档"),Object(o["i"])("）： ")],-1),N={class:"pb15"},R=Object(o["j"])("div",{class:"pb10"},"气泡聊天窗：",-1);function E(e,t,n,c,a,l){var r=Object(o["z"])("RadioButton"),s=Object(o["z"])("Button"),i=Object(o["z"])("InputText"),E=Object(o["z"])("Panel"),z=Object(o["z"])("Avatar"),H=Object(o["z"])("InputSwitch"),D=Object(o["z"])("SelectButton"),M=Object(o["z"])("Toast");return Object(o["t"])(),Object(o["g"])("div",u,[Object(o["j"])(E,{header:"语音获取",class:"mb15"},{default:Object(o["H"])((function(){return[Object(o["j"])("div",p,[d,Object(o["j"])("div",b,[Object(o["j"])("div",h,[Object(o["j"])("label",null,[Object(o["j"])(r,{name:"getType",value:"1",modelValue:a.getType,"onUpdate:modelValue":t[1]||(t[1]=function(e){return a.getType=e}),onChange:l.getTypeChange},null,8,["modelValue","onChange"]),j])]),Object(o["j"])("div",f,[Object(o["j"])("label",null,[Object(o["j"])(r,{name:"getType",value:"2",modelValue:a.getType,"onUpdate:modelValue":t[2]||(t[2]=function(e){return a.getType=e}),onChange:l.getTypeChange},null,8,["modelValue","onChange"]),v])]),Object(o["j"])("div",m,[Object(o["j"])("label",null,[Object(o["j"])(r,{name:"getType",value:"0",modelValue:a.getType,"onUpdate:modelValue":t[3]||(t[3]=function(e){return a.getType=e}),onChange:l.getTypeChange},null,8,["modelValue","onChange"]),g])])]),Object(o["I"])(Object(o["j"])("div",O,[Object(o["j"])(s,{label:"复制控制器URL",class:"p-button-raised p-button-text p-button-sm p-button-mr10",onClick:t[4]||(t[4]=function(e){return l.copyControlUrl("speechcontrol")})}),Object(o["j"])(s,{label:"打开控制器",class:"p-button-raised p-button-text p-button-sm",onClick:t[5]||(t[5]=function(e){return l.openControlUrl("speechcontrol")})})],512),[[o["F"],"2"===a.getType]])]),Object(o["j"])("div",y,"状态："+Object(o["D"])(a.status),1),Object(o["j"])("div",S,[Object(o["j"])(i,{placeholder:"捕获语音",modelValue:a.message,"onUpdate:modelValue":t[6]||(t[6]=function(e){return a.message=e})},null,8,["modelValue"]),Object(o["j"])(s,{label:"手动发送",onClick:l.sendByUser},null,8,["onClick"])])]})),_:1}),Object(o["j"])(E,{header:"设置",class:"mb15"},{default:Object(o["H"])((function(){return[Object(o["j"])("div",k,[Object(o["j"])("div",C,[T,a.avatarPre?(Object(o["t"])(),Object(o["g"])(z,{key:0,shape:"circle",image:a.avatarPre},null,8,["image"])):Object(o["h"])("",!0)]),Object(o["j"])("div",null,[Object(o["j"])(i,{class:"input-text-full",onBlur:l.changeAvatar,placeholder:"设置头像URL",modelValue:a.avatar,"onUpdate:modelValue":t[7]||(t[7]=function(e){return a.avatar=e})},null,8,["onBlur","modelValue"])])]),Object(o["j"])("div",w,[V,Object(o["j"])("div",null,[Object(o["j"])(H,{modelValue:a.isSpeech,"onUpdate:modelValue":t[8]||(t[8]=function(e){return a.isSpeech=e})},null,8,["modelValue"])])]),Object(o["I"])(Object(o["j"])("div",null,[Object(o["j"])("div",U,[x,Object(o["j"])("div",null,[Object(o["j"])(D,{modelValue:a.cloudSel,"onUpdate:modelValue":t[9]||(t[9]=function(e){return a.cloudSel=e}),options:a.cloudList,optionLabel:"name",optionValue:"value"},null,8,["modelValue","options"])])]),Object(o["I"])(Object(o["j"])("div",null,[Object(o["j"])("div",A,[P,Object(o["j"])("div",null,[Object(o["j"])(i,{class:"input-text-full",modelValue:a.appkey,"onUpdate:modelValue":t[10]||(t[10]=function(e){return a.appkey=e})},null,8,["modelValue"])])]),Object(o["j"])("div",_,[B,Object(o["j"])("div",null,[Object(o["j"])(i,{class:"input-text-full",modelValue:a.AccessToken,"onUpdate:modelValue":t[11]||(t[11]=function(e){return a.AccessToken=e})},null,8,["modelValue"])])]),Object(o["j"])("div",L,[I,Object(o["j"])("div",null,[Object(o["j"])(i,{class:"input-text-full",modelValue:a.voice,"onUpdate:modelValue":t[12]||(t[12]=function(e){return a.voice=e})},null,8,["modelValue"])])])],512),[[o["F"],"aliyun"===a.cloudSel]])],512),[[o["F"],a.isSpeech]]),Object(o["j"])(s,{label:"发送设置",class:"p-button-sm",onClick:l.saveSetting},null,8,["onClick"])]})),_:1}),Object(o["j"])(E,{header:"获取地址"},{default:Object(o["H"])((function(){return[Object(o["j"])("div",N,[R,Object(o["j"])("div",null,[Object(o["j"])(s,{label:"复制聊天窗URL",class:"p-button-raised p-button-text p-button-sm p-button-mr10",onClick:t[13]||(t[13]=function(e){return l.copyControlUrl("chat")})}),Object(o["j"])(s,{label:"打开聊天窗",class:"p-button-raised p-button-text p-button-sm",onClick:t[14]||(t[14]=function(e){return l.openControlUrl("chat")})})])])]})),_:1}),Object(o["j"])(M,{position:"top-center"})])}n("99af"),n("96cf");var z=n("1da1"),H=n("8055"),D=n.n(H),M=n("8398"),F=n("bb57"),J=n("1e2d"),$=n("48d5"),q=n("f4ad"),K=n("a5af"),Y=n("b3b6"),G=n("b35c"),Q=n("e6a9"),W=n.n(Q),X={name:"Home",components:{InputText:M["a"],Button:F["a"],Panel:J["a"],Avatar:$["a"],InputSwitch:q["a"],SelectButton:K["a"],Toast:Y["a"],RadioButton:G["a"]},data:function(){return{rec:null,message:"",avatarPre:"",socket:null,status:"未启动",getType:"0",cloudList:[{name:"谷歌娘",value:"googleNiang"},{name:"谷歌云",value:"googleCloud"},{name:"阿里云智能语音交互",value:"aliyun"}],isSpeech:!1,avatar:"",cloudSel:"googleNiang",appkey:"",AccessToken:"",voice:"xiaoyun"}},computed:{},watch:{},methods:{openControlUrl:function(e){window.open("".concat(window.location.origin,"/").concat(e),"target")},copyControlUrl:function(e){var t=this;return Object(z["a"])(regeneratorRuntime.mark((function n(){var o,c;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return o=W()(),c=o.toClipboard,n.prev=1,n.next=4,c("".concat(window.location.origin,"/").concat(e));case 4:t.$toast.add({severity:"success",summary:"成功",detail:"复制成功",life:3e3}),n.next=10;break;case 7:n.prev=7,n.t0=n["catch"](1),t.$toast.add({severity:"errro",summary:"失败",detail:"复制失败",life:3e3});case 10:case"end":return n.stop()}}),n,null,[[1,7]])})))()},saveSetting:function(){var e={isSpeech:this.isSpeech,avatar:this.avatar,cloudSel:this.cloudSel,appkey:this.appkey,AccessToken:this.AccessToken,voice:this.voice};this.socket.emit("settingData",e),this.$toast.add({severity:"success",summary:"发送成功",detail:"发送成功",life:3e3}),localStorage.setItem("liveSpeechSetting",JSON.stringify(e))},sendByUser:function(){this.send(this.message)},changeAvatar:function(){this.avatarPre=this.avatar},toSocket:function(){var e=this;this.socket=D.a.connect("/socketchat"),this.socket.on("connect",(function(){console.log("已连接");var t={isSpeech:e.isSpeech,avatar:e.avatar,cloudSel:e.cloudSel,appkey:e.appkey,AccessToken:e.AccessToken,voice:e.voice};e.socket.emit("settingData",t),e.socket.on("getControlSpeech",(function(t){"2"===e.getType&&(t?e.speechStart():e.speechStop())}))})),this.socket.on("disconnect",(function(){console.log("已断开")}))},send:function(e){this.socket.emit("send",{message:e})},getTypeChange:function(){switch(this.getType){case"0":this.speechStop();break;case"1":this.speechStart();break;case"2":this.speechStop();break;default:break}},speechStart:function(){this.rec.start()},speechStop:function(){this.rec.stop()},initSpeech:function(){var e=this,t=new window.webkitSpeechRecognition;this.rec=t,t.continuous=!0,t.interimResults=!1,t.lang="cmn-Hans-CN",t.onresult=function(t){console.log("on result"),console.log(t);var n=t.results[t.resultIndex][0].transcript;console.log("Recognised: ".concat(n)),e.message=n,e.send(e.message)},t.onstart=function(){console.log("on start"),e.status="初始化中"},t.onerror=function(){console.log("on start"),e.status="发生错误"},t.onend=function(){console.log("on end"),"1"===e.getType?t.start():e.status="未启动"},t.onspeechstart=function(){console.log("on speech start")},t.onspeechend=function(){console.log("on speech end")},t.onosundstart=function(){console.log("on sound start")},t.onsoundend=function(){console.log("on sound end")},t.onaudiostart=function(){console.log("on audio start"),e.status="监听中..."},t.onaudioend=function(){console.log("on audio end")}},init:function(){var e=localStorage.getItem("liveSpeechSetting")||"";if(e){var t=JSON.parse(e);this.isSpeech=!!t.isSpeech,this.avatar=t.avatar||"",this.cloudSel=t.cloudSel||"googleNiang",this.appkey=t.appkey||"",this.AccessToken=t.AccessToken||"",this.voice=t.voice||"xiaoyun"}this.avatarPre=this.avatar,this.toSocket(),this.initSpeech()}},created:function(){},mounted:function(){this.init()},beforeCreate:function(){},beforeMount:function(){},beforeUpdate:function(){},updated:function(){},beforeUnmount:function(){},unmounted:function(){},activated:function(){}};n("b6a9");X.render=E;var Z=X,ee=[{path:"/",name:"home",component:Z},{path:"/chat",name:"chat",component:function(){return n.e("chat").then(n.bind(null,"293a"))}},{path:"/speechcontrol",name:"SpeechControl",component:function(){return n.e("SpeechControl").then(n.bind(null,"7275"))}}],te=Object(i["a"])({history:Object(i["b"])("/"),routes:ee}),ne=te,oe=n("5502"),ce=Object(oe["a"])({state:{},mutations:{},actions:{},modules:{}}),ae=n("485c");n("4dcb"),n("e1ae"),n("098b"),n("4121"),n("bddf");Object(o["f"])(r).use(ce).use(ne).use(s["a"]).use(ae["a"]).mount("#app")},b6a9:function(e,t,n){"use strict";n("0864")}});
//# sourceMappingURL=app.021407e0.js.map