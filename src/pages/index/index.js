import Taro, { Component, getApp } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'
import Title from '../../components/Title'

@connect(({common}) => ({...common}))

export default class Index extends Component {

  config = {
    navigationBarTitleText: ''
  }

  state = {
  }

  componentWillMount () {
    
  }

  componentDidMount () {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View>
      </View>
    )
  }
}

