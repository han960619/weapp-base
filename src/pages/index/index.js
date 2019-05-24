import Taro, { Component, getApp } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'

@connect(({common}) => ({...common}))

export default class Index extends Component {

  config = {
    navigationBarTitleText: ''
  }

  state = {
  }

  componentWillMount () {
    const token = Taro.getStorageSync('token')
    if(token) {
      Taro.reLaunch({
        url: 'pages/storeList/index'
      })
    }else {
      Taro.redirectTo({
        url: '/pages/login/index'
      })
    }
  }

  componentDidMount () {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View>
      </View>
    )
  }
}

