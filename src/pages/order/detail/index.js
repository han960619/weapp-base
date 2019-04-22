import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton } from 'taro-ui'
import classnames from 'classnames'
import './index.less'

@connect(({order}) => ({...order}))

export default class orderDetail extends Component {

  config = {
    navigationBarTitleText: '订单详情'
  }

  state = {
    o_id: null,
    detailData: {}
  }

  componentWillMount () {
    const { params } = this.$router
    this.setState({
      ...params
    })
  }

  componentDidShow () {
    this.fetchOrderDetail()
  }

  fetchOrderDetail = () => {
    const { o_id } = this.state
    const store_id = Taro.getStorageSync('storeId')
    this.props.dispatch({
      type: 'order/fetchOrderDetail',
      payload: {
        store_id,
        o_id
      }
    }).then((res) => {
      if(res != '203') {
        this.setState({
          detailData: res
        })
      }
    })
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

