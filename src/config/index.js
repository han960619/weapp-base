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
	5: '已取餐',
	6: '已退款',
	7: '已关闭 ',
	8: '已完成',
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
