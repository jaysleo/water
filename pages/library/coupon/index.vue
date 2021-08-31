<template>
	<view class="container">
		<view class="empty" v-if="list.length==0">
			<image src="/static/img/example/icon_coupon.png" mode="aspectFit" class="icon"></image>
			<text>暂无相关内容</text>
		</view>
		<view class="coupon_list">
			<view class="coupon_item" v-for="(item,index) in list" :key="index" @click="goBuy(item.id)">
				<text class="title">满{{item.face_value}}立减{{item.discount}}元</text>
				<button type="default" class="btn_primary">去使用</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				list:[]
			}
		},
		methods:{
			//请求数据
			async loadData(){
				await this.$api.http.getCoupons().then((res) => {
					if(res.code==200){
						this.list = res.data;
					}
				});
			},
			goBuy(id){
				uni.setStorage({key:"couponsid",data:id});
				uni.navigateTo({
					url:"/pages/library/goods/index"
				})
			}
		},
		onLoad(){
			this.loadData();
		}
	}
</script>

<style lang="scss" scoped>
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
	.coupon_list{
		padding: 0 45rpx;
		.coupon_item{
			width: 100%;
			height: 172rpx;
			margin-top: 27rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			// background: linear-gradient(74deg,#ec1555 8%, #fd6660 92%);
			background:url(../../../static/img/example/couponbg.png) no-repeat;
			background-size: 100% 100%;
			.title{
				font-size: 34rpx;
				color:#FFFFFF;
				padding-left: 34rpx;
			}
			.btn_primary{
				width: 188rpx;
				height: 47rpx;
				line-height: 47rpx;
				margin-right: 45rpx;
				text-align: center;
				font-size: 24rpx;
				color:#F84E5D;
				background: #ffffff;
				border-radius: 24rpx;
				box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0,0,0,0.16); 
			}
		}
	}
</style>
