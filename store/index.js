import Vue from 'vue'
import Vuex from 'vuex'
import api from "../api/index";

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		token: undefined,
		hasLogin: false,
		userInfo: undefined,
		shareTicket: undefined,
		cart: []
	},
	getters: {
		token: state => {
			if (state.token) {
				return state.token;
			}
			return uni.getStorageSync('token');
		},
		hasLogin: state => {
			if (state.hasLogin) {
				return state.hasLogin;
			}
			return uni.getStorageSync('has_login');
		},
		userInfo: state => {
			if (state.userInfo) {
				return state.userInfo;
			}
			return uni.getStorageSync('user_info')
		},
		avatar: state => {
			if (state.userInfo && state.userInfo.avatar) {
				return state.userInfo.avatar;
			}
			return '/static/img/example/icon_avatar.jpg';
		},
		//获取购物车总数量
		getAllCount: state => {
			var sum = 0;
			state.cart.forEach(item => {
				sum += item.count;
			})
			return sum;
		}
	},
	mutations: {
		storeToken(state, token) {
			state.token = token;
			state.hasLogin = true;
			uni.setStorage({
				key: 'token',
				data: token
			});
			uni.setStorage({
				key: 'has_login',
				data: 'true'
			});
		},
		storeUser(state, user) {
			state.hasLogin = true;
			state.userInfo = user;
			uni.setStorage({
				key: 'has_login',
				data: 'true'
			});
			uni.setStorage({
				key: 'user_info',
				data: user
			});
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = undefined;
			state.shareTicket = undefined;
			uni.clearStorage();
		},
		addToCart(state, goodsinfo) {
			// var flag = false; //假设没有新加入的商品
			state.cart.some(item => {
				if (item.id == goodsinfo.id) {
					item.count == parseInt(goodsinfo.count);
					// flag = true;
					return true;
				}
			})
			// if (!flag) { //添加到购物车
				state.cart.push(goodsinfo);
			// }
			//保存到本地存储
			uni.setStorage({
				key: 'cart',
				data: JSON.stringify(state.cart)
			});
		},
	},
	actions: {}
})

export default store
