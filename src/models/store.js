import { fetchGoods, changeStatus, fetchStoreStatus, getStoreIndex, getStoreData, getStoreGoods, getStoreStatistics, getStoreAssetBill, getStoreMarketingBill } from '../services/store';

export default {
	namespace: 'store',
	state: {
		storeData: {}
	},

	effects: {
		* fetchGoods({payload}, {put, call}) {
			return yield call(fetchGoods, payload);
		},
		* fetchSearchGoods({payload}, {put, call}) {
			return yield call(fetchGoods, payload);
		},
		* changeStatus({payload}, {put, call}) {
			return yield call(changeStatus, payload);
		},
		* getStoreIndex({payload}, {put, call}) {
			const response = yield call(getStoreIndex, payload);
			yield put({
				type: 'saveStoreData',
				payload: response,
			});
			return response
		},
		* getStoreData({payload}, {put, call}) {
			return yield call(getStoreData, payload);
		},
		* getStoreGoods({payload}, {put, call}) {
			return yield call(getStoreGoods, payload);
		},
		* getStoreStatistics({payload}, {put, call}) {
			return yield call(getStoreStatistics, payload);
		},
		* getStoreAssetBill({payload}, {put, call}) {
			return yield call(getStoreAssetBill, payload);
		},
		* getStoreMarketingBill({payload}, {put, call}) {
			return yield call(getStoreMarketingBill, payload);
		},
		* fetchStoreStatus({payload}, {put, call}) {
			return yield call(fetchStoreStatus, payload);
		},
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
  