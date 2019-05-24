import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Curtain from '../Curtain'
import classnames from 'classnames'

import './index.less'

class CouponModal extends Component {

  static defaultProps = {
    data: {
      coupon: []
    }
  }

  render () {
    const {show, data, onClose} = this.props
    const {background_color, coupon, image, font_color, butto_color} = data
    return (
      <Curtain show={show} className='coupon-modal' onClose={onClose} contentWidth='90%'>
        <View className='coupon-modal-content'>
          <Image src={image} />
          <View className='list' style={{backgroundColor: background_color}}>
            {
              coupon && coupon.map((item, index) => (
                <View className='item' key={index}>
                  <View className='info'>
                    <View className='name'>{item.c_name}</View>
                    <View className='memo'>
                      {
                        item.c_min_amount == 0 ? '无门槛' :
                          `满${item.c_min_amount}元可用`
                      }
                    </View>
                  </View>
                  <View className='gap'>
                    <Text className='line' />
                    <Text className='dot' style={{backgroundColor: background_color}} />
                    <Text className='dot dot-b' style={{backgroundColor: background_color}} />
                  </View>
                  <View className='right'>
                    <View className='price'>
                      <Text>&yen;</Text>
                      <Text className='font-xin-bold num'>{item.c_price}</Text>
                    </View>
                    <Button
                      formType='submit'
                      style={{color: font_color, backgroundColor: butto_color}}
                      className={classnames('handle')}
                    >去使用</Button>
                  </View>
                </View>
              ))
            }
          </View>
        </View>
      </Curtain>
    )
  }
}

export default CouponModal
