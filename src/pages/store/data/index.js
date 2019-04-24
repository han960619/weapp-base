import Taro, { Component, getApp } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtTabs, AtTabsPane } from 'taro-ui'
import dashboard_order_num from '../../../assets/images/order_num.png'
import dashboard_bug_num from '../../../assets/images/bug_num.png'
import dashboard_money from '../../../assets/images/money.png'
import dashboard_add_user from '../../../assets/images/add_user.png'
import dashboard_refund_num from '../../../assets/images/refund_num.png'
import dashboard_refund from '../../../assets/images/refund.png'
import morePng from '../../../assets/images/more.png'
import goods_refund_num from '../../../assets/images/goods_refund_num.png'
import goods_num from '../../../assets/images/goods_num.png'
import noPowerPng from '../../../assets/images/noPower.png'

import './index.less'

@connect(({store}) => ({...store}))

export default class StoreData extends Component {

  config = {
    navigationBarTitleText: '数据概况',
    navigationBarBackgroundColor: '#637BF8',
    navigationBarTextStyle: 'white',
    disableScroll: true,
  }

  state = {
    dashboardData: {
      pay_amount: '0.00',
      total_number: 0,
      user_new_number: 0,
      refund_amount: 0,
      user_order_number: 0,
      user_unit_price: 0,
      refund_number: 0,
      last_ratio: '--',
      lastYearkey_ratio: '--',
      time: '',
    },
    goodsData: {
      total_sales_amount: 0.00,
      total_sales_number: 0,
      total_refund_number: 0,
      total_refund_amount: 0.00,
      last_ratio: '--',
      lastYearkey_ratio: '--',
      time: ''
    },
    dashboardPower: true,
    goodsPower: true,
    baseTime: 1,  // 1,2,3  按周按日按月
    current: 0
  }

  componentWillMount () {
    this.fetchData('store/getStoreData', 'dashboardData')
  }

  handleClick = (value) => {
    const { current } = this.state
    if(current != value) {
      if(value == 0) {
        this.fetchData('store/getStoreData', 'dashboardData')
      }else {
        this.fetchData('store/getStoreGoods', 'goodsData')
      }
      this.setState({
        current: value
      })
    }
  }

  fetchData = (type, key) => {
    const { baseTime } = this.state
    this.props.dispatch({
      type,
      payload: {
        store_id: Taro.getStorageSync('storeId'),
        type: baseTime
      }
    }).then((res) => {
      if(res == '203') {
        const _key = key == 'dashboardData' ? 'dashboardPower' : 'goodsPower'
        this.setState({
          [_key]: false
        })
      }else {
        this.setState({
          [key]: res
        })
      }
    })
  }

  changePop = () => {
    const { baseTime, current } = this.state
    Taro.showActionSheet({
      itemList: ['按天', '按周', '按月']
    })
    .then(res => {
      let time = res.tapIndex + 1
      if(baseTime == time) {
        return false
      }else {
        this.setState({
          baseTime: time
        }, () => {
          if(current == 0) {
            this.fetchData('store/getStoreData', 'dashboardData')
          }else {
            this.fetchData('store/getStoreGoods', 'goodsData')
          }
        })
      }
    })
    .catch(err => console.log(err.errMsg))
  }

  render () {
    const { dashboardData, goodsData, current, baseTime, dashboardPower, goodsPower } = this.state
    const tabList = [{ title: '数据概况' }, { title: '商品数据' }]
    const dashboardList = [
      {
        title: '客户订单数',
        value: dashboardData.total_number,
        img: dashboard_order_num
      },{
        title: '购买客户数',
        value: dashboardData.user_order_number,
        img: dashboard_bug_num
      },{
        title: '客单价(元)',
        value: dashboardData.user_unit_price,
        img: dashboard_money
      },{
        title: '新增客户数',
        value: dashboardData.user_new_number,
        img: dashboard_add_user
      },{
        title: '退款金额(元)',
        value: dashboardData.refund_amount,
        img: dashboard_refund_num
      },{
        title: '退款订单数',
        value: dashboardData.refund_number,
        img: dashboard_refund
      }
    ]
    const goodsList = [
      {
        title: '商品总销量',
        value: goodsData.total_sales_number,
        img: goods_num
      },{
        title: '商品退款数',
        value: goodsData.total_refund_number,
        img: goods_refund_num
      },{
        title: '退款金额(元)',
        value: goodsData.total_refund_amount,
        img: dashboard_refund_num
      }
    ]
    let pageData = {
      payMoney: current == 0 ? dashboardData.pay_amount : goodsData.total_sales_amount,
      compareNew: current == 0 ? dashboardData.last_ratio : goodsData.last_ratio,
      compareTheLast: current == 0 ? dashboardData.lastYearkey_ratio : goodsData.lastYearkey_ratio,
      appList: current == 0 ? dashboardList : goodsList,
      time: current == 0 ? dashboardData.time : goodsData.time,
    }
    pageData.compareNew = pageData.compareNew == '--' ? '+0' : pageData.compareNew + ''
    pageData.compareTheLast = pageData.compareTheLast == '--' ? '+0' : pageData.compareTheLast + ''
    let label1, label2, timeText;
    switch(baseTime) {
      case 1: 
        label1 = '较前一日'
        label2 = '较上周同期'
        timeText = '日数据'
        break;
      case 2:
        label1 = '较前一周'
        label2 = '较去年同期'
        timeText = '周数据'
        break;
      case 3:
        label1 = '较前一月'
        label2 = '较去年同期'
        timeText = '月数据'
        break;
    }
    return (
      <View className='store-data-page'>
        <View className='page-header'>
          <View className='header-title'>
            <View className='switch-text' onClick={() => {this.changePop()}}>{timeText}</View>
            <Image className='switch-icon' onClick={() => {this.changePop()}} src={morePng} />
            <View className='header-empty'></View>
            <View className='data-time'>{pageData.time}</View>
          </View>
        </View>
        <View className='page-content'>
          <AtTabs current={current} swipeable={false} tabList={tabList} onClick={this.handleClick.bind(this)}>
            {
              tabList.map((item, index) => (
                <AtTabsPane current={current} index={index} key={index}>
                  <View className={index == 0 ? 'dashboard-content' : 'goods-content'}>
                    {
                      ((current == 0 && dashboardPower) || (current == 1 && goodsPower)) ? 
                      <View className='main-content'>
                        <View className='main-left'>
                          <View className='main-label left-label'>商品总销售额(元)</View>
                          <View className='main-num'>{pageData.payMoney}</View>
                        </View>
                        <View className='main-right'>
                          <View className='main-item'>
                            <View className='main-status'>
                              <View className='main-label status-label'>{label1}</View>
                              <View className={pageData.compareNew.indexOf('-') > -1 ? 'down-label' : 'up-label'}>
                                {`${pageData.compareNew}%`}
                              </View>
                            </View>
                          </View>
                          <View className='main-item'>
                            <View className='main-status'>
                              <View className='main-label status-label'>{label2}</View>
                              <View className={pageData.compareTheLast.indexOf('-') > -1 ? 'down-label' : 'up-label'}>
                                {`${pageData.compareTheLast}%`}
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                      : <View className='main-content noPower'>
                          <Image className='noPower-img' src={noPowerPng} />
                          <View className='noPower-text'>——  暂无权限  ——</View>
                        </View>
                    }
                    <View className='main-apps'>
                      <View className='apps-title'>
                        <View className='title-icon'></View>
                        <View className='title-text'>详细信息</View>
                      </View>
                      
                      {
                        (current == 0 ? dashboardPower : goodsPower)
                        ? <ScrollView className='apps-List' scrollY>
                            {
                              pageData.appList.map((app, index) => (
                                <View className='app-item' key={index}>
                                  <Image className='item-icon' src={app.img} />
                                  <View className='item-text'>{app.title}</View>
                                  <View className='item-num'>{app.value}</View>
                                </View>
                              ))
                            }
                            {
                              pageData.appList.length == 3 &&
                              <View className='app-warn'>——  没有更多啦  ——</View>
                            }
                          </ScrollView>
                        : <View className='apps-List noPower'>
                            <Image className='noPower-img' src={noPowerPng} />
                            <View className='noPower-text'>——  暂无权限  ——</View>
                          </View>
                      }
                    </View>
                  </View>
                </AtTabsPane>
              ))
            }
          </AtTabs>
        </View>
      </View>
    )
  }
}

