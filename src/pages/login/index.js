import Taro, { Component, getApp } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import './index.less'

@connect(({common}) => ({...common}))

export default class Login extends Component {

  config = {
    navigationBarTitleText: '登录'
  }

  state = {
    userName: '',
    passward: ''
  }

  componentWillMount () { }

  componentDidMount () {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onSubmit = (res) => {
    const { userName, passward } = this.state
    const payload = {
      userName,
      passward
    }
    if(userName && passward) {
      this.props.dispatch({
        type: 'common/login',
        payload
      }).then(res => {
        Taro.setStorageSync('userData', payload )
        Taro.reLaunch({
          url: '/pages/order/index'
        })
      }).catch(() => {
        this.toastOption('您输入的账号密码有误，请重新输入')
      })
    }else {
      this.toastOption('请输入正确的账号密码')
    }
  }

  toastOption = (title) => {
    Taro.showToast({
      title,
      icon: 'none',
      duration: 2000
    }).then(() => {
      this.setState({
        passward: ''
      })
    })
  }

  handleChange (type ,value) {
    let state = this.state
    state[type] = value
    this.setState({
      state
    })
  }

  render () {
    return (
      <AtForm
        onSubmit={this.onSubmit.bind(this)}
      >
        <AtInput
          name='userName'
          title='账号'
          type='text'
          placeholder='请输入您的账号'
          value={this.state.userName}
          onChange={(e) => { this.handleChange('userName', e) }}
        />
        <AtInput
          name='passward'
          title='密码'
          type='text'
          placeholder='请输入您的密码'
          value={this.state.passward}
          onChange={(e) => { this.handleChange('passward', e) }}
        />
        <AtButton formType='submit'>提交</AtButton>
      </AtForm>
    )
  }
}

