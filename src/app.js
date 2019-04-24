import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import Index from './pages/index'

import store from './store'

import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {v
//   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/login/index',
      'pages/order/index',
      'pages/resetPassword/index',
      'pages/order/cancel/index',
      'pages/order/detail/index',
      'pages/order/refund/index',
      'pages/order/search/index',
      'pages/setting/order/index',
      'pages/setting/printer/index',
      'pages/setting/addPrinter/index',
      'pages/setting/repast/index',
      'pages/setting/takeaway/index',
      'pages/store/index',
      'pages/store/goods/index',
      'pages/store/searchGoods/index',
      'pages/store/asset/index',
      'pages/store/setting/index',
      'pages/store/data/index',
      'pages/storeList/index',
      'pages/desk/index',
      'pages/noUser/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      borderStyle: 'black',
      color: '#CCCCCC',
      backgroundColor: '#fff',
      selectedColor: '#FF8F1F',
      list: [
        { pagePath: 'pages/order/index', iconPath: 'assets/images/desk.png', selectedIconPath: 'assets/images/desk1.png', text: '订单' },
        { pagePath: 'pages/desk/index', iconPath: 'assets/images/order.png', selectedIconPath: 'assets/images/order1.png', text: '工作台' },
        { pagePath: 'pages/store/index', iconPath: 'assets/images/store.png', selectedIconPath: 'assets/images/store1.png', text: '门店' }
      ]
    }
  }

  componentDidMount () {
    const token = Taro.getStorageSync('token')
    if(token) {
      Taro.reLaunch({
        url: 'pages/store/index'
      })
    }else {
      Taro.redirectTo({
        url: '/pages/login/index'
      })
    }
  }

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
