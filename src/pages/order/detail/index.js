import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtIcon, AtFloatLayout, AtActivityIndicator } from 'taro-ui'
import markPng from '../../../assets/images/mark2.png'
import clockPng from '../../../assets/images/orderClock.png'
import take_dadaPng from '../../../assets/images/take_dada.png'
import take_storePng from '../../../assets/images/take_store.png'
import no_take_dadaPng from '../../../assets/images/no_take_dada.png'
import no_take_storePng from '../../../assets/images/no_take_store.png'
import phonePng from '../../../assets/images/phone.png'
import addressPng from '../../../assets/images/address.png'
import './index.less'
import { orderStatus, orderStatusImg } from '../../../config/index'
import Timeline from '../../../components/Timeline'

@connect(({order}) => ({...order}))

export default class orderDetail extends Component {

  config = {
    navigationBarTitleText: '订单详情',
    enablePullDownRefresh: true
  }

  state = {
    o_id: null,
    showSelect: false,
    showCause: false,
    showTakeDetail: false,
    takeLog: [],
    current: 0,
    cancelList: [],
    order: {
      o_order_status: 1
    },
    take_info: [],
    loading: true
  }

  componentWillMount () {
    const { params } = this.$router
    this.setState({
      ...params
    })
  }

  componentDidShow () {
    this.setState({
      loading: true
    })
    this.fetchOrderDetail()
  }

  onPullDownRefresh () {
		Taro.setBackgroundTextStyle({
			textStyle: 'dark'
			})
		Taro.setBackgroundColor({
			backgroundColorTop: '#ffffff'
    })
    this.fetchOrderDetail()
    Taro.stopPullDownRefresh()
  }

  fetchOrderDetail = () => {
    const { o_id } = this.state
    const store_id = Taro.getStorageSync('storeId')
    this.props.dispatch({
      type: 'order/fetchOrderDetail',
      payload: {
        store_id,
        o_id
      }
    }).then((res) => {
      if(res != '203' && res) {
        this.setState({
          order: res,
          take_info: res.take_info,
          loading: false
        })
        if(res.take_id == 2 && (res.o_order_status == 42 || res.o_order_status == 41)) {
          this.fetchDadaCancel()
        }
      }
    })
  }

  selectTake = (index) =>{
		const { take_info, order } = this.state
		if(take_info.length > index) {
			this.setState({
        showSelect: false,
        loading: true
			})
			if( index == 0 && order.take_id == 1 && order.take_status == 0) {
				return 
			}else {
				this.fetchOption('deliverTake', { type: +index + 1, select: +index + 1 })
			}
		}
	}

  linkToClose = () => {
    const { order } = this.state
    Taro.navigateTo({ 
      url: `/pages/order/cancel/index?o_id=${order.o_id}&o_order_status=${order.o_order_status}`
    })
  }

  linkToRefund = () => {
    const { order } = this.state
    if((order.o_order_status == 42 || order.o_order_status == 41) && order.take_id == 2 && order.take_status != 5 && order.take_status != 0) {
      Taro.showToast({
        title: '请先取消当前配送',
        icon: 'none',
        mask: true,
      })
    }else {
      Taro.navigateTo({ 
        url: `/pages/order/refund/index?o_id=${order.o_id}&&o_order_status=${order.o_order_status}&o_pay_amount=${order.o_pay_amount}`
      })
    }
  }
  
  fetchOption = (type, data) => {
    const { order } = this.state
		const store_id = Taro.getStorageSync('storeId')
		let payload = {
			store_id,
			o_id: order.o_id
		}
		if(data) {
			payload = {
				...payload,
				...data
			}
    }
		this.props.dispatch({
      type: `order/${type}`,
      payload
    }).then((res)=> {
      console.log(2)
			if(res != 203 && res) {
				Taro.showToast({
					title: '操作成功',
					icon: 'success',
					mask: true,
				})
				this.fetchOrderDetail()
			}
		})
  } 
  
  fetchTakeLog = () => {
    const { order } = this.state
		const store_id = Taro.getStorageSync('storeId')
		let payload = {
			store_id,
			o_id: order.o_id
		}
		this.props.dispatch({
      type: `order/fetchTakeLog`,
      payload
    }).then((res)=> {
			if(res != 203 && res) {
				this.setState({
					takeLog: res,
					showTakeDetail: true
				})
			}
		})
  }
  
  callPhone = () => {
    const { order } = this.state
    Taro.makePhoneCall({
      phoneNumber: order.o_contact_mobile
    })
  }

  lookAddress = () => {
    const { order } = this.state
    Taro.openLocation({
      latitude: +order.o_address_lat,
      longitude: +order.o_address_lng,
      name: order.o_address.split('|')[0],
      scale: 18
    })
  }

  fetchDadaCancel = () => {
    const store_id = Taro.getStorageSync('storeId')
		let payload = {
			store_id,
			cancel_reasons: 1
		}
		this.props.dispatch({
      type: `order/fetchDadaCancel`,
      payload
    }).then((res)=> {
			if(res != 203 && res) {
				this.setState({
					cancelList: res
				})
			}
		})
  }

  selectCancel = (value) => {
    const { cancelList } = this.state
    this.setState({
      loading: true
    })
    this.fetchOption('cancelOrderTake', { type: 2, code: cancelList[+value].id, remark: cancelList[+value].content })
  }

  render () {
    const { showSelect, showCause, showTakeDetail, loading, takeLog, current, cancelList, order, take_info } = this.state;
    const hasClock = [1, 2, 3, 31, 32].indexOf(order.o_order_status) > 0
    return (
      !loading ? 
      <View className='order-detail-page'>
        <View className='page-header'>
          <Image className='header-icon' mode='widthFix' src={orderStatusImg[order.o_order_status]} />
          <View className='header-title'>
            <View className='title-status flex1'>{orderStatus[order.o_order_status]}
            </View>
            <View className='title-time'>{order.o_reserve_time} </View>
            <View className='title-type'>{order.o_take_type == 3 ? '送达' : '取餐'}</View>
          </View>
          <View className='header-warn'>
            {
              hasClock && <Image className='item-icon' src={clockPng} />
            }
            {
              order.o_order_status == 41 && (order.take_status == 0 && order.take_id == 0)
              &&  <View className='warn-text flex1'>
                    <View className='reset-item reset-text' onClick={() => {this.setState({ showSelect: true })}}>请选择配送方式</View>
                    <AtIcon value='chevron-right' class='chevron-right' size='20' color='#fff'></AtIcon>
                  </View>
            }
            {
              order.o_order_status == 41 && order.take_status == 5
              &&  <View className='warn-text flex1'>
                    {
                      order.take_id == 2 && <Image className='reset-icon' src={markPng} onClick={() => {this.setState({ showCause: true })}} />
                    }
                    <View className='reset-text' onClick={() => {this.setState({ showSelect: true })}}>配送被取消，请重新选择</View>
                    <AtIcon value='chevron-right' class='chevron-right' size='20' color='#fff'></AtIcon>
                  </View>
            }
            {
              order.o_order_status == 41 && order.take_status != 5 && order.take_id == 1
              &&  <View className='warn-text flex1'>
                    <View className='reset-text' onClick={() => {this.setState({ showSelect: true })}}>商家配送</View>
                    <AtIcon value='chevron-right' class='chevron-right' size='20' color='#fff'></AtIcon>
                  </View>
            }
            {
              order.o_order_status == 41 && order.take_status != 5 && order.take_id == 2
              &&  <View className='warn-text flex1'>
                    <View className='reset-text' onClick={() => {this.fetchTakeLog()}}>{order.status_remark}</View>
                    <AtIcon value='chevron-right' class='chevron-right' size='20' color='#fff'></AtIcon>
                  </View>
            }
            {
              order.o_order_status == 42 && order.take_id == 1
              &&  <View className='warn-text flex1'>
                    <View className='reset-item reset-text'>当前:商家配送</View>
                    <View className='reset-item reset-button' onClick={() => { this.fetchOption('cancelOrderTake', { type: 1 }) }}>取消</View>
                  </View>
            }
            {
              order.o_order_status == 42 && order.take_id == 2
              &&  <View className='warn-text flex1'>
                    <View className='reset-text' onClick={() => {this.fetchTakeLog()}}>{order.status_remark}</View>
                    <AtIcon value='chevron-right' class='chevron-right' size='20' color='#fff'></AtIcon>
                  </View>
            }
            {
              (order.o_order_status != 41 && order.o_order_status != 42) 
              &&  <View className='warn-text flex1'>{order.status_remark ? order.status_remark : order.o_refund_remark}</View>
            }
            {
              (order.o_order_status != 1 && order.o_take_type != 3) && order.o_take_no
              && <View className='item-number'>{order.o_take_no ? `取餐号:${order.o_take_no}` : ''}</View>
            }
          </View>
        </View>
        <View className='page-content'>
          <View className='food-list'>
            {
              order.goods && order.goods.map((good, index) => (
                <View className='food-item' key={index}>
                  <Image className='food-icon' src={good.od_image} />
                  <View className='food-desc'>
                    <View className='item-header'>
                      <View className='item-name'>{good.od_title}</View>
                      {
                        good.od_full_send == 1 && <View className='item-label'>满单</View>
                      }
                      <View className='item-num flex1'>x{good.od_num}</View>
                    </View>
                    <View className='item-norm'>{good.od_norm_str ? `(${good.od_norm_str})` : ''}</View>
                    <View className='item-money'><Text>&yen;</Text>{good.od_price}</View>
                  </View>
                </View>
              ))
            }
          </View>
          <View className='order-money'>
            <View className='money-rows'>
              <View className='rows-label'>打包费</View>
              <View className='rows-num'><Text>&yen;</Text>{order.o_take_money}</View>
            </View>
            {
              order.o_take_type == 3 && 
              <View className='money-rows'>
                <View className='rows-label'>配送费</View>
                <View className='rows-num'><Text>&yen;</Text> {order.o_takeaway_money}</View>
              </View>
            }
            {
              order.o_coupon_name &&
              <View className='money-rows'>
                <View className='rows-label'>{order.o_coupon_name}</View>
                <View className='rows-num red-text'>- <Text>&yen;</Text> {order.o_coupon_amount}</View>
              </View>
            }
            <View className='money-rows'>
              <View className='rows-label'>合计</View>
              {
                order.o_order_status == 6 && <View className='color-text red-text '>已退款<Text>&yen;</Text>{order.o_refund_amount}</View>
              }
              <View className={`rows-num default-text ${order.o_order_status == 6 ? 'noUsed' : ''}`}><Text>&yen;</Text>{order.o_pay_amount}</View>
            </View> 
          </View>
          {
            order.o_order_status == 1 &&
            <View className='options-box'>
              <View className='item-button close-button' onClick={() => { this.linkToClose() }}>取消接单</View>
            </View>
          }
          {
            order.o_order_status == 2 &&
            <View className='options-box'>
              <View className='item-button close-button' onClick={() => { this.linkToClose() }}>取消接单</View>
              <View className='flex1'></View>
              <View className='item-button ok-button'  onClick={() => { this.fetchOption('acceptOrder') }}>确认接单</View>
            </View>
          }
          {
            (order.o_order_status == 3 || order.o_order_status == 32) &&
            <View className='options-box'>
              <View className='item-button close-button' onClick={() => { this.linkToRefund() }}>退款</View>
              <View className='flex1'></View>
              <View className='item-button ok-button'  onClick={() => { this.fetchOption('makeComplete') }}>制作完成</View>
            </View>
          }
          {
            order.o_order_status == 31 &&
            <View className='options-box'>
              <View className='item-button close-button' onClick={() => { this.linkToRefund() }}>退款</View>
              <View className='flex1'></View>
              <View className='item-button ok-button'  onClick={() => { this.fetchOption('makeComplete') }}>开始制作</View>
            </View>
          }
          {
            order.o_order_status == 4 &&
            <View className='options-box'>
              <View className='item-button close-button' onClick={() => { this.linkToRefund() }}>退款</View>
              <View className='flex1'></View>
              <View className='item-button ok-button'  onClick={() => { this.fetchOption('takeOrder') }}>确认取餐</View>
            </View>
          }
          {
            order.o_order_status == 41 && 
            <View className='options-box'>
              <View className='item-button close-button' onClick={() => { this.linkToRefund() }}>退款</View>
              <View className='flex1'></View>
              {
                order.take_id == 1 && order.take_status != 5
                && <View className='item-button ok-button' onClick={() => { this.fetchOption('deliverTake', { type: 1, select: 2 }) }}>确认发货</View>
              }
              {
                order.take_id == 2 && order.take_status != 5
                && <Picker mode='selector' range={cancelList} value={current} rangeKey={'content'} onChange={(e) => { this.selectCancel(e.detail.value)}}>
                    <View className='item-button ok-button'>取消配送</View>
                  </Picker>
              }
              {
                ((order.take_status == 0 && order.take_id == 0) || order.take_status == 5)
                && <View className='item-button default-button'>确认发货</View>
              }
            </View>
          }
          {
            order.o_order_status == 42 && order.take_id == 1 &&
            <View className='options-box'>
              <View className='item-button close-button' onClick={() => { this.linkToRefund() }}>退款</View>
              <View className='flex1'></View>
              <View className='item-button ok-button' onClick={() => { this.fetchOption('reachTake') }}>确认送达</View>
            </View>
          }
          {
            order.o_order_status == 42 && order.take_id == 2 &&
            <View className='options-box'>
              <View className='item-button close-button' onClick={() => { this.linkToRefund() }}>退款</View>
              <View className='flex1'></View>
              <Picker mode='selector' range={cancelList} rangeKey={'content'} value={current} onChange={(e) => { this.selectCancel(e.detail.value)}}>
                <View className='item-button ok-button'>取消配送</View>
              </Picker>
            </View>
          }
          {
            order.o_order_status == 5 &&
            <View className='options-box'>
              <View className='item-button close-button' onClick={() => { this.linkToRefund() }}>退款</View>
            </View>
          }
        </View>
        <View className='page-footer'>
          <View className='footer-item underline'>
            <View className='footer-row'>
              <View className='row-label'>客户名称:</View>
              <View className='row-text'>{order.o_contact_name}</View>
            </View>
            <View className='footer-row'>
              <View className='row-label'>联系方式:</View>
              <Image className='row-icon' src={phonePng} onClick={() => {this.callPhone()}} />
              <View className='row-text color-text' onClick={() => {this.callPhone()}}>{order.o_contact_mobile}</View>
            </View>
            {
              order.o_address && 
              <View className='footer-row'>
                <View className='row-label'>收货地址:</View>
                <Image className='row-icon mr10' src={addressPng} onClick={() => {this.lookAddress()}} />
                <View className='row-text color-text' onClick={() => {this.lookAddress()}} >{order.o_address ? order.o_address.split('|')[0] + order.o_address.split('|')[2] : ''}</View>
              </View>
            }
            {
              order.o_remark && 
              <View className='footer-row'>
                <View className='row-label'>订单备注:</View>
                <View className='row-text'>{order.o_remark}</View>
              </View>
            }
          </View>
          <View className='footer-item'>
            {
              order.take_id &&
              <View className='footer-row'>
                <View className='row-label'>配送方式:</View>
                <View className='row-text'>{order.take_id == 1 ? '商家配送' : '第三方配送'}</View>
              </View>
            }
            {
              order.transporter_name &&
              <View className='footer-row'>
                <View className='row-label'>骑手信息:</View>
                <View className='row-text'>{order.transporter_name}/{order.transporter_phone}</View>
              </View>
            }
            <View className='footer-row'>
              <View className='row-label'>订单编号:</View>
              <View className='row-text'>{order.o_order_no}</View>
            </View>
            <View className='footer-row'>
              <View className='row-label'>下单时间:</View>
              <View className='row-text'>{order.o_create_time}</View>
            </View>
          </View>
        </View>
        <AtFloatLayout title='配送取消原因' isOpened={showCause} onClose={() => {this.setState({ showCause: false })}}>
					<View className='cause-row'>
						<View className='row-label'>骑手</View>
						<View className='row-text'>{order.take_transporter_name ? order.take_transporter_name + ' / ' + order.take_transporter_phone : '骑手未接单'}</View>
					</View>
					<View className='cause-row'>
						<View className='row-label'>原因</View>
						<View className='row-text'>{order.status_remark}</View>
					</View>
				</AtFloatLayout>
				<AtFloatLayout title='选择配送方式' isOpened={showSelect} onClose={() => {this.setState({ showSelect: false })}}>
					<View className='cause-row' onClick={() => { this.selectTake(0) }}>
						{
							take_info.length > 0
							? <Image className='row-image' src={take_storePng}/>
							: <Image className='row-image' src={no_take_storePng}/>
						}
						{
							take_info.length > 0
							? <View className='row-label'>商家配送</View>
							: <View className='row-label noUsed'>商家配送</View>
						}
					</View>
					<View className='cause-row' onClick={() => { this.selectTake(1) }}>
						{
							take_info.length > 1
							? <Image className='row-image' src={take_dadaPng}/>
							: <Image className='row-image' src={no_take_dadaPng}/>
						}
						{
							take_info.length > 1
							? <View className='row-label'>第三方配送<Text className='row-label noUsed'>（达达配送）</Text></View>
							: <View className='row-label noUsed'>第三方配送（当前外卖设置未完善）</View>
						}
					</View>
				</AtFloatLayout>
				<AtFloatLayout title='配送详情' isOpened={showTakeDetail} onClose={() => {this.setState({ showTakeDetail: false })}}>
					<Timeline 
						items={takeLog}
					>
					</Timeline>
				</AtFloatLayout>
      </View>
      : <AtActivityIndicator size={32} color='#FF8F1F' mode='center'></AtActivityIndicator>
    )
  }
}

