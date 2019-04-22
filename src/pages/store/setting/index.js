import Taro, { Component, getApp } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'
import classnames from 'classnames'
import businessCheckPng from '../../../assets/images/business-check.png'
import businessPng from '../../../assets/images/business.png'
import restPng from '../../../assets/images/rest.png'
import restCheckPng from '../../../assets/images/rest-check.png'
import usedPng from '../../../assets/images/used.png'
import bgPng from '../../../assets/images/storeSetting.png'

@connect(({store}) => ({...store}))
export default class StoreSetting extends Component {

  config = {
    navigationBarTitleText: '我的设置',
    navigationBarBackgroundColor: '#FF8E1F',
    navigationBarTextStyle: 'white'
  }

  state = {
    status: 1

  }

  componentWillMount() {
    const { params: { status = 1 } } = this.$router
    this.setState({
      status
    })
  }

  calcHourZone = () => {
    let hour = new Date().getHours()
    if (hour >=6 && hour < 10) {
      return '早上好，越努力越幸运哦！';
    } else if (hour > 10 && hour < 20) {
      return '机会总是倾向于有准备的人';
    } else if (hour >=20 || hour < 6) {
      return '夜里凉，请注意保暖'
    }
  }

  changeStore = () => {
    Taro.navigateTo({ url: '/pages/storeList/index' })
  }

  changeStoreStatus = (status) => {
    // to do 门店切换接口
    this.props.dispatch({
      type: 'store/fetchStoreStatus',
      payload: {
        store_id: Taro.getStorageSync('storeId'),
        status
      }
    }).then((res) => {
      if(res != '203') {
        Taro.showToast({
          title: '切换成功',
          icon: 'success',
          mask: true,
        }).then(() => {
          this.setState({
            status
          })
        })
      }
    })
  }
  
  signOut = () => {
    Taro.clearStorage()
    Taro.reLaunch({ url: '/pages/login/index' })
  }

  render () {
    const { status } = this.state
    const nickname = Taro.getStorageSync('nickname') || '你好'
    return (
      <View className='store-setting-page'>
        <View className='page-header'>
          <Image className='header-img' src={bgPng} />
          <View className='header-nickName'>{nickname}</View>
          <View className='header-calc'>{this.calcHourZone()}</View>
        </View>
        <View className='page-content'>
          <View className='switch-status' onClick={() => {this.changeStoreStatus(1)}}>
            <Image className='status-img' src={status == 1 ? businessCheckPng : businessPng} />
            <View className={classnames('status-text', status == 1 ? 'active' : '')}>营业中</View>
            {
              status == 1 ? 
              <Image className='status-check' src={usedPng} />
              : ''
            }
          </View>
          <View className='switch-status' onClick={() => {this.changeStoreStatus(2)}}>
            <Image className='status-img' src={status == 2 ? restCheckPng : restPng} />
            <View className={classnames('status-text', status == 2 ? 'active' : '')}>休息中</View>
            {
              status == 2 ? 
              <Image className='status-check' src={usedPng} />
              : ''
            }
          </View>
        </View>
        <View className='page-footer'>
          <View className='footer-button' onClick={() => {this.changeStore()}}>切换门店</View>
          <View className='footer-button sign-out' onClick={() => {this.signOut()}}>退出登录</View>
        </View>
      </View>
    )
  }
}

