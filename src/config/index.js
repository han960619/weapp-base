  
 import order_status1Png from '../assets/images/order_status1.png'
 import order_status2Png from '../assets/images/order_status2.png'
 import order_status3Png from '../assets/images/order_status3.png'
 import order_status31Png from '../assets/images/order_status31.png'
 import order_status32Png from '../assets/images/order_status32.png'
 import order_status4Png from '../assets/images/order_status4.png'
 import order_status41Png from '../assets/images/order_status41.png'
 import order_status42Png from '../assets/images/order_status42.png'
 import order_status5Png from '../assets/images/order_status5.png'
 import order_status6Png from '../assets/images/order_status6.png'
 import order_status7Png from '../assets/images/order_status7.png'
 import order_status8Png from '../assets/images/order_status8.png'
 
 // 打印机数量枚举
  export const orderTabList = [
	{ 
		title: '待处理',
		status: 9
	},
	{ 
		title: '待付款',
		status: 1
	},
	{ 
		title: '待接单',
		status: 2
	},
	{ 
		title: '制作中',
		status: 3
	},
	{ 
		title: '待取餐',
		status: 4
	},
	{ 
		title: '待配送',
		status: 41
	},
	{ 
		title: '配送中',
		status: 42
	},
	{ 
		title: '已完成',
		status: 5
	},
	{ 
		title: '已关闭',
		status: 6
	}
]

export const orderStatus = {
	1: '待付款',
	2: '待接单',
	3: '制作中',
	31: '已接单',
	32: '制作中',
	4: '待取餐',
	41: '待配送',
	42: '配送中',
	5: '已完成',
	6: '已关闭',
	7: '已关闭',
	8: '已完成',
}

export const orderStatusImg = {
	1: order_status1Png,
	2: order_status2Png,
	3: order_status3Png,
	31: order_status31Png,
	32: order_status32Png,
	4: order_status4Png,
	41: order_status41Png,
	42: order_status42Png,
	5: order_status5Png,
	6: order_status6Png,
	7: order_status7Png,
	8: order_status8Png,
}

export const takeStatus = ['待配送', '呼叫骑手', '骑手待取货', '配送中', '完成', '已取消']

// 订单设置自动接单枚举
export const autoList = [
	{
		label: '5分钟',
		value: 5
	},
	{
		label: '10分钟',
		value: 10
	},
	{
		label: '15分钟',
		value: 15
	}
]
// 订单设置自动完成枚举
export const workList = [
	{
		label: '5分钟',
		value: 5
	},
	{
		label: '10分钟',
		value: 10
	},
	{
		label: '15分钟',
		value: 15
	},
	{
		label: '20分钟',
		value: 20
	}
]

// 订单设置预约间隔枚举
export const reserveList = [
	{
		label: '5分钟',
		value: 5
	},
	{
		label: '10分钟',
		value: 10
	},
	{
		label: '15分钟',
		value: 15
	},
	{
		label: '30分钟',
		value: 30
	}
]

// 订单设置预约设置枚举
export const timeList = [
	{
		label: '暂不开启',
		value: -1
	},
	{
		label: '仅需当天',
		value: 1
	},
	{
		label: '提前两天',
		value: 2
	},
	{
		label: '提前三天',
		value: 3
	},
	{
		label: '提前四天',
		value: 4
	},
	{
		label: '提前五天',
		value: 5
	},
	{
		label: '提前六天',
		value: 6
	},
	{
		label: '提前七天',
		value: 7
	}
]


// 外卖设置配送方式枚举
export const dispatchList = [
	{
		label: '商家配送',
		value: 1
	},
	{
		label: '第三方配送',
		value: 2
	}
]

// 外卖设置配送方式枚举
export const otherDispatchList = [
	{
		label: '暂不开启',
		value: 0
	},
	{
		label: '达达配送',
		value: 'dada'
	}
]

// 打印机数量枚举
export const printList = [
	{
	  label: '1张',
	  value: 1
	},
	{
	  label: '2张',
	  value: 2
	},
	{
	  label: '3张',
	  value: 3
	},
	{
	  label: '4张',
	  value: 4
	},
]
