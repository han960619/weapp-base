import Taro, { Component, getApp } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtForm, AtInput, AtButton, AtIcon } from 'taro-ui'
import './index.less'
import printerForm from '../../../assets/images/printerForm.png'
import { printList } from '../../../config/index'

@connect(({common}) => ({...common}))

export default class AddPrinter extends Component {

  config = {
    navigationBarTitleText: '添加打印机',
  }

  state = {
    id: '',
    printer_key: '',
    printer_name: '',
    printer_number: '',
    print_number: '1'
  }

  componentWillMount() {
    const { params } = this.$router
    if(params.id) {
      Taro.setNavigationBarTitle({
        title: '编辑打印机'
      })
      this.setState({
        ...params
      })
    }
  }

  setValue = (key, value) => {
    this.setState({
      [key]: value
    })
  }

  onSubmit = () => {
    const { id, printer_key, printer_name, printer_number,
      print_number } = this.state
    
    let payload = {
      store_id: Taro.getStorageSync('storeId'),
      printer_name,
      printer_number,
      printer_key,
      print_number
    }
    if(id) {
      payload = {
        ...payload,
        id
      }
    }
    if(printer_name && printer_number && printer_key) {
      this.props.dispatch({
        type: 'desk/savePrinter',
        payload
      }).then((res) => {
        if(res != undefined && res != '203') {
          Taro.showToast({
            title: '保存成功',
            icon: 'success',
            mask: true,
            duration: 1500
          }).then(() => {
            setTimeout(() => {
              Taro.navigateBack()
            }, 1500)
          })
        }
      })
    }else {
      Taro.showToast({
        title: '请填写正确的设备信息',
        icon: 'none',
        mask: true,
      })
    }
  }

  deletePrint = () => {
    this.props.dispatch({
      type: 'desk/delPrinter',
      payload: {
        store_id: Taro.getStorageSync('storeId'),
        id: this.state.id
      }
    }).then((res) => {
      if(res != undefined && res != '203') {
        Taro.showToast({
          title: '删除成功',
          icon: 'success',
          mask: true,
          duration: 1500
        }).then(() => {
          setTimeout(() => {
            Taro.navigateBack()
          }, 1500)
        })
      }
    })
  }

  render () {
    const { id, printer_key, printer_name, printer_number,
    print_number } = this.state
    let printNumList = [1,2,3,4]
    return (
      <View className='order-setting-page setting-page'>
        <AtForm
          onSubmit={this.onSubmit.bind(this)}
          onReset={this.onReset.bind(this)}
        >
          <View className="form-title">请确保Wifi打印机已连接网络</View>
          <View className="form-content">
            <Image src={printerForm} className='shareImg'/>
            <View className="form-row must-row">
              <View className="row-title">品牌</View>
              <View className="row-value">飞鹅</View>
            </View>
            <View className="form-row">
              <AtInput
                title='设备名称'
                name='printer_name'
                type='text'
                border={false}
                placeholder={ printer_name ? '' : '请输入打印机名称' }
                value={printer_name}
                onChange={(e) => { this.setValue('printer_name', e) }}
              />
            </View>
            <View className="form-row">
              <AtInput
                title='设备号码'
                name='printer_number'
                type='text'
                border={false}
                placeholder={ printer_number ? '' : '请输入打印机号码' }
                value={printer_number}
                onChange={(e) => { this.setValue('printer_number', e) }}
              />
            </View>
            <View className="form-row">
              <AtInput
                title='设备秘钥'
                name='printer_key'
                type='text'
                border={false}
                placeholder={ printer_key ? '' : '请输入打印机秘钥' }
                value={printer_key}
                onChange={(e) => { this.setValue('printer_key', e) }}
              />
            </View>
            <View className="form-row">
              <Picker mode='selector' range={printNumList} value={print_number - 1} onChange={(e) => {this.setValue('print_number', printList[+e.detail.value].value)}}>
                <View className='demo-list-item'>
                  <View className='demo-list-item__label'>打印数量</View>
                  <View className='demo-list-item__value'>{print_number}张<AtIcon value='chevron-right' size='20' color='#FF8F1F'></AtIcon></View>
                </View>
              </Picker>
            </View>
            <View className="form-desc form-warn">设备号码及秘钥可在打印机底部查看</View>
          </View>  
          <View className='form-footer'>
            <AtButton className='form-button' formType='submit'>保存打印机</AtButton>
            {
              id ? 
              <AtButton className='form-button delete-button' onClick={() => { this.deletePrint() }}>删除</AtButton>
              : ''
            }
          </View>
        </AtForm>
      </View>
    )
  }
}

