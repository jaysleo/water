<template>
	<view class="container">
		<view class="modeslider">
			<swiper class="sliderbox" :circular="true" :indicator-dots="true" indicator-color="#ffffff" indicator-active-color="#FFC965">
				<swiper-item v-for="(item,index) in list.pic_arr" :key="index">
					<view class="imagewrap">
						<image :src="item.domain+item.path.substr(1)" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="fntitle_wrap">
			<view class="title">{{list.title}}</view>
			<view class="price">
				<text>￥</text><text class="bold">{{price}}</text>
			</view>
		</view>
		<view class="specbox">
			<view class="title">选择规格</view>
			<view class="tagbox">
				<view class="itag" :class="{active:cur==index}" v-for="(items,index) in list.sku_arr" :key="index" @click="tab(index,items)">{{items.size}}</view>
			</view>
		</view>
		<view class="tipbox">
			<view class="title" v-if="list.prompt">提示：{{list.prompt}}</view>
			<view class="fntag" v-if="list.product_tags">
				<view class="itag" v-for="(item,index) in list.product_tags.split(',')" :key="index">{{item}}</view>
			</view>
		</view>
		<view class="fncommentbox combox" v-if="commitlist.length">
			<view class="title">评论</view>
			<view class="commlist">
				<view class="comment_item" v-for="(item,index) in commitlist" :key="index">
					<image :src="item.user_info.avatar" mode="aspectFit" class="avatar"></image>
					<view class="info">
						<view class="hd">
							<text class="name">{{item.user_info.nickname}}</text>
							<text class="time">{{item.create_at}}</text>
						</view>
						<view class="con">{{item.content}}</view>
					</view>
				</view>
			</view>
			<view class="more" @click="goCommit(list.id)" v-if="commitlist.length>0">
				<text>查看更多</text>
				<u-icon name="arrow-right" size="22" color="#19BEF4" class="icon"></u-icon>
			</view>
		</view>
		<view class="fninfo combox">
			<view class="title">商品详情</view>
			<view class="detail">
				<u-parse :html="list.desc" :lazy-load="true"></u-parse>
			</view>
		</view>
		<view class="btn_actions">
			<view class="cartbtn" @click="addCart">
				<u-icon name="/static/img/example/icon_cart.png" size="34" class="icon"></u-icon>
				<text>加入购物车</text>
			</view>
			<button type="default" class="btn_primary" @click="show = true">立即购买</button>
		</view>
		<u-gap height="80"></u-gap>
		<u-popup class="popbox" mode="bottom" v-model="show">
			<view class="poptit">选择数量</view>
			<view class="num_wrap">
			    <view class="minus" @click="sub"><u-icon size="36" name="/static/img/example/minus.png"></u-icon></view>
			    <text class="text_wrap">{{number}}</text>
			    <view class="plus" @click="add"><u-icon size="36" name="/static/img/example/plus.png"></u-icon></view>
			</view>
			<button type="default" class="btn_primary" @click="buy">确定</button>
		</u-popup>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				swiperlist:[],
				id:0,
				list:[],
				commitlist:[],
				price:"0",
				cur:0,
				skuid:0,
				number:1,
				show:false
			}
		},
		methods:{
			async loadData(){
				await this.$api.http.getProDetail(this.id).then(res => {
					if(res.code == 200){
						this.list = res.data;
						this.price = res.data.sku_arr[0].price;
						this.skuid = res.data.sku_arr[0].sku_id;
					}else{
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
				await this.$api.http.commitlist(this.id,1,3).then(res => {
					if(res.code == 200){
						this.commitlist = res.data.data;
					}
				})
			},
			//规格切换
			tab(index,data){
				this.cur = index;
				this.price = data.price;
				this.skuid = data.sku_id;
			},
			//减少数量
			sub(){
				if(this.number<=1){
					return;
				}
				this.number--;
			},
			//增加数量
			add(){
				this.number++;
			},
			async addCart(){
				await this.$api.http.addCart(this.id,this.skuid,this.number).then((res) => {
					if(res.code == 200){
						uni.showToast({
							title:"加入购物车成功",
							icon:"none"
						})
					}else if(res.code==402){
						uni.navigateTo({
							url:"/pages/login/index"
						})
					}else{
						uni.showToast({
							title:res.message,
							icon:"none"
						})
					}
				})
			},
			async buy(){
				this.show = false;
				await this.$api.http.addCart(this.id,this.skuid,this.number).then((res) => {
					if(res.code == 200){
						uni.switchTab({
							url:"/pages/cart/cart"
						})
					}else if(res.code==402){
						uni.navigateTo({
							url:"/pages/login/index"
						})
					}else{
						uni.showToast({
							title:res.message,
							icon:"none"
						})
					}
				})
			},
			goCommit(id){
				uni.navigateTo({
					url:"/pages/library/comments/index?id="+id
				})
			}
		},
		onLoad(e){
			this.id = e.id;
			this.loadData();
		}
	}
</script>

<style lang="scss" scoped>
	.modeslider{
		background:#ffffff;
		width: 100%;
		height: 424rpx;
		.sliderbox{
			width: 100%;
			height: 100%;
			.imagewrap{
				width: 100%;
				height: 100%;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	.fntitle_wrap{
		background:#ffffff;
		padding:27rpx 49rpx 18rpx;
		margin-bottom: 2rpx;
		position: relative;
		.title{
			font-size: 22rpx;
			color:#000000;
			margin-bottom: 14rpx;
		}
		.price{
			font-size: 22rpx;
			color:#FD4E1F;
			.bold{
				font-weight: bold;
			}
		}
		&::after{
			content:"";
			position: absolute;
			top:27rpx;
			left:0;
			width: 9rpx;
			height: 62rpx;
			background: #19bef4;
		}
	}
	.specbox{
		padding:16rpx 49rpx 33rpx;
		background: #ffffff;
		position: relative;
		.title{
			font-size: 25rpx;
			color:#000000;
			font-weight: bold;
		}
		.tagbox{
			padding-top:29rpx;
			display: flex;
			.itag{
				padding:0 36rpx;
				height: 42rpx;
				line-height: 42rpx;
				font-size: 22rpx;
				color:#FFFFFF;
				text-align: center;
				background: #e5e5e5;
				border-radius: 22rpx;
				margin-right: 22rpx;
				margin-bottom: 20rpx;
				&.active{
					background: #19bef4;
				}
			}
		}
		&::after{
			content:"";
			position: absolute;
			top:18rpx;
			left:22rpx;
			width: 9rpx;
			height: 31rpx;
			background: #19bef4;
		}
	}
	.tipbox{
		display: flex;
		flex-direction: column;
		padding:20rpx 46rpx;
		.title{
			font-size: 22rpx;
			color:#000000;
			margin-bottom: 11rpx;
		}
		.fntag{
			display: flex;
			align-items: center;
			.itag{
				width: 156rpx;
				height: 42rpx;
				line-height: 42rpx;
				font-size: 22rpx;
				color:#ffffff;
				text-align: center;
				background: #19bef4;
				border-radius: 22rpx;
				margin-right: 13rpx;
				&:last-child{
					margin-right: 0;
				}
			}
		}
	}
	.combox{
		padding:20rpx 22rpx 24rpx;
		background: #ffffff;
		.title{
			font-size: 25rpx;
			color:#000000;
			font-weight: bold;
			border-left: 9rpx #19bef4 solid;
			padding-left: 18rpx;
		}
	}
	.fncommentbox{
		margin-bottom: 9rpx;
		.commlist{
			padding:0 42rpx 0 49rpx;
			.comment_item{
				display: flex;
				padding:17rpx 0;
				border-bottom: 2rpx solid rgba(112,112,112,0.10);
				.avatar{
					width:72rpx;
					height: 72rpx;
					border-radius: 50%;
					flex-shrink: 0;
				}
				.info{
					flex:1;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					margin-left: 20rpx;
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
				&:last-child{
					border-bottom: 0;
				}
			}
		}
		.more{
			font-size: 18rpx;
			color:#19BEF4;
			display: flex;
			align-items: center;
			justify-content: center;
			padding-top:21rpx;
			.icon{
				display: flex;
				margin-left: 16rpx;
			}
		}
	}
	.fninfo{
		background: #ffffff;
		.detail{
			padding:20rpx 47rpx;
		}
	}
	.btn_actions{
		display: flex;
		align-items: center;
		width: 100%;
		height: 80rpx;
		background: #ffffff;
		box-shadow: 0rpx -2rpx 4rpx 0rpx rgba(0,0,0,0.16);
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 50;
		.cartbtn{
			display: flex;
			align-items: center;
			justify-content: center;
			flex:1;
			font-size: 22rpx;
			color:#19BEF4;
			.icon{
				display: flex;
				margin-right: 18rpx;
			}
		}
		.btn_primary{
			width: 505rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			font-size: 22rpx;
			color:#ffffff;
			background: #19bef4;
			border-radius: 0;
		}
	}
	.popbox{
		.poptit{
			margin-left: 50rpx;
			padding:30rpx 0;
			font-size: 22rpx;
			color:#000000;
			text-align: center;
			border-bottom:2rpx solid #e5e5e5;
		}
		.num_wrap{
			padding:47rpx 0;
			display: flex;
			align-items: center;
			justify-content: center;
			.text_wrap{
				font-size: 25rpx;
				color:#707070;
				padding:0 27rpx;
			}
			.minus,.plus{
				display: flex;
			}
		}
		.btn_primary{
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			background: #19bef4;
			border-radius: 0;
			font-size: 22rpx;
			color:#ffffff;
		}
	}
</style>
