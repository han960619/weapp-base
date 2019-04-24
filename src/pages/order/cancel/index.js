import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import './index.less'
import checkPng from '../../../assets/images/check.png'


@connect(({common}) => ({...common}))

export default class OrderCancel extends Component {

  config = {
    navigationBarTitleText: '取消订单',
    disableScroll: true
  }

  state = {
    reasons: ['商品缺货', '生意繁忙', '休息打烊', '其他(选填)'],
    current: 0,
    note: '',
    o_id: '',
    o_order_status: '',
    showNote: false
  }

  componentWillMount() {
    const { params } = this.$router
    this.setState({
      ...params
    })
  }

  handlePickReasons = (index, e) => {
    this.setState({
      current: index,
      showNote: index == 3
    })
  }
  
  bindKeyInput = (e) => {
    this.setState({
      note: e.detail.value
    })
  }

  submitForm = () => {
    const { reasons, current, note, o_id, o_order_status } = this.state
    const store_id = Taro.getStorageSync('storeId')
    this.props.dispatch({
      type: `order/cancelOrder`,
      payload: {
        store_id,
        o_id,
        pay_status: o_order_status == 1 ? 1 : 2,
        remark: current == 3 ? note : reasons[current]
      }
    }).then((res)=> {
			if(res != 203) {
				Taro.showToast({
					title: '取消成功',
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
    const { reasons, note, current, showNote } = this.state
    const cancelReasons = reasons.map((item, index) => {
      return (
        <View className='cancel-wrap' key={index} onClick={this.handlePickReasons.bind(this, index)}>
          <View className={`tips ${current == index ? 'active' : ''}`}>{item}</View>
          {
            current == index ? <Image className='icon' src={checkPng} /> : ''
          }
        </View>
      )
    })

    return (
      <View className='order-cancel'>
        <View className='cancel'>
          <View className='cancel-title title'>取消订单原因</View>
          <View className='cancel-content panes'>
            {cancelReasons}
          </View>
        </View>
        {
          showNote && <View className='note'>
            <View className='note-title title'>备注</View>
            <View className='note-content panes'>
              <Input value={note} onChange={(e) => { this.bindKeyInput(e) }} className='text' maxLength={15} placeholder='在此填入原因，选填（仅限15字）' placeholderClass='inp' />
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

