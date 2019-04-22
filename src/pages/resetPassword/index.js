import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import GetCodeForm from '../../components/GetCodeForm'
import './index.less'

@connect(({common}) => ({...common}))

export default class Index extends Component {

  config = {
    navigationBarTitleText: '后台登录',
    disableScroll: true
  }

  state = {
    mobile: '',
    password: '',
    code: '',
  }

  handleChange = (type ,value) => {
    let state = this.state
    state[type] = value
    this.setState({
      state
    })
  }

  toastOption = (title, image) => {
    Taro.showToast({
      title,
      icon: 'none',
      image,
      mask: true,
      duration: 2000
    })
  }

  onSubmit = () => {
    const { mobile, password, code } = this.state
    let payload = { mobile, password, code }
    if(!mobile && !/^[1][3,4,5,7,8][0-9]{9}$/.test(mobile)) {
      this.toastOption('请输入正确的手机号和密码')
      return
    }else if(!code) {
      this.toastOption('请输入正确的验证码')
      return
    }else if(!password) {
      this.toastOption('请输入密码')
      return
    }
    this.props.dispatch({
      type: 'common/resetPassword',
      payload
    }).then(res => {
      if(res) {
        Taro.navigateBack()
      }
    })
  }

  render () {
    const { mobile, code, password } = this.state
    return (
      <View className="reset-page">
        <AtForm
          className='reset-form'
          onSubmit={() => { this.onSubmit() }}
        >
          <GetCodeForm  
            mobile={mobile} 
            code={code} 
            my-class="form-item"
            updateProps={(type, value) => {this.handleChange(type, value)}} 
          />
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
          <AtButton className='form-button' formType='submit'>提交</AtButton>
        </AtForm>
      </View>
    )
  }
}

