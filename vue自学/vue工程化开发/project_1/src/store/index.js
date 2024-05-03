import Vue from 'vue'
import Vuex from 'vuex'
import tab from './tab'

Vue.use(Vuex)

//创建vuex实例
export default new Vuex.Store({
    // 模块化管理
    modules: {
        //引入tab模块
        // <!-- 思路是利用vuex的store,点击按钮去触发store当中state的修改的方法,然后在aside侧边导航栏组件中获取state的结果并使用它 -->
        // store的state的改变方法就在tab
        tab
    }
})