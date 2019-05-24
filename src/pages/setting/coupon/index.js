import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtTabs, AtTabsPane, AtIcon, AtActivityIndicator } from 'taro-ui'
import CouponList from '../../../components/CouponList'
import { couponTabList } from '../../../config/index'
import './index.less'

@connect(({desk}) => ({...desk}))

export default class Coupon extends Component {

  config = {
    navigationBarTitleText: '优惠券',
  }

  state = {
    page: 1,
    current: 0,
    status: 0,
    loading: false,
    listLoading: true,
    couponList: null,
    can_fetch: true
  }

  componentDidMount() {
    this.fetchCouponList()
  }

  fetchCouponList = () => {
    const { status, page, can_fetch, couponList } = this.state
    if(!can_fetch) return 
    this.props.dispatch({
      type: 'desk/getCouponList',
      payload: {
        store_id: Taro.getStorageSync('storeId'),
        status,
        page
      }
    }).then((res) => {
      if(res != 203 && res) {
        const _status = {
          can_fetch: page <= (res.total / 10),
          page: page + 1,
          couponList: page == 1 ? [].concat(res.rows) : couponList.concat(res.rows)
        }
        this.setState({
          ..._status,
          loading: true,
					listLoading: false
				})
      }
    })
  }
  
  linkToSearch = () => {
    Taro.navigateTo({ 
      url: '/pages/setting/searchCoupon/index' 
    })
  }

  handleClick = value => {
    const { current } = this.state
    if(current != value) {
      this.setState({
        current: value,
        status: value,
        can_fetch: true,
				page: 1,
				listLoading: true,
        orderList: null
      }, () => {
        this.fetchCouponList()
      })
    }
  }

  render () {
    const { current, loading, listLoading, couponList } = this.state
    return (
      loading ?
      <View className='active-page setting-page'>
        <View className='page-header'>
          <View className='search-input' onClick={() => {this.linkToSearch()}}>
            <AtIcon value='search' size='20' color='#999999'></AtIcon>
            <View className='search-text'>搜索关键词</View>
          </View>
        </View>
        <View class='page-content'>
          <AtTabs scroll={true} animated={false} swipeable={false} current={current} tabList={couponTabList} onClick={this.handleClick.bind(this)}>
            {
              couponTabList.map((item, index) => (
                <AtTabsPane current={current} index={index} key={index}>
                  {
                    !listLoading 
                    ? <ScrollView
                        scrollY
                        lowerThreshold={50}
                        enableBackToTop
                        className='tabs-content'
                        onScrollToLower={() => {this.fetchCouponList()}} 
                      >
                        <CouponList couponList={couponList}></CouponList>
                      </ScrollView>
                    : (index == current && <AtActivityIndicator size={32} color='#FF8F1F' mode='center'></AtActivityIndicator>)
                  }
                </AtTabsPane>
              ))
            }
          </AtTabs>
        </View>
      </View>
      : <EmptyPage />
    )
  }
}

