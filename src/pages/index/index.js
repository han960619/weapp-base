import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'
import Title from '../../components/Title'

@connect(({common}) => ({...common}))

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  state = {
  }

  componentWillMount () { }

  componentDidMount () {
    this.props.dispatch({
      type: 'common/changeName',
      payload: {
        name: '555'
      }
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { name } = this.props
    console.log(name)
    return (
      <View>
        <Title text="这是一个标题组件" />
        <Text>Hello world!{name}</Text>
      </View>
    )
  }
}

