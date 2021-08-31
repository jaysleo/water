<template>
	<view>
		<view class="login_wrap">
			<image src="/static/img/common/logo.png" mode="aspectFit" style="width: 294rpx;height: 294rpx;"></image>
			<u-gap height="160"></u-gap>
			<!-- <button type="default" class="loginbtn" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">微信用户快捷登录</button> -->
			<button type="default" class="loginbtn" @click="GetUserInfo">微信用户快捷登录</button>
		</view>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex';
	export default {
		data(){
			return {
				originUrl: ''
			}
		},
		methods:{
			...mapMutations(['storeToken']),
			bindGetUserInfo(e){
				let _this = this;
				let info = e.detail.userInfo;
				uni.login({
					provider: 'weixin',
					success: (res)=> {
						this.otherLogin(res, info);
					},
					fail: () => {
						uni.showToast({
							title:"失败",
							icon:"none"
						})
					}
				});
			},
			GetUserInfo(){
				let infores = "";
				if(uni.getUserProfile){
					uni.getUserProfile({
						desc:'登录',
						success:(res)=>{
							infores = res.userInfo;
							uni.login({
								provider: 'weixin',
								success: (loginRes)=> {
									this.otherLogin(loginRes, infores);
								},
								fail: () => {
									uni.showToast({
										title:"失败",
										icon:"none"
									})
								}
							});
						},
						fail:(err)=>{
							console.log(err);
						}
					})
				}
			},
			//授权登录
			otherLogin(loginRes, infoRes) {
				let pram = {
					userinfo:JSON.stringify(infoRes),
					code:loginRes.code
				}
				this.$api.http.htmlLogin(pram).then(res => {
					if (res.code == 200) {
						this.storeToken(res.data.token);
						uni.showToast({
							title:"登录成功",
							icon:"none"
						})
						setTimeout(()=>{
							if (this.originUrl) {
								uni.navigateBack();
							} else {
								uni.switchTab({
									url: '/pages/user/index',
								});
							}
						},1000);
					}else{
						uni.showToast({
							title:res.message,
							icon:"none"
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page{background:#ffffff;}
	.login_wrap{
		display: flex;
		align-items: center;
		flex-direction: column;
		padding:60rpx;
		.loginbtn{
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			background: #07c160;
			font-size: 24rpx;
			color:#ffffff;
		}
	}
</style>
