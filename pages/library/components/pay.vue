<template>
	<view>
		<u-popup class="paypopup" v-model="show" mode="bottom" :closeable="true" close-icon-pos="top-left" border-radius="40" @close="close">
			<view class="popupcon">
				<view class="price">￥{{totals}}</view>
				<view class="paytit">选择支付方式</view>
				<view class="typebox">
					<view class="item" :class="{active:cur==index}" v-for="(item,index) in typelist" :key="index" @click="tab(index,item.type)">
						<u-icon :name="item.icon" size="38"></u-icon>
						<text class="label">{{item.title}}</text>
						<view class="icon"></view>
					</view>
				</view>
				<u-gap height="120"></u-gap>
				<u-button :ripple="true" class="btn_primary" @click="eventClick">立即支付</u-button>
			</view>
		</u-popup>
		<u-popup class="paypopup" v-model="show" mode="bottom" :closeable="true" close-icon-pos="top-left" border-radius="40" @close="close">
			<view class="popupcon">
				<view class="price">￥{{totals}}</view>
				<view class="paytit">选择支付方式</view>
				<view class="typebox">
					<view class="item" :class="{active:cur==index}" v-for="(item,index) in typelist" :key="index" @click="tab(index)">
						<u-icon :name="item.icon" size="38"></u-icon>
						<text class="label">{{item.title}}</text>
						<view class="icon"></view>
					</view>
				</view>
				<view class="coupons" @click="isCoupon">
					<text class="label">优惠券：</text>
					<view class="right" v-if="couponslist.length==0">无可用优惠券</view>
					<view class="right" v-else>
						<text class="text">{{coutit}}</text>
						<u-icon name="arrow-right" size="22" color="#e6e6e6"></u-icon>
					</view>
				</view>
				<u-gap height="80"></u-gap>
				<button type="default" class="btn_primary" @click="eventClick">立即支付</button>
			</view>
		</u-popup>
		<u-popup class="coupopup" v-model="coushow" mode="bottom" height="500" border-radius="40">
			<view class="title">优惠券</view>
			<view class="coulist">
				<view class="item" :class="{on:coucur==index}" v-for="(item,index) in couponslist" :key="index" @click="tabs(index,item)">
					<text class="ntits">满{{item.face_value}}立减{{item.discount}}元</text>
					<view class="icon"></view>
				</view>
			</view>
			<u-gap height="80"></u-gap>
			<button type="default" class="btn_primary" @click="couClick">完成</button>
		</u-popup>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				id:0,
				show:false,
				cur:0,
				couponslist:[],
				typelist:[
					{
						title:"微信支付",
						icon:"/static/img/example/icon_weixin.png",
						type:"wechat"
					}
				],
				payway:"wechat",
				coushow:false,
				couponsid:0,
				coucur:-1,
				coutit:"请选择优惠券",
				price:0
			}
		},
		watch:{
			popupShow(val){
				this.show = val;
				if(val==true){
					this.getCoupons();
				}
			},
			orderid(val){
				this.id = val;
			},
			totals(val){
				this.price = val;
			}
		},
		props:{
			popupShow:{
				type:Boolean,
				default:false
			},
			totals:{
				type:String,
				default:"0"
			},
			orderid:{
				type:Number,
				default:0
			}
		},
		methods:{
			//支付类型切换
			tab(index,type){
				this.cur = index;
				this.payway = type;
			},
			tabs(index,data){
				if(parseFloat(this.price)>=parseFloat(data.face_value)){
					this.coucur = index;
					this.couponsid = data.id;
					this.coutit = "-￥"+data.discount;
				}
			},
			isCoupon(){
				if(this.couponslist.length>0){
					this.coushow = !this.coushow;
				}
			},
			couClick(){
				this.coushow = !this.coushow;
			},
			eventClick(){
				this.$emit('close');
				this.moneypay();
			},
			moneypay(){
				this.$api.http.payOrder(this.id,this.couponsid,this.payway).then((res)=>{
					if(res.code==200){
						uni.requestPayment({
						    provider: 'wxpay',
						    timeStamp: res.data.timeStamp.toString(),
						    nonceStr: res.data.nonceStr,
						    package: res.data.package,
						    signType: res.data.signType,
						    paySign: res.data.paySign,
						    success: (res)=> {
						        console.log('success:' + JSON.stringify(res));
								uni.showToast({
									title:"支付成功",
									icon:"none"
								})
								setTimeout(()=>{
									uni.redirectTo({
										url:"/pages/library/order/index"
									})
								},800)
						    },
						    fail: (err)=> {
						        console.log('fail:' + JSON.stringify(err));
								this.$http.payfail(this.id).then((res)=>{
									console.log(res)
								})
						    }
						});
					}
				})
			},
			close(){
				this.$emit('close');
			},
			getCoupons(){
				this.$api.http.getCoupons().then((res)=>{
					if(res.code==200){
						if(res.data.length){
							this.couponslist = res.data;
							let cid = uni.getStorageSync("couponsid");
							this.couponslist.forEach((item)=>{
								if(item.id==cid){
									this.couponsid = item.id;
									this.coutit = "-￥"+item.discount;
								}
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.paypopup{
		/deep/.u-close--top-left{
			left:60rpx;
		}
		.popupcon{
			padding-left: 60rpx;
			.price{
				text-align: center;
				font-size: 27rpx;
				color:#FD4E1F;
				font-weight: bold;
				padding-top:65rpx;
				padding-bottom: 15rpx;
				border-bottom: 2rpx solid #e5e5e5;
			}
			.paytit{
				padding:15rpx 0 28rpx;
				font-size: 31rpx;
				color:#141313;
				text-align: center;
				font-weight: bold;
			}
			.typebox{
				display: flex;
				flex-direction: column;
				position: relative;
				padding-bottom: 38rpx;
				border-bottom: 2rpx solid #e5e5e5;
				.item{
					display: flex;
					align-items: center;
					padding:21rpx 56rpx 21rpx 0;
					.label{
						flex:1;
						margin-left: 18rpx;
						font-size: 27rpx;
						color:#141313;
					}
					.icon{
						width: 33rpx;
						height: 33rpx;
					}
					&.active{
						.icon{
							background: url(/static/img/example/icon_checked.png) no-repeat;
							background-size: 100% 100%;
						}
					}
				}
			}
			.coupons{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding:0 56rpx 20rpx 0;
				height: 100rpx;
				line-height: 100rpx;
				.label{
					font-size: 22rpx;
					color:#FF1E10;
					font-weight: bold;
				}
				.right{
					font-size: 22rpx;
					color:#ABABAB;
					font-weight: bold;
					.text{
						color:#000000;
						font-weight: normal;
						flex:1;
						margin-right: 20rpx;
					}
				}
			}
			.btn_primary{
				position: fixed;
				bottom:0;
				left:0;
				right: 0;
				z-index: 20;
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				font-size: 22rpx;
				color:#ffffff;
				text-align: center;
				background: #19bef4;
				border-radius: 0;
			}
		}
	}
	.coupopup{
		.title{
			width: 100%;
			font-size: 30rpx;
			color:#000000;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			position: fixed;
			top:0;
			let:0;
			z-index: 50;
		}
		.coulist{
			padding:80rpx 40rpx 0;
			display: flex;
			flex-direction: column;
			.item{
				display: flex;
				align-items: center;
				font-size: 24rpx;
				color: #000000;
				padding:20rpx 0;
				.ntits{
					flex:1;
				}
				.icon{
					width: 23rpx;
					height: 23rpx;
					background: url(/static/img/example/icon_check.png) no-repeat;
					background-size: 100% 100%;
				}
				&.on{
					.icon{
						background: url(/static/img/example/icon_checked.png) no-repeat;
						background-size: 100% 100%;
					}
				}
			}
		}
		.btn_primary{
			position: fixed;
			bottom:0;
			left:0;
			right: 0;
			z-index: 20;
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 22rpx;
			color:#ffffff;
			text-align: center;
			background: #19bef4;
			border-radius: 0;
		}
	}
</style>
