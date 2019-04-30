import axios from 'axios'
import store from '@/store'

// 创建axios实例
const request = axios.create({
  withCredentials: true,
  baseURL: process.env.YUYAN_API,
  timeout: 35000
})

// request拦截器
request.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['X-Ivanka-Token'] = store.getters.token
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
request.interceptors.response.use(
  response => {
    // code为非200是抛错
    const res = response.data
    // eslint-disable-next-line
    if (res.code != 200) {
      const message = res.message ? res.message : res.msg
      // Message({
      //   message: message,
      //   type: 'error',
      //   duration: 5 * 1000
      // })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      // eslint-disable-next-line
      if (res.code == 401) {
        store.dispatch('FedLogOut').then(() => {
          // Message.error({
          //   message: '你已被登出, 请重新登录',
          //   duration: 500,
          //   onClose: function() {
          //     location.href = '/Kaiman/login/logout.html'
          //     location.reload()// 为了重新实例化vue-router对象 避免bug
          //   }
          // })
        })
      }

      return Promise.reject(message)
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export { request }
