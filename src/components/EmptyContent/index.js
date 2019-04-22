import { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import PropTypes from 'prop-types'
import './index.less'

class EmptyPage extends Component {
  static options = {
    addGlobalClass: true
  }

  static propTypes = {
    buttonText: PropTypes.string,
    tip: PropTypes.string,
  }

  static defaultProps = {
    buttonText: '',
    tip: ''
  }

  state = {
  }

  render () {
    const { image, buttonText, tip } = this.props
    return (
      <View className='noUser-page'>
        <View className="close-cover">
        <Image src={image}  mode="widthFix"/>
        </View>
        <View className="close-tip">{tip}</View>
        {
          buttonText ? 
            <View className="close-action"  onClick={this.props.onAction}>{buttonText}</View>
          : ''
        }
      </View>
    )
  }

}

export default EmptyPage
