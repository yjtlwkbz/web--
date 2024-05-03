<template>
  <div>
    <!-- v-model原理就是【v-bind:value="xxx"】+【@事件="进行对value数据的操作"】 -->
    <!-- 为什么不直接用v-model呢？因为直接用v-model数据双向流通的话，下拉菜单一改不就把city_value这个父亲传过来的值改了吗？但是【儿子是不可以直接改父亲的值的】 -->
    <!-- 所以要拆成底层原理这样，然后通过【@事件="进行对value数据的操作"】把修改的值传给父亲组件那边，让父组件在自己那边修改 -->
    <select :value="city_value" @change="changeSelect">
        <option value="上海">上海</option>
        <option value="北京">北京</option>
        <option value="阳江">阳江</option>
        <option value="舟山">舟山</option>
        <option value="佛山">佛山</option>
    </select>
  </div>
</template>

<script>
export default {
    props: {
        'city_value': String
    },
    methods: {
        changeSelect(e){
            console.log(e.target.value)
            this.$emit('changeCity',e.target.value)
        }
    }
}
</script>

<style>

</style>