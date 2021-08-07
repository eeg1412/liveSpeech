# 语音合成虚拟主播
简单来说就是将主播说的话通过神经网络黑科技合成另外一种声音的OBS工具
## 效果图：
live2d模式  
![image](https://user-images.githubusercontent.com/27753071/128522743-18f1dc9a-ef6e-435f-84b8-ca8bd3628ee6.png)


对话气泡模式  
![QQ截图20210801181431](https://user-images.githubusercontent.com/27753071/127765918-435d53b0-05d1-44f7-a3ef-aba828899807.png)

## 视频演示：
[哔哩哔哩](https://www.bilibili.com/video/BV1a3411r7B8/)

## 使用方法
1.在[releases](https://github.com/eeg1412/liveSpeech/releases)下载最新版  
2.下载nodejs  
3.cmd在文件夹中执行npm install安装依赖  
4.执行npm run start启动    
5.用chrome或者edge打开http://localhost:3000/ 进行配置更改  
6.在obs中添加浏览器，地址为http://localhost:3000/chat 或者 http://localhost:3000/live2d   
7.在obs中点击左上角菜单 【视图】→【停靠部件】→【自定义浏览器 Dock】中添加控制器http://localhost:3000/speechcontrol  

## 最终在OBS中的效果
![image](https://user-images.githubusercontent.com/27753071/128595433-df829087-0d0e-4b85-bc62-19154baf4c5f.png)
