// api文件夹对应的就是对各个服务器\或者后端发送的不同的请求,比如物流数据请求\图片资源请求\登陆注册请求
// 第一步:还是导入
import http from '../utile/request'

//请求首页数据的方法,并导出
export const getData = () => {
    // 返回一个Promise对象
    return http.get('/home/getData')
}