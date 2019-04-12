import { pwdLogin, codeLogin, getName } from '../services/common';
import Taro from '@tarojs/taro';

export default {
    namespace: 'common',
    state: {
			name: 'xx'
    },
  
    effects: {
      * changeName({payload}, {put, call}) {
				yield put({
					type: 'setName',
					payload
				});
			},
			* login({payload}, {put, call}) {
				let res;
				Taro.setStorageSync('stopLogin', 1)
				if( payload.type == 'pwd') {
					res =  yield call(pwdLogin, payload)
				}else {
					res =  yield call(codeLogin, payload)
				}

				Taro.setStorageSync('userData', payload )
				Taro.setStorageSync('token', res.token )
				Taro.eventCenter.trigger('loginedRequest', {payload})
				Taro.removeStorageSync('stopLogin')
				return res
      }
    },
  
    reducers: {
			setName(state, {payload}) {
				let res = {...state, ...payload}
				return res
			},
    }
  }
  