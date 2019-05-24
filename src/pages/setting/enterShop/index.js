import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View } from '@tarojs/components'
import './index.less'
import Activity from '../../../components/Activity'

@connect(({desk}) => ({...desk}))

export default class EnterShop extends Component {

  config = {
    navigationBarTitleText: '进店有礼',
  }

  render () {
    return (
      <View className='page'>
        <Activity a_type={1} />
      </View>
    )
  }
}

