import request from '../utils/request'

export async function fetchOrder(params) {
	return request('/addons.diancan.merchant.Setting_order', {
		method: 'POST',
		data: {
			...params,
		},
	},true,3);
}

export async function fetchTakeaway(params) {
	return request('/addons.diancan.merchant.Setting_takeaway', {
		method: 'POST',
		data: {
			...params,
		},	
	},true,3);
}

export async function fetchRepast(params) {
	return request('/addons.diancan.merchant.Setting_eat', {
		method: 'POST',
		data: {
			...params,
		},
	},true,3);
}
export async function getPrinterList(params) {
	return request('/addons.diancan.merchant.Setting_printer', {
		method: 'POST',
		data: {
			...params,
		},
	},true,3);
}

export async function savePrinter(params) {
	return request('/addons.diancan.merchant.Setting_savePrinter', {
		method: 'POST',
		data: {
			...params,
		},
	},true,3);
}

export async function delPrinter(params) {
	return request('/addons.diancan.merchant.Setting_delPrinter', {
		method: 'POST',
		data: {
			...params,
		},
	},true,3);
}

export async function changePrinter(params) {
	return request('/addons.diancan.merchant.Setting_changePrinter', {
		method: 'POST',
		data: {
			...params,
		},
	},true,3);
}

export async function getCouponList(params) {
	return request('/addons.diancan.merchant.Coupon_list', {
		method: 'POST',
		data: {
			...params,
		},
	},true,3);
}

export async function getFullSendList(params) {
	return request('/addons.diancan.merchant.FullSend_list', {
		method: 'POST',
		data: {
			...params,
		},
	},true,3);
}

export async function getBaoList(params) {
	return request('/addons.diancan.merchant.Bao_list', {
		method: 'POST',
		data: {
			...params,
		},
	},true,3);
}


