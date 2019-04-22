import Taro from '@tarojs/taro';
import store from '../store'
import toastPng from '../assets/images/toast-warn.png'
export default function request(url, options = { method: 'GET', data: {} }, needToken = true) {
  let domain = 'https://wxapp.xiaomafeiteng.com'

  let query = {
    url: domain + url,
    data: {
      version: '1.0.29',
      ...options.data,
    },
    header: {
      'Content-Type': 'application/json',
    },
    method: options.method,
  }
  if (needToken) {
    query.header.Authorization = Taro.getStorageSync('token')
  }
  
  return Taro.request(query).then((res) => {
    const { statusCode, data } = res;
    if (statusCode >= 200 && statusCode < 300) {
      if (+data.code === 200) {
        return data.data
      } else if(+data.code === 201) { 
        //未登录 重新登录 跳登录
        Taro.removeStorageSync('token')
        Taro.redirectTo({
          url: '/pages/login/index'
        })
      } else if(+data.code === 202) { 
        Taro.navigateTo({ url: '/pages/noUser/index' })
      } else if(+data.code === 203) { 
        //替换页面还是toast提示
        Taro.showToast({
          title: '用户无权限',
          image: toastPng,
          mask: true,
          duration: 2000
        }).then(() =>{
          setTimeout(() => {
            Taro.navigateBack()
          }, 2000)
        })
        return '203'
      } else {
        Taro.showToast({
          title: data.message,
          image: toastPng,
          mask: true,
          duration: 2000
        })
        return
      }
    }else {
      Taro.redirectTo({
        url: '/pages/error-page/index'
      })
      console.log(`网络请求错误，状态码${statusCode}`);
      return new Error('网络请求出错')
    }
  }).catch(() => {
    Taro.redirectTo({
      url: '/pages/error-page/index'
    })
  })

};

