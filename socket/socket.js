
const utils = require('../utils/utils');

module.exports = (io) => {
    // console.log(io);
    const chat = io
        .of('/socketchat')
        .on('connection', function (socket) {
            socket.emit('getSettingData', global.myAppConfig);
            socket.on('send', (data) => {
                chat.emit('msg', data);
            });
            socket.on('settingData', (data) => {
                global.myAppConfig = data
                chat.emit('getSettingData', global.myAppConfig);
            });
        });
};