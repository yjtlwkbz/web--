<template>
  <div>
    Page1
    <button @click="chufa">点一下</button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    methods:{
      chufa(){
        axios.get(`https://aa.hzxlmagnet.net/news/get/${1}`, {
          // "code" : "0c3d5U0w34jWC23kXT0w3pqBMc3d5U0J"
          // withCredentials: true,  // 发送跨域请求时需要携带凭据（比如cookies）
          // headers: {
          // 'Access-Control-Allow-Origin': '*'  // 设置允许访问的来源
          // }
        }).then(response => {
            console.log(response);
        }).catch(error => {
          console.error(error);
        });
      }
    }
}
</script>

<style>

</style>