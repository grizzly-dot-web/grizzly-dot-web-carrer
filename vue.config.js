module.exports = {
  // ...
  pluginOptions: {
    lintStyleOnBuild: true,
    stylelint: {
      fix: true, // boolean (default: true)
      //files: ['src/**/*.{vue,htm,html,css,sss,less,scss}'])
      // See https://stylelint.io/developer-guide/formatters/
      //formatter: () => {} // function (default: require('stylelint-codeframe-formatter'))
      // etc...
    }
  }
}
