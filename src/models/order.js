import { reachTake, cancelOrderTake, deliverTake, takeOrder, makeComplete, fetchOrderList,
	fetchTakeLog, fetchOrderDetail, makeStart, fetchDadaCancel, refundOrder, cancelOrder, acceptOrder } from '../services/order';

export default {
	namespace: 'order',
	state: {
	},

	effects: {
		* reachTake({payload}, {put, call}) {
			return yield call(reachTake, payload);
		},
		* cancelOrderTake({payload}, {put, call}) {
			return yield call(cancelOrderTake, payload);
		},
		* deliverTake({payload}, {put, call}) {
			return yield call(deliverTake, payload);
		},
		* takeOrder({payload}, {put, call}) {
			return yield call(takeOrder, payload);
		},
		* makeComplete({payload}, {put, call}) {
			return yield call(makeComplete, payload);
		},
		* fetchOrderList({payload}, {put, call}) {
			return yield call(fetchOrderList, payload);
		},
		* fetchTakeLog({payload}, {put, call}) {
			return yield call(fetchTakeLog, payload);
		},
		* fetchOrderDetail({payload}, {put, call}) {
			return yield call(fetchOrderDetail, payload);
		},
		* fetchDadaCancel({payload}, {put, call}) {
			return yield call(fetchDadaCancel, payload);
		},
		* cancelOrder({payload}, {put, call}) {
			return yield call(cancelOrder, payload);
		},
		* acceptOrder({payload}, {put, call}) {
			return yield call(acceptOrder, payload);
		},
		* makeStart({payload}, {put, call}) {
			return yield call(makeStart, payload);
		},
		* refundOrder({payload}, {put, call}) {
			return yield call(refundOrder, payload);
		}
	},
	reducers: {
	}
}