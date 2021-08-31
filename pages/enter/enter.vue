<template>
	<view class="container">
		<view class="logo_wrap">
			<image src="/static/img/common/logo.png" mode="aspectFit" style="width: 294rpx;height: 294rpx;"></image>
		</view>
		<view class="enter_form">
			<view class="form_item">
				<view class="label">你的姓名</view>
				<input type="text">
			</view>
			<view class="form_item">
				<view class="label">联系电话</view>
				<input type="text">
			</view>
			<view class="form_item">
				<view class="label">店铺地址</view>
				<input type="text">
			</view>
			<view class="form_item">
				<view class="label">主营业务</view>
				<input type="text">
			</view>
			<button type="default" class="btn_primary fixed">确定</button>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				form:{
					name:""
				}
			}
		}
	}
</script>

<style lang="scss">
	page{background: #ffffff;}
	.logo_wrap{
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-top:25rpx;
		margin-bottom: 56rpx;
		.text{
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 18rpx;
			color:#1EBB33;
		}
	}
	.enter_form{
		padding:0 49rpx;
		.form_item{
			.label{
				margin-bottom:18rpx;
				font-size: 22rpx;
				color:#000000;
				font-weight: bold;
			}
			input{
				height: 78rpx;
				line-height: 78rpx;
				font-size: 22rpx;
				color:#000000;
				background: #ffffff;
				padding:0 27rpx;
				margin-bottom: 22rpx;
				border-radius: 18rpx;
				box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0,0,0,0.16);
			}
		}
		.btn_primary{
			width: 192rpx;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 22rpx;
			color:#FFFFFF;
			margin:62rpx auto;
			background: #19bef4;
			border-radius: 18rpx;
			&.fixed{
				position: fixed;
				left:0;
				bottom:0;
				width: 100%;
				margin:0;
				border-radius: 0;
			}
		}
	}
</style>
