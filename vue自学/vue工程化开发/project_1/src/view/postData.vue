<template>
      <!-- 组件传数据 -->
      <div>
      <!-- 【:city_value="city"】是为了把数据传给儿子，
          【city_value】是自定义属性（理解为形参），子组件那边也只能用这个名字接收值，
          【city】就是父组件data的值（理解为实参） -->
      <!-- 【@changeCity="city = $event"】是为了接收儿子传过来的值，
          【@changeCity】是儿子组件自定义的事件，它只要发送过来就是触发这个事件，
          【$event】是“事件形参”，儿子传过来的值就是“事件”的内容 -->
      <CitySelect :city_value="city" @changeCity="city = $event"></CitySelect>
      <span>{{ city }}</span><!-- 这一块是为了测试子组件（下拉菜单）改了的时候，值能否传过来并改了父组件的city的值 -->
    </div>
</template>

<script>
import CitySelect from './components/CitySelect.vue';

export default {
    components: {
    // '组件名' : '组件对象'
    CitySelect
    //【组件名】就是上面<template>要用的“标签名字”，【组件对象】就是import的那个名字
    //那么如果组件名和组件对象是同名的情况，就可以省略后面【: 组件对象】了
  },
  data(){
    return {
      city: '北京' //在父亲设置到初始值，传给儿子
    }
  }
}
</script>

<style>

</style>