import request from '../utils/request'
import { stringify } from 'qs';

export async function codeLogin(params) {
	console.log(params)
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

export async function getName(params) {
  return request(`/api/getName?${stringify(params)}`);
}