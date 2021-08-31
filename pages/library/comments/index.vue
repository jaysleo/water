<template>
	<view class="container">
		<view class="commentlist">
			<view class="comment_item" v-for="(item,index) in list" :key="index">
				<image :src="item.user_info.avatar" mode="aspectFit" class="avatar"></image>
				<view class="info">
					<view class="hd">
						<text class="name">{{item.user_info.nickname}}</text>
						<!-- <view class="location">
							<image src="/static/img/example/icon_maps.png" mode="aspectFit" class="icon"></image>
							<text></text>
						</view> -->
						<text class="time">{{item.create_at}}</text>
					</view>
					<view class="con">{{item.content}}</view>
				</view>
			</view>
		</view>
		<loadMore :status="status" :show="loadShow"></loadMore>
	</view>
</template>

<script>
	import loadMore from '@/components/loadmore.vue'
	export default{
		components: {
			loadMore
		},
		data(){
			return {
				id:0,
				list:[],
				status: 'loading',
				page:1,
				loadShow:false
			}
		},
		methods:{
			async loadData(){
				await this.$api.http.commitlist(this.id,this.page,10).then(res => {
					if(res.code == 200){
						this.list = this.list.concat(res.data.data);
						let total = res.data.total;
						if(res.data.data.length<=total && this.page==1){
							this.status = 'nomore';
							this.loadShow = false;
						}
						if(res.data.data.length == 0) {
							this.status = 'nomore';
							this.loadShow = false;
						}
					}
				})
			}
		},
		onLoad(e){
			this.id = e.id;
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

<style lang="scss">
	.commentlist{
		padding:14rpx 22rpx;
		.comment_item{
			background: #ffffff;
			border-radius: 18rpx;
			box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0,0,0,0.16);
			padding:20rpx 20rpx 18rpx 27rpx;
			display: flex;
			margin-bottom: 9rpx;
			.avatar{
				width:72rpx;
				height: 72rpx;
				border-radius: 50%;
				flex-shrink: 0;
			}
			.info{
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				margin-left: 20rpx;
				flex:1;
				.hd{
					display: flex;
					align-items: center;
					font-size: 22rpx;
					color:#000000;
					.name{
						flex:1;
						width: 240rpx;
						height: 30rpx;
						margin-right: 20rpx;
						text-overflow: ellipsis;
						white-space: nowrap;
						overflow: hidden;
					}
					.location{
						display: flex;
						align-items: center;
						flex:1;
						.icon{
							width:17rpx;
							height: 24rpx;
							margin-right: 14rpx;
						}
					}
					.time{
						font-size: 18rpx;
						color:#707070;
					}
				}
				.con{
					padding-top:16rpx;
					font-size: 18rpx;
					color:#000000;
				}
			}
		}
	}
</style>
