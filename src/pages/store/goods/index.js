import Taro, { Component, getApp } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import GoodsItem from '../../../components/GoodsItem'
import './index.less'
import EmptyPage from '../../../components/EmptyContent'
import classnames from 'classnames'
import { AtIcon } from 'taro-ui'

@connect(({store}) => ({...store}))

export default class Goods extends Component {

  config = {
    navigationBarTitleText: '在售商品',
  }

  state = {
    group: [],
    loading: false,
    curGroupId: '',
    curGroupGoodId: '',
    curClassifyIndex: 0,
    scrollCurGroupId: '',
  }

  componentDidShow () {
    this.fetchGoods()
  }

  fetchGoods = () => {
    this.props.dispatch({
      type: 'store/fetchGoods',
      payload: {
        store_id: Taro.getStorageSync('storeId')
      }
    }).then((group) => {
      if(group == undefined || group == '203') {
        return
      }
      if (!group || group.length === 0) {
        Taro.showToast({
          title: '当前店铺尚未上架任何商品!',
          icon: 'none'
        })

        setTimeout(() => {
          Taro.navigateBack()
        }, 2500)

        return
      }
      this.setState({
        group,
        loading: true
      }, this.calcAsideSize)

      this.goodPosition = []
      for (let i = 0; i < group.length; i++) {
        let height = 34 + 96 * group[i].goods_list.length
        let top = i === 0 ? 0 : this.goodPosition[i - 1].bottom
        this.goodPosition.push({
          group_id: group[i].group_id,
          index: i,
          top,
          bottom: top + height
        })
      }
    })
  }

  /**
   * 计算左侧总高度和单个项高度
   * */
  calcAsideSize = () => {
    const {group} = this.state

    if (group.length === 0) return

    if (!this.asideHeiInfo) {
      this.asideHeiInfo = {}
      let query = Taro.createSelectorQuery()
      query.select('#aside-scroll').boundingClientRect()
        .exec(res => {
          this.asideHeiInfo.wrapHeight = res[0].height
        })

      query.select('#asid-' + group[0].group_id).boundingClientRect()
        .exec(res => {
          this.asideHeiInfo.itemHeight = res[1].height
        })
    }
  }

  changeClassify = (index, scrollGood = true) => {

    const {group} = this.state

    const {wrapHeight, itemHeight} = this.asideHeiInfo
    const asideScrollTop = this.asideScrollTop || 0
    const itemNums = Math.ceil(wrapHeight / itemHeight)
    let curGroupId

    if (index === 0) {
      curGroupId = 'asid-' + group[0].group_id
    } else if ((index - 1) * itemHeight <= asideScrollTop) {
      curGroupId = 'asid-' + group[index - 1].group_id
    } else if ((index + 2) * itemHeight > (asideScrollTop + wrapHeight) && index > itemNums - 3) {
      curGroupId = 'asid-' + group[index - itemNums + 3].group_id
    }

    this.setState({
      curClassifyIndex: index,
      curGroupId,
    })

    if (scrollGood) {
      this.setState({
        curGroupGoodId: 'id' + this.state.group[index].group_id,
        scrollCurGroupId: null
      })
      this.curGroupGoodId = this.state.group[index].group_id
    }

  }


  stopPropagation = e => {
    e.stopPropagation()
  }

  asideScroll = e => {
    this.asideScrollTop = e.detail.scrollTop
  }

  goodScroll = e => {
    const fix = e.detail.scrollHeight / (this.goodPosition[this.goodPosition.length - 1].bottom + 95)

    if (e.detail.scrollTop + this.asideHeiInfo.wrapHeight > e.detail.scrollHeight) return
    this.goodPosition.map(item => {
      if (e.detail.scrollTop >= Math.floor(item.top * fix) && e.detail.scrollTop < (item.bottom) * fix) {
        if (this.curGroupGoodId !== this.state.group[item.index].group_id) {
          this.setState({
            scrollCurGroupId: item.group_id,
          })
        } else{
          this.curGroupGoodId = null
        }
        this.changeClassify(item.index, false)
      }
    })
  }

  linkToSearch = () => {
    Taro.navigateTo({ url: '/pages/store/searchGoods/index' })
  }

  render() {
    const {
      group, curClassifyIndex, curGroupId,
      curGroupGoodId, scrollCurGroupId, loading
    } = this.state

    return (
      loading ?
      <View className='shop-index'>
        <View className='banner'>
          <View className='search-input' onClick={() => {this.linkToSearch()}}>
            <AtIcon value='search' size='20' color='#999999'></AtIcon>
            <View className='search-text'>搜索</View>
          </View>
        </View>
        {
          group.length > 1 &&
          <View className='menu'>
            <View className='aside'>
              <ScrollView
                scrollWithAnimation
                scrollY className='item-wrap'
                onScroll={this.asideScroll} scrollIntoView={curGroupId}
                id='aside-scroll'>
                <View className='bg-alias'>
                  {
                    group.map((classify, index) => (
                      <View key={index}/>
                    ))
                  }
                </View>
                {
                  group.map((classify, index) => (
                    <View
                      className={classnames('item', index === curClassifyIndex ? 'active' : '',
                        index === curClassifyIndex - 1 ? 'pre-active' : '',
                        index === curClassifyIndex + 1 ? 'af-active' : '')}
                      onClick={this.changeClassify.bind(this, index)}
                      key={index} id={'asid-' + classify.group_id}
                    >
                      <View>
                        <Image src={classify.gg_image || ''}/>
                        <Text>{classify.gg_name}</Text>
                      </View>
                    </View>
                  ))
                }
                <View className={classnames('null-block', curClassifyIndex === group.length - 1 ? 'radius' : '')}>
                  <View />
                </View>
              </ScrollView>
            </View>
            <ScrollView
              scrollWithAnimation
              className='content'
              scrollY scrollIntoView={curGroupGoodId}
              onScroll={this.goodScroll}
            >
              {
                group.map((classify, index) => (
                  <View className='good-block' key={index} id={'id' + classify.group_id}>
                    <View className='title' id={'title-' + classify.group_id}>
                      <View className={scrollCurGroupId === classify.group_id ? 'top-show' : ''}
                        style={{zIndex: 20 + index}}
                      >
                        <Image src={classify.gg_image || ''}/>
                        <Text>{classify.gg_name}</Text>
                      </View>
                    </View>
                    <View className='good-list'>
                      {
                        classify.goods_list.map((good, index) => {
                          return (
                            <GoodsItem key={index} onFetchGoods={this.fetchGoods} good={good}></GoodsItem>
                          )
                        })
                      }
                    </View>
                  </View>
                ))
              }
            </ScrollView>
          </View>
        }
      </View>
      : <EmptyPage />
    )
  }
}

