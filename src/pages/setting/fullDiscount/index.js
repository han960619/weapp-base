import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import EmptyPage from '../../../components/EmptyContent'
import noActionPng from '../../../assets/images/noAction.png'
import './index.less'

@connect(({desk}) => ({...desk}))

export default class FullDiscount extends Component {

  config = {
    navigationBarTitleText: '满减优惠',
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
      type: 'desk/getFullDiscountList',
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
                  <View class='item-value'>{data.fd_title}</View>
                </View>
              </View>
              <View class='item-group'>
                <View class='item'>
                  <View class='item-label'>开始时间</View>
                  <View class='item-value'>{data.fd_start_time}</View>
                </View>
                <View class='item'>
                  <View class='item-label'>结束时间</View>
                  <View class='item-value'>{data.fd_end_time}</View>
                </View>
              </View>
              <View class='item-group'>
                <View class='group-title'>所用优惠券</View>
                {
									data.fd_content.map((item, index) => (
										<View class='item' key={index}>
											<View class='item-label'>规则{index + 1}</View>
											<View class='item-value'>满{item.f}元减{item.d}元</View>
										</View>
									))
                }
              </View>
            </View>
        }
      </View>
      : <EmptyPage />
    )
  }
}

