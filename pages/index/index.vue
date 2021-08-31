<template>
	<view class="container">
		<view class="top" :style="{top:headerTop}">
			<view class="city">
				<view class="icon location">
					<image src="/static/img/index/icon_map.png" mode="aspectFit" style="width: 17rpx;height: 24rpx;"></image>
				</view>
				<text class="text">{{city}}</text>
			</view>
			<u-search class="searchbox" placeholder="搜一搜" :clearabled="true" :show-action="false" border-color="#E5E5E5" search-icon-color="#E5E5E5" bg-color="#FFFFF" input-align="center" placeholder-color="#ABABAB" color="#707070" v-model="keywords" @search="goSearch"></u-search>
		</view>
		<u-gap height="97"></u-gap>
		<u-swiper class="bannerbox" :list="banner" mode="dot" height="393" border-radius="0" indicator-pos="bottomRight"></u-swiper>
		<view class="index_con">
			<view class="newsbox">
				<view class="icon">
					<image src="/static/img/index/icon_gg.png" mode="aspectFit" style="width: 63rpx;height: 28rpx;"></image>
				</view>
				<swiper class="swiperbox" :vertical="true" :circular="true" :autoplay="true">
					<swiper-item class="swiper_item" v-for="(item, index) in newsData" :key="index" @click="goArticle(item.content)">
						{{item.title}}
					</swiper-item>
				</swiper>
				<!-- <view class="swiperbox" :class="{'animate_up': animateUp}" v-if="isup">
					<view class="swiper_item" v-for="(item, index) in newsData" :key="index">{{item.title}}</view>
				</view>
				<view class="swiperbox" :class="{'animate_down': animateUp}" v-else>
					<view class="swiper_item" v-for="(item, index) in newsData" :key="index">{{item.title}}</view>
				</view> -->
				<view class="right">
					<view class="arrow">
						<u-icon name="/static/img/example/icon_arrow.png" size="16" class="icons"></u-icon>
					</view>
				</view>
			</view>
			<view class="menu">
				<view class="menu_item" :class="{index:index==1}" v-for="(item,index) in menulist" :key="index" @click="navTo(item.url)">
					<image :src="item.image" mode="aspectFit"></image>
					<text>{{item.title}}</text>
				</view>
			</view>
			<view class="brandbox">
				<view class="tit">
					<text class="text">热门品牌</text>
				</view>
				<view class="brand_menu">
					<view class="item" :class="{on:tabcur==0}" @click="tab(0,0)" v-if="isAll">
						<image src="/static/img/brand/icon_alls.png" mode="aspectFit" class="icon"></image>
						<text class="text">全部</text>
					</view>
					<view class="item" :class="{on:tabcur==item.category_id}" v-for="(item,index) in brandlist" :key="index" @click="tab(index,item.category_id)">
						<image :src="brandlists[index].image" mode="aspectFit" :style="brandlists[index].style" class="icon"></image>
						<text class="text">{{item.title}}</text>
					</view>
				</view>
				<view class="floor_container">
					<view class="similar" v-for="(item,index) in prolist" :key="index" @click="detail(item.id)">
						<view class="icon_hot" v-if="item.has_pay_num>100"></view>
						<view class="img_wrap" v-for="(items,index) in item.pic_arr" :key="items.pic_id" v-if="index==0">
							<image :src="items.domain+items.path.substr(1)" mode="aspectFill"></image>
						</view>
						<view class="title">{{item.title}}</view>
						<view class="product_info">
							<view class="price" v-for="(items,index) in item.sku_arr" :key="items.sku_id" v-if="index==0">￥ {{items.price}}</view>
							<view class="sales">已售{{item.has_pay_num}}</view>
						</view>
					</view>
					<loadMore :status="status" :show="loadShow"></loadMore>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import amap from '@/common/SDK/amap-wx.js';
	import loadMore from '@/components/loadmore.vue'
	export default{
		components: {
			loadMore
		},
		data(){
			return {
				headerTop:"0px",
				city:"定位中",
				banner:[],
				isup:true,
				newsData:[],
				animateUp:false,
				newstimer: null,
				menulist:[
					{
						image:"/static/img/index/icon_kf.png",
						title:"人工客服",
						url:"/pages/library/service/index"
					},
					{
						image:"/static/img/index/icon_lzpz.png",
						title:"绿植盆栽",
						url:"/pages/plant/index"
					}
				],
				brandlist:[],
				brandlists:[
					{
						image:"/static/img/brand/icon_tzs.png",
						title:"桶装水",
						style:"width:19rpx;height:24rpx;"
					},
					{
						image:"/static/img/brand/icon_pzs.png",
						title:"瓶装水",
						style:"width:31rpx;height:32rpx;"
					},
					{
						image:"/static/img/brand/icon_ysj.png",
						title:"饮水机",
						style:"width:18rpx;height:23rpx;"
					}
				],
				isAll:false,
				tabcur:0,
				keywords:"",
				prolist:[],
				protype:0,
				status: 'loading',
				page:1,
				loadShow:false
			}
		},
		methods:{
			verticalChange(){
				if(this.isup){
					this.isup = false;
				}else{
					this.isup = true;
				}
			},
			scrollAnimate() {
			      this.animateUp = true;
			      setTimeout(() => {
					  this.newsData.push(this.newsData[0]);
					  this.newsData.shift();
					  this.animateUp = false;
			      }, 500);
			},
			//请求数据
			async loadData(){
				await this.$api.http.banner().then(res => {
					if(res.code == 200){
						let list = res.data;
						let nlist = list.map((item) => {
							return {
								image:item.domain+item.path.substr(1),
							};
						 });
						this.banner = nlist;
					}
				});
				this.$api.http.announce().then(res => {
					if(res.code == 200){
						this.newsData = res.data;
					}
				});
				this.$api.http.getCategory().then(res => {
					if(res.code == 200){
						let data = res.data;
						data.forEach((item)=>{
							if(item.pid==0 && item.title=="水"){
								this.brandlist = item.children;
							}
						})
						this.isAll = true;
					}
				});
				this.getPro();
			},
			detail(id){
				uni.navigateTo({
					url:"/pages/library/detail/index?id="+id
				})
			},
			goArticle(data){
				uni.setStorage({key:"article",data:data});
				uni.navigateTo({
					url:"/pages/library/article/index"
				})
			},
			getlocation(){
				var myAmapFun = new amap.AMapWX({key:'920f79168bc1acfc9cbd1710aba2b43c'});
				myAmapFun.getRegeo({
					success: (data)=>{
						this.city = data[0].regeocodeData.formatted_address;
					},
					fail: (info)=>{
						console.log(info)
					}
				})
			},
			goSearch(){
				uni.navigateTo({
					url:"/pages/library/goods/index?key="+this.keywords
				})
			},
			//商品
			getPro(){
				this.$api.http.getProductlist(0,1,this.page,10,this.keywords,this.protype).then(res => {
					if(res.code == 200){
						this.prolist = this.prolist.concat(res.data.data);
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
			navTo(url){
				uni.navigateTo({
					url:url
				})
			},
			tab(index,id){
				this.tabcur = id;
				this.protype = id;
				this.prolist = [];
				this.page = 1;
				this.getPro();
			}
		},
		onLoad(){
			// #ifdef H5
			this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight+'px';
			// #endif
			this.loadData();
			this.getlocation();
		},
		onShow(){
			// this.newstimer = setInterval(this.scrollAnimate, 2000);
		},
		onUnload(){
			// clearInterval(this.newstimer);
		},
		//上拉加载
		onReachBottom(){
			if (this.status == 'nomore'){
				return;
			}
			this.loadShow = true;
			this.status = 'loading';
			this.page ++;
			this.getPro();
		},
		//下拉刷新
		onPullDownRefresh(){
			uni.stopPullDownRefresh();
			this.prolist = [];
			this.page = 1;
			this.loadData();
		}
	}
</script>

<style lang="scss" scoped>
	.top{
		background: #ffffff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding:18rpx 24rpx;
		width: 100%;
		position: fixed;
		left: 0;
		right: 0;
		top: var(--window-top);
		z-index: 50;
		.city{
			flex:1;
			display: flex;
			align-items: center;
			.icon{
				display: flex;
				margin-right: 14rpx;
			}
			font-size: 22rpx;
			color:#000000;
			font-weight: bold;
			.text{
				width: 313rpx;
				height: 31rpx;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
		}
		.searchbox{
			flex:0 0 264rpx;
			/deep/.u-input{
				font-size: 24rpx;
			}
		}
	}
	.bannerbox{
		width:100%;
		height: 393rpx;
		background:#f8f8f8;
		/deep/.u-indicator-item-dot{
			background:#ffffff;
		}
		/deep/.u-indicator-item-dot-active{
			background:#FFC965;
		}
		/deep/.u-swiper-indicator{
			bottom:60rpx !important;
		}
	}
	.index_con{
		margin:0 24rpx;
		.newsbox{
			height: 53rpx;
			padding:0 27rpx;
			background: #ffffff;
			border-radius: 9rpx;
			font-size: 20rpx;
			color:#000000;
			margin-top:-27rpx;
			position: relative;
			z-index: 20;
			display: flex;
			align-items: center;
			overflow: hidden;
			.icon{
				display: flex;
				margin-right: 18rpx;
			}
			.swiperbox{
				height: 53rpx;
				flex:1;
				overflow: hidden;
				.swiper_item{
					display: flex;
					align-items: center;
					width: 100%;
					height: 100%;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
				}
				&.animate_up{
				    transition: all 0.5s;
				    transform: translateY(-53rpx);
				}
				&.animate_down{
				    transition: all 0.5s;
				    transform: translateY(53rpx);
				}
			}
			.right{
				display: flex;
				align-items: center;
				flex-direction: column;
				padding:16rpx 0;
				.arrow{
					.icons{
						display: flex;
					}
				}
			}
		}
		.menu{
			padding:27rpx 0;
			display: flex;
			align-items: center;
			.menu_item{
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				width:50%;
				font-size: 22rpx;
				color:#000000;
				height: 125rpx;
				background: #cfd8f2;
				border-radius: 63rpx;
				image{
					width:63rpx;
					height: 63rpx;
					margin-top: 19rpx;
					margin-bottom: 14rpx;
				}
				&.index{
					background: #C2F1C8;
					margin-left:4rpx;
				}
			}
		}
		.brandbox{
			background: #ffffff;
			border-radius: 18rpx;
			box-shadow: 0rpx 5rpx 11rpx 0rpx rgba(0,0,0,0.16);
			margin-bottom:40rpx;
			.tit{
				padding:24rpx 0;
				font-size: 25rpx;
				color:#000000;
				font-weight: bold;
				position: relative;
				.text{
					padding-right: 18rpx;
					padding-left: 31rpx;
					background: #ffffff;
					position: relative;
					z-index: 10;
				}
				&::before{
					content:"";
					width: 9rpx;
					height: 31rpx;
					background: #ffc965;
					position: absolute;
					top:24rpx;
					left:0;
					z-index: 20;
				}
				&::after{
					content:"";
					width: 100%;
					height: 2rpx;
					background: rgba(255,201,101,0.20);
					position: absolute;
					top:38rpx;
					right:0;
				}
			}
			.brand_menu{
				padding:8rpx;
				display: flex;
				align-items: center;
				.item{
					margin-left:60rpx;
					font-size: 22rpx;
					color:#000000;
					display: flex;
					align-items: center;
					.icon{
						width: 23rpx;
						height: 23rpx;
					}
					.text{
						margin-left:17rpx;
						padding-bottom: 4rpx;
						position: relative;
					}
					&.on{
						color:#FFC965;
						.text{
							&::before{
								content:"";
								position: absolute;
								bottom:0;
								left:0;
								width: 100%;
								height: 2rpx;
								background: #ffc965;
							}
						}
					}
				}
			}
			.floor_container{
				margin:36rpx 33rpx 36rpx 36rpx;
				display: flex;
				flex-wrap: wrap;
				.similar{
					width:50%;
					position: relative;
					margin-bottom: 27rpx;
					.icon_hot{
						width:108rpx;
						height: 39rpx;
						background: url(../../static/img/index/icon_hot.png) no-repeat;
						background-size: 100%;
						position: absolute;
						top:37rpx;
						left:0;
						z-index: 20;
					}
					.img_wrap{
						width:100%;
						height: 308rpx;
						image{
							width:100%;
							height: 100%;
						}
					}
					.title{
						font-size: 22rpx;
						color:#000000;
						margin-top:18rpx;
						margin-bottom: 5rpx;
						height: 67rpx;
					}
					.product_info{
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-size: 22rpx;
						.price{
							color:#FD4E1F;
						}
						.sales{
							color:#ABABAB;
						}
					}
					&:nth-child(odd) {
						padding-right: 29rpx;
					}
				}
			}
		}
	}
</style>
