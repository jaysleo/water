<template>
	<view class="container">
		<view class="aside">
			<scroll-view scroll-y="true" class="left_aside">
				<view class="f_item" :class="{active: 0 === currentId}" :key="index" @click="tabtap(0)" v-if="isAll">
					<u-icon name="/static/img/brand/icon_all.png" size="32" class="icon"></u-icon>
					<text>全部</text>
				</view>
				<view class="f_item" :class="{active: item.category_id === currentId}" v-for="(item,index) in flist" :key="item.category_id" @click="tabtap(item.category_id)">
					<u-icon :name="navlist[index].image" :size="navlist[index].width" class="icon"></u-icon>
					<text>{{item.title}}</text>
				</view>
			</scroll-view>
			<scroll-view scroll-with-animation="true" scroll-y="true" class="right_aside" @scrolltolower="onReachBottom">
				<view class="plist">
					<view @click="navToList(titem.id)" class="item" v-for="(titem,index) in plist" :key="titem.id">
						<view class="imgwrap" v-for="(items,index) in titem.pic_arr" :key="index" v-if="index==0">
							<image :src="items.domain+items.path.substr(1)" mode="scaleToFill"></image>
						</view>
						<text class="name">{{titem.title}}</text>
					</view>
					<loadMore :status="status" :show="loadShow"></loadMore>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import loadMore from '@/components/loadmore.vue'
	export default {
		components: {
			loadMore
		},
		data(){
			return {
				isAll:false,
				currentId:0,
				navlist:[
					{
						image:"/static/img/brand/icon_tzs.png",
						width:"29"
					},
					{
						image:"/static/img/brand/icon_pzs.png",
						width:"46"
					},
					{
						image:"/static/img/brand/icon_ysj.png",
						width:"27"
					}
				],
				flist:[],
				plist:[],
				status: 'loading',
				page:1,
				loadShow:false,
				cateid:0
			}
		},
		methods: {
			async loadData() {
				await this.$api.http.getCategory().then(res => {
					let data = res.data;
					data.forEach((item)=>{
						if(item.pid==0 && item.title=="水"){
							this.flist = item.children;
						}
					})
					this.isAll = true;
				});
			},
			async getplist(){
				await this.$api.http.getProductlist(0,this.page,10,"",this.cateid).then(res => {
					if(res.code == 200){
						this.plist = this.plist.concat(res.data.data);
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
			//一级分类点击
			tabtap(id) {
				this.currentId = id;
				this.cateid = id;
				this.getplist();
			},
			navToList(id){
				uni.navigateTo({
					url:"/pages/library/detail/index?id="+id
				})
			}
		},
		onLoad(options) {
			this.cateid = options.id;
			this.loadData();
			this.getplist();
		},
		//上拉加载
		onReachBottom(){
			if (this.status == 'nomore'){
				return;
			}
			this.loadShow = true;
			this.status = 'loading';
			this.page ++;
			this.getplist();
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
	page{background:#ffffff;}
</style>
<style lang="scss" scoped>
	.aside{
		display: flex;
		height: 100vh;
	}
	.left_aside{
		width:255rpx;
		height: 100%;
		background: #F4F4F4;
		.f_item{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 134rpx;
			font-size: 34rpx;
			color: #000000;
			position: relative;
			.icon{
				display: flex;
				margin-right: 30rpx;
			}
			&.active {
				background: #ffffff;
			}
		}
	}
	.right_aside{
		flex: 1;
		overflow: hidden;
		.plist{
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			background: #fff;
			padding-left: 16rpx;
			.item{
				flex-shrink: 0;
				display: flex;
				flex-direction: column;
				width: 48%;
				font-size: 22rpx;
				color: #000000;
				margin:0 2% 0 0;
				.imgwrap{
					width: 100%;
					height: 220rpx;
					background:#eeeeee;
					overflow: hidden;
					margin-bottom: 18rpx;
					image {
						width: 100%;
						height: 100%;
					}
				}
				.name{
					margin-bottom: 43rpx;
					text-align: center;
				}
			}
		}
	}
</style>
