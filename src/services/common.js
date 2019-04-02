import request from '../utils/request'
import { stringify } from 'qs';

export async function login(params) {
	return request('/api/user', {
		method: 'POST',
		data: {
			...params,
		},
	});
}

export async function getName(params) {
  return request(`/api/getName?${stringify(params)}`);
}