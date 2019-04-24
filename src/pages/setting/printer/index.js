import Taro, { Component, getApp } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import classnames from 'classnames'
import EmptyPage from '../../../components/EmptyContent'
import printerPng from '../../../assets/images/printer.png'
import './index.less'

@connect(({desk}) => ({...desk}))

export default class PrinterSetting extends Component {

  config = {
    navigationBarTitleText: '打印机设置',
  }

  state = {
    printerList: [],
    otherPrinter: [],
    loading: false,
    curPrinter: []
  }

  componentDidShow() {
    this.fetchPrinter()
  }

  fetchPrinter = () => {
    this.props.dispatch({
      type: 'desk/getPrinterList',
      payload: {
        store_id: Taro.getStorageSync('storeId')
      }
    }).then((res) => {
      if(!res || res == '203') {
      }else {
        res = res.rows ? res.rows : []
        let curPrinter = res.filter((item) => {
          return item.print_status == 1
        })
        let otherPrinter = res.filter((item) => {
          return item.print_status != 1
        })
  
        this.setState({
          printerList: res,
          otherPrinter,
          curPrinter,
          loading: true
        })
      }
    })
  }

  setValue = (key, value) => {
    this.setState({
      [key]: value
    })
  }

  linkTo = () => {
    Taro.navigateTo({ url: '/pages/setting/addPrinter/index' })
  }

  linkToEdit = (item) => {
    const { id, printer_key, printer_name, printer_number,
        print_number } = item
    Taro.navigateTo({ 
      url: `/pages/setting/addPrinter/index?printer_key=${printer_key}&printer_name=${printer_name}&printer_number=${printer_number}&print_number=${print_number}&id=${id}` 
    })
  }

  

  setItem = (id) => {
    this.props.dispatch({
      type: 'desk/changePrinter',
      payload: {
        store_id: Taro.getStorageSync('storeId'),
        id
      }
    }).then(() => {
      this.fetchPrinter()
    })
  }

  render () {
    const { printerList, loading, otherPrinter, curPrinter } = this.state
    return (
      loading ?
      <View className='printer-list-page setting-page'>
        {
          printerList.length > 0 ? 
          <View className='printer-list'>
            <View className='curPrinter'>
              <View className='printer-title'>
                <View className='printer-icon'></View>
                <View className='printer-type'>当前设备</View>
                <View className='printer-button' onClick={() => {this.linkToEdit(curPrinter[0])}}>编辑</View>
              </View>
              {
                curPrinter.map((item, index) => (
                  <View className='printer-content' key={index}>
                    <View className='printer-row'>
                      <View className='row-label'>设备名称</View>
                      <View className='row-text'>{item.printer_name}</View>
                    </View>
                    <View className='printer-row'>
                      <View className='row-label'>品牌</View>
                      <View className='row-text'>{item.printer_brand}</View>
                    </View>
                    <View className='printer-row'>
                      <View className='row-label'>工作状态</View>
                      <View className={classnames('row-text', item.status_str != '离线' ? 'used' : 'noUsed')}>{item.status_str}</View>
                    </View>
                  </View>
                ))
              }
            </View>
            <View className='otherPrinter'>
            <View className='printer-title'>
                <View className='printer-icon'></View>
                <View className='printer-type'>待使用设备</View>
                <View className='printer-button' onClick={() => {this.linkTo()}}>添加</View>
              </View>
              {
                otherPrinter && otherPrinter.length > 0
                ? <View>
                    {
                      otherPrinter.map((item, index) => (
                        <View className='printer-content' key={index}>
                          <View className='printer-row'>
                            <View className='row-label'>设备名称</View>
                            <View className='row-text'>{item.printer_name}</View>
                          </View>
                          <View className='printer-row'>
                            <View className='row-label'>品牌</View>
                            <View className='row-text'>{item.printer_brand}</View>
                          </View>
                          <View className='printer-row'>
                            <View className='row-label'>工作状态</View>
                            <View className={classnames('row-text', item.status_str != '离线' ? 'used' : 'noUsed')}>{item.status_str}</View>
                          </View>
                          <View className='printer-row option-row'>
                            <View className='row-button' onClick={() => {this.linkToEdit(item)}}>编辑</View>
                            <View className='row-button used' onClick={() => {this.setItem(item.id)}}>使用</View>
                          </View>
                        </View>
                      ))
                    }
                  </View>
                : <View className='no-printer'>
                    <Image className='no-printer-img' src={printerPng} />
                    <View className='no-printer-desc'>暂未添加其他可用设备</View>
                  </View>
              }
            </View>
          </View>
          : <View className='no-page'>
              <EmptyPage 
                tip='当前暂未添加任何打印机'
                image={printerPng}
                onAction={() => {this.linkTo()}}
                buttonText='立即添加'
              >
              </EmptyPage>
            </View>
        }
      </View>
      : <EmptyPage />
    )
  }
}

