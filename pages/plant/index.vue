<template>
	<view class="container">
		<view class="plantlist">
			<view class="list_item" v-for="(item,index) in list" :key="index">
				<view class="imgwrap" v-for="(items,index) in item.pic_arr" :key="items.pic_id" v-if="index==0">
					<image :src="items.domain+items.path.substr(1)" mode="aspectFill"></image>
				</view>
				<view class="info">
					<view class="title">{{item.title}}</view>
					<view class="foot">
						<text>已售{{item.has_pay_num}}</text>
						<text class="price" v-for="(items,index) in item.sku_arr" :key="items.sku_id" v-if="index==0">￥{{items.price}}</text>
					</view>
				</view>
				<button type="default" class="btn_primary" @click="detail(item.id)">查看详情</button>
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
				list:[],
				status: 'loading',
				page:1,
				loadShow:false
			}
		},
		methods:{
			//请求数据
			async loadData(){
				await this.$api.http.getProductlist(0,2,this.page,10).then(res => {
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
				});
			},
			detail(id){
				uni.navigateTo({
					url:"/pages/library/detail/index?id="+id
				})
			}
		},
		onLoad(){
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
	.plantlist{
		margin:0 18rpx;
		.list_item{
			background: #ffffff;
			border-radius: 18rpx;
			padding:27rpx 31rpx;
			margin-top:18rpx;
			display: flex;
			position: relative;
			.imgwrap{
				width:190rpx;
				height: 163rpx;
				flex-shrink: 0;
				margin-right: 27rpx;
				background:#eeeeee;
				image{
					width:100%;
					height: 100%;
				}
			}
			.info{
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.title{
					font-size: 25rpx;
					color:#121314;
					font-weight: bold;
				}
				.foot{
					font-size: 22rpx;
					color:#ABABAB;
					display: flex;
					flex-direction: column;
					.price{
						font-size: 25rpx;
						color:#FD4E1F;
						font-weight: bold;
						margin-top:9rpx;
					}
				}
			}
			.btn_primary{
				width: 207rpx;
				height: 47rpx;
				line-height: 47rpx;
				background: #19bef4;
				font-size: 22rpx;
				color:#FFFFFF;
				position: absolute;
				top:50%;
				right:31rpx;
				margin-top:-23rpx;
			}
		}
	}
</style>
