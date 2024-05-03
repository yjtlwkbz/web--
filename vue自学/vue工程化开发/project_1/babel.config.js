module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    // 配置局部Element UI
    ["@babel/preset-env", { "modules": false }]
  ],
  // 也是配置局部Element UI
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
