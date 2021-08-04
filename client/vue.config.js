module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      title: '直播语音转换',
    },
  },
  devServer: {
    https: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000/api',
        changeOrigin: true,
        // ws: true,
        pathRewrite: {
          '/api': '',
        },
      },
      '/socketchat': {
        target: 'http://127.0.0.1:3000/chat',
        changeOrigin: true,
        ws: true,
      },
      '/socket.io': {
        target: 'http://127.0.0.1:3000/socket.io',
        changeOrigin: true,
        // ws: true,
        pathRewrite: {
          '/socket.io': '',
        },
      },
    },
  },
}
