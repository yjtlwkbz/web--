import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../view/Home.vue'
import User from '../view/User.vue'
import Main from '../view/Main.vue'
import Mall from '../view/Mall.vue'
import Page1 from '../view/Page1.vue'
import Page2 from '../view/Page2.vue'

Vue.use(VueRouter)

const routes = [
    // 主路由
    {
        path: '/',
        redirect: '/home', //重新定向，在主路由页面点击返回主路由页面
        component: Main,
        // 子路由
        children: [
            { path: 'home', component: Home },
            { path: 'user', component: User },
            { path: 'mall', component: Mall },
            { path: 'page1', component: Page1 },
            { path: 'page2', component: Page2 }
        ]
    }
]


const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
})


export default router