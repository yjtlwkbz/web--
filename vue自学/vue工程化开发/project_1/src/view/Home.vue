<template>
  <!-- el-row表示一行 -->
  <el-row>
    <!-- 表示一行里的内容,一共有24个栅格,span=12就相当于宽度占页面的50% -->
    <el-col :span="8"><div class="grid-content bg-purple">
        <el-card class="box-card" style="margin-top: 20px;">
            <div class="user">
              <img src="../../../../../岑家购/img/举报中心.avif" alt="">
              <div class="user-info">
                <p class="name">Admin</p>
                <p class="access">超级管理员</p>
              </div>
            </div>

            <div class="login-info">
                <p>上次登录时间: <span>2017-02-22</span></p>
                <p>上次登陆地点: <span>广东阳江 </span></p>
            </div>
        </el-card>

        <el-card class="table" style="margin-top: 30px; height: 460px;">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="names" label="课程"></el-table-column>
                <el-table-column prop="todayBuy" label="今日购买"></el-table-column>
                <el-table-column prop="monthBuy" label="本月购买"></el-table-column>
                <el-table-column prop="totalBuy" label="总购买"></el-table-column>
            </el-table>
        </el-card>
    </div></el-col>


    <el-col :span="16">
        <div class="num">
            <!-- element ui有时候组件需要在标签里设置样式,比如卡片组件要用body-style,而且因为是循环数组动态渲染,要:body-style动态设置(值用对象给) -->
            <el-card v-for="item in countData" :key="item.name" :body-style="{ display: 'flex',padding: 0 }">
              <i class="icon" :class="`el-icon-${item.icon}`" :style="{ background: item.color }"></i>
              <div class="detail">
                <p class="price">￥ {{ item.value }}</p>
                <p class="desc">{{ item.name }}</p>
              </div>
            </el-card>
        </div>
    </el-col>
</el-row>
</template>

<script>
// 怎么使用axios请求呢?
// 在util的request文件里封装好axios
// 然后在api里各个文件使用axios发送请求
// 然后在要用的地方导入使用即可(用解构的方式获取)
import { getData } from '../api'

export default {
    data(){
      return {
          tableData: [
          {
            names: "oppo",
            todayBuy: 100,
            monthBuy: 300,
            totalBuy: 800,
          },
          {
            names: "vivo",
            todayBuy: 100,
            monthBuy: 300,
            totalBuy: 800,
          },
          {
            names: "苹果",
            todayBuy: 100,
            monthBuy: 300,
            totalBuy: 800,
          },
          {
            names: "小米",
            todayBuy: 100,
            monthBuy: 300,
            totalBuy: 800,
          },
          {
            names: "三星",
            todayBuy: 100,
            monthBuy: 300,
            totalBuy: 800,
          },
          {
            names: "魅族",
            todayBuy: 100,
            monthBuy: 300,
            totalBuy: 800,
          },
        ],
        countData: [
          {
            name: "本月已到款",
            value: 20123,
            icon: "success",
            color: "#2ec7c9",
          },
          {
            name: "本月已完成订单",
            value: 210,
            icon: "star-on",
            color: "#ffb980",
          },
          {
            name: "本月未到款",
            value: 1211,
            icon: "s-goods",
            color: "#5ab1ef",
          },
          {
            name: "本日已到款",
            value: 0,
            icon: "success",
            color: "#2ec7c9",
          },
          {
            name: "本日已完成订单",
            value: 2,
            icon: "star-on",
            color: "#ffb980",
          },
          {
            name: "今日未支付",
            value: 231,
            icon: "s-goods",
            color: "#5ab1ef",
          },
        ]
      }
    },
    // 对于数据请求,在生命周期里不限于在created还是mounted,看个人喜好
    mounted(){
      // 注意getData是通过http.get()请求后返回的一个Promise对象,要使用它的.then()方法,千万记住要带(),不要getData.then()
      getData().then(res => {
        console.log(res)
      })
    }
}
</script>

<style lang="less" scoped>
.user{
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;

  img{
    margin-right: 40px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }

  .user-info{
    .name{
      font-size: 32px;
      margin-bottom: 10px;
    }
    
    .access{
      color: #999999;
    }
  }
}

.login-info{
    p{
      font-size: 14px;
      line-height: 28px;
      color: #999999;
      span{
        color: #666666;
        margin-left: 60px;
      }
    }
}

.table{
  overflow: hidden;
}

.num{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .el-card{
    width: 32%;
    margin-bottom:20px;
  }


  .icon{
    width: 80px;
    height: 80px;
    font-size:30px;
    text-align: center;
    line-height: 80px;
    color: #fff;
  }

  .detail{
    margin-left: 15px;
    display: flex;
    flex-direction:column;
    justify-content: center;

    .price{
      font-size: 30px;
      margin-bottom:10px;
      line-height: 30px;
      height: 30px;
    }
    .desc{
      font-size: 14px;
      color: #999;
      text-align: center;
    }

  }
}
</style>