import Taro, { Component, getApp } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'
import EmptyPage from '../../components/EmptyContent'
import noUserPng from '../../assets/images/noUser.png'

@connect(({common}) => ({...common}))

export default class NoUser extends Component {

  config = {
    navigationBarTitleText: '账号停用',
    disableScroll: true
  }

  state = {
  }

  backIndex = () => {
    Taro.reLaunch({
      url: '/pages/storeList/index'
    })
	}

  render () {
    return (
      <View class='no-user-page'>
        <EmptyPage 
          tip='抱歉，当前员工账号已被停用'
          image={noUserPng}
          onAction={() => {this.backIndex()}}
          buttonText='我知道了'
        >
        </EmptyPage>
      </View>
    )
  }
}

