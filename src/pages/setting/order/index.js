import Taro, { Component } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtForm, AtSwitch, AtButton, AtInput, AtIcon } from 'taro-ui'
import './index.less'
import EmptyPage from '../../../components/EmptyContent'
import { autoList, workList, reserveList, timeList } from '../../../config/index'

@connect(({desk}) => ({...desk}))
export default class OrderSetting extends Component {

  config = {
    navigationBarTitleText: '订单设置',
    disableScroll: true
  }

  state = {
    s_automatic: 2,
    s_nopay_close: '10',
    s_production: 2,
    s_production_time: '5',
    s_reserve: '-1',
    s_reserve_interval: '5',
    s_reserve_reserve: '',
    loading: false
  }

  componentDidMount () {
    this.fetchOrder(false)
  }

  fetchOrder = (save = false, data = {}) => {
    let payload = {
      store_id: Taro.getStorageSync('storeId'),
      save
    }
    if(save) {
      payload = {
        ...payload,
        ...data
      }
    }
    this.props.dispatch({
      type: 'desk/fetchOrder',
      payload
    }).then((res) => {
      if(res != 203) {
        if(!save) {
          this.setState({
            ...res,
            loading: true
          })
        }else if(data.s_reserve_reserve){
          Taro.showToast({
            title: '保存成功',
            icon: 'success',
            mask: true,
          })
        }
      }
    })
  }

  setValue = (key, value) => {
    let data = {}
    this.setState({
      [key]: value
    }, () => {
      if(key != 's_reserve_reserve') {
        data[key] = value
        this.fetchOrder(true, data)
      }
    })
  }

  saveTime = () => {
    let data = {
      s_reserve_reserve: this.state.s_reserve_reserve
    }
    this.fetchOrder(true, data)
  }

  render () {
    const { s_automatic, s_nopay_close, s_production, s_production_time,
      s_reserve, s_reserve_interval, s_reserve_reserve, loading } = this.state
    return (
      loading ?
      <View className='order-setting-page setting-page'>
        <AtForm
          onSubmit={this.onSubmit.bind(this)}
          onReset={this.onReset.bind(this)}
        >
          <View className='form-item'>
            <View className='item-title'>自动设置</View>
            <AtSwitch title='自动接单' color='#1AAD16' border={false} checked={s_automatic == 1} onChange={(value) => {this.setValue('s_automatic', value ? 1 : 2)}} />
            <Picker mode='selector' range={autoList} rangeKey='label' onChange={(e) => {this.setValue('s_nopay_close', autoList[+e.detail.value].value)}}>
              <View className='demo-list-item'>
                <View className='demo-list-item__label'>自动关闭</View>
                <View className='demo-list-item__value'>{s_nopay_close}分钟<AtIcon value='chevron-right' size='20' color='#999'></AtIcon></View>
              </View>
            </Picker>
          </View>
          <View className='form-item'>
            <View className='item-title'>制作设置</View>
            <AtSwitch title='自动完成' color='#1AAD16' border={false} checked={s_production == 1} onChange={(value) => {this.setValue('s_production', value ? 1 : 2)}} />
            <Picker mode='selector' range={workList} rangeKey='label' onChange={(e) => {this.setValue('s_production_time', workList[+e.detail.value].value)}}>
              <View className='demo-list-item'>
                <View className='demo-list-item__label'>制作时间</View>
                <View className='demo-list-item__value'>{s_production_time}分钟<AtIcon value='chevron-right' size='20' color='#999'></AtIcon></View>
              </View>
            </Picker>
          </View>
          <View className='form-item'>
            <View className='item-title'>预约设置</View>
            <Picker mode='selector' range={timeList} value={s_reserve} rangeKey='label' onChange={(e) => {this.setValue('s_reserve', timeList[+e.detail.value].value)}}>
              <View className='demo-list-item'>
                <View className='demo-list-item__label'>预约点餐</View>
                <View className='demo-list-item__value'>{s_reserve == '-1' ? '暂不开启' : timeList[s_reserve].label}</View>
              </View>
            </Picker>
            {
              s_reserve != '-1' ?
              <View>
                <Picker className='border-top' mode='selector' range={reserveList} rangeKey='label' onChange={(e) => {this.setValue('s_reserve_interval', reserveList[+e.detail.value].value)}}>
                  <View className='demo-list-item'>
                    <View className='demo-list-item__label'>预约间隔</View>
                    <View className='demo-list-item__value'>{s_reserve_interval}分钟<AtIcon value='chevron-right' size='20' color='#999'></AtIcon>
                    </View>
                  </View>
                </Picker>
                <AtInput
                  title='最早预约'
                  name='s_reserve_reserve'
                  type='number'
                  border={false}
                  placeholder={s_reserve_reserve ? '' : '请输入时间'}
                  value={s_reserve_reserve}
                  onChange={(e) => { this.setValue('s_reserve_reserve', e) }}
                >
                分钟<Text className='input-button' onClick={() => { this.saveTime() }}>保存</Text>
                </AtInput>
              </View>
              : ''
            }
          </View>
          {
            s_reserve != '-1' ?
            <View className='item-warn'>最早预约：若输入时间为60分钟，营业时间为8:30，则顾客可选的最早预约时间为9:30</View>
            : ''
          }
        </AtForm>
      </View>
      : <EmptyPage />
    )
  }
}

