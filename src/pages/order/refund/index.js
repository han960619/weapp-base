import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import './index.less'
import checkPng from '../../../assets/images/check.png'


@connect(({common}) => ({...common}))

export default class OrderCancel extends Component {

  config = {
    navigationBarTitleText: '订单退款',
    disableScroll: true
  }

  state = {
    note: '',
    o_id: '',
    o_pay_amount: '',
    amount: ''
  }

  componentWillMount() {
    const { params } = this.$router
    this.setState({
      ...params
    })
  }
  
  bindKeyInput = (e, key) => {
    this.setState({
      [key]: e.detail.value
    })
  }

  submitForm = () => {
    const { note, amount, o_id, o_pay_amount } = this.state
    const store_id = Taro.getStorageSync('storeId')
    if(!amount) {
      Taro.showToast({
        title: '请输入退款金额',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return false
    }
    if( +amount > +o_pay_amount) {
      Taro.showToast({
        title: '退款金额不能大于支付金额',
        icon: 'none',
        mask: true,
        duration: 2000
      })
    }else {
      this.props.dispatch({
        type: `order/refundOrder`,
        payload: {
          store_id,
          o_id,
          amount,
          remark: note
        }
      }).then((res)=> {
        if(res != 203) {
          Taro.showToast({
            title: '退款成功',
            icon: 'success',
            mask: true,
            duration: 2000
          }).then(() => {
            setTimeout(() => {
              Taro.navigateBack()
            }, 2000)
          })
        }
      })
    }
  }

  render() {
    const { note, amount, o_pay_amount } = this.state
    return (
      <View className='order-cancel'>
        <View className='refund panes'>
          <View className='refund-wrap'>
            <View className='tips'>微信支付</View>
            <View className='txt price'>￥{o_pay_amount}</View>
          </View>
          <View className='refund-wrap'>
            <View className='tips'>退款金额</View>
            <Input value={amount} onChange={(e) => { this.bindKeyInput(e, 'amount') }} className='txt' placeholder='请输入退款金额' placeholderClass='inp' />
          </View>
          <View className='refund-wrap'>
            <View className='tips'>退款方式</View>
            <View className='txt'>原路退回</View>
          </View>
        </View>
        <View className='note'>
          <View className='note-title title'>备注</View>
          <View className='note-content panes'>
            <Input value={note} onChange={(e) => { this.bindKeyInput(e, 'note') }} className='text' maxLength={15} placeholder='在此填入原因，选填（仅限15字）' placeholderClass='inp' />
          </View>
        </View>
        <View className='footer'>
          <AtButton className='btn' onClick={() => { this.submitForm() }}>确定</AtButton>
        </View>
      </View>
    )
  }
}

