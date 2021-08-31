import httpRequest from '../utils/http'

module.exports = {
	htmlLogin: function(params) {
		return httpRequest.post('/auth/mini_login', params, false)
	},
	getUserInfo: function() {
		return httpRequest.get('/user/info')
	},
	//首页轮播图
	banner: function() {
		return httpRequest.get('/index/banner', {}, false)
	},
	//分类
	getCategory: function() {
		return httpRequest.get('/index/category')
	},
	//商品列表
	getProductlist: function(protype,water_or_plant, page, limit, keyword, pid) {
		let params = {
			product_type: protype,
			water_or_plant:water_or_plant,
			page: page,
			limit: limit
		};
		if (pid) {
			params.pid = pid
		}
		if (keyword) {
			params.keyword = keyword
		}
		return httpRequest.get('/index/product_list', params)
	},
	//商品详情页
	getProDetail: function(product_id) {
		return httpRequest.get('/index/product_detail', {product_id: product_id})
	},
	//购物车
	cartList: function() {
		return httpRequest.get('/cart/index')
	},
	addCart: function(proid, skuid, stock) {
		return httpRequest.post('/cart/add2cart', {product_id: proid,sku_id: skuid,stock: stock})
	},
	changeCartnum: function(cart_id, number, symbol) {
		return httpRequest.post('/cart/change_cart_num', {cart_id: cart_id,number: number,symbol: symbol})
	},
	delCart: function(cart_id) {
		return httpRequest.post('/cart/del_cart_product', {cart_id: cart_id})
	},
	//收货地址列表
	addresslist: function() {
		return httpRequest.get('/address/index')
	},
	addressAdd: function(params) {
		return httpRequest.post('/address/add', params)
	},
	addressEdit: function(params) {
		return httpRequest.post('/address/edit', params)
	},
	//订单
	orderDetail: function(order_id) {
		return httpRequest.get('/order/order_detail', {order_id: order_id})
	},
	postOrder: function(pay_cart_arr, address_id, user_note) {
		return httpRequest.post('/order/post_order', {pay_cart_arr: pay_cart_arr,address_id: address_id,user_note: user_note})
	},
	payOrder: function(order_id,coupons_id, pay_way) {
		return httpRequest.post('/order/pay2order', {order_id: order_id,coupons_id:coupons_id,pay_way: pay_way})
	},
	payfail: function(order_id) {
		return httpRequest.post('/order/pay2fail', {order_id: order_id})
	},
	orderList: function(order_status, page, limit) {
		return httpRequest.get('/order/index', {order_status: order_status,page: page,limit: limit})
	},
	waitCommit: function(page, limit) {
		return httpRequest.get('/order/wait_commit',{page:page, limit:limit})
	},
	cancelOrder: function(order_id) {
		return httpRequest.post('/order/cancel_order', {order_id: order_id})
	},
	delOrder: function(order_id) {
		return httpRequest.post('/order/del_order', {order_id: order_id})
	},
	deliver: function(order_id) {
		return httpRequest.post('/order/confirm_deliver', {order_id: order_id})
	},
	addCommit: function(order_id,product_id,content) {
		return httpRequest.post('/user/add_commit', {order_id: order_id,product_id:product_id,content: content})
	},
	commitlist: function(product_id, page, limit) {
		return httpRequest.get('/index/commit_list',{product_id:product_id, page:page, limit:limit})
	},
	webconfig: function() {
		return httpRequest.get('/index/web_config')
	},
	announce: function() {
		return httpRequest.get('/index/announce')
	},
	getCoupons: function() {
		return httpRequest.get('/user/user_coupons')
	}
}