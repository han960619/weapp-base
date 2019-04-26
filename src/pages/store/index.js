import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'
import classnames from 'classnames'
import { connect } from '@tarojs/redux'
import EmptyPage from '../../components/EmptyContent'
import { AtIcon } from 'taro-ui'
import goodsPng from '../../assets/images/goods.png'
import storeDataPng from '../../assets/images/store_data.png'
import storeMontyPng from '../../assets/images/store_monty.png'
import settingPng from '../../assets/images/setting.png'
import usedPng from '../../assets/images/used.png'
import noUsedPng from '../../assets/images/noUsed.png'
import switchPng from '../../assets/images/switch.png'
import closeWarnPng from '../../assets/images/close-warn.png'
import noPowerPng from '../../assets/images/noPower.png'
import storeBg1Png from '../../assets/images/storeBg1.png'
import storeBg2Png from '../../assets/images/storeBg2.png'

@connect(({desk, store}) => ({...desk, ...store}))
export default class Store extends Component {

  config = {
    navigationBarTitleText: '门店',
    navigationBarBackgroundColor: '#578AFC',
    disableScroll: true,
    navigationBarTextStyle: 'white'
  }

  state = {
    s_automatic: 1,
    s_business: 1,
    is_connect_printer: 1, 
    send_type: 1, 
    over_time: 100,
    pay_amount: 0, 
    total_number: 0, 
    user_new_number: 0, 
    refund_amount: 0,
    power: true,
    transWarn: false,
    showWarn: false
  }

  componentDidShow () {
    this.props.dispatch({
      type: 'store/getStoreIndex',
      payload: {
        store_id: Taro.getStorageSync('storeId')
      }
    }).then(res => {
      if(res != '203') {
        this.setState({
          ...res,
          showWarn: res.is_connect_printer != 1,
          power: true
        })
      }else {
        Taro.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: '#ffffff'
        })
        this.setState({
          power: false
        })
      }
    })
  }

  linkTo = url => {
    Taro.navigateTo({ url })
  }

  changeStatus = () => {
    const { s_business } = this.state
    Taro.showModal({
      content: `是否修改营业状态为${s_business == 1 ? '休息中' : '营业中'}`,
    }).then(res => {
      if(res.confirm) {
        this.props.dispatch({
          type: 'store/fetchStoreStatus',
          payload: {
            store_id: Taro.getStorageSync('storeId'),
            status: s_business == 1 ? 2 : 1
          }
        }).then((res) => {
          if(res != '203') {
            Taro.showToast({
              title: '切换成功',
              icon: 'success',
              mask: true,
            }).then(() => {
              this.setState({
                s_business: s_business == 1 ? 2 : 1
              })
            })
          }
        })
      }
    })
  }

  render () {
    const { s_automatic, power, showWarn, over_time, is_connect_printer, send_type, pay_amount, 
      total_number, user_new_number, refund_amount, transWarn, s_business } = this.state
    const store = Taro.getStorageSync('storeData')
    const settingList = [
      {
        name: '自动接单',
        path: '/pages/setting/order/index',
        status: s_automatic == 1
      },
      {
        name: '打印机',
        path: '/pages/setting/printer/index',
        status: is_connect_printer == 1
      },
      {
        name: '默认配送',
        path: '/pages/setting/takeaway/index',
        status: send_type == 1
      }
    ]
    const appList = [
      {
        name: '在售商品',
        path: '/pages/store/goods/index',
        img: goodsPng
      },
      {
        name: '门店数据',
        path: '/pages/store/data/index',
        img: storeDataPng
      },
      {
        name: '门店资产',
        path: '/pages/store/asset/index',
        img: storeMontyPng
      },
      {
        name: '设置',
        path: `/pages/store/setting/index?status=${s_business}`,
        img: settingPng
      }
    ]
    return (
      power ? 
      <View className='store-page'>
        {
          over_time <= 15 &&
          <View className={`header-warn ${transWarn ? 'transY' : ''}`}>
            {
              over_time > 0 
              ? <View className='no-over flex1'>您的店铺有效期不足{over_time}天，请尽快续费。</View>
              : <View className='over flex1'>店铺已打烊，请联系客服恢复使用。</View>
            }
            <View className='warn-button' onClick={() => {this.setState({ transWarn: true })}}>知道了</View>
          </View>
        }
        <View className='page-header'>
          <Image className='header-image' src={s_business == 1 ? storeBg2Png : storeBg1Png} />
          <View className='header-title'>
            <Image className='title-logo' src={store.b_logo} />
            <View className='title-name'>{store.s_title}</View>
            <View className='title-switch'>
              <View className='switch-text' onClick={() => {this.changeStatus()}}>{s_business == 1 ? '营业中' : '休息中'}</View>
              <Image className='switch-icon' src={switchPng} />
            </View>
          </View>
          <View className='today-income'>
            <View className='item-label income-label'>今日销售(元)</View>
            <View className='income-num'>{pay_amount}</View>
          </View>
          <View className='today-dataList'>
            <View className='data-item'>
              <View className='item-label'>今日订单数</View>
              <View className='item-num'>{total_number}</View>
            </View>
            <View className='data-item'>
              <View className='item-label'>今日新增数</View>
              <View className='item-num'>{user_new_number}</View>
            </View>
            <View className='data-item'>
              <View className='item-label'>今日退款(元)</View>
              <View className='item-num'>{refund_amount}</View>
            </View>
          </View>
        </View>
        <View className='setting-list'>
          {
            settingList.map((item, index) => (
              <View className='setting-item' onClick={() => { this.linkTo(item.path) }} key={index}>
                <Image className='setting-status' src={item.status ? usedPng : noUsedPng} />
                <View className={classnames('setting-name', item.status == 1 ? '' : 'noUsed')}>{item.name}</View>
              </View>
            ))
          }
        </View>
        <View className='page-content app-list'>
          {
            appList.map((item, index) => (
              <View className='app-item' onClick={() => { this.linkTo(item.path) }} key={index}>
                <Image className='app-logo' src={item.img} />
                <View className='app-name'>{item.name}</View>
              </View>
            ))
          }
        </View>
        {
          showWarn 
          ? <View className='page-warn'>
              <View className='warn-text'>为避免漏单，请连接打印机哦！</View>
              <View className='warn-buttom' onClick={() => {this.linkTo('/pages/setting/printer/index')}}>去设置</View>
              <Image className='warn-close' src={closeWarnPng} onClick={() => {this.setState({ showWarn: false })}} />
            </View>
          : ''
        }
      </View>
      : <View className='store-page'>
          <EmptyPage image={noPowerPng} tip='——  暂无权限  ——' />
        </View>
    )
  }
}

