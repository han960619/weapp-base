import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtGrid } from "taro-ui"
import './index.less'

export default class Desk extends Component {

  config = {
    navigationBarTitleText: '工作台'
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
        image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
        value: '订单设置',
        type: 'order'
      },
      {
        image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
        value: '外卖设置',
        type: 'takeaway'
      },
      {
        image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
        value: '就餐设置',
        type: 'repast'
      },
      {
        image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
        value: '打印机设置',
        type: 'printer'
      }
    ]
    return (
      <View className='desk-page'>
        <View className='desk-title'>
          <View className='title-icon'></View>
          <View className='title-type'>待使用设备</View>
        </View>
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

