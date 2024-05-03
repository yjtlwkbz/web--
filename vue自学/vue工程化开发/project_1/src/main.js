// 文件核作用：导入App.vue，基于App.vue创建结构渲染index.html

// 1、导入vue核心包
import Vue from 'vue'
// 2、导入App.vue根组件
import App from './App.vue'
//全局组件
import MyButton from './components/MyButton'


// 全局引用Element UI的所有组件
import ElementUI from 'element-ui';
// 局部引用Element UI的部分组件
// import { Button, Select } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import router from './router';

import store from './store';

import './api/mock'


// 全局引用Element UI的所有组件
Vue.use(ElementUI);
// 局部引用Element UI的部分组件
// Vue.use(Button);
// Vue.use(Select);

//提示：当前处于什么环境（生产环境 / 开发环境）
Vue.config.productionTip = false

//进行全局注册
Vue.component('MyButton' ,  MyButton)

// 3、vue实例化，提供render方法——>基于App.vue创建结构渲染index.html
//以前我们学的vue模板写法
// new Vue({
//   el: '#app',
//   render: h => h(App),
// })

//现在的写法，效果一样
new Vue({
  // render: h => h(App),
  // render函数完整写法
  //以前我们是在HTML里用{{ }}来创建vue渲染的结构，而现在是用App.vue，而App.vue就需要搭配main.js里的render函数来创建渲染结构
  render: (createElement) => {
    //基于App.vue创建渲染结构
    return createElement(App)
  },
  router,
  store

  //箭头函数return简写不就是
  // render: createElement => createElement(App),

  //再把形参createElemrnt换成h不就行了
  // render: h => h(App)
}).$mount('#app')
