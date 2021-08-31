<template>
	<view class="container">
		<view class="article">
			<u-parse :html="content"></u-parse>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				content:""
			}
		},
		onLoad(){
			let content = uni.getStorageSync('article');
			if(content){
				this.content = content;
			}
		}
	}
</script>
<style lang="scss">
	page{background: #ffffff;}
	.article{
		padding:40rpx;
		font-size: 32rpx;
		color:#000000;
		line-height: 1.6;
	}
</style>
