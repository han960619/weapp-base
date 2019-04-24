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
  }

  componentWillMount() {
    const { params } = this.$router
    this.setState({
      ...params
    })
  }
  
  bindKeyInput = (e) => {
    this.setState({
      note: e.detail.value
    })
  }

  submitForm = () => {
    const { note, o_id, o_pay_amount } = this.state
    const store_id = Taro.getStorageSync('storeId')
    this.props.dispatch({
      type: `order/cancelOrder`,
      payload: {
        store_id,
        o_id,
        pay_status: o_order_status == 1 ? 1 : 2,
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

  render() {
    const { o_pay_amount, note } = this.state
    return (
      <View className='order-cancel'>
        <View className='refund panes'>
          <View className='refund-wrap'>
            <View className='tips'>微信支付</View>
            <View className='txt price'>￥10.00</View>
          </View>
          <View className='refund-wrap'>
            <View className='tips'>退款金额</View>
            <Input value={o_pay_amount} onChange={(e) => { this.bindKeyInput(e, 'o_pay_amount') }} className='txt' placeholder='请输入退款金额' placeholderClass='inp' />
          </View>
          <View className='refund-wrap'>
            <View className='tips'>退款方式</View>
            <View className='txt'>原路退回</View>
          </View>
        </View>
        {
          showNote && <View className='note'>
            <View className='note-title title'>备注</View>
            <View className='note-content panes'>
              <Input value={note} onChange={(e) => { this.bindKeyInput(e, 'note') }} className='text' maxLength={15} placeholder='在此填入原因，选填（仅限15字）' placeholderClass='inp' />
            </View>
          </View>
        }
        <View className='footer'>
          <AtButton className='btn' onClick={() => { this.submitForm() }}>确定</AtButton>
        </View>
      </View>
    )
  }
}

