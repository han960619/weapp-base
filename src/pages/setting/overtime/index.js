import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Activity from '../../../components/Activity'
import './index.less'

@connect(({desk}) => ({...desk}))

export default class Overtime extends Component {

  config = {
    navigationBarTitleText: '超时有礼',
  }

  render () {
    return (
      <View className='page'>
        <Activity a_type={3} />
      </View>
    )
  }
}

