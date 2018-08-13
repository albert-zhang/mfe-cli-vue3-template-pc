module.exports = {
  presets: [
    "@vue/app"
  ],
  "plugins": [
    ["component", {
      "libraryName": "element-ui",
      "styleLibraryName": "theme-chalk"
    }],
    ["import", {
      "libraryName": "@mydreamplus/aglarond",
      "libraryDirectory": "lib"
    }]
  ]
}
