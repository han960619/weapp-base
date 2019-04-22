import { pwdLogin, codeLogin, resetPassword, sendCode, getStoreData } from '../services/common';
import Taro from '@tarojs/taro';

export default {
    namespace: 'common',
    state: {
			storeData: {
				storeList: [],
				nickname: ''
			}
    },
  
    effects: {
			* login({payload}, {put, call}) {
				let res;
				if( payload.type == 2) {
					res = yield call(pwdLogin, payload)
				}else {
					res = yield call(codeLogin, payload)
				}
				if(res) {
					Taro.setStorageSync('token', res.token )
				}
				return res
			},
			* resetPassword({payload}, {put, call}) {
				return yield call(resetPassword, payload)
			},
			* sendCode({payload}, {put, call}) {
				console.log(payload)
				return yield call(sendCode, payload)
			},
			* getStoreData({payload}, {put, call}) {
				const response = yield call(getStoreData, payload);
				Taro.setStorageSync('nickname', response.nickname )
				yield put({
					type: 'saveStoreData',
					payload: response,
				});
			}
    },
    reducers: {
			saveStoreData(state, action) {
				return {
					...state,
					storeData: action.payload,
				};
			},
    }
  }
  