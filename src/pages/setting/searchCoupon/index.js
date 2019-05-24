import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtIcon, AtInput } from 'taro-ui'
import CouponList from '../../../components/CouponList'
import EmptyPage from '../../../components/EmptyContent'
import './index.less'

@connect(({desk}) => ({...desk}))

export default class Coupon extends Component {

  config = {
    navigationBarTitleText: '优惠券',
  }

  state = {
    page: 1,
    status: 0,
    couponList: null,
    can_fetch: true
  }

  componentDidMount() {
    // this.fetchCouponList()
  }

  fetchCouponList = () => {
    const { status, page, can_fetch, couponList, keyword } = this.state
    if(!keyword) {
      this.setState({
        page: 1,
        can_fetch: true,
        couponList: null
      })
      return
    }
    if(!can_fetch || !keyword) return 
    this.props.dispatch({
      type: 'desk/getCouponList',
      payload: {
        store_id: Taro.getStorageSync('storeId'),
        status,
        page,
        search: keyword
      }
    }).then((res) => {
      if(res != 203 && res) {
        const _status = {
          can_fetch: page <= (res.total / 10),
          page: page + 1,
          couponList: page == 1 ? [].concat(res.rows) : couponList.concat(res.rows)
        }
        this.setState({
          ..._status
				})
      }
    })
  }

  handleChange = (value) => {
    this.setState({
      keyword: value,
      can_fetch: true,
      page: 1
    }, () => {
      this.fetchCouponList()
    })
  }

  render () {
    const { keyword, couponList } = this.state
    return (
      <View className='search-page'>
        <View className='search-panel'>
          <AtIcon value='search' className='search-icon' size='18'/>
          <AtInput
            focus
            placeholder='搜索关键词'
            name='keyword'
            type='text'
            clear
            border={false}
            value={keyword}
            onChange={(e) => { this.handleChange(e) }}
          />
        </View>
        {
          couponList && couponList.length >= 0
          ? <ScrollView
              scrollY
              lowerThreshold={50}
              enableBackToTop
              className='tabs-content'
              onScrollToLower={() => {this.fetchCouponList()}} 
            >
              <CouponList couponList={couponList}></CouponList>
            </ScrollView>
          : <EmptyPage/>
        }
      </View>
    )
  }
}

