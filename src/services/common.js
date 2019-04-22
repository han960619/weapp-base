import request from '../utils/request'
import { stringify } from 'qs';

export async function codeLogin(params) {
	return request('/admin.MobileLogin_codeSubmit', {
		method: 'POST',
		data: {
			...params,
		},
	}, false);
}

export async function pwdLogin(params) {
	return request('/admin.MobileLogin_pwdSubmit', {
		method: 'POST',
		data: {
			...params,
		},
	}, false);
}

export async function resetPassword(params) {
	return request('/admin.MobileLogin_forgetPwd', {
		method: 'POST',
		data: {
			...params,
		},
	}, false);
}

export async function sendCode(params) {
	return request('/admin.MobileLogin_smscode', {
		method: 'POST',
		data: {
			...params,
		},
	}, false);
}

export async function getStoreData(params) {
	return request('/addons.diancan.merchant.Home_storeList', {
		method: 'POST',
		data: {
			...params,
		},
	});
}

