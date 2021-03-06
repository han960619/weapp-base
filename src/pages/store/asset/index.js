import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'
import classnames from 'classnames'
import { AtTabs, AtTabsPane } from 'taro-ui'
import morePng from '../../../assets/images/more.png'
import noPowerPng from '../../../assets/images/noPower.png'

@connect(({store}) => ({...store}))

export default class StoreAsset extends Component {

  config = {
    navigationBarTitleText: '门店资产',
    disableScroll: true,
  }

  state = {
    baseTime: 1,
    baseTime2: 1,
    current: 0,
    storeStatistics: {
      pay_amount: '',
      coupon_amount: '',
      refund_amount: '',
      time: ''
    },
    assetBill: {
      amount: '',
      number: '',
      refund_amount: '',
      refund_number: '',
      time: ''
    },
    marketingBill: {
      coupon_amount: '',
      coupon_number: '',
      send_goods_amount: '',
      send_goods_number: '',
      time: ''
    },
    storeStatisticsPower: true,
    assetBillPower: true,
    marketingBillPower: true
  }
  

  componentWillMount () {
    const { baseTime, baseTime2 } = this.state
    this.fetchData('store/getStoreStatistics', 'storeStatistics', baseTime)
    this.fetchData('store/getStoreAssetBill', 'assetBill', baseTime2)
    this.fetchData('store/getStoreMarketingBill', 'marketingBill', baseTime2)
  }

  fetchData = (type, key, time) => {
    this.props.dispatch({
      type,
      payload: {
        store_id: Taro.getStorageSync('storeId'),
        type: time
      }
    }).then((res) => {
      let data = {}
      if(res == '203') {
        let _key;
        switch(key) {
          case 'storeStatistics':
            _key = 'storeStatisticsPower'
            break;
          case 'assetBill':
            _key = 'assetBillPower'
            break;
          case 'marketingBill':
            _key = 'marketingBillPower'
            break;  
        }
        this.setState({
          [_key]: false
        })
      }else {
        data = res
      }
      this.setState({
        [key]: data
      })
    })
  }

  changePop = () => {
    const { baseTime } = this.state
    Taro.showActionSheet({
      itemList: ['按天', '按周', '按月']
    })
    .then(res => {
      let time = res.tapIndex + 1
      if(baseTime == time) {
        return false
      }else {
        this.fetchData('store/getStoreStatistics', 'storeStatistics', time)
        this.setState({
          baseTime: time
        })
      }
    })
    .catch(err => console.log(err.errMsg))
  }

  handleClick = (value) => {
    const { current, baseTime2 } = this.state
    if(current != value) {
      // if(value == 0){
      //   this.fetchData('store/getStoreAssetBill', 'assetBill', baseTime2)
      // }else {
      //   this.fetchData('store/getStoreMarketingBill', 'marketingBill', baseTime2)
      // }
      this.setState({
        current: value
      })
    }
  }

  changeBastTime = (key, value) => {
    if(value == this.state[key]) return
    this.setState({
      [key]: value
    }, () => {
      this.fetchData('store/getStoreAssetBill', 'assetBill', value)
      this.fetchData('store/getStoreMarketingBill', 'marketingBill', value)
    })
  }

  render () {
    const { storeStatisticsPower, assetBillPower, marketingBillPower,  storeStatistics, assetBill, marketingBill, baseTime, baseTime2, current } = this.state
    const assetData = [
      {
        title: '收入金额',
        value: assetBill.amount,
        hasIcon: true
      },{
        title: '成交单数',
        value: assetBill.number,
        unit: '笔'
      },{
        title: '退款金额',
        value: assetBill.refund_amount,
        hasIcon: true
      },{
        title: '退款单数',
        value: assetBill.refund_number,
        unit: '笔'
      }
    ]
    const marketingData = [
      {
        title: '券总抵扣',
        value: marketingBill.coupon_amount,
        hasIcon: true
      },{
        title: '优惠券总数',
        value: marketingBill.coupon_number,
        unit: '张'
      },{
        title: '满单金额',
        value: marketingBill.send_goods_amount,
        hasIcon: true
      },{
        title: '满单总数',
        value: marketingBill.send_goods_number,
        unit: '笔'
      }
    ]
    const contentData = current == 0 ? assetData : marketingData
    const tabList = [{ title: '数据概况' }, { title: '商品数据' }]
    return (
      <View className='store-asset-page'>
        <View className='page-header'>
          <View className='header-title'>
            <View className='switch-box' onClick={() => {this.changePop()}}>
              <View className='switch-text'>{baseTime == 1 ? '按日' : (baseTime == 2 ? '按周' : '按月')}</View>
              <Image className='switch-icon' src={morePng} />
            </View>
            <View className='header-empty'></View>
            <View className='data-time'>{storeStatistics.time}</View>
          </View>
          {
            storeStatisticsPower 
            ?  <View className='hearch-content'>
                  <View className='header-income'>
                    <View className='item-label income-label'>门店总收入</View>
                    <View className='income-num'><Text class="item-icon">￥</Text>{storeStatistics.pay_amount}</View>
                  </View>
                  <View className='header-dataList'>
                    <View className='data-item'>
                      <View className='item-label'>优惠券总抵扣</View>
                      <View className='item-num'><Text class="item-icon">￥</Text>{storeStatistics.coupon_amount}</View>
                    </View>
                    <View className='data-item'>
                      <View className='item-label'>门店总退款</View>
                      <View className='item-num'><Text class="item-icon">￥</Text>{storeStatistics.refund_amount}</View>
                    </View>
                  </View>
                </View>
            :  <View className='noPower'>
                <Image className='noPower-img' src={noPowerPng} />
                <View className='noPower-text'>——  暂无权限  ——</View>
              </View>
          }
        </View>
        <View className='page-content'>
          <View className='content-switch'>
            <View className={classnames('switch-button', baseTime2 == 1 ? 'active' : '')} onClick={() => {this.changeBastTime('baseTime2', 1)}}>日汇总</View>
            <View className={classnames('switch-button', baseTime2 == 3 ? 'active' : '')} onClick={() => {this.changeBastTime('baseTime2', 3)}}>月汇总</View>
          </View>
          <View className='content-time'>{current == 0 ? assetBill.time : marketingBill.time}</View>
          <View className='apps-List'>
            <AtTabs current={current} tabList={tabList} onClick={this.handleClick.bind(this)}>
              {
                tabList.map((item, index) => (
                  <AtTabsPane current={current} index={index} key={index}>
                    <View className='apps-title'>{current == 0 ? '资产对账单' : '营销对账单'}</View>
                    {
                      (current == 0 ? assetBillPower : marketingBillPower) ?
                      <View className='list'>
                        {
                          contentData.map((app, index) => (
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
                      : <View className='noPower'>
                          <Image className='noPower-img' src={noPowerPng} />
                          <View className='noPower-text'>——  暂无权限  ——</View>
                        </View>
                    }
                  </AtTabsPane>
                ))
              }
            </AtTabs>
            <View className='apps-switch'>
              <View className={classnames('switch-icon', current == 0 ? 'active' : '')}></View>
              <View className={classnames('switch-icon', current == 1 ? 'active' : '')}></View>
            </View>
          </View>
        </View>
      </View> 
    )
  }
}

