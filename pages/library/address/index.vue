<template>
	<view class="container">
		<view class="address_list">
			<view class="item" v-for="(item,index) in list" :key="index" @click="Goquery(item)">
				<view class="hd">
					<view class="label">
						<view class="name">
							<text class="text">{{item.name}} {{item.number}}</text>
							<u-tag text="默认" shape="circle" size="mini" bg-color="#19BEF4" color="#ffffff"></u-tag>
						</view>
						<view class="address">{{item.province}}{{item.city}}{{item.area}}{{item.address}}</view>
					</view>
				</view>
				<view class="foot">
					<view class="check" @click="isCheck">
						<view class="icon" v-if="item.is_default==0"></view>
						<u-icon name="checkmark-circle-fill" size="34" color="#19bef4" v-else></u-icon>
						<text>默认地址</text>
					</view>
					<view class="icon_edit" @click.stop="onEdit(item)">
						<u-icon name="edit-pen" size="24" color="#969799"></u-icon>
					</view>
					<!-- <view class="del">删除</view> -->
				</view>
			</view>
		</view>
		<view class="btnbox">
			<button type="default" class="btn_primary" @click="onAdd">新增收货地址</button>
		</view>
		<u-gap height="120"></u-gap>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				checked:true,
				list:[]
			}
		},
		methods:{
			async loadData(){
				await this.$api.http.addresslist().then(res => {
					if(res.code == 200){
						this.list = res.data;
					}else{
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				});
			},
			Goquery(data){
				let newdata = [];
				newdata.push(data);
				uni.setStorage({
					key:"address",
					data:JSON.stringify(newdata)
				})
				uni.navigateBack();
			},
			onEdit(data){
				uni.setStorage({
					key:"address",
					data:data
				})
				uni.navigateTo({
					url:"/pages/library/address/add?type=edit"
				})
			},
			isCheck(){
				this.checked = this.checked?false:true;
			},
			onAdd(){
				uni.navigateTo({
					url:"/pages/library/address/add"
				})
			}
		},
		onShow(){
			this.loadData();
		}
	}
</script>

<style lang="scss">
	.address_list{
		padding:18rpx 24rpx;
		.item{
			background: #ffffff;
			border-radius: 16rpx;
			padding:24rpx;
			display: flex;
			flex-direction: column;
			margin-bottom: 24rpx;
			.hd{
				display: flex;
				align-items: center;
				word-wrap: break-word;
				.label{
					margin-left:24rpx;
					flex:1;
					.name{
						display: flex;
						align-items: center;
						margin-bottom: 16rpx;
						font-size: 28rpx;
						color: #323233;
						.text{
							margin-right: 20rpx;
						}
					}
					.address{
						color: #323233;
						font-size: 28rpx;
						padding-right: 20rpx;
						padding-bottom: 20rpx;
					}
				}
			}
			.foot{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding:20rpx 0 0;
				font-size: 28rpx;
				color: #323233;
				border-top:2rpx #eee solid;
				.icon_edit{
					display: flex;
					align-items: center;
					margin-right: 20rpx;
				}
				.check{
					display: flex;
					align-items: center;
					.icon{
						width:34rpx;
						height: 34rpx;
						border:1px solid #c8c9cc;
						border-radius: 50%;
						margin-right: 20rpx;
					}
				}
			}
		}
	}
	.btnbox{
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 999;
		box-sizing: border-box;
		width: 100%;
		padding: 0 24rpx;
		.btn_primary{
			margin:10rpx 0;
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 24rpx;
			color:#ffffff;
			text-align: center;
			background: #19bef4;
			border-radius: 18rpx;
		}
	}
</style>
