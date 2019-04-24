import request from '../utils/request'

export async function fetchOrderList(params) {
	return request('/addons.diancan.merchant.Order_list', {
		method: 'POST',
		data: {
			...params,
		},
	});
}

export async function fetchTakeLog(params) {
	return request('/addons.diancan.merchant.Order_takeLog', {
		method: 'POST',
		data: {
			...params,
		},
	});
}

export async function fetchOrderDetail(params) {
	return request('/addons.diancan.merchant.Order_orderDetail', {
		method: 'POST',
		data: {
			...params,
		},
	}, true , 3);
}

export async function fetchDadaCancel(params) {
	return request('/addons.diancan.merchant.Order_orderDetail', {
		method: 'POST',
		data: {
			...params,
		},
	});
}

export async function cancelOrder(params) {
	return request('/addons.diancan.merchant.Order_cancelOrder', {
		method: 'POST',
		data: {
			...params,
		},
	});
}

export async function acceptOrder(params) {
	return request('/addons.diancan.merchant.Order_acceptOrder', {
		method: 'POST',
		data: {
			...params,
		},
	});
}

export async function makeComplete(params) {
	return request('/addons.diancan.merchant.Order_makeComplete', {
		method: 'POST',
		data: {
			...params,
		},
	});
}

export async function takeOrder(params) {
	return request('/addons.diancan.merchant.Order_takeOrder', {
		method: 'POST',
		data: {
			...params,
		},
	});
}
export async function deliverTake(params) {
	return request('/addons.diancan.merchant.Order_deliverTake', {
		method: 'POST',
		data: {
			...params,
		},
	});
}
export async function cancelOrderTake(params) {
	return request('/addons.diancan.merchant.Order_cancelOrderTake', {
		method: 'POST',
		data: {
			...params,
		},
	});
}
export async function reachTake(params) {
	return request('/addons.diancan.merchant.Order_reachTake', {
		method: 'POST',
		data: {
			...params,
		},
	});
}

export async function makeStart(params) {
	return request('/addons.diancan.merchant.Order_makeStart', {
		method: 'POST',
		data: {
			...params,
		},
	});
}

export async function refundOrder(params) {
	return request('/addons.diancan.merchant.Order_refundOrder', {
		method: 'POST',
		data: {
			...params,
		},
	});
}