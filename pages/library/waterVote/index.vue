<template>
	<view class="container">
		<view class="splist">
			<!-- <view class="empty" v-if="list.length==0">
				<image src="/static/img/example/icon_coupon.png" mode="aspectFit" class="icon"></image>
				<text>暂无相关内容</text>
			</view> -->
			<view class="item">
				<view class="left">
					<text>水票买三送一</text>
					<text class="desc">一共四桶水~~~</text>
				</view>
				<view class="buy" @click="gobuy">
					<text class="price">￥50.00</text>
					<text>购买</text>
				</view>
			</view>
		</view>
		<u-popup class="paypopup" v-model="show" mode="bottom" :closeable="true" close-icon-pos="top-left" border-radius="40">
			<view class="popupcon">
				<view class="price">￥100.00</view>
				<view class="paytit">选择支付方式</view>
				<view class="typebox">
					<view class="item" :class="{active:cur==index}" v-for="(item,index) in typelist" :key="index" @click="tab(index)">
						<u-icon :name="item.icon" size="38"></u-icon>
						<text class="label">{{item.title}}</text>
						<view class="icon"></view>
					</view>
				</view>
				<view class="coupons">
					<text class="label">优惠券：</text>
					<view class="right">无可用优惠券</view>
				</view>
				<u-gap height="80"></u-gap>
				<u-button :ripple="true" class="btn_primary" @click="pay">立即支付</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				list:[],
				typelist:[
					{
						id:1,
						title:"微信支付",
						icon:"/static/img/example/icon_weixin.png"
					},
					{
						id:2,
						title:"水票支付",
						icon:"/static/img/example/icon_water.png"
					}
				],
				cur:0,
				show:false
			}
		},
		methods:{
			tab(index){
				this.cur = index;
			},
			gobuy(){
				this.show = true;
			},
			pay(){}
		}
	}
</script>

<style lang="scss">
	.splist{
		padding:18rpx 45rpx;
		.item{
			display: flex;
			align-items: center;
			padding:0 46rpx 0 34rpx;
			height: 172rpx;
			margin-bottom: 18rpx;
			background: linear-gradient(74deg,#005fc4 8%, #71aeda 92%);
			.left{
				flex:1;
				display: flex;
				flex-direction: column;
				font-size: 34rpx;
				color:#FFFFFF;
				.desc{
					font-size: 16rpx;
					opacity: 0.49;
					margin-top:10rpx;
				}
			}
			.buy{
				width: 188rpx;
				height: 47rpx;
				line-height: 47rpx;
				background: #ffffff;
				border-radius: 24rpx;
				box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0,0,0,0.16); 
				text-align: center;
				font-size: 18rpx;
				color:#005FC4;
				.price{
					font-size: 24rpx;
				}
			}
		}
		.empty{
			display: flex;
			align-items: center;
			flex-direction: column;
			margin-top: 160rpx;
			font-size: 22rpx;
			color:#707070;
			.icon{
				margin-bottom: 50rpx;
				width:243rpx;
				height: 183rpx;
			}
		}
	}
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
				padding:23rpx 56rpx 50rpx 0;
				.label{
					font-size: 22rpx;
					color:#FF1E10;
					font-weight: bold;
				}
				.right{
					font-size: 22rpx;
					color:#ABABAB;
					font-weight: bold;
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
</style>
