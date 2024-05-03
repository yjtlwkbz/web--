// 对axios的二次封装
// util文件夹就是对一些常用工具的封装,比如求时间的工具\发送请求的工具\计算三角形的工具......
// 1 那么还是第一步,导入axios
import axios from 'axios'

// 2 通过axios.create创建一个axios实例, 并用一个变量接收这个实例
const http = axios.create({
    baseURL: '/api',  //通用请求的地址前缀
    timeout: 10000 //超时时间
})


// 3 添加请求拦截器
// 直接拿axios官方文档的拦截器代码
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  });

// 4 暴露导出
export default http