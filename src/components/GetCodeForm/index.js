import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import classnames from 'classnames'
import { AtInput } from 'taro-ui'
import PropTypes from 'prop-types'
import './index.less'
import {connect} from '@tarojs/redux'
let time;

@connect(({common}) => ({...common}))
class GetCodeForm extends Component {
  static options = {
    addGlobalClass: true
  }

  static propTypes = {
    mobile: PropTypes.string,
    code: PropTypes.string,
  }

  static defaultProps = {
    mobile: '',
    code: ''
  }

  state = {
    sec: 59,
    isShow: false
  }

  getCode = () => {
    const { mobile } = this.state;
    const reg = /^[1][3,4,5,7,8][0-9]{9}$/
    if(!mobile) {
      return false
    }
    if(mobile && reg.test(mobile)) {
      this.props.dispatch({
        type: 'common/sendCode',
        payload: {
          mobile
        }
      }).then((res) => {
        console.log(res)
        if(res != undefined) {
          this.setState({
            isShow: true
          })
          var remain = 59;         
          time = setInterval(() => {
            if (remain == 1) {
              clearInterval(time);            
              this.setState({
                sec: 59,
                isShow: false
              })
              return false   
            }
            remain--;
            this.setState({
              sec: remain
            })
          }, 1000)
        }
      })
    }else{
      Taro.showToast({
        title: '请输入正确手机号',
        icon: 'none',
        image: '../../assets/images/toast-warn.png',
        mask: true,
        duration: 2000
      })
      return false
    }
  }

  handleChange = (type, value) => {
    this.props.updateProps(type, value)
  }

  render () {
    const { mobile, code } = this.props
    const { sec } = this.state
    
    return (
      <View className="form-item">
        <View className="form-row">
          <AtInput
            name='mobile'
            type='number'
            clear
            border={false}
            maxLength={10}
            placeholder='手机号码'
            value={mobile}
            onChange={(e) => { this.handleChange('mobile', e) }}
          />
        </View>
        <View className="form-row code-row">
          <AtInput
            className="code-input"
            name='code'
            type='text'
            border={false}
            clear
            placeholder='验证码'
            maxLength={10}
            value={code}
            onChange={(e) => { this.handleChange('code', e) }}
          >
          {
            isShow ? 
              <View className="form-control form-defaultText">{sec}</View>
              :
              <View className={classnames('form-control', !mobile ? 'form-defaultText' : '')} onClick={() => { this.getCode() }}>获取验证码</View> 
          }
          </AtInput>
        </View>
      </View>
    )
  }
}

export default GetCodeForm
