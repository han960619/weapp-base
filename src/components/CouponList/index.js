import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Button } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import EmptyPage from '../EmptyContent'
import noCouponPng from '../../assets/images/noCoupon.png'

import './index.less'

class CouponList extends Component {

	state = {
		openIndex: null
	}

	openCondition = index => {
    const {openIndex} = this.state
    this.setState({openIndex: openIndex !== index ? index : null})
	}

  render () {
		const { openIndex } = this.state
		const { couponList } = this.props
    return (
			<View className='tab-content'>
				{
					couponList && couponList.length === 0 &&
					<EmptyPage 
						tip='—— 暂无优惠券——'
						image={noCouponPng}
					/>
				}
				{
					couponList && couponList.length !== 0 &&
					<View className='coupon-list'>
						{
							couponList.map((coupon, index) => (
								<View className='item' key={index}>
									<View className='entity'>
										<View className={`deno ${coupon.c_status == 1 ? 'bg' : ''}`}>
											<View className='price'>
												<Text>&yen;</Text>
												<Text className='num font-xin-bold'>{coupon.c_price}</Text>
											</View>
											<View>{coupon.c_min_amount}</View>
										</View>
										<View className='desc'>
											<View className={`name ${coupon.c_status == 2? 'disabled' : ''}`}>{coupon.c_name}</View>
											<View className='time'>{coupon.c_effective_time}</View>
											<View className='btn' onClick={this.openCondition.bind(this, index)}>使用条件
												<AtIcon value={openIndex === index ? 'chevron-up': 'chevron-down'} size='13' />
											</View>
										</View>
									</View>
									{
										openIndex === index &&
										<View className='condi'>
											<View>优惠券使用条件</View>
											{
												coupon.norm.map((item, i) => (
													<View key={i}>{i + 1}. {item}</View>
												))
											}
										</View>
									}
								</View>
							))
						}
					</View>
				}
			</View>
    )
  }
}

export default CouponList
