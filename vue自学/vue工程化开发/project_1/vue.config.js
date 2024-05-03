const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false //关闭eslint校验（也就是有的时候你漏个分号、或者单词命名不标准，会强制给你报个错，很烦）
})
