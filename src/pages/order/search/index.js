import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'
import clockPng from '../../../assets/images/clock.png'
import markPng from '../../../assets/images/mark.png'
import take_dadaPng from '../../../assets/images/take_dada.png'
import take_storePng from '../../../assets/images/take_store.png'
import no_take_dadaPng from '../../../assets/images/no_take_dada.png'
import no_take_storePng from '../../../assets/images/no_take_store.png'
import EmptyPage from '../../../components/EmptyContent'
import Timeline from '../../../components/Timeline'
import noListPng from '../../../assets/images/noList.png'
import { AtInput, AtIcon, AtFloatLayout } from 'taro-ui'
import { orderStatus } from '../../../config/index'

@connect(({order}) => ({...order}))

export default class orderSearch extends Component {

  config = {
    navigationBarTitleText: '订单搜索',
  }

  state = {
    keyword: '',
    orderData: {},
    power: true,
    orderList: null,
    take_info: [],
    page: 1,
    can_fetch: true,
		showCause: false,
		showSelect: false,
		showTakeDetail: false,
		takeLog: []
  }

  componentDidShow () {
		this.setState({
			can_fetch: true,
			page: 1,
			orderList: null
		}, () => {
			this.fetchOrderList()
		})
	}

  fetchOrderList = () => {
    const { page, can_fetch, orderList, keyword } = this.state
    if(!keyword) {
      this.setState({
        page: 1,
        can_fetch: true,
        orderList: null
      })
      return
    }
    if(!can_fetch || !keyword) return 
    const store_id = Taro.getStorageSync('storeId')
    this.props.dispatch({
      type: 'order/fetchOrderList',
      payload: {
        store_id,
        search: keyword,
        page
      }
    }).then((res) => {
      if(res == '203') {
        this.setState({
          power: false 
        })
      }else {
        const _status = {
          take_info: res.take_info != undefined ? res.take_info : [],
          can_fetch: page <= (res.total / 10),
          page: page + 1,
          orderList: page == 1 ? [].concat(res.rows) : orderList.concat(res.rows)
        }
        this.setState({
          ..._status
        })
      }
    })
  }

  changeTakeType = (take_type) => {
		this.setState({
			take_type
		})
	}

	changeOrderType = () => {
		const { order_type } = this.state
		this.setState({
			order_type: order_type == 0 ? 1 : 0
		})
	}

	linkToDetail = (order) => {
		Taro.navigateTo({ 
      url: `/pages/order/detail/index?o_id=${order.o_id}`
    })
	}

	linkToClose = (order) => {
		Taro.navigateTo({ 
      url: `/pages/order/cancel/index?o_id=${order.o_id}&o_order_status=${order.o_order_status}`
    })
	}

	fetchOption = (order, type, data) => {
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
			if(res != 203) {
				Taro.showToast({
					title: '操作成功',
					icon: 'success',
					mask: true,
				})
				this.setState({
					can_fetch: true,
					page: 1
				}, () => {
					this.fetchOrderList()
				})
			}
		})
	} 

	fetchTakeLog = (orderData) => {
		const store_id = Taro.getStorageSync('storeId')
		let payload = {
			store_id,
			o_id: orderData.o_id
		}
		this.props.dispatch({
      type: `order/fetchTakeLog`,
      payload
    }).then((res)=> {
			if(res != 203) {
				this.setState({
					takeLog: res,
					orderData,
					showTakeDetail: true
				})
			}
		})
	}

	selectTake = (index) =>{
		const { take_info, orderData } = this.state
		if(take_info.length > index) {
			this.setState({
				showSelect: false
			})
			if( index == 0 && orderData.take_id == 1 && orderData.take_status == 0) {
				return 
			}else {
				this.fetchOption(orderData, 'deliverTake', { type: +index + 1, select: +index + 1 })
			}
		}
	}
  
  handleChange = (value) => {
    this.setState({
      keyword: value,
      page: 1
    }, () => {
      this.fetchOrderList()
    })
  }

  render () {
    const { orderList, keyword, take_type, take_info, takeLog, order_type, showTakeDetail, show, showCause, orderData, showSelect } = this.state 
    return (
      <View className='search-page'>
        <View className='search-panel'>
          <AtIcon value='search' className='search-icon' size='18'/>
          <AtInput
            focus
            placeholder='搜索姓名/手机号/订单号'
            name='keyword'
            type='text'
            clear
            border={false}
            value={keyword}
            onChange={(e) => { this.handleChange(e) }}
          />
        </View>
        {
          orderList 
          &&  <View>
                {
                  orderList && orderList.length > 0
                  ?  <ScrollView scrollY={orderList.length > 1} onScrollToLower={() => {this.fetchOrderList()}} className='order-list'>
                            {
                              orderList.map((order, i) => (
                                <View key={i} className='order-item'>
                                  <View onClick={() => {this.linkToDetail(order)}}>
                                    <View className='item-header'>
                                      <View className='header-time'>{order.o_reserve_time}</View>
                                      <View className='header-text'>{order.o_take_type == 3 ? '送达' : '取餐'}</View>
                                      <View className='header-type'>{orderStatus[order.o_order_status]}</View>
                                    </View>
                                    <View className='item-labels'>
                                      {
                                        order.o_send_goods_id > 0 && <View className='item-label yellow'>满单</View>
                                      }
                                      {
                                        order.o_order_type == 2 && <View className='item-label blue'>预约</View>
                                      }
                                      {
                                        order.o_take_type == 2 && <View className='item-label green'>打包</View>
                                      }
                                    </View>
                                    <View className='item-goods'>
                                      <View className='goods-name'>{order.goods_title}</View>
                                      <View className='goods-number'>等共<Text className='color-num'>{order.goods_num}</Text>件商品</View>
                                    </View>
                                    <View className='item-money'>
                                      {
                                        order.o_order_status == 6 
                                        ? <View className='drewBack'>
                                            <View className='drewBack-empty'></View>
                                            <View className='drewBack-number'>已退款 &yen;{order.o_refund_amount}</View>
                                            <View className='after-number'>&yen;{order.o_pay_amount}</View>
                                          </View>
                                        : <View className='pay-number'>&yen;{order.o_pay_amount}</View>
                                      }
                                    </View>
                                  </View>
                                  {
                                    (order.o_order_status == 6 || order.o_order_status == 7 || order.o_order_status == 5 || order.o_order_status == 8) && !order.o_remark 
                                    ? '' : <View className='underLine'></View>
                                  }
                                  {
                                    order.o_remark && <View className='item-remark'>
                                                        <View className='remark-left'>备注：</View>
                                                        <View className='remark-right'>{order.o_remark}</View>	
                                                      </View>
                                  }
                                  {
                                    order.o_order_status == 1 
                                    && <View className='item-option item-status1'>
                                        <View className='button-group'>
                                          <View className='flex1'></View>
                                          <View className='item-button close-button' onClick={() => { this.linkToClose(order) }}>取消接单</View>
                                        </View>
                                        <View className='item-warn'>
                                          <View className='flex1'></View>
                                          <Image className='item-icon' src={clockPng} />
                                          <View className='warn-text'>{order.remind}</View>
                                        </View>
                                      </View>
                                  }
                                  {
                                    order.o_order_status == 2 
                                    && <View className='item-option item-status2'>
                                        <View className='button-group'>
                                          <View className='flex1'></View>
                                          <View className='item-button close-button' onClick={() => { this.linkToClose(order) }}>取消接单</View>
                                          <View className='item-button ok-button' onClick={() => { this.fetchOption(order, 'acceptOrder') }}>确认接单</View>
                                        </View>
                                        <View className='item-warn'>
                                          <View className='flex1'></View>
                                          <Image className='item-icon' src={clockPng} />
                                          <View className='warn-text'>{order.remind}</View>
                                        </View>
                                      </View>
                                  }
                                  {
                                    (order.o_order_status == 3 || order.o_order_status == 32)
                                    && <View className='item-option item-status3'>
                                        <View className='button-group'>
                                          <View className='item-number flex1'>取餐号：<Text className='color-number'>{order.o_take_no}</Text></View>
                                          <View className='item-button ok-button' onClick={() => { this.fetchOption(order, 'makeComplete') }}>制作完成</View>
                                        </View>
                                        <View className='item-warn'>
                                          <View className='flex1'></View>
                                          <Image className='item-icon' src={clockPng} />
                                          <View className='warn-text'>{order.remind}</View>
                                        </View>
                                      </View>
                                  }
                                  {
                                    order.o_order_status == 31
                                    && <View className='item-option item-status31'>
                                        <View className='button-group'>
                                          <View className='item-number flex1'>取餐号：<Text className='color-number'>{order.o_take_no}</Text></View>
                                          <View className='item-button ok-button'  onClick={() => { this.fetchOption(order, 'makeStart') }}>开始制作</View>
                                        </View>
                                        <View className='item-warn'>
                                          <View className='flex1'></View>
                                          <Image className='item-icon' src={clockPng} />
                                          <View className='warn-text'>{order.remind}</View>
                                        </View>
                                      </View>
                                  }
                                  {
                                    order.o_order_status == 4
                                    && <View className='item-option item-status4'>
                                        <View className='button-group'>
                                          <View className='item-number flex1'>取餐号：<Text className='color-number'>{order.o_take_no}</Text></View>
                                          <View className='item-button ok-button' onClick={() => { this.fetchOption(order, 'takeOrder') }}>确认取餐</View>
                                        </View>
                                      </View>
                                  }
                                  {
                                    order.o_order_status == 41
                                    && <View className='item-option item-status41'>
                                        {
                                          (order.take_status == 0 && order.take_id == 0) || order.take_status == 5
                                          && <View className='button-group'>
                                              <View className='flex1'></View>
                                              <View className='reset-take'>
                                                {
                                                  order.take_status == 0
                                                  ? <View className='reset-item reset-text' onClick={() => {this.setState({ showSelect: true, orderData: order })}}>请选择配送方式</View>
                                                  : <View className='reset'>
                                                      {
                                                        order.take_id == 2 &&  <Image className='reset-icon' src={markPng} onClick={() => {this.setState({ showCause: true, orderData: order })}} />
                                                      }
                                                      <View className='reset-text' onClick={() => {this.setState({ showSelect: true, orderData: order })}}>配送被取消，请重新选择</View>
                                                    </View>
                                                }
                                              </View>
                                              <AtIcon value='chevron-right' class='chevron-right' size='20' color='#FF8F1F'></AtIcon>
                                            </View>
                                        }
                                        {
                                          order.take_id == 1 && order.take_status != 5
                                          && <View className='button-group'>
                                              <View className='flex1'></View>
                                              <View className='reset-text' onClick={() => {this.setState({ showSelect: true, orderData: order })}}>更换</View>
                                              <View className='reset-default'>商家配送</View>
                                              <View className='item-button ok-button' onClick={() => { this.fetchOption(order, 'deliverTake', { type: 1, select: 2 }) }}>确认发货</View>
                                            </View>
                                        }
                                        {
                                          order.take_id == 2 && order.take_status != 5
                                          && <View className='button-group'>
                                              <View className='flex1'></View>
                                              <View className='reset' onClick={() => {this.fetchTakeLog(order)}}>
                                                <View className='reset-text'>{order.take_remark}</View>
                                                <AtIcon value='chevron-right' class='chevron-right' size='20' color='#FF8F1F'></AtIcon>
                                              </View>
                                            </View>
                                        }
                                      </View>
                                  }
                                  {
                                    order.o_order_status == 42
                                    && <View className='item-option item-status4'>
                                        {
                                          order.take_id == 1
                                          ? <View className='button-group'>
                                              <View className='flex1'></View>
                                              <View className='item-button ok-button' onClick={() => { this.fetchOption(order, 'reachTake') }}>确认送达</View>
                                            </View>
                                          : <View className='button-group'>
                                              <View className='flex1'></View>
                                              <View className='reset' onClick={() => {this.fetchTakeLog(order)}}>
                                                <View className='reset-text'>{order.take_remark}</View>
                                                <AtIcon value='chevron-right' class='chevron-right' size='20' color='#FF8F1F'></AtIcon>
                                              </View>
                                            </View>
                                        }
                                      </View>
                                  }
                                </View>
                              ))
                            }
                            <View className='empty'></View>
                          </ScrollView>
                  : <View className='goods-list'>
                      <EmptyPage image={noListPng} tip='——  找不到啦  ——' />
                    </View>
                }
              </View>
        }
				<AtFloatLayout title='配送取消原因' isOpened={showCause} onClose={() => {this.setState({ showCause: false })}}>
					<View className='cause-row'>
						<View className='row-label'>骑手</View>
						<View className='row-text'>{orderData.take_transporter_name ? orderData.take_transporter_name + ' / ' + orderData.take_transporter_phone : '骑手未接单'}</View>
					</View>
					<View className='cause-row'>
						<View className='row-label'>原因</View>
						<View className='row-text'>{orderData.take_cancel_remark}</View>
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
    )
  }
}

