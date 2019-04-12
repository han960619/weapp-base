import Taro from '@tarojs/taro';
import store from '../store'

export default async (url, options = { method: 'GET', data: {} }, needToken = true) => {
  let domain = 'https://wxapp.xiaomafeiteng.com'

  let request = (data = {}) => {
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
      query.header.token = Taro.getStorageSync('token')
    }
    return Taro.request(query)
  }

  let resp = await request().then(res => res).catch(err => ({error: 1, ...err}));

  if (resp.error !== 1) {
    return loopFetch(resp)
  } else {
    Taro.redirectTo({
      url: '/pages/error-page/index'
    })
    return {error: 1, timeout: 1}
  }

  async function loopFetch(res) {

    const { statusCode, data } = res;

    if (statusCode >= 200 && statusCode < 300) {
      if (+data.code === 200) {

        return data.data;

      } else if(+data.code === 201 && !options.no_const) { //未登录
        if (Taro.getStorageSync('stopLogin') === 1) {

          // 并发请求正在登陆
          let response = await (() => {
            return new Promise((resolve) => {
              Taro.eventCenter.on('loginedRequest', (payload) => {
                request(payload).then(re => {
                  resolve(re)
                })
              })
            })
          })()
          return loopFetch(response)
        } else {

          //无并发请求正在登陆，执行登陆请求
          Taro.removeStorageSync('userInfo')
          const userData = Taro.getStorageSync('userData')
          let r = await store.dispatch({
            type: 'common/login',
            payload: userData
          })

          let response = await request(userData)
          return loopFetch(response)
        }
      }else {
        return data
      }

    }else {
      Taro.redirectTo({
        url: '/pages/error-page/index'
      })
      console.log(`网络请求错误，状态码${statusCode}`);
      return {error: 1}
    }
  }

}

