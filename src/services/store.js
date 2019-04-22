import request from '../utils/request'

export async function fetchGoods(params) {
	return request('/addons.diancan.merchant.Goods_goodsList', {
		method: 'POST',
		data: {
			...params,
		},
	});
}

export async function changeStatus(params) {
	return request('/addons.diancan.merchant.Goods_changeStatus', {
		method: 'POST',
		data: {
			...params,
		},
	});
}

// 门店首页
export async function getStoreIndex(params) {
	return request('/addons.diancan.merchant.Data_index', {
		method: 'POST',
		data: {
			...params,
		},
	});
}

// 数据概览
export async function getStoreData(params) {
	return request('/addons.diancan.merchant.Data_data', {
		method: 'POST',
		data: {
			...params,
		},
	});
}

// 商品数据
export async function getStoreGoods(params) {
	return request('/addons.diancan.merchant.Data_goods', {
		method: 'POST',
		data: {
			...params,
		},
	});
}

// 资产统计
export async function getStoreStatistics(params) {
	return request('/addons.diancan.merchant.Asset_statistics', {
		method: 'POST',
		data: {
			...params,
		},
	});
}

// 资产对账
export async function getStoreAssetBill(params) {
	return request('/addons.diancan.merchant.Asset_assetBill', {
		method: 'POST',
		data: {
			...params,
		},
	});
}

// 营销对账
export async function getStoreMarketingBill(params) {
	return request('/addons.diancan.merchant.Asset_marketingBill', {
		method: 'POST',
		data: {
			...params,
		},
	});
}

// 切换门店状态
export async function fetchStoreStatus(params) {
	return request('/addons.diancan.merchant.Setting_business', {
		method: 'POST',
		data: {
			...params,
		},
	});
}