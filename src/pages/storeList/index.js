import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'
import bg from '../../assets/images/storeList-bg.png'
import noStorePng from '../../assets/images/noStore.png'
import EmptyPage from '../../components/EmptyContent'
@connect(({common}) => ({...common}))

export default class StoreList extends Component {

  config = {
    navigationBarTitleText: '选择门店',
    navigationBarBackgroundColor: '#FF8F1F',
    navigationBarTextStyle: 'white'
  }

  componentDidMount () {
    this.props.dispatch({
      type: 'common/getStoreData'
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

  linkTo = store => {
    Taro.setStorageSync('storeId', store.store_id )
    Taro.setStorageSync('storeData', store )
    Taro.reLaunch({ url: '/pages/store/index' })
  }

  render () {
    let { storeList, nickname } = this.props.storeData
    return (
      <View className='storeList-page'>
        <View className='page-header'>
          <Image className='page-bg' src={bg} />
          <View className='user-nikeName'>{nickname}</View>
          <View className='greed'>{this.calcHourZone()}</View>
        </View>
        <View className='page-content'>
          <View className='store-list'>
            {
              storeList.map((item, index) => (
                <View className='store-item' onClick={() => {this.linkTo(item)}} key={index}>
                  <Image className='item-logo' src={item.b_logo} />
                  <View className='item-desc'>
                    <View className='item-title'>{item.s_title}</View>  
                    <View className='item-order_num'>待处理订单： {item.order_num}笔</View>  
                  </View>  
                </View>
              ))
            }
            {
              storeList.length == 0 
              && <View className='no-store'>
                  <EmptyPage image={noStorePng} imageWidth={150} tip='——  暂无门店  ——' />
                 </View>
            }
          </View>
        </View>
      </View>
    )
  }
}

