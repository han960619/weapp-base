import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './index.less'

class Title extends Component {

  static propTypes = {
    text: PropTypes.string
  }

  static defaultProps = {
    text: '组件测试'
  }

  render () {
    const { text } = this.props
    return (
      <View className='page-title'>{text}</View>
    )
  }
}

export default Title
