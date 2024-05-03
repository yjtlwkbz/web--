<template>
  <!-- 组件 -->
  <div class="App">
      <!-- 自定义头部组件 -->
      <MyHeader></MyHeader>

      <!-- 自定义主体组件 -->
      <MyMain></MyMain>

      <!-- 自定义底部组件 -->
      <MyFooter></MyFooter>

      <MyCounter></MyCounter>
      <MyCounter></MyCounter>
    </div>
</template>

<script>
import MyHeader from './components/MyHeader.vue';
import MyMain from './components/MyMain.vue';
import MyFooter from './components/MyFooter.vue';
import MyCounter from './components/MyCounter.vue';

export default {
  components: {
    // MyHeader: MyHeader,
    // MyMain: MyMain,
    // MyFooter: MyFooter
    // '组件名' : '组件对象'
    MyHeader,
    MyMain,
    MyFooter,
    MyCounter
    //【组件名】就是上面<template>要用的“标签名字”，【组件对象】就是import的那个名字
    //那么如果组件名和组件对象是同名的情况，就可以省略后面【: 组件对象】了
  }
}
</script>

<style scoped>
  .App{
    width: 600px;
    height: 700px;
    background-color: aqua;
    margin: 0 auto;
    padding: 20px;
  }
</style>