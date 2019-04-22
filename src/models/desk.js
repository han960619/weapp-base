import { fetchTakeaway, fetchOrder, fetchRepast, getPrinterList, savePrinter, delPrinter, changePrinter } from '../services/desk';

export default {
	namespace: 'desk',
	state: {
		orderSetting: {},
		printerList: []
	},

	effects: {
		* fetchOrder({payload}, {put, call}) {
			return yield call(fetchOrder, payload);
		},
		* fetchTakeaway({payload}, {put, call}) {
			return yield call(fetchTakeaway, payload);
		},
		* fetchRepast({payload}, {put, call}) {
			return yield call(fetchRepast, payload);
		},
		* getPrinterList({payload}, {put, call}) {
			const response = yield call(getPrinterList, payload);
			return response
		},
		* savePrinter({payload}, {put, call}) {
			return yield call(savePrinter, payload);
		},
		* delPrinter({payload}, {put, call}) {
			return yield call(delPrinter, payload);
		},
		* changePrinter({payload}, {put, call}) {
			return yield call(changePrinter, payload);
		}
	},
	reducers: {
	}
}
  