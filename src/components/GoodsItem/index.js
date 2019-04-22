import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.less'
import {connect} from '@tarojs/redux'

@connect(({store}) => ({...store}))
class GoodsItem extends Component {
  static options = {
    addGlobalClass: true
  }

  state = {
  }


  handleClick = () => {
    const { good } = this.props
    this.props.dispatch({
      type: 'store/changeStatus',
      payload: {
        store_id: Taro.getStorageSync('storeId'),
        g_id: good.g_id,
        status: good.gs_status == 1 ? 2 : 1
      }
    }).then((res) => {
      if(res != '203') {
        Taro.showToast({
          title: `已成功${good.gs_status == 1 ? '下架' : '上架'}`,
          icon: 'success',
          duration: 2000
        })
      }
    }).then(() => {
      this.props.onFetchGoods()
    })
  }

  render () {
    const { good } = this.props
    
    return (
      <View className='good'>
        <View className='img-wrap'>
          <Image src={good.g_image_100 || ''}/>
        </View>
        <View className='info'>
          <View className='name'>
            <Text>{good.g_title}</Text>
          </View>
          <View
            className='price'
          >
            <Text>&yen;</Text> {good.g_price}
          </View>
          <View className='sales-num'>销量：{good.sales_num}件</View>
          <View className='handle' onClick={() => {this.handleClick()}}>
            <View className={good.gs_status == 1 ? 'down' : 'up'}>{good.gs_status == 1 ? '下架' : '上架'}</View>
          </View>
        </View>
      </View>
    )
  }
}

export default GoodsItem
