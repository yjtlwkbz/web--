<template>
  <div class="header-container">
    <!-- 顶部左边的按钮和"首页"两字 -->
    <div class="l-content">
      <!-- 这个按钮控制侧边导航栏展不展开 -->
      <!-- 思路是利用vuex的store,点击按钮去触发store当中state的修改的方法,然后在aside侧边导航栏组件中获取state的结果并使用它 -->
      <el-button icon="el-icon-menu" size="mini" @click="handelMenu()"></el-button>
      <!-- 面包屑 -->
      <span class="text">首页</span>
    </div>

    <!-- 右侧头像(包含下拉菜单) -->
    <div class="r-content">
        <el-dropdown>
            <span class="el-dropdown-link">
              <img class="user" src="../../../../../岑家购/img/举报中心.avif" alt="">
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  methods:{
    handelMenu(){
      // 这个$store跟$router一样,都是我们做了一系列操作:[npm下载]->[创建文件夹和index.js]->[index.js里import vue和vuex这些]
      //->[设置好配置,export default暴露]->[再到main.js里]import这个index.js->[最后在new Vue里面挂载]->才能直接使用
      this.$store.commit('collapseMenu')
      //使用commit方法调用store的tab里的修改state的方法: collapseMenu()
    }
  }
}
</script>

<style lang="less">
.header-container{
    padding: 0 20px;
    background-color: #333;
    height: 60px;
    display: flex;
    justify-content: space-between;
    /* 别跟align-content搞混了 */
    align-items: center;
    .text{
      color: #fff;
      font-size: 14px;
      margin-left: 10px;
    }

    .r-content{
      .user{
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }
}

</style>