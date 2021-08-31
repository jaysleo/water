<template>
	<view class="container">
		<view class="tabsbox">
			<view class="tabs_item" v-for="(item,index) in tablist" :key="index" @click="tabchange(item.id)" :class="{active:current==item.id}">{{item.name}}</view>
		</view>
		<u-gap height="80"></u-gap>
		<view class="emptybox" v-if="list.length==0">
			<u-gap height="300"></u-gap>
			<image src="/static/img/example/icon_noorder.png" mode="aspectFit" style="width: 299rpx;height: 201rpx;"></image>
			<text class="text">暂无相关订单</text>
		</view>
		<view class="orderlist" v-else>
			<view class="order_item" v-for="(item,index) in list" :key="index">
				<view class="hd">
					<text>订单编号：{{item.order_no}}</text>
					<text>下单时间：{{item.order_time}}</text>
				</view>
				<view class="bd">
					<block v-for="(items,index) in item.product_arr" :key="index">
					<view class="item">
						<view class="imgwrap">
							<image :src="items.images" mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="title">{{items.title}}</view>
							<view class="desc">
								<text>数量：{{items.buy_number}}</text>
								<text>实付款：￥{{items.total_price}}</text>
							</view>
						</view>
						<view class="right">
							<button type="default" class="status" v-if="item.status==1">{{item.status|orderStatus}}</button>
							<button type="default" class="status red" v-if="item.status==2">{{item.status|orderStatus}}</button>
							<button type="default" class="status green" v-if="item.status==5">{{item.status|orderStatus}}</button>
							<button type="default" class="status blue" v-if="item.status==4">{{item.status|orderStatus}}</button>
						</view>
					</view>
					</block>
				</view>
				<view class="foot">
					<view class="time">
						<image src="/static/img/example/icon_time.png" mode="aspectFit" class="icon"></image>
						<text>{{item.order_time}}</text>
					</view>
					<button type="default" class="btn_primary" @click="onPay(item.id,item.price)" v-if="item.status==1">去支付</button>
					<button type="default" class="btn_primary" @click="onDeliver(item.id,index)" v-if="item.status==3">确认收货</button>
					<button type="default" class="btn_primary" @click="onCommit(item.id,item.proid)" v-if="item.status==4">评价</button>
					<button type="default" class="btn_primary" @click="delOrder(item.id,index)">删除订单</button>
				</view>
			</view>
		</view>
		<loadMore :status="status" :show="loadShow"></loadMore>
		<v-pay :popupShow="payshow" :totals="totals" :orderid="orderid" @close="close"></v-pay>
	</view>
</template>

<script>
	import loadMore from '@/components/loadmore.vue'
	import Pay from '../components/pay.vue'
	export default{
		components: {
			loadMore,
			"v-pay":Pay
		},
		data(){
			return {
				tablist: [
					{
						id:1,
						name: '待付款'
					},
					{
						id:2,
						name: '待发货'
					},
					{
						id:3,
						name: '待收货'
					},
					{
						id:4,
						name: '待评价'
					}
				],
				current:1,
				list:[],
				status: 'loading',
				page:1,
				loadShow:false,
				totals:"0",
				payshow:false,
				orderid:0,
				ostatus:""
			}
		},
		filters:{
			orderStatus(status){
				switch(status){
					case 1:
						return "待付款"
					break;
					case 2:
						return "已付款"
					break;
					case 3:
						return "已发货"
					break;
					case 4:
						return "待评价"
					break;
					case 5:
						return "已取消"
					break;
					default:
						return "待确认"
					break;
				}
			}
		},
		methods:{
			tabchange(id){
				this.current = id;
				this.page = 1;
				this.list = [];
				this.loadData();
			},
			//请求数据
			async loadData(){
				if(this.current==4){
					await this.$api.http.waitCommit(this.page,10).then((res) => {
						if(res.code==200){
							let price = 0;
							let proid = 0;
							let list = res.data.data.map(item=>{
								item.product_arr.map(val=>{
									price += val.buy_number * parseFloat(val.total_price);
									proid = val.product_id;
								})
								item.proid = proid;
								item.price = price.toFixed(2);
								return item;
							});
							this.list = this.list.concat(list);
							let total = res.data.total;
							if(res.data.data.length<=total && this.page==1){
								this.status = 'nomore';
								this.loadShow = false;
							}
							if(res.data.data.length == 0) {
								this.status = 'nomore';
								this.loadShow = false;
							}
						}else if(res.code==402){
							uni.navigateTo({
								url:"/pages/login/index"
							})
						}
					});
					return false;
				}
				await this.$api.http.orderList(this.current,this.page,10).then((res) => {
					if(res.code==200){
						let price = 0;
						let proid = 0;
						let list = res.data.data.map(item=>{
							item.product_arr.map(val=>{
								price += val.buy_number * parseFloat(val.total_price);
								proid = val.product_id;
							})
							item.proid = proid;
							item.price = price.toFixed(2);
							return item;
						});
						this.list = this.list.concat(list);
						let total = res.data.total;
						if(res.data.data.length<=total && this.page==1){
							this.status = 'nomore';
							this.loadShow = false;
						}
						if(res.data.data.length == 0) {
							this.status = 'nomore';
							this.loadShow = false;
						}
					}else if(res.code==402){
						uni.navigateTo({
							url:"/pages/login/index"
						})
					}
				});
			},
			delOrder(id,index){
				uni.showModal({
				    title: '提示',
				    content: '是否确认删除该订单？',
					confirmColor:"#19BEF4",
				    success: (res)=> {
				        if (res.confirm) {
							this.$api.http.delOrder(id).then((res) => {
								if(res.code==200){
									this.list.splice(index, 1);
								}else{
									uni.showToast({
										title:res.message,
										icon:"none"
									})
								}
							});
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			onDeliver(id,index){
				uni.showModal({
				    title: '提示',
				    content: '是否确认收货？',
					confirmColor:"#19BEF4",
				    success: (res)=> {
				        if (res.confirm) {
							this.$api.http.deliver(id).then((res) => {
								if(res.code==200){
									this.list.splice(index, 1);
								}else{
									uni.showToast({
										title:res.message,
										icon:"none"
									})
								}
							});
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			onCommit(id,pid){
				uni.navigateTo({
					url:"/pages/library/order/comment?id="+id+"&pid="+pid
				})
			},
			close(){
				this.payshow = false;
			},
			onPay(id,price){
				this.payshow = true;
				this.totals = price;
				this.orderid = id;
			}
		},
		onShow(){
			this.page = 1;
			this.list = [];
			this.loadData();
		},
		//上拉加载
		onReachBottom(){
			if (this.status == 'nomore'){
				return;
			}
			this.loadShow = true;
			this.status = 'loading';
			this.page ++;
			this.loadData();
		},
		//下拉刷新
		onPullDownRefresh(){
			uni.stopPullDownRefresh();
			this.list = [];
			this.page = 1;
			this.loadData();
		}
	}
</script>

<style lang="scss" scoped>
	.tabsbox{
		width: 100%;
		padding:20rpx 0;
		background:#ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		top:0;
		left:0;
		z-index: 50;
		.tabs_item{
			font-size: 28rpx;
			color: #707070;
			flex:1;
			text-align: center;
			&.active{
				color:#19BEF4;
				font-weight: bold;
			}
		}
	}
	.orderlist{
		width: 100%;
		padding:22rpx;
		.order_item{
			background: #ffffff;
			border-radius: 18rpx;
			padding:0 28rpx;
			margin-bottom: 18rpx;
			.hd{
				padding:25rpx 0 22rpx 0;
				font-size: 18rpx;
				color:#B1B1B1;
				border-bottom: 2rpx solid #eeeeee;
				display: flex;
				flex-direction: column;
			}
			.bd{
				padding-top: 24rpx;
				display: flex;
				flex-direction: column;
				.item{
					margin-bottom: 28rpx;
					display: flex;
					.imgwrap{
						flex-shrink: 0;
						width: 127rpx;
						height: 127rpx;
						background:#eeeeee;
						image{
							width: 100%;
							height: 100%;
						}
					}
					.info{
						display: flex;
						flex-direction: column;
						flex:1;
						margin-left: 18rpx;
						.title{
							font-size: 25rpx;
							color:#141313;
							font-weight: bold;
							margin-top: 10rpx;
							margin-bottom: 18rpx;
						}
						.desc{
							font-size: 18rpx;
							color:#B1B1B1;
							display: flex;
							flex-direction: column;
						}
					}
					.right{
						.status{
							padding:0 31rpx;
							height: 36rpx;
							line-height: 32rpx;
							text-align: center;
							font-size: 18rpx;
							color:#B1B1B1;
							background: #ffffff;
							border: 2rpx solid #b1b1b1;
							border-radius: 20rpx;
							&.red{
								border-color:#D23033;
								color: #D23033;
							}
							&.green{
								border-color: #1EBB33;
								color:#1EBB33;
							}
							&.blue{
								border-color: #1EA0BB;
								color:#1EA0BB;
							}
						}
					}
				}
			}
			.foot{
				border-top: 2rpx solid #eeeeee;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 15rpx 0 18rpx 0;
				.time{
					flex:1;
					font-size: 22rpx;
					color:#ABABAB;
					display: flex;
					align-items: center;
					.icon{
						width: 18rpx;
						height: 18rpx;
						margin-right: 19rpx;
					}
					&.first{
						color:#000000;
					}
				}
				.btn_primary{
					width: 159rpx;
					height: 51rpx;
					line-height: 51rpx;
					text-align: center;
					font-size: 18rpx;
					color:#ffffff;
					background: #19bef4;
					border-radius: 25rpx;
					margin:0 10rpx;
				}
			}
			
		}
	}
	.emptybox{
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		.text{
			font-size: 22rpx;
			color: #707070;
			margin-top: 40rpx;
		}
	}
</style>
