import Taro, { Component, getApp } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'
import classnames from 'classnames'
import noPowerPng from '../../assets/images/noPower.png'
import noOrderPng from '../../assets/images/noOrder.png'
import filterMorePng from '../../assets/images/filterMore.png'
import clockPng from '../../assets/images/clock.png'
import markPng from '../../assets/images/mark.png'
import checkPng from '../../assets/images/check.png'
import take_dadaPng from '../../assets/images/take_dada.png'
import take_storePng from '../../assets/images/take_store.png'
import no_take_dadaPng from '../../assets/images/no_take_dada.png'
import no_take_storePng from '../../assets/images/no_take_store.png'
import EmptyPage from '../../components/EmptyContent'
import Drawer from '../../components/Drawer'
import Timeline from '../../components/Timeline'
import { orderTabList, takeStatus, orderStatus } from '../../config/index'
import { AtTabs, AtTabsPane, AtIcon, AtFloatLayout, AtActivityIndicator } from 'taro-ui'

@connect(({order}) => ({...order}))

export default class Order extends Component {

  config = {
		navigationBarTitleText: '订单',
		// disableScroll: true
  }

  state = {
		orderData: {},
    power: true,
    current: 0,
    orderList: null,
    take_info: [],
    status: 9,
    page: 1,
    can_fetch: true,
		show: false,
    take_type: 0,
		order_type: 0,
		old_take: 0,
		old_order: 0,
		showCause: false,
		showSelect: false,
		showTakeDetail: false,
		takeLog: [],
		loading: true
  }

  // componentWillMount () {}

  // componentDidMount () {
  //   this.fetchOrderList()
  // }

  fetchOrderList = () => {
    const { status, page, take_type, order_type, can_fetch, orderList } = this.state
    if(!can_fetch) return 
    const store_id = Taro.getStorageSync('storeId')
    this.props.dispatch({
      type: 'order/fetchOrderList',
      payload: {
        store_id,
        status,
        page,
        take_type,
        order_type,
      }
    }).then((res) => {
      if(res == '203' || !res) {
        this.setState({
          power: false 
        })
      }else{
        const _status = {
          take_info: res.take_info != undefined ? res.take_info : [],
          can_fetch: page <= (res.total / 10),
          page: page + 1,
          orderList: page == 1 ? [].concat(res.rows) : orderList.concat(res.rows)
        }
        this.setState({
					..._status,
					loading: false
				})
      }
    })
  }

  componentDidShow () {
		this.init()
	}

	init = () => {
		this.setState({
			can_fetch: true,
			page: 1,
			orderList: null,
			loading: true
		}, () => {
			this.fetchOrderList()
		})
	}

	onPullDownRefresh () {
    Taro.stopPullDownRefresh()
    this.init()
  }

  linkToSearch = () => {
    Taro.navigateTo({ 
      url: '/pages/order/search/index' 
    })
  }

  handleClick = (value) => {
    const { current } = this.state
    if(current != value) {
      this.setState({
        current: value,
        status: orderTabList[value].status,
        can_fetch: true,
				page: 1,
				loading: true,
        orderList: null
      }, () => {
        this.fetchOrderList()
      })
    }
	}
	
	onShow = () => {
		const { order_type, take_type } = this.state
		this.setState({ 
			show: true,
			old_order: order_type,
			old_take: take_type
		})
	}

  onClose = () => {
		const { order_type, take_type, old_order, old_take } = this.state
		if( order_type != old_order || take_type != old_take ) {
			this.init()
		}
		this.setState({
			show: false,
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
					page: 1,
					loading: true
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

  render () {
    const { power, current, orderList, loading, take_type, take_info, takeLog, order_type, showTakeDetail, show, showCause, orderData, showSelect } = this.state 
		const selectList = ['全部', '堂食单', '外卖单']
		const list = orderList && orderList.map((order, i) => (
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
					order.o_remark &&  <View className='item-remark'>
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
					order.o_order_status == 3 || order.o_order_status == 32
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
							<View className='button-group'>
								<View className='flex1'></View>
								{
									order.take_id == 1
									? <View className='item-button ok-button' onClick={() => { this.fetchOption(order, 'reachTake') }}>确认送达</View>
									: <View className='reset' onClick={() => {this.fetchTakeLog(order)}}>
											<View className='reset-text'>{order.take_remark}</View>
											<AtIcon value='chevron-right' class='chevron-right' size='20' color='#FF8F1F'></AtIcon>
										</View>
								}
							</View>
						</View>
				}
			</View>
		))
    return (
      <View className='order-page'>
        {
          power 
          ? <View className='main'>
              <View className='page-header'>
                <View className='search-input' onClick={() => {this.linkToSearch()}}>
                  <AtIcon value='search' size='18' color='#999999'></AtIcon>
                  <View className='search-text'>搜索</View>
                </View>
                <View className='filter-panel' onClick={() => {this.onShow()}}>
                  <View className='filter-text'>筛选</View>
                  <Image className='filter-icon' src={filterMorePng} />
                </View>
              </View>
              <View className='page-content'>
                <AtTabs scroll={true} animated={false} swipeable={false} lowerThreshold={150} current={current} tabList={orderTabList} onClick={this.handleClick.bind(this)}>
                  {
                    orderTabList.map((item, index) => (
                      <AtTabsPane current={current} index={index} key={index}>
                        {
                          !loading 
                          ? <View>
                              {
                                orderList && orderList.length > 0 
                                ? <ScrollView scrollY={orderList.length > 1} onScrollToLower={() => {this.fetchOrderList()}} className='order-list'>
                                    {
                                      list
																		}
																		<View className='empty'></View>
                                  </ScrollView>
                                : <View className='no-order'>
                                    <EmptyPage image={noOrderPng} tip='——  暂无相关订单  ——' />
                                  </View>
                              }
                            </View>
                          : (index == current && <AtActivityIndicator size={32} color='#FF8F1F' mode='center'></AtActivityIndicator>)
												}
                      </AtTabsPane>
                    ))
                  }
                </AtTabs>
              </View>
            </View>
          : <View className='no-power'>
              <EmptyPage image={noPowerPng} tip='——  暂无权限  ——' />
            </View>
				}
        <Drawer
          show={show}
          mask
          right={true}
          onClose={this.onClose.bind(this)} 
        >
          <View className='drawer-item'>
            <View className='item-title'>
              <View className='title-icon'></View>
              <View className='title-text'>订单筛选</View>
            </View>
            <View className='select-list'>
              {
                selectList.map((item, index) => (
                  <View className='select-item' onClick={() => { this.changeTakeType(index) }} key={index}>
                    <View className={classnames('item-text', take_type == index ? 'check' : 0)}>{item}</View>
                    {
                      take_type == index && <Image className='check-icon' src={checkPng} />
                    }
                  </View>
                ))
              }
            </View>
						<View className='line'></View>
						<View className='select-list'>
							<View className='select-item' onClick={() => { this.changeOrderType() }} >
								<View className={classnames('item-text', order_type == 1 ? 'check' : 0)}>仅看预约单</View>
								{
									order_type == 1 && <Image className='check-icon' src={checkPng} />
								}
							</View>
						</View>
					</View>
        </Drawer>
				<AtFloatLayout title='配送取消原因' isOpened={showCause} onClose={() => {this.setState({ showCause: false })}}>
					<View className='cause-row'>
						<View className='row-label'>骑手</View>
						<View className='row-text'>{orderData.take_transporter_name}/{orderData.take_transporter_phone}</View>
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

