import { fetchTakeaway, fetchOrder, fetchRepast, getPrinterList, getCouponList, getFullDiscountList, getFullSendList, getBaoList, savePrinter, delPrinter, changePrinter } from '../services/desk';

export default {
	namespace: 'desk',
	state: {
		orderSetting: {},
		printerList: []
	},

	effects: {
		* fetchOrder({payload}, {call}) {
			return yield call(fetchOrder, payload);
		},
		* fetchTakeaway({payload}, {call}) {
			return yield call(fetchTakeaway, payload);
		},
		* fetchRepast({payload}, {call}) {
			return yield call(fetchRepast, payload);
		},
		* getPrinterList({payload}, {call}) {
			const response = yield call(getPrinterList, payload);
			return response
		},
		* savePrinter({payload}, {call}) {
			return yield call(savePrinter, payload);
		},
		* delPrinter({payload}, {call}) {
			return yield call(delPrinter, payload);
		},
		* changePrinter({payload}, {call}) {
			return yield call(changePrinter, payload);
		},
		* getCouponList({payload}, {call}) {
			return yield call(getCouponList, payload);
		},
		* getFullSendList({payload}, {call}) {
			return yield call(getFullSendList, payload);
		},
		* getBaoList({payload}, {call}) {
			return yield call(getBaoList, payload);
		},
		* getFullDiscountList({payload}, {call}) {
			return yield call(getFullDiscountList, payload);
		},
	},
	reducers: {
	}
}
  