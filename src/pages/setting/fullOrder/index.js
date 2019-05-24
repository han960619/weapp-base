import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import EmptyPage from '../../../components/EmptyContent'
import noActionPng from '../../../assets/images/noAction.png'
import './index.less'

@connect(({desk}) => ({...desk}))

export default class FullOrder extends Component {

  config = {
    navigationBarTitleText: '满单即送',
  }

  state = {
    data: null,
    noData: false,
    loading: false
  }

  componentDidShow() {
    this.fetchData()
  }

  fetchData = () => {
    this.props.dispatch({
      type: 'desk/getFullSendList',
      payload: {
        store_id: Taro.getStorageSync('storeId')
      }
    }).then(res => {
      if (res == undefined) return
      if(res == 404) {
        this.setState({
          noData: true,
          loading: true
        })
      }else if(res != 203) {
        this.setState({
          data: {
            ...res
          },
          loading: true
        })
      }
    })
  }

  render () {
    const { data, loading, noData } = this.state
    return (
      loading ?
      <View class='printer-list-page setting-page'>
        {
          noData && !data ?
          <EmptyPage 
            tip='—— 暂未开启任何活动 ——'
            image={noActionPng}
            onAction={() => { Taro.navigateBack() }}
            buttonText='我知道了'
          >
          </EmptyPage>
          : <View class='page-content'>
              <View class='item-group'>
                <View class='item'>
                  <View class='item-label'>活动名称</View>
                  <View class='item-value'>{data.fs_title}</View>
                </View>
                <View class='item'>
                  <View class='item-label'>购买订单数</View>
                  <View class='item-value'>{data.fs_full_num}次</View>
                </View>
              </View>
              {
                !(data.fs_min_price == 0 && data.fs_original_pay == 2) &&
                <View class='item-group'>
                  <View class='group-title'>活动规则</View>
                  {
                    data.fs_min_price != 0 &&
                    <View class='item'>
                      <View class='item-label'>规则1</View>
                      <View class='item-value'>单次消费满￥${data.fs_min_price}以上</View>
                    </View>
                  }
                  {
                    data.fs_original_pay != 2 &&
                    <View class='item'>
                      <View class='item-label'>{data.fs_min_price != 0 ? '规则2' : '规则1'}</View>
                      <View class='item-value'>购买特价商品不计入满单条件中</View>
                    </View>
                  }
                </View>
              } 
              <View class='item-group'>
                <View class='item'>
                  <View class='item-label'>活动日期</View>
                  <View class='item-value time'>
                  {
                    data.fs_end_time == '以后' ? `${data.fs_start_time }以后` : <Text>{data.fs_start_time}\n 至{data.fs_end_time}</Text>
                  }
                  </View>
                </View>
                <View class='item'>
                  <View class='item-label'>赠送可选商品</View>
                  <View class='item-value'>{data.goods_all == 1 ? '全部' : '部分'}商品</View>
                </View>
                {
                  data.goodsList.length != 0 &&
                  <View class='item'>
                    <View class='item-label'>商品内容</View>
                    <View class='item-value'>最多添加三个商品</View>
                  </View>
                }
                <View class='good-list'>
                  {
                    data.goodsList.map((good, index) => (
                      <View class='good-item' key={index}>
                        <Image src={good.gn_image} class='item-image'/>
                        <View class='item-name'>{good.gn_name}</View>
                      </View>
                    ))
                  }
                </View>
              </View>
            </View>
        }
      </View>
      : <EmptyPage />
    )
  }
}

