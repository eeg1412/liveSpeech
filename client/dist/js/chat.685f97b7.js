(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chat"],{"1dde":function(t,e,n){var o=n("d039"),c=n("b622"),a=n("2d00"),i=c("species");t.exports=function(t){return a>=51||!o((function(){var e=[],n=e.constructor={};return n[i]=function(){return{foo:1}},1!==e[t](Boolean).foo}))}},"293a":function(t,e,n){"use strict";n.r(e);var o=n("7a23"),c={key:0,class:"kaiwa"},a={class:"kaiwa-img-right"},i={class:"kaiwa-text-left"},r={class:"kaiwa-text"};function s(t,e,n,s,u,f){return Object(o["t"])(),Object(o["g"])("div",null,[Object(o["j"])(o["c"],{name:"fade"},{default:Object(o["H"])((function(){return[u.chatShow?(Object(o["t"])(),Object(o["g"])("div",c,[Object(o["j"])("figure",a,[Object(o["j"])("img",{src:u.avatar,alt:"no-img2"},null,8,["src"])]),Object(o["j"])("div",i,[Object(o["j"])("p",r,Object(o["D"])(u.chat||"..."),1)])])):Object(o["h"])("",!0)]})),_:1})])}n("99af");var u=n("8055"),f=n.n(u),l={name:"chat",components:{},data:function(){return{chat:"",chatShow:!1,chatShowTimer:null,socket:null,isSpeech:!1,avatar:"https://i.loli.net/2021/08/01/SFHndyel1UJx6wL.png",cloudSel:"googleNiang",appkey:"",AccessToken:"",voice:"xiaoyun"}},computed:{},watch:{},methods:{playVoice:function(t){if(this.isSpeech){var e="";switch(this.cloudSel){case"aliyun":e="https://nls-gateway.cn-shanghai.aliyuncs.com/stream/v1/tts?appkey=".concat(this.appkey,"&token=").concat(this.AccessToken,"&text=").concat(encodeURI(this.chat),"&format=mp3&sample_rate=16000&voice=").concat(this.voice);break;case"googleNiang":e=t;break;default:break}if(e){var n=new Audio(e);n.load(),n.play()}}},toSocket:function(){var t=this;this.socket=f.a.connect("/socketchat"),this.socket.on("msg",(function(e){console.log(e),t.chat=e.message,t.$nextTick((function(){t.chatShow=!0,t.playVoice(e.voiceUrl)})),clearTimeout(t.chatShowTimer),t.chatShowTimer=setTimeout((function(){t.chatShow=!1}),1e3*t.chat.length)})),this.socket.on("getSettingData",(function(e){console.log(e),t.isSpeech=!!e.isSpeech,t.avatar=e.avatar||"https://i.loli.net/2021/08/01/SFHndyel1UJx6wL.png",t.cloudSel=e.cloudSel||"googleNiang",t.appkey=e.appkey||"",t.AccessToken=e.AccessToken||"",t.voice=e.voice||"xiaoyun"})),this.socket.on("connect",(function(){console.log("已连接")})),this.socket.on("disconnect",(function(){console.log("已断开")}))}},created:function(){this.toSocket()},mounted:function(){},beforeCreate:function(){},beforeMount:function(){},beforeUpdate:function(){},updated:function(){},beforeUnmount:function(){this.socket.close()},unmounted:function(){},activated:function(){}};n("ffd1");l.render=s;e["default"]=l},"65f0":function(t,e,n){var o=n("861d"),c=n("e8b5"),a=n("b622"),i=a("species");t.exports=function(t,e){var n;return c(t)&&(n=t.constructor,"function"!=typeof n||n!==Array&&!c(n.prototype)?o(n)&&(n=n[i],null===n&&(n=void 0)):n=void 0),new(void 0===n?Array:n)(0===e?0:e)}},8418:function(t,e,n){"use strict";var o=n("c04e"),c=n("9bf2"),a=n("5c6c");t.exports=function(t,e,n){var i=o(e);i in t?c.f(t,i,a(0,n)):t[i]=n}},"99af":function(t,e,n){"use strict";var o=n("23e7"),c=n("d039"),a=n("e8b5"),i=n("861d"),r=n("7b0b"),s=n("50c4"),u=n("8418"),f=n("65f0"),l=n("1dde"),h=n("b622"),d=n("2d00"),p=h("isConcatSpreadable"),v=9007199254740991,g="Maximum allowed index exceeded",b=d>=51||!c((function(){var t=[];return t[p]=!1,t.concat()[0]!==t})),k=l("concat"),w=function(t){if(!i(t))return!1;var e=t[p];return void 0!==e?!!e:a(t)},y=!b||!k;o({target:"Array",proto:!0,forced:y},{concat:function(t){var e,n,o,c,a,i=r(this),l=f(i,0),h=0;for(e=-1,o=arguments.length;e<o;e++)if(a=-1===e?i:arguments[e],w(a)){if(c=s(a.length),h+c>v)throw TypeError(g);for(n=0;n<c;n++,h++)n in a&&u(l,h,a[n])}else{if(h>=v)throw TypeError(g);u(l,h++,a)}return l.length=h,l}})},e8b5:function(t,e,n){var o=n("c6b6");t.exports=Array.isArray||function(t){return"Array"==o(t)}},e8f3:function(t,e,n){},ffd1:function(t,e,n){"use strict";n("e8f3")}}]);
//# sourceMappingURL=chat.685f97b7.js.map