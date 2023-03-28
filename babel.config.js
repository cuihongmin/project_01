// module.exports = {
//   presets: [
//     '@vue/app'
//   ]
// }
module.exports = {
  presets: [
    // https://github.com/vuejs/vue-cli/tree/master/packages/@vue/babel-preset-app
    '@vue/app'
  ],
  'env': {
    'development': {
      // babel-plugin-dynamic-import-node plugin only does one thing by converting all import() to require().
      // This plugin can significantly increase the speed of hot updates, when you have a large number of pages.
      'plugins': ['@babel/plugin-proposal-optional-chaining','@babel/plugin-proposal-nullish-coalescing-operator']
    }
  }
}
