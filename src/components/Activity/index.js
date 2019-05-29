import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import PropTypes from 'prop-types'
import { AtIcon, AtFloatLayout } from 'taro-ui'
import CouponModal from '../CouponModal'
import EmptyPage from '../EmptyContent'
import noActionPng from '../../assets/images/noAction.png'
import './index.less'

@connect(({desk}) => ({...desk}))

class Activity extends Component {

	constructor (props) {
    super(...arguments)
    this.state = {
			isShowCoupon: false,
			isShowDetail: false,
			detailData: {},
			data: {
				coupon: []
			},
			noData: false,
			loading: false
    }
	}
	
	static propTypes = {
		a_type: PropTypes.number
	}

	componentDidShow() {
    this.fetchData()
  }

  fetchData = () => {
		const { a_type } = this.props
    this.props.dispatch({
      type: 'desk/getBaoList',
      payload: {
        store_id: Taro.getStorageSync('storeId'),
        a_type
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

  showCoupon = () => {
    const { isShowCoupon } = this.state
    this.setState({
      isShowCoupon: !isShowCoupon
    })
  }

  showDetail = data => {
    this.setState({
      isShowDetail: true,
      detailData: data
    })
  }

  render () {
    const { a_type } = this.props
    const { isShowCoupon, isShowDetail, detailData, data, loading, noData } = this.state
    const detailList = [
      { 
        title: '名称',
        value: detailData.c_name
      },
      { 
        title: '面值',
        value: detailData.c_price,
        num: true
      },
      { 
        title: '有效期',
        value: detailData.c_effective_time
      },
      { 
        title: '规则',
        list: detailData.norm
      },
    ]
    let ActivityRule
    switch(data.condition) {
      case 1: 
        ActivityRule = '无任何条件限制'
        break;
      case 2: 
        ActivityRule = `订单金额需达到￥${data.min_pay_amount}以上`
        break; 
      case 3: 
        ActivityRule = `购买部分商品`
        break; 
    }
    return (
      loading ?
      <View className='active-page setting-page'>
        {
          noData ?
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
                  <View class='item-value'>{data.a_title}</View>
                </View>
                {
                  (a_type == 1 || a_type == 2 ) && 
                  <View class='item'>
                    <View class='item-label'>适用对象</View>
                    <View class='item-value'>{data.user_condition == 1 ? '新客户' : `消费次数低于${data.user_order_number}次的客户`}</View>
                  </View>
                }
                {
                  a_type == 2 && 
                  <View class='item'>
                    <View class='item-label'>活动条件</View>
                    <View class='item-value'>{ActivityRule}</View>
                  </View>
                }
                {
                  a_type == 2 && data.goodsList.length != 0 &&
                  <View class='item'>
                    <View class='item-label'>商品内容</View>
                    <View class='item-value'>最多添加三个商品</View>
                  </View>
                }
                <View class='good-list'>
                  {
                    a_type == 2 && data.goodsList.map((good, index) => (
                      <View class='good-item' key={index}>
                        <Image src={good.gn_image} class='item-image'/>
                        <View class='item-name'>{good.g_title}</View>
                      </View>
                    ))
                  }
                </View>
              </View>
              <View class='item-group'>
                <View class='group-title'>所用优惠券</View>
                {
                  data.coupon.map((item, index) => (
                    <View class='item' key={index}>
                      <View class='item-label'>优惠券{index + 1}</View>
                      <View onClick={() => {this.showDetail(item)}} class='item-value'>{item. c_name}<AtIcon value='chevron-right' size='20' color='#999' ></AtIcon></View>
                    </View>
                  ))
                }
              </View>
              <View class='item-group'>
                <View class='item'>
                  <View class='item-label'>活动期限</View>
                  <View class='item-value time'>
                  {
                    data.fs_end_time == '以后' ? `${data.a_start_time }以后` : <Text>{data.a_start_time}\n 至{data.a_end_time}</Text>
                  }
                  </View>
                </View>
                <View class='item'>
                  <View class='item-label'>活动状态</View>
                  <View class='item-value'>{data.status == 1 ? '启用' : '关闭'}</View>
                </View>
              </View>
              <View class='page-button' onClick={this.showCoupon}>预览</View>
              <CouponModal
                show={isShowCoupon} data={data}
                onClose={this.showCoupon}
              />
              <AtFloatLayout title='优惠券详情' isOpened={isShowDetail} onClose={() => {this.setState({ isShowDetail: false })}}>
                {
                  detailList.map((item, index) => (
                    <View key={index}>
                      {
                        index == 3 
                        ? <View className={`rule-row`}>
                            <View className='row-label'>{item.title}</View>
                            {
                              item.list.length == 0 
                              ? <View className='rule-value'>无使用规则</View>
                              : <View className='row-list'>
                                  {
                                    item.list.map((i, j) => (
                                      <View key={j} className='rule-item'>{j + 1}. {i}</View>
                                    ))
                                  }
                                </View>
                            }
                          </View>
                        : <View className='cause-row'>
                            <View className='row-label'>{item.title}</View>
                            <View className={`row-value ${item.num ? 'red' : ''}`}>{item.num ? ('¥' + item.value) : item.value}</View>
                          </View>
                      }
                    </View>
                  ))
                }
              </AtFloatLayout>
            </View>
        }
      </View>
      : <EmptyPage />
    )
  }
}

export default Activity