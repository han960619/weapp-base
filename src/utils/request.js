import Taro from '@tarojs/taro';

/**
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "httpRequest"
 * @return {string} needToken   判断接口是否需要token及token放置位置 参数枚举：'url', 'data', ''
 */
export default function request(url, options = { method: 'GET', data: {} }, needToken = true, noPower = 2) {
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
        return '202'
      } else if(+data.code === 203) { 
        //替换页面还是toast提示
        if(noPower == 2) {
          Taro.showToast({
            title: '抱歉，您暂无相关权限',
            icon: 'none',
            mask: true,
            duration: 2000
          })
        }else if(noPower == 3){
          Taro.showToast({
            title: '抱歉，您暂无相关权限',
            icon: 'none',
            mask: true,
            duration: 2000
          }).then(() =>{
            setTimeout(() => {
              Taro.navigateBack()
            }, 2000)
          })
        }
        return '203'
      } else if(+data.code === 404) { 
        return '404'
      } else {
        Taro.showToast({
          title: data.message,
          mask: true,
          icon: 'none',
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

