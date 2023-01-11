//  ./为当前目录， true为是否匹配当前文件夹    /\.vue$/为匹配插件(匹配.vue结尾的插件)
const requireComponent = require.context('./', true, /\.vue$/);
const install = (Vue) => {

  if (install.installed) return
  else install.installed

    requireComponent.keys().forEach(fileName => {
        console.log("88888");
        console.log(fileName);
    const config = requireComponent(fileName)
    const componentName = config.default.name
    Vue.component('wf-' + componentName, config.default || config)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install
}