import Taro, { Component, getApp } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import EmptyPage from '../../../components/EmptyContent'
import { AtForm, AtSwitch, AtButton, AtInput } from 'taro-ui'
import './index.less'

@connect(({common}) => ({...common}))

export default class RepastSetting extends Component {

  config = {
    navigationBarTitleText: '就餐设置',
    disableScroll: true
  }

  state = {
    s_take_dinner: 1,
    s_take_bale: 1,
    loading: false,
    s_take_money: ''
  }

  componentDidMount () {
    this.fetchRepast(false)
  }

  fetchRepast = (save = false, saveMoney = false) => {
    const { s_take_dinner, s_take_bale, s_take_money } = this.state
    let payload = {
      store_id: Taro.getStorageSync('storeId'),
      save
    }
    if(save) {
      payload = {
        ...payload,
        s_take_dinner,
        s_take_bale,
        s_take_money
      }
    }
    this.props.dispatch({
      type: 'desk/fetchRepast',
      payload
    }).then((res) => {
      if(res != undefined && res != 203) {
        if(!save) {
          this.setState({
            ...res,
            loading: true
          })
        }else if(saveMoney){
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
    this.setState({
      [key]: value
    }, () => {
      if(key != 's_take_money') {
        this.fetchRepast(true)
      }
    })
  }

  saveTime = () => {
    this.fetchRepast(true, true)
  }

  render () {
    const { s_take_dinner, loading, s_take_bale, s_take_money } = this.state
    return (
      loading ?
      <View className='repast-setting-page setting-page'>
        <AtForm
          onSubmit={this.onSubmit.bind(this)}
          onReset={this.onReset.bind(this)}
        >
          <View className="form-row">
            <AtSwitch color='#1AAD16' title='食堂就餐' disabled={s_take_bale != 1} border={false} checked={s_take_dinner == 1} onChange={(value) => {this.setValue('s_take_dinner', value ? 1 : 2)}} />
          </View>
          <View className="form-row">
            <AtSwitch color='#1AAD16' title='外卖配送' disabled={s_take_dinner != 1} border={false} checked={s_take_bale == 1} onChange={(value) => {this.setValue('s_take_bale', value ? 1 : 2)}} />
          </View>
          <View className="form-desc form-warn">可同时开启两个就餐方式，最少保留一个就餐方式！</View>
          <View className="form-row border-bottom">
            <AtInput
              title='打包费'
              name='s_take_money'
              type='text'
              border={false}
              placeholder={s_take_money ? '' : '请输入金额'}
              value={s_take_money}
              onChange={(e) => { this.setValue('s_take_money', e) }}
            >
            元<Text className='input-button' onClick={() => { this.saveTime() }}>保存</Text>
            </AtInput>
          </View>
        </AtForm>
      </View>
      : <EmptyPage />
    )
  }
}

