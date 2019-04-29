import Taro, { Component, getApp } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtTabs, AtTabsPane } from 'taro-ui'
import morePng from '../../../assets/images/more.png'
import noPowerPng from '../../../assets/images/noPower.png'

import './index.less'

@connect(({store}) => ({...store}))

export default class StoreData extends Component {

  config = {
    navigationBarTitleText: '数据概况',
    // navigationBarBackgroundColor: '#637BF8',
    // navigationBarTextStyle: 'white',
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
    this.fetchData('store/getStoreGoods', 'goodsData')
  }

  handleClick = (value) => {
    const { current } = this.state
    if(current != value) {
      // if(value == 0) {
      //   this.fetchData('store/getStoreData', 'dashboardData')
      // }else {
      //   this.fetchData('store/getStoreGoods', 'goodsData')
      // }
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
          // if(current == 0) {
            this.fetchData('store/getStoreData', 'dashboardData')
          // }else {
            this.fetchData('store/getStoreGoods', 'goodsData')
          // }
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
        unit: '笔'
      },{
        title: '购买客户数',
        value: dashboardData.user_order_number,
        unit: '位'
      },{
        title: '新增客户数',
        value: dashboardData.user_new_number,
        unit: '位'
      },{
        title: '退款订单数',
        value: dashboardData.refund_number,
        unit: '笔'
      },{
        title: '客单价',
        hasIcon: true,
        value: dashboardData.user_unit_price,
      },{
        title: '退款金额',
        hasIcon: true,
        value: dashboardData.refund_amount,
      }
    ]
    const goodsList = [
      {
        title: '商品总销量',
        value: goodsData.total_sales_number,
        unit: '件'
      },{
        title: '商品退款数',
        value: goodsData.total_refund_number,
        unit: '件'
      },{
        title: '退款金额',
        hasIcon: true,
        value: goodsData.total_refund_amount,
      }
    ]
    let pageData = {
      payMoney: current == 0 ? dashboardData.pay_amount : goodsData.total_sales_amount,
      compareNew: current == 0 ? dashboardData.last_ratio : goodsData.last_ratio,
      compareTheLast: current == 0 ? dashboardData.lastYearkey_ratio : goodsData.lastYearkey_ratio,
      appList: current == 0 ? dashboardList : goodsList,
      time: current == 0 ? dashboardData.time : goodsData.time,
    }
    pageData.compareNew = pageData.compareNew == '--' ? '0' : pageData.compareNew + ''
    pageData.compareTheLast = pageData.compareTheLast == '--' ? '0' : pageData.compareTheLast + ''
    let label1, label2, timeText;
    switch(baseTime) {
      case 1: 
        label1 = '较前一日'
        label2 = '较上周同期'
        timeText = '按日'
        break;
      case 2:
        label1 = '较前一周'
        label2 = '较去年同期'
        timeText = '按周'
        break;
      case 3:
        label1 = '较前一月'
        label2 = '较去年同期'
        timeText = '按月'
        break;
    }
    return (
      <View className='store-data-page'>
        <View className='page-header'>
          <View className='header-title'>
            <View className='switch-box' onClick={() => {this.changePop()}}>
              <View className='switch-text'>{timeText}</View>
              <Image className='switch-icon' src={morePng} />
            </View>
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
                          <View className='main-label left-label'>{current == 0 ? '销售金额' : '商品总销售'}</View>
                          <View className='main-num'><Text class="main-icon">￥</Text>{pageData.payMoney}</View>
                        </View>
                        <View className='main-right'>
                          <View className='main-item'>
                            <View className='main-status'>
                              <View className='main-label status-label'>{label1}</View>
                              <View className={pageData.compareNew.indexOf('-') > -1 ? 'down-label' : 'up-label'}>
                                {`${pageData.compareNew > 0 ? '+' + pageData.compareNew : pageData.compareNew}%`}
                              </View>
                            </View>
                          </View>
                          <View className='main-item'>
                            <View className='main-status'>
                              <View className='main-label status-label'>{label2}</View>
                              <View className={pageData.compareTheLast.indexOf('-') > -1 ? 'down-label' : 'up-label'}>
                                {`${pageData.compareTheLast > 0 ? '+' + pageData.compareTheLast : pageData.compareTheLast}%`}
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
                      {
                        (current == 0 ? dashboardPower : goodsPower)
                        ? <View className='apps-List'>
                            {
                              pageData.appList.map((app, index) => (
                                <View className='app-item' key={index}>
                                  <View className='item-num'>
                                    {
                                      app.hasIcon && <Text class="item-icon">￥</Text>
                                    }
                                    {app.value}
                                    {
                                      app.unit && <Text class="item-unit">{app.unit}</Text>
                                    }
                                  </View>
                                  <View className='item-text'>{app.title}</View>
                                </View>
                              ))
                            }
                          </View>
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

