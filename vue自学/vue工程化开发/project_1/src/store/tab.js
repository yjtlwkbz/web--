export default{
    // <!-- 思路是利用vuex的store,点击按钮去触发store当中state的修改的方法,然后在aside侧边导航栏组件中获取state的结果并使用它 -->
    state: {
        isCollapse: false //这个值就是之前在Aside侧边导航栏里控制它展开还是收起的变量
                          //现在在这里设置是利用vuex,点击顶部一个按钮来控制它展开还是收起
    },
    mutations: {
        //修改菜单展开\收起的方法
        collapseMenu(state){
            state.isCollapse = !state.isCollapse
            // 直接把state的isCollaps取反即可
        }
    }
}