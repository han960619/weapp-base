import Taro, { Component, getApp } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtForm, AtSwitch, AtButton } from 'taro-ui'
import EmptyPage from '../../../components/EmptyContent'
import { otherDispatchList, dispatchList } from '../../../config/index'
import './index.less'

@connect(({common}) => ({...common}))

export default class TakeawaySetting extends Component {

  config = {
    navigationBarTitleText: '外卖设置',
    disableScroll: true
  }

  state = {
    status: 2,
    send_type: 0,
    third_party_use: 0,
    third_party: '',
    loading: false
  }

  componentDidMount () {
    this.fetchTakeaway(false)
  }

  fetchTakeaway = (save = false) => {
    const { status, send_type, third_party_use, third_party } = this.state
    let payload = {
      store_id: Taro.getStorageSync('storeId'),
      save
    }
    if(save) {
      payload = {
        ...payload,
        third_party,
        status,
        third_party_use,
        send_type
      }
    }
    this.props.dispatch({
      type: 'desk/fetchTakeaway',
      payload
    }).then((res) => {
      if(res != 203 && !save) {
        this.setState({
          ...res,
          loading: true
        })
      }
    })
  }

  setValue = (key, value) => {
    let data = {}
    this.setState({
      [key]: value
    }, () => {
      this.fetchTakeaway(true)
    })
  }

  render () {
    const { loading, status, send_type, third_party_use, third_party } = this.state
    console.log(dispatchList)
    const list = third_party_use == 0 ? dispatchList.slice(0 ,1) : dispatchList
    return (
      loading ? 
      <View className='takeaway-setting-page setting-page'>
        <AtForm
          onSubmit={this.onSubmit.bind(this)}
          onReset={this.onReset.bind(this)}
        >
          <View className="form-row border-top-bottom">
            <AtSwitch color='#1AAD16' title='外卖配送' border={false} checked={status == 1} onChange={(value) => {this.setValue('status', value ? 1 : 2)}} />
          </View>
          {
            status == 1 ? 
            <View>
              <View className="form-desc item-title">默认方式</View>
              <View className="form-row must-row border-top-bottom">
                <View className="row-title">商家配送</View>
                <View className="row-value">已开启</View>
              </View>
              <View className="form-row border-bottom">
                <Picker mode='selector' rangeKey='label' range={otherDispatchList} 
                  onChange={(e) => {
                    if(e.detail.value == 0) {
                      this.setValue('third_party_use', 0)
                    }else {
                      this.setValue('third_party_use', 1)
                      this.setValue('third_party', 'dada')
                    }
                  }}
                >
                  <View className='demo-list-item'>
                    <View className='demo-list-item__label'>第三方同城配送</View>
                    <View className='demo-list-item__value'>{third_party_use == 1 ? '达达配送' : '暂不开启'}<AtIcon value='chevron-right' size='20' color='#999'></AtIcon></View>
                  </View>
                </Picker>
              </View>
              <View className="form-desc item-title">默认配送</View>
              <View className="form-row border-top-bottom">
                <AtSwitch color='#1AAD16' title='默认配送' border={false} checked={send_type != 0} onChange={(value) => {this.setValue('send_type', value ? 1 : 0)}} />
              </View>
              {
                send_type != 0 ? 
                <View className="form-row border-bottom">
                  <Picker mode='selector' range={list} rangeKey='label' onChange={(e) => {this.setValue('send_type', +e.detail.value + 1)}}>
                    <View className='demo-list-item'>
                      <View className='demo-list-item__label'>配送方式</View>
                      <View className='demo-list-item__value'>{send_type == 1 ? '商家配送' : '第三方配送'}<AtIcon value='chevron-right' size='20' color='#999'></AtIcon></View>
                    </View>
                  </Picker>
                </View>
                : ''
              }
              <View className="form-desc item-warn">未配置达达，服务将无法生效，请前往PC端配置</View>
            </View>
            : ''
          }
        </AtForm>
      </View>
      : <EmptyPage />
   )
  }
}

