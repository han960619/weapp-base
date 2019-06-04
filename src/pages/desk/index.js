import Taro, { Component } from '@tarojs/taro'
import { WebView } from '@tarojs/components'
import bg from '../../assets/images/deskBg.png'
import './index.less'

export default class Desk extends Component {

  config = {
    navigationBarTitleText: '工作台'
  }

  linkTo = e => {
    if(e.type) {
      Taro.navigateTo({
        url: `/pages/setting/${e.type}/index`
      })
    }
  }

  render () {
    const group1 = {
      title: '点餐设置',
      apps: [
        {
          image: require('../../assets/images/desk_order.png'),
          value: '订单设置',
          type: 'order'
        },
        {
          image: require('../../assets/images/desk_takeaway.png'),
          value: '外卖设置',
          type: 'takeaway'
        },
        {
          image: require('../../assets/images/desk_repast.png'),
          value: '就餐设置',
          type: 'repast'
        },
        {
          image: require('../../assets/images/desk_printer.png'),
          value: '打印机设置',
          type: 'printer'
        }
      ]
    }
    const group2 = {
      title: '营销活动',
      apps: [
        {
          image: require('../../assets/images/desk_fullOrder.png'),
          value: '满单即送',
          type: 'fullOrder'
        },
        {
          image: require('../../assets/images/desk_coupon.png'),
          value: '优惠券',
          type: 'coupon'
        },
        {
          image: require('../../assets/images/desk_enterShop.png'),
          value: '进店有礼',
          type: 'enterShop'
        },
        {
          image: require('../../assets/images/desk_payment.png'),
          value: '支付有礼',
          type: 'payment'
        },
        {
          image: require('../../assets/images/desk_overtime.png'),
          value: '超时有礼',
          type: 'overtime'
        },
        {
          image: require('../../assets/images/desk_fullDiscount.png'),
          value: '满减优惠',
          type: 'fullDiscount'
        }
      ]
    }
    return (
      <View className='desk-page'>
        <Image className='page-bg' src={bg} />
        <View className='page-content'>
          <View className='list-item'>
            <View className='item-title'>
              <View className='title-icon'></View>
              <View className='title-type'>{group1.title}</View>
            </View>
            <View className='app-list'>
              {
                group1.apps.map((app, i) => (
                  <View key={i} className='app-item' onClick={() => {this.linkTo(app)}}>
                    <Image className='item-img' src={app.image} />
                    <View className='title-type'>{app.value}</View>
                  </View>
                ))
              }
            </View>
          </View>
          <View className='list-item'>
            <View className='item-title'>
              <View className='title-icon'></View>
              <View className='title-type'>{group2.title}</View>
            </View>
            <View className='app-list'>
              {
                group2.apps.map((app, i) => (
                  <View key={i} className='app-item' onClick={() => {this.linkTo(app)}}>
                    <Image className='item-img' src={app.image} />
                    <View className='title-type'>{app.value}</View>
                  </View>
                ))
              }
            </View>
          </View>
        </View>
      </View>
    )
  }
}

