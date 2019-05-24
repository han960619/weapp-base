import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'
import Activity from '../../../components/Activity'

@connect(({desk}) => ({...desk}))

export default class Payment extends Component {

  config = {
    navigationBarTitleText: '支付有礼',
  }

  render () {
    return (
      <View className='page'>
        <Activity a_type={2} />
      </View>
    )
  }
}

