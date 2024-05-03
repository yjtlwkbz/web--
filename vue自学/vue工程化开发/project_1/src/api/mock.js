import Mock from 'mockjs'
import homeApi from './mockServeData/home'

// 定义mock请求拦截
// 传三个参数,第一个是要拦截的请求路径,第二个是请求方式,第三个是拦截到之后要干什么
// Mock.mock('/api/home/getData','get',function(){
//     //拦截到之后要干什么
//     console.log('拦截到了')
// })

Mock.mock('/api/home/getData','get',homeApi.getStatisticalData)