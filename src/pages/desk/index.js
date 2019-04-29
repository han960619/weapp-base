import Taro, { Component } from '@tarojs/taro'
import bg from '../../assets/images/deskBg.png'
import './index.less'

export default class Desk extends Component {

  config = {
    navigationBarTitleText: '工作台',
    disableScroll: true,
  }

  linkTo = (e) => {
    if(e.type) {
      Taro.navigateTo({
        url: `/pages/setting/${e.type}/index`
      })
    }
  }

  render () {
    const list = [
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
    return (
      <View className='desk-page'>
        <Image className='page-bg' src={bg} />
        {/* <View className='desk-title'>
          <View className='title-icon'></View>
          <View className='title-type'>待使用设备</View>
        </View> */}
        <View className='app-list'>
          {
            list.map((item, index) => (
              <View key={index} className='app-item' onClick={() => {this.linkTo(item)}}>
                <Image className='item-img' src={item.image} />
                <View className='title-type'>{item.value}</View>
              </View>
            ))
          }
        </View>
      </View>
    )
  }
}

