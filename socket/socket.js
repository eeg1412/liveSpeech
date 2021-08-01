
const utils = require('../utils/utils');

module.exports = (io) => {
    // console.log(io);
    const chat = io
        .of('/socketchat')
        .on('connection', function (socket) {
            socket.on('send', (data) => {
                chat.emit('msg', data);
            });
        });
};