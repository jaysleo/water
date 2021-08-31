<template>
	<view class="container">
		<view class="hd">
			<view class="shopbox" v-for="(item,index) in list" :key="index">
				<view class="imgwrap" v-for="(items,index) in item.pic_arr" :key="index" v-if="index==0">
					<image :src="items.domain+items.path.substr(1)" mode="aspectFit"></image>
				</view>
				<view class="info">
					<text class="title">{{item.product_info.title}}</text>
					<view class="price">￥<text class="bold">{{item.sku_info.price}}</text></view>
					<text class="num">×{{item.stock}}</text>
				</view>
			</view>
			<view class="oicon"></view>
			<view class="typebox">
				<text>订单类型</text>
				<view class="right">
					<text>同城配送</text>
					<u-icon name="/static/img/example/icon_checked.png" size="25" class="icon"></u-icon>
				</view>
			</view>
			<view class="address_box obox">
				<view class="title">收件信息</view>
				<view class="address_info">
					<button type="default" class="btn_primary" v-if="addresslist.length==0" @click="goAddress">新建收件人信息</button>
					<view class="itop" v-for="(item,index) in addresslist" :key="index" @click="goAddress" v-else>
						<view class="left">
							<view class="text">
								<text>收货人：{{item.name}}</text>
								<text class="phone">联系方式：{{item.number}}</text>
							</view>
							<view class="text">收货地址：{{item.province}}{{item.city}}{{item.area}}{{item.address}}</view>
						</view>
						<u-icon name="arrow-right" size="22" color="#19BEF4"></u-icon>
					</view>
				</view>
			</view>
			<view class="remark obox">
				<view class="title">备注</view>
				<input type="text" v-model="remark" placeholder="请输入" class="inpt" />
			</view>
		</view>
		<u-gap height="80"></u-gap>
		<view class="btn_actions">
			<view class="total">
				<text>合计</text>
				<text class="price">￥{{totals}}</text>
			</view>
			<button type="default" class="btn_primary" @click="onSubmit">提交订单</button>
		</view>
		<v-pay :popupShow="payshow" :totals="totals" :orderid="orderid" @close="close"></v-pay>
	</view>
</template>

<script>
	import Pay from '../components/pay.vue'
	export default{
		components: {
			"v-pay":Pay
		},
		data(){
			return {
				list:[],
				addresslist:[],
				totals:0,
				remark:"",
				cur:0, //支付类型选中判断
				orderid:0, //订单id
				payway:"wechat", //支付类型balance 余额 wechat 微信 ali 支付宝
				payshow:false, //支付弹框
				isOrder:false,
				orderid:0
			}
		},
		methods:{
			//获取地址
			getAddress(){
				this.$api.http.addresslist().then((res)=>{
					let list = res.data;
					let newData = list.filter(item => item.is_default == 1);
					this.addresslist = newData;
				})
			},
			//跳转地址页
			goAddress(){
				uni.navigateTo({
					url:"/pages/library/address/index"
				})
			},
			//提交订单
			onSubmit(){
				let ids = [];
				let aid = 0;
				if(this.list.length>0){
					let glist = [];
					this.list.map((item)=>{
						glist.push(item.cart_id)
					})
					ids = glist.join(",");
				}
				if(this.addresslist.length>0){
					aid = this.addresslist[0].address_id;
				}
				if(aid==0){
					uni.showToast({
						title:"请填写收货地址"
					})
					return false;
				}
				uni.showModal({
				    title: '提示',
				    content: '确定是否提交订单？',
					confirmColor:"#19BEF4",
				    success: (res)=> {
				        if (res.confirm) {
				            if(this.isOrder == false){
				            	this.$api.http.postOrder(ids,aid,this.remark).then((res)=>{
				            		if(res.code==200){
										uni.removeStorageSync("cartlist");
										uni.removeStorageSync("address");
				            			this.orderid = res.data.order_id;
				            			let ordernum = res.data.order_no;
				            			this.isOrder = true;
				            			this.payshow = true;
				            		}else{
				            			uni.showToast({
				            				title:res.message,
				            				icon:"none"
				            			})
				            		}
				            	})
				            }else{
				            	this.payshow = true;
								this.isOrder == false;
				            }
				        } else if (res.cancel) {
				            console.log('用户点击取消');
							this.isOrder == false;
				        }
				    }
				});
			},
			//支付类型切换
			tab(index,type){
				this.cur = index;
				this.payway = type;
			},
			close(){
				this.payshow = false;
			},
		},
		onShow(){
			let value = uni.getStorageSync('cartlist');
			if (value) {
				this.list = JSON.parse(value.data);
				this.totals = parseFloat(value.total).toFixed(2);
			}
			let address = uni.getStorageSync("address");
			if(address){
				this.addresslist = JSON.parse(address);
			}else{
				this.getAddress();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		padding:18rpx 24rpx;
	}
	.hd{
		position: relative;
		.oicon{
			width: 261rpx;
			height: 22rpx;
			background: url(../../../static/img/example/icon_order.png) no-repeat;
			background-size: 100% 100%;
			position: absolute;
			top:186rpx;
			left:220rpx;
		}
		.shopbox{
			background: #ffffff;
			border-radius: 18rpx;
			box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0,0,0,0.16);
			padding: 31rpx 53rpx 31rpx 31rpx;
			display: flex;
			.imgwrap{
				width:132rpx;
				height: 132rpx;
				flex-shrink: 0;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.info{
				margin-left: 29rpx;
				flex:1;
				display: flex;
				flex-direction: column;
				.title{
					font-size: 22rpx;
					color:#000000;
					margin-bottom: 4rpx;
					height: 67rpx;
				}
				.price{
					font-size: 22rpx;
					color:#FD4E1F;
					.bold{
						font-weight: bold;
					}
				}
				.num{
					font-size: 18rpx;
					color:#707070;
					margin-top:7rpx;
				}
			}
		}
		.typebox{
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 83rpx;
			background: #ffffff;
			border-radius: 18rpx;
			box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0,0,0,0.16);
			font-size: 18rpx;
			color:#000000;
			padding:0 53rpx 0 25rpx;
			margin-top:9rpx;
			.right{
				display: flex;
				align-items: center;
				.icon{
					margin-left: 25rpx;
				}
			}
		}
	}
	.address_box{
		background: #ffffff;
		border-radius: 18rpx;
		box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0,0,0,0.16);
		margin-top: 22rpx;
		padding:27rpx 0 45rpx;
		.address_info{
			margin:30rpx 58rpx 0;
			.itop{
				display: flex;
				align-items: center;
				.left{
					flex:1;
					font-size: 22rpx;
					color:#000000;
					.text{
						margin-bottom: 13rpx;
						.phone{
							margin-left: 54rpx;
						}
					}
				}
			}
			.btn_primary{
				height: 62rpx;
				line-height: 62rpx;
				font-size: 22rpx;
				color:#ffffff;
				background: #19bef4;
				border-radius: 18rpx;
			}
		}
	}
	.obox{
		.title{
			font-size: 25rpx;
			color:#000000;
			font-weight: bold;
			padding-left: 36rpx;
			position: relative;
			&::after{
				content:"";
				width: 9rpx;
				height: 31rpx;
				opacity: 1;
				background: #19bef4;
				position: absolute;
				top:0;
				left:0;
			}
		}
	}
	.remark{
		margin-top:22rpx;
		height: 94rpx;
		background: #ffffff;
		border-radius: 18rpx;
		box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0,0,0,0.16);
		display: flex;
		align-items: center;
		.inpt{
			margin-left: 36rpx;
			font-size: 22rpx;
			color:#707070;
		}
	}
	.btn_actions{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 80rpx;
		background: #ffffff;
		box-shadow: 0rpx -2rpx 4rpx 0rpx rgba(0,0,0,0.16); 
		z-index: 50;
		display: flex;
		align-items: center;
		.total{
			flex:1;
			font-size: 18rpx;
			color:#000000;
			padding-left: 49rpx;
			display: flex;
			align-items: center;
			.price{
				font-size: 22rpx;
				color:#FD4E1F;
				font-weight: bold;
				margin-left: 9rpx;
			}
		}
		.btn_primary{
			width: 505rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			font-size: 22rpx;
			color:#ffffff;
			background: #19bef4;
			border-radius: 0;
		}
	}
</style>
