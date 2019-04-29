import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'
import bg from '../../assets/images/storeList-bg.png'
import noStorePng from '../../assets/images/noStore.png'
import EmptyPage from '../../components/EmptyContent'
import { AtActivityIndicator } from 'taro-ui'
@connect(({common}) => ({...common}))

export default class StoreList extends Component {

  config = {
    navigationBarTitleText: '选择门店',
    navigationBarBackgroundColor: '#FF8F1F',
    navigationBarTextStyle: 'white',
    disableScroll: true
  }

  state = {
    loading: true
  }

  componentDidMount () {
    this.props.dispatch({
      type: 'common/getStoreData'
    }).then(res => {
      if(res != '203' && res) {
        this.setState({
          loading: false
        })
      }
    }) 
  }

  calcHourZone = () => {
    let hour = new Date().getHours()
    if (hour >=6 && hour < 10) {
      return '早上好，越努力越幸运哦！';
    } else if (hour >= 10 && hour < 20) {
      return '机会总是倾向于有准备的人';
    } else if (hour >=20 || hour < 6) {
      return '夜里凉，请注意保暖'
    }
  }

  linkTo = store => {
    Taro.setStorageSync('storeId', store.store_id )
    Taro.setStorageSync('storeData', store )
    this.props.dispatch({
      type: 'store/getStoreIndex',
      payload: {
        store_id: Taro.getStorageSync('storeId')
      }
    }).then(res => {
      if(res != '203' && res != '202') {
        Taro.reLaunch({ url: '/pages/store/index' })
      }
    })
  }

  render () {
    const { loading } = this.state
    const { storeList, nickname } = this.props.storeData
    return (
      !loading 
      ? <View className='storeList-page'>
          <View className='page-header'>
            <Image className='page-bg' src={bg} />
            <View className='user-nikeName'>{nickname}</View>
            <View className='greed'>{this.calcHourZone()}</View>
          </View>
          <View className='page-content'>
            <ScrollView scrollY className='store-list'>
              {
                storeList && storeList.map((item, index) => (
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
                storeList && storeList.length == 0 
                && <View className='no-store'>
                    <EmptyPage image={noStorePng} imageWidth={150} tip='——  暂无门店  ——' />
                  </View>
              }
            </ScrollView>
          </View>
        </View>
      :  <AtActivityIndicator size={32} color='#FF8F1F' mode='center'></AtActivityIndicator>
    )
  }
}

