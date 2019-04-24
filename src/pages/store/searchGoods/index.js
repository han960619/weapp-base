import Taro, { Component, getApp } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import GoodsItem from '../../../components/GoodsItem'
import EmptyPage from '../../../components/EmptyContent'
import './index.less'
import noListPng from '../../../assets/images/noList.png'
import { AtIcon, AtInput } from 'taro-ui'

@connect(({store}) => ({...store}))

export default class SearchGoods extends Component {

  config = {
    navigationBarTitleText: '在售商品',
  }

  state = {
    searchGoodsList: [],
    keyword: ''
  }

  componentDidMount () { 
  }

  handleChange = (value) => {
    let keyword = value.trim()
    if(keyword && keyword != '') {
      this.setState({
        keyword
      })
      this.props.dispatch({
        type: 'store/fetchGoods',
        payload: {
          store_id: Taro.getStorageSync('storeId'),
          search: keyword
        }
      }).then((res) => {
        this.setState({
          searchGoodsList: res
        })
      })
    }else {
      this.setState({
        searchGoodsList: [],
        keyword: ''
      })
    }
  }

  render () {
    const { searchGoodsList, keyword } = this.state;
    return (
      <View className='searchGoods-page'>
        <View className='search-panel'>
          <AtIcon value='search' className='search-icon' size='18'/>
          <AtInput
            focus
            placeholder='请输入商品名'
            name='keyword'
            type='text'
            clear
            border={false}
            value={keyword}
            onChange={(e) => { this.handleChange(e) }}
          />
        </View>
        {
          searchGoodsList && searchGoodsList.length > 0
          ? <View className='goods-list'>
              {
                searchGoodsList.map((good, index) => {
                  return (
                    <GoodsItem key={index} onFetchGoods={() => {this.handleChange(keyword)}} good={good}></GoodsItem>
                  )
                })
              }
            </View>
          : <View className='goods-list'>
              <EmptyPage image={noListPng} tip='——  找不到啦  ——' />
            </View>
        }
        
      </View>
    )
  }
}

