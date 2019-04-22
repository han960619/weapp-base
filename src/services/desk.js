import request from '../utils/request'

export async function fetchOrder(params) {
	return request('/addons.diancan.merchant.Setting_order', {
		method: 'POST',
		data: {
			...params,
		},
	});
}

export async function fetchTakeaway(params) {
	return request('/addons.diancan.merchant.Setting_takeaway', {
		method: 'POST',
		data: {
			...params,
		},
	});
}

export async function fetchRepast(params) {
	return request('/addons.diancan.merchant.Setting_eat', {
		method: 'POST',
		data: {
			...params,
		},
	});
}
export async function getPrinterList(params) {
	return request('/addons.diancan.merchant.Setting_printer', {
		method: 'POST',
		data: {
			...params,
		},
	});
}

export async function savePrinter(params) {
	return request('/addons.diancan.merchant.Setting_savePrinter', {
		method: 'POST',
		data: {
			...params,
		},
	});
}

export async function delPrinter(params) {
	return request('/addons.diancan.merchant.Setting_delPrinter', {
		method: 'POST',
		data: {
			...params,
		},
	});
}

export async function changePrinter(params) {
	return request('/addons.diancan.merchant.Setting_changePrinter', {
		method: 'POST',
		data: {
			...params,
		},
	});
}

