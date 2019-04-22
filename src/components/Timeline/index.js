import PropTypes from 'prop-types'
import { View } from '@tarojs/components'
import classNames from 'classnames'
import Taro, { Component } from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import checkPng from '../../assets/images/check.png'
import './index.scss'

class Timeline extends Component {

  static propTypes = {
    pending: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.object),
    customStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  }

  static defaultProps = {
    pending: false,
    items: [],
    customStyle: {},
  }

  render () {
    const {
      pending,
      items,
      customStyle,
    } = this.props

    const rootClassName = ['at-timeline']
    if (pending) rootClassName.push('at-timeline--pending')

    const rootClassObject = {
      'at-timeline--pending': pending,
    }

    const itemElems = items.map((item, index) => {
      const {
        status_code_str = '',
        create_time= '',
        color,
        icon,
        remark= '',
        content = [],
      } = item

      const itemRootClassName = ['at-timelineitem']
      if (color) itemRootClassName.push(`at-timelineitem--${color}`)

      const dotClass = ['at-timelineitem__dot']
      if (icon) dotClass.push('at-timelineitem__icon')

      return (
        <View className={itemRootClassName} key={index}>
          <View className='at-timelineitem__tail'>
            <View className='at-timelineitem__tail__dot'></View>
            <View className='at-timelineitem__tail__dot'></View>
            <View className='at-timelineitem__tail__dot'></View>
          </View>
          <View className={dotClass}>
            <Image className='dot-img' src={checkPng}/>
          </View>
          <View className='at-timelineitem__content'>
            <View className='at-timelineitem__content-item'>
              <View className='at-timelineitem__content-item__name'>{status_code_str}</View>
              <View className='at-timelineitem__content-item__time'>{create_time}</View>
            </View>
            <View
              className='at-timelineitem__content-item at-timelineitem__content--sub'
            >
              {remark}
            </View>
          </View>
        </View>
      )
    })
    return (
      <View
        className={classNames(rootClassName, rootClassObject, this.props.className)}
        style={customStyle}
      >
        {itemElems}
      </View>
    )
  }
}
