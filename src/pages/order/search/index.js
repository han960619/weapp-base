import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import classnames from 'classnames'
import GetCodeForm from '../../components/GetCodeForm'
import './index.less'
import toastPng from '../../assets/images/toast-warn.png'


@connect(({common}) => ({...common}))

export default class Login extends Component {

  config = {
    navigationBarTitleText: '后台登录',
    disableScroll: true
  }


  state = {
    mobile: '',
    password: '',
    code: '',
    active: 1,
  }

  onSubmit = () => {
    const { mobile, password, code, active } = this.state
    let payload = { mobile, type: active }
    if(active == 1) {
      if(mobile && /^[1][3,4,5,7,8][0-9]{9}$/.test(mobile) && code) {
        payload = {
          ...payload,
          code
        }
      }else {
        this.toastOption('请输入正确的手机号和验证码', toastPng)
        return false
      }
    }else {
      if(mobile && /^[1][3,4,5,7,8][0-9]{9}$/.test(mobile) && password) {
        payload = {
          ...payload,
          password
        }
      }else {
        this.toastOption('请输入正确的手机号和密码', toastPng)
        return false
      }
    }

    this.props.dispatch({
      type: 'common/login',
      payload
    }).then(res => {
      if(res) {
        Taro.reLaunch({
          url: '/pages/storeList/index'
        })
      }
    })
  }

  toastOption = (title, image) => {
    Taro.showToast({
      title,
      icon: 'none',
      image,
      mask: true,
    })
  }

  handleChange = (type ,value) => {
    let state = this.state
    state[type] = value
    this.setState({
      state
    })
  }

  changeTab = active => {
    if(active != this.state.active) {
      this.setState({
        active,
        mobile: '',
        code: '',
        password: ''
      })
    } 
  }

  render () {
    const { active, code, mobile, password } = this.state;
    return (
      <View className='login-page'>
        <View className='page-header'>
          <View
            className={classnames('header-title normal', active === 1 ? 'active' : '')}
            onClick={() => { this.changeTab(1) }}>验证码登录</View>
          <View className='line'></View>
          <View
            className={classnames('header-title useless', active === 2 ? 'active' : '')}
            onClick={() => { this.changeTab(2) }}>密码登录</View>
        </View>
        <AtForm
          className='login-form'
          onSubmit={() => { this.onSubmit() }}
        >
          {
            active == 2 ? 
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
                <View className="form-row">
                  <AtInput
                    name='password'
                    type='password'
                    clear
                    border={false}
                    maxLength={20}
                    placeholder='输入密码'
                    value={password}
                    onChange={(e) => { this.handleChange('password', e) }}
                  />
                </View>
              </View>
              :
              <GetCodeForm  
                mobile={mobile} 
                code={code} 
                updateProps={(type, value) => {this.handleChange(type, value)}} 
              />
          }
          <AtButton className='form-button' formType='submit'>登录</AtButton>
        </AtForm>
        {
          active == 2 ? 
            <View className="link-to" 
              onClick={() => { Taro.navigateTo({ url: '/pages/resetPassword/index' }) }}>
            忘记密码？</View>
            : ''
        }
      </View>
    )
  }
}

