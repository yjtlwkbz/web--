<template>
    <el-menu default-active="1-4-1" 
             class="el-menu-vertical-demo" 
             @open="handleOpen" 
             @close="handleClose" 
             :collapse="isCollapse"
             background-color="#545c64"
             text-color="#fff"
             active-text-color="#ffd04b"
    >
      
      <!-- 这里根据点击外部按钮把侧边栏展开\收起,来动态控制大标题是全部显示\还是只显示"后台"两字 -->
      <h3>{{ isCollapse? '后台':'岑梓铭后台管理系统' }}</h3>

      <!-- 这里是普通的前三项导航页面数据（没有子数据、下拉菜单）  -->
      <el-menu-item v-for="item in noChildren" :key="item.name" :index="item.name" @click="clickMenu(item)">
        <!-- 一定要有key，不过用v-for自带的index会出问题，那么不一定要在成员里一定设置一个id，只要用“唯一”的属性也行 -->
        <i :class="`el-icon-${item.icon}`"></i>
        <span slot="title">{{item.label}}</span>
      </el-menu-item>
    
      <!-- 这一项是最后有子数据的导航页面数据，有下拉菜单 -->
      <el-submenu v-for="item in hasChildren" :key="item.label" :index="item.label">
        <template slot="title">
          <i :class="`el-icon-${item.icon}`"></i>
          <span slot="title">{{item.label}}</span>
        </template>
        <!-- 这是子数据（下拉菜单），在item的基础上去遍历item里的children这个数组的数据 -->
        <el-menu-item-group v-for="subItem in item.children" :key="subItem.path">
          <el-menu-item :index="subItem.path" @click="clickMenu(subItem)">{{subItem.label}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

  </el-menu>
</template>

  
<style lang="less" scoped>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
      min-height: 400px;
    }

    .el-menu{
      height: 100vh;
      /* vh就是当前屏幕可见高度的1%，也就是说
      height:100vh == height:100%;
      但是当元素没有内容时候，设置height:100%，该元素不会被撑开，此时高度为0，
      但是设置height:100vh，该元素会被撑开与屏幕高度一致。
      总结：设置height:100vh，能够保证元素无论是否有没有内容，高度都等于屏幕高度 */
      h3 {
        text-align: center;
        color: #fff;
      }
    }
</style>
  
<script>
    export default {
      data() {
        return {
          // 这里是一开始在自身组件控制侧边栏展不展开的属性,当我们在别的组件控制时,用到了store的修改state方法
          // 那这个属性就要设置在computed而不是data里了
          // isCollapse: false,
          menuData: [
              //这里是普通的前三项导航页面数据（没有子数据、下拉菜单） 
              {
                path: "/",
                name: "home",
                label: "首页",
                icon: "s-home",
                url: "Home/Home",
              },
              {
                path: "/mall",
                name: "mall",
                label: "商品管理",
                icon: "video-play",
                url: "MallManage/MallManage",
              },
              {
                path: "/user",
                name: "user",
                label: "用户管理",
                icon: "s-home",
                url: "UserManage/UserManage",
              },
              //这一项是最后有子数据的导航页面数据，有下拉菜单
              {
                label: "其他",
                icon: "location",
                //子数据
                children: [
                    {
                      path: "/page1",
                      name: "page1",
                      label: "页面1",
                      icon: "setting",
                      url: "Other/PageOne",
                    },
                    {
                      path: "/page2",
                      name: "page2",
                      label: "页面2",
                      icon: "setting",
                      url: "Other/PageTwo",
                    }
                ] 
              }
          ]
        };
      },
      methods: {
        handleOpen(key, keyPath) {
          console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
          console.log(key, keyPath);
        },
        // 点击菜单切换页面事件
        clickMenu(item){
          console.log(item)
          // 这个就是把已经挂载到main.js里的router直接拿来用，调用push方法就可以跳转页面了
          // this.$router.push(item.path)

          // 但是我们发现，如果你在一个页面重复跳转它自己，就会报错，那这里就要进行判断
          // 1、这里$route是专门用来获取当前（跳转之前）的页面的路径，item.path则是传过来、要即将跳转的路径
          // 2、this.$route.path == '/home' && item.path == '/'是判断在主路由页面重定向成‘/home’主页面、并且传过来的路由是“/”（也是主页面路径）
          if( this.$route.path !== item.path && !(this.$route.path == '/home' && item.path == '/') ){
            this.$router.push(item.path)
          }
        }
      },
      // 用计算属性来【分组】：数据里有“子数据”的一组，没有的一组
      computed: {
        noChildren(){
          //filter方法：遍历到数组每个成员，根据return的是true还是false，来决定返不返回当前遍历到的这个成员
          //那么这里就是：如果menuData数组里这个对象成员没有children属性，那么!item.children将返回true
          //注意这个方法不会改变原本数组的内容，只会把筛选后的新内容数组返回给这个【计算属性】函数
          return this.menuData.filter(item => !item.children)
        },
        hasChildren(){
          return this.menuData.filter(item => item.children)
        },
        // 记住了别犯这种白痴问题！计算属性要return结果的！

        // 固定写法,一定要在computed里写,然后下面那个我也不懂,反正固定按这么写就行了
        isCollapse(){
          return this.$store.state.tab.isCollapse
        }
      }
    }
</script>