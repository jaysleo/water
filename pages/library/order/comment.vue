<template>
	<view class="container">
		<view class="comment_con">
			<view class="textarea">
				<textarea :auto-height="true" placeholder="请输入评价内容" v-model="msg"></textarea>
			</view>
			<view class="comment_tit">一键评论</view>
			<view class="comlist">
				<view class="cell">
					<view class="item" :class="{active:cur==index}" v-for="(item,index) in list" :key="index" @click="tab(index,item.title)">
						<text class="text">{{item.title}}</text>
						<view class="icon"></view>
					</view>
				</view>
				<view class="refresh">
					<u-icon name="/static/img/example/icon_reload.png" size="21" class="icon"></u-icon>
					<text>换一批</text>
				</view>
			</view>
			<view class="btnbox">
				<button type="default" class="btn_primary" @click="onSubmit">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				orderid:0,
				proid:0,
				msg:"",
				cur:-1,
				list:[
					{
						title:"购得此物不由得精神为之一振，自觉七经八脉为之一畅。"
					},
					{
						title:"真不错，是个好东西，会推荐给朋友。"
					},
					{
						title:"挺好的，下次还会买。"
					}
				]
			}
		},
		methods:{
			tab(index,con){
				this.cur = index;
				this.msg = con;
			},
			onSubmit(){
				if(this.msg==""){
					uni.showToast({
						title:"请输入评论内容",
						icon:"none"
					})
					return false;
				}
				this.$api.http.addCommit(this.orderid,this.proid,this.msg).then((res)=>{
					if(res.code==200){
						uni.showToast({
							title:"评论成功",
							icon:"none"
						})
						setTimeout(()=>{
							uni.navigateBack();
						},500)
					}
				})
			}
		},
		onLoad(e){
			this.orderid = e.id==undefined?0:e.id;
			this.proid = e.pid==undefined?0:e.pid;
		}
	}
</script>

<style lang="scss">
	.comment_con{
		padding:0 24rpx;
		.textarea{
			padding:25rpx 31rpx;
			height: 422rpx;
			margin-top:22rpx;
			background: #ffffff;
			border-radius: 18rpx;
			box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0,0,0,0.16);
			textarea{
				width:100%;
				font-size: 22rpx;
				color:#707070;
			}
		}
		.comment_tit{
			font-size: 22rpx;
			color: #000000;
			margin:42rpx 0 18rpx 30rpx;
		}
		.comlist{
			padding:0 28rpx;
			background: #ffffff;
			border-radius: 18rpx;
			box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0,0,0,0.16);
			.item{
				padding:25rpx 0 19rpx 0;
				border-bottom: 2rpx solid #e5e5e5;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.text{
					font-size: 22rpx;
					color:#ABABAB;
				}
				.icon{
					width: 23rpx;
					height: 23rpx;
					background: url(/static/img/example/icon_check.png) no-repeat;
					background-size: 100% 100%;
				}
				&:last-child{
					border-bottom: 0;
				}
				&.active{
					.icon{
						background: url(/static/img/example/icon_checked.png) no-repeat;
						background-size: 100% 100%;
					}
				}
			}
			.refresh{
				padding:18rpx 0;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 22rpx;
				color:#19BEF4;
				.icon{
					margin-right: 9rpx;
				}
			}
		}
		.btnbox{
			position: fixed;
			bottom: 63rpx;
			left:0;
			z-index: 20;
			width: 100%;
			.btn_primary{
				margin:0 51rpx;
				height: 80rpx;
				line-height: 80rpx;
				font-size: 22rpx;
				color:#ffffff;
				text-align: center;
				background: #19bef4;
				border-radius: 18rpx;
			}
		}
	}
</style>
