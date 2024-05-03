<template>
    <div>
        <el-container>
            <el-aside width="auto">
                <HoutaiAside />
                <!-- 这样也行 -->
            </el-aside>
            <el-container>
                <el-header>
                    <HoutaiHeader></HoutaiHeader>
                    <!-- 这样也行 -->
                </el-header>
                <!-- 这一块放路由区域 -->
                <el-main>
                    <!-- 主路由 -->
                    <!-- router路由，当页面到了对应的路由，就会在这显示对应路由的内容 -->
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import { Header } from 'element-ui';
import HoutaiAside from '../components/HoutaiAside.vue';
import HoutaiHeader from '../components/HoutaiHeader.vue';
export default {
    components: {
        HoutaiAside,
        HoutaiHeader
    }
}
</script>

<style>
/* 这些element ui自带的样式会影响我们实际开发想要的效果,
要想知道怎么调,就要到浏览器F12检查,然后在源码里调试就能知道是哪个元素用了什么样式,怎么改 */

/* 去除侧边导航栏自带的滚动条 */
.el-aside{
    overflow: hidden;
}
/* 去除头部自带的间隔 */
.el-header{
    padding: 0;
}
/* 去除侧边导航栏跟头部之间的自带的边界样式 */
.el-menu{
    border-right: none;
}
</style>