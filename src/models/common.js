import { login, getName } from '../services/common';
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
				return yield call(login, payload);
      }
    },
  
    reducers: {
			setName(state, {payload}) {
				let res = {...state, ...payload}
				return res
			},
    }
  }
  