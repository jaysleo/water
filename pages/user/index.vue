<template>
	<view class="container">
		<view class="userbg">
			<view class="place"></view>
			<view class="userbox">
				<image :src="avatar" mode="aspectFit" class="avatar"></image>
				<view class="info" v-if="hasLogin">
					<view class="left">
						<view class="name">
							<image src="/static/img/example/icon_user.png" mode="aspectFit" style="width: 16rpx;height: 20rpx;"></image>
							<text class="text">{{userInfo.nickname}}</text>
						</view>
						<view class="phone">
							<image src="/static/img/example/icon_phone.png" mode="aspectFit" style="width: 16rpx;height: 21rpx;"></image>
							<text>{{userInfo.mobile}}</text>
						</view>
					</view>
					<view class="vip" v-if="userInfo.is_vip==1">
						<image src="/static/img/example/icon_vip.png" mode="aspectFit" style="width: 84rpx;height: 22rpx;"></image>
					</view>
				</view>
				<view class="info" v-else>
					<view class="left">
						<view class="ntit" @click="goTo('/pages/login/index')">登录/注册</view>
					</view>
				</view>
				<view class="account" v-if="hasLogin" @click="loginOut">
					<text>切换账号</text>
					<image src="/static/img/example/icon_login.png" mode="aspectFit" style="width: 20rpx;height: 20rpx;"></image>
				</view>
			</view>
		</view>
		<view class="user_con">
			<view class="place"></view>
			<view class="order_card" @click="goTo('/pages/library/order/index',true)">
				<view class="tit">全部订单</view>
				<u-icon name="arrow-right" size="20"></u-icon>
			</view>
			<view class="common_card">
				<view class="tit">我的服务</view>
				<view class="card_body">
					<view class="card_item" v-for="(item,index) in servlist" :key="index" @click="goTo(item.url,true)">
						<image :src="item.src" mode="aspectFit" :style="item.style"></image>
						<text>{{item.title}}</text>
					</view>
				</view>
			</view>
			<view class="common_card">
				<view class="tit">分享</view>
				<view class="card_body">
					<view class="card_item" @click="onShare">
						<image src="/static/img/user/icon_ewm.png" mode="aspectFit" style="width: 36rpx;height: 34rpx;"></image>
						<text>二维码分享</text>
					</view>
					<view class="card_item">
						<button type="default" class="btnshare" open-type="share">
							<image src="/static/img/user/icon_xcf.png" mode="aspectFit" style="width: 38rpx;height: 34rpx;"></image>
							<text>小程序分享</text>
						</button>
					</view>
				</view>
			</view>
			<view class="tips">无忧订水网：0577-28120623</view>
		</view>
		<u-popup v-model="show" mode="bottom" :closeable="true" close-icon-pos="top-left" height="850" border-radius="18">
			<view class="sharebox">
				<u-gap height="100"></u-gap>
				<view class="image_wrap">
					<image :src="erweima" mode="aspectFit"></image>
				</view>
				<view class="title">分享邀请好友，用户下单后可得满减优惠券</view>
				<view class="btnbox">
					<button type="default" class="btn_save combtn" @click="toSave">
						<u-icon name="/static/img/user/icon_save.png" size="17" class="icon"></u-icon>
						<text>保存图片</text>
					</button>
					<button type="default" class="btn_share combtn" open-type="share">
						<u-icon name="/static/img/user/icon_share.png" size="17" class="icon"></u-icon>
						<text>立即分享</text>
					</button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex';
	export default {
		data(){
			return {
				username:"",
				phone:"",
				erweima:"/static/img/user/ewm.png",
				show:false,
				servlist:[
					// {
					// 	src:"/static/img/user/icon_Watervote.png",
					// 	title:"水票",
					// 	url:"/pages/library/waterVote/index",
					// 	style:"width:36rpx;height:33rpx;"
					// },
					{
						src:"/static/img/user/icon_coupon.png",
						title:"优惠券",
						url:"/pages/library/coupon/index",
						style:"width:30rpx;height:30rpx;"
					},
					{
						src:"/static/img/user/icon_map.png",
						title:"地址",
						url:"/pages/library/address/index",
						style:"width:30rpx;height:30rpx;"
					},
					{
						src:"/static/img/user/icon_Bucketback.png",
						title:"退桶",
						url:"/pages/library/service/index",
						style:"width:30rpx;height:30rpx;"
					},
					{
						src:"/static/img/user/icon_invoice.png",
						title:"发票",
						url:"/pages/library/service/index",
						style:"width:30rpx;height:30rpx;"
					},
					{
						src:"/static/img/user/icon_service.png",
						title:"客服",
						url:"/pages/library/service/index",
						style:"width:30rpx;height:30rpx;"
					}
				]
			}
		},
		computed: {
		    ...mapGetters(['hasLogin','userInfo','avatar'])
		},
		methods:{
			...mapMutations(['logout','storeUser']),
			goTo(url, loginCheck = false){
				if(loginCheck && !this.hasLogin){
					uni.showToast({
						title: '您还未登录，请先登录',
						icon: 'none'
					});
					uni.navigateTo({
						url:"/pages/login/index"
					})
					return;
				}
				uni.navigateTo({
					url:url
				})
			},
			getUserInfo(){
				this.$api.http.getUserInfo().then((res)=>{
					if(res.code == 200){
						this.storeUser(res.data);
					}
				})
			},
			loginOut(){
				uni.showModal({
					title:"提示",
					content: '确定要退出登录吗？',
					confirmColor:"#19BEF4",
					success: (e)=>{
						if(e.confirm){
							this.logout();
							setTimeout(()=>{
								uni.navigateTo({
									url:"/pages/login/index"
								})
							}, 1000)
						}
					}
				});
			},
			onShare(){
				this.show = true;
				let erweima = uni.getStorageSync("erweima");
				if(erweima){
					this.erweima = erweima;
				}else{
					this.$api.http.webconfig().then((res)=>{
						if(res.code == 200){
							res.data.forEach((item)=>{
								if(item.only_tag == "qrcode"){
									uni.setStorage({key:"erweima",data:item.value});
									this.erweima = item.value;
								}
							})
						}
					})
				}
			},
			toSave(){
				uni.getImageInfo({
					src: this.erweima,
					success: function (image) {
						console.log('图片信息：', JSON.stringify(image));
						uni.saveImageToPhotosAlbum({
							filePath: image.path,
							success: function () {
								console.log('save success');
								uni.showToast({
									title: '图片保存成功',
									icon: 'none'
								});
							}
						});
					}
				});
			}
		},
		onShow(){
			if(this.userInfo==""){
				this.getUserInfo();
			}
		},
		//下拉刷新
		onPullDownRefresh(){
			uni.stopPullDownRefresh();
			this.getUserInfo();
		},
		//分享
		onShareAppMessage() {
			return {
				title: "1桶水",
				path: "/pages/index/index",
				success: res => {
					console.info(res)
				}
			}
		}
	}
</script>

<style lang="scss">
	.userbg{
		width: 100%;
		height: 283rpx;
		background:url(../../static/img/user/userbg.png) no-repeat;
		background-size: cover;
		background-color: #19bef4;
		.place{
			width: 100%;
			height: 200rpx;
		}
		.userbox{
			margin:0 49rpx;
			padding:0 28rpx 0 45rpx;
			height: 163rpx;
			background: #ffffff;
			border-radius: 18rpx;
			box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0,0,0,0.16); 
			display: flex;
			align-items: center;
			.avatar{
				width:101rpx;
				height: 101rpx;
				border-radius: 50%;
				background:#eee;
				flex-shrink: 0;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.info{
				flex:1;
				flex-shrink: 0;
				margin-left:22rpx;
				display: flex;
				align-items: center;
				position: relative;
				.left{
					flex:1;
					display: flex;
					flex-direction: column;
					font-size: 24rpx;
					color:#000000;
					image{
						margin-right: 19rpx;
					}
					.ntit{
						font-size: 32rpx;
					}
					.text{
						width: 180rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					.name{
						display: flex;
						align-items: center;
						font-weight: bold;
						margin-bottom: 14rpx;
					}
					.phone{
						display: flex;
						align-items: center;
					}
				}
				.vip{
					display: flex;
					margin-right: 26rpx;
				}
				&::after{
					content:"";
					position: absolute;
					top:50%;
					right:0;
					width: 2rpx;
					height: 53rpx;
					margin-top:-26rpx;
					background:#e5e5e5;
				}
			}
			.account{
				display: flex;
				align-items: center;
				font-size: 18rpx;
				color:#19BEF4;
				margin-left: 28rpx;
				image{
					margin-left:10rpx;
				}
			}
		}
	}
	.user_con{
		margin:0 49rpx;
		.place{
			width: 100%;
			height: 82rpx;
		}
		.order_card{
			margin-top:18rpx;
			height: 82rpx;
			padding-right: 38rpx;
			background: #ffffff;
			border-radius: 18rpx;
			box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0,0,0,0.16);
			display: flex;
			align-items: center;
			justify-content: space-between;
			.tit{
				font-size: 22rpx;
				color:#000000;
				font-weight: bold;
				position: relative;
				padding-left: 33rpx;
				&::after{
					content:"";
					position: absolute;
					top:0;
					left:0;
					width: 9rpx;
					height: 31rpx;
					background: #19bef4;
				}
			}
		}
		.common_card{
			margin-top:18rpx;
			background: #ffffff;
			border-radius: 18rpx;
			box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0,0,0,0.16);
			.tit{
				font-size: 22rpx;
				color:#000000;
				font-weight: bold;
				position: relative;
				padding:24rpx 0 14rpx 33rpx;
				&::before{
					content:"";
					position: absolute;
					top:24rpx;
					left:0;
					width: 9rpx;
					height: 31rpx;
					background: #19bef4;
				}
				&::after{
					content:"";
					position: absolute;
					bottom:0;
					left:33rpx;
					width: 100%;
					height: 2rpx;
					background:#f1f1f1;
				}
			}
			.card_body{
				padding-top:29rpx;
				padding-left:33rpx;
				display: flex;
				flex-wrap: wrap;
				.card_item{
					width:33.333%;
					display: flex;
					flex-direction: column;
					align-items: center;
					font-size: 22rpx;
					color:#4A4A4A;
					margin-bottom:45rpx;
					image{
						margin-bottom: 17rpx;
					}
					.btnshare{
						display: flex;
						flex-direction: column;
						align-items: center;
						font-size: 22rpx;
						color:#4A4A4A;
						line-height: 32rpx;
						background:none;
						border:0;
						padding-left: 0;
						padding-right: 0;
					}
				}
			}
		}
		.tips{
			padding:27rpx 0;
			font-size: 22rpx;
			color:#19BEF4;
			text-align: right;
		}
	}
	.sharebox{
		display: flex;
		align-items: center;
		flex-direction: column;
		position: relative;
		width: 100%;
		height: 100%;
		.image_wrap{
			width:232rpx;
			height: 232rpx;
			// border: 2rpx solid #19bef4;
			// border-radius: 28rpx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.title{
			font-size: 18rpx;
			color:#ABABAB;
			margin-top:30rpx;
		}
		.btnbox{
			position: absolute;
			bottom:80rpx;
			left:0;
			width: 100%;
			.combtn{
				height: 58rpx;
				line-height: 58rpx;
				font-size: 18rpx;
				text-align: center;
				display: flex;
				align-items: center;
				justify-content: center;
				.icon{
					margin-right: 18rpx;
				}
			}
			.btn_save{
				width: 384rpx;
				border: 2rpx solid #19bef4;
				border-radius: 20rpx;
				color:#19BEF4;
				margin-bottom: 22rpx;
			}
			.btn_share{
				width: 386rpx;
				background: #19bef4;
				border-radius: 18rpx;
				color:#ffffff;
			}
		}
	}
</style>
