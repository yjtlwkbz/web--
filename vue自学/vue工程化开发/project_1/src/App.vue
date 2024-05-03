<template>
  <div>
    <!-- 主路由 -->
    <!-- router路由，当页面到了对应的路由，就会在这显示对应路由的内容 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  components: {
  },
  data(){
    return {
      
    }
  }
}
</script>

<style lang="less">
  body,html,p{
    margin: 0;
    padding: 0;
  }
</style>
