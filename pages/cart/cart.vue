<template>
	<view class="container">
		<view class="tabbox" :style="{top:headerTop}">
			<view class="tabview" :class="{on:cur==1}" @click="tab(1)">
				<text class="text">购物车{{cartNum}}</text>
			</view>
			<!-- <view class="tabview" :class="{on:cur==2}" @click="tab(2)">
				<text class="text">水票购物</text>
			</view> -->
		</view>
		<u-gap height="80"></u-gap>
		<Empty height="600" v-if="cartList.length==0"></Empty>
		<view class="cartlist" v-else>
			<uni-swipe-action class="swipebox">
				<uni-swipe-action-item v-for="(item,index) in cartList" :key="item.cart_id" :options="options" @click="onDel($event,index)">
					<view class="cart_item">
						<view class="icon" @click="check('item', index)">
							<view class="icon_check" v-if="!item.checked"></view>
							<u-icon name="checkmark-circle-fill" size="30" color="#19BEF4" v-else></u-icon>
						</view>
						<view class="imgwrap" v-for="(items,index) in item.pic_arr" :key="index" v-if="index==0">
							<image :src="items.domain+items.path.substr(1)" mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="title">
								<text>{{item.product_info.title}}</text>
								<text class="desc">规格：{{item.sku_info.size}}</text>
							</view>
							<view class="foot">
								<view class="price">¥{{item.sku_info.price}}</view>
								<view class="num_wrap">
									<view class="minus" @click="sub(index,item.cart_id)"><u-icon name="/static/img/example/icon_minus.png" size="40" class="fulicon"></u-icon></view>
									<view class="text_wrap"><input class="text" type="tel" disabled="true" v-model="item.stock"></view>
									<view class="plus" @click="add(index,item.cart_id)"><u-icon name="/static/img/example/icon_plus.png" size="40" class="fulicon"></u-icon></view>
								</view>
							</view>
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</view>
		<view class="action_section">
			<view class="icon_checkbox" @click="check('all')">
				<view class="icon" v-if="!allChecked"></view>
				<u-icon name="checkmark-circle-fill" size="30" color="#19BEF4" v-else></u-icon>
				<text class="tits">全选</text>
			</view>
			<view class="total_box">
				<text>合计：</text>
				<text class="price">￥{{total}}</text>
			</view>
			<button type="default" class="confirm_btn disable" disabled="true" v-if="cklist.length==0">结算</button>
			<button type="default" class="confirm_btn" @click="goSubmit" v-else>结算({{totalNum}})</button>
		</view>
		<u-gap height="80"></u-gap>
	</view>
</template>

<script>
	import Empty from '@/components/empty.vue'
	export default {
		components: {
			Empty
		},
		data(){
			return {
				headerTop:"0px",
				cartNum:"",
				cur:1,
				cartList:[],
				allChecked:false,
				total:0.00,
				totalNum:0,
				cklist:[],
				options: [
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				]
			}
		},
		methods:{
			tab(index){
				this.cur = index;
			},
			//请求数据
			async loadData(){
				await this.$api.http.cartList().then((res) => {
					if(res.code == 200){
						this.cartList = res.data.data;
						if(res.data.total>0){
							this.cartNum = "("+res.data.total+")";
							let cartList = this.cartList.map(item=>{
								item.show = false;
								item.checked = false;
								return item;
							});
							this.allChecked = false;
							this.cartList = cartList;
						}else{
							this.cartNum = "";
						}
					}else{
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				});
			},
			//选中状态处理
			check(type, index){
				if(type === 'item'){
					this.cartList[index].checked = !this.cartList[index].checked;
				}else{
					const checked = !this.allChecked
					const list = this.cartList;
					list.forEach(item=>{
						item.checked = checked;
					})
					this.allChecked = checked;
				}
				this.cklist = this.cartList.filter(item=>item.checked == true);
				this.totalNum = this.cklist.length;
				this.calcTotal();
			},
			// 减少数量
			sub(index,id){
				if(this.cartList[index].number<=1){
					return;
				}
				let number = this.cartList[index].stock;
				this.$api.http.changeCartnum(id,number,0).then((res) => {
					if(res.code == 200){
						this.cartList[index].stock--;
					}else{
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
				this.calcTotal();
			},
			// 增加数量
			add(index,id){
				let number = this.cartList[index].stock;
				this.$api.http.changeCartnum(id,number,1).then((res) => {
					if(res.code == 200){
						this.cartList[index].stock++;
					}else{
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
				this.calcTotal();
			},
			//删除
			onDel(e,index) {
				let list = this.cartList;
				let id = this.cartList[index].cart_id;
				uni.showModal({
				    title: '提示',
				    content: '确定是否删除该商品？',
					confirmColor:"#19BEF4",
				    success: (res)=> {
				        if (res.confirm) {
				            this.$api.http.delCart(id).then((res) => {
				            	if(res.code == 200){
				            		list.splice(index, 1);
				            		this.calcTotal();
				            	}else{
				            		uni.showToast({
				            			title: res.message,
				            			icon: "none"
				            		})
				            	}
				            })
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			//计算总价
			calcTotal(){
				let list = this.cartList;
				let total = 0;
				let checked = true;
				list.forEach(item=>{
					if(item.checked === true){
						total += parseFloat(item.sku_info.price) * item.stock;
					}else if(checked === true){
						checked = false;
					}
				})
				this.allChecked = checked;
				this.total = total.toFixed(2);
			},
			//结算
			goSubmit(){
				uni.showLoading({
					title:"加载中"
				})
				if(this.cklist.length){
					uni.removeStorageSync("cartlist");
					setTimeout(()=>{
						uni.hideLoading();
						uni.setStorage({key: 'cartlist', data: {data:JSON.stringify(this.cklist),total:this.total}});
						uni.navigateTo({
							url:"/pages/library/order/orderConfirm"
						})
					},800)
				}
			}
		},
		onShow(){
			// #ifdef H5
			this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight+'px';
			// #endif
			this.loadData();
		}
	}
</script>

<style lang="scss">
	page{background: #f5f5f5;}
</style>
<style lang="scss" scoped>
	.tabbox{
		width: 100%;
		border-top:4rpx #f5f5f5 solid;
		background: #ffffff;
		display: flex;
		align-items: center;
		justify-items: center;
		position: fixed;
		left: 0;
		right: 0;
		top: var(--window-top);
		width: 100%;
		z-index: 20;
		.tabview{
			display: inline-block;
			flex:1;
			text-align: center;
			height: 80rpx;
			line-height: 80rpx;
			font-size:22rpx;
			color:#707070;
			.text{
				display: inline-block;
			}
			&.on{
				.text{
					color:#000000;
					font-weight: bold;
					border-bottom: 5rpx solid #19bef4;
				}
			}
		}
	}
	.cartlist{
		padding-bottom: 18rpx;
		.swipebox{
			/deep/.uni-swipe{
				margin-top:18rpx;
			}
		}
		.cart_item{
			flex: 1;
			display: flex;
			align-items: center;
			padding:40rpx 49rpx 38rpx 30rpx;
			background: #ffffff;
			.icon{
				margin-right: 22rpx;
				.icon_check{
					width: 29rpx;
					height: 29rpx;
					background: #ffffff;
					border: 2rpx solid #ababab;
					border-radius: 16rpx;
				}
			}
			.imgwrap{
				width:139rpx;
				height: 141rpx;
				overflow: hidden;
				flex-shrink: 0;
				margin-right: 22rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.info{
				display: flex;
				flex-direction: column;
				flex:1;
				.title{
					font-size: 22rpx;
					color: #141313;
					font-weight: bold;
					display: flex;
					flex-direction: column;
					.desc{
						font-weight: normal;
						margin-top:14rpx;
						margin-bottom: 34rpx;
						font-size: 18rpx;
						color:#ABABAB;
					}
				}
				.foot{
					display: flex;
					align-items: center;
					justify-content: space-between;
					.price{
						font-size: 22rpx;
						color: #FD4E1F;
						flex:1;
					}
					.num_wrap{
						display: flex;
						align-items: center;
						.minus,.plus{
							position: relative;
							display: flex;
							align-items: center;
							justify-content: center;
							.fulicon{
								display: flex;
							}
						}
						.text_wrap{
							width: 69rpx;
							text-align: center;
							flex:1;
							font-size: 24rpx;
							color:#707070;
						}
					}
				}
			}
		}
	}
	.action_section{
		/* #ifdef H5 */
		margin-bottom:100rpx;
		/* #endif */
		position:fixed;
		left: 0;
		bottom:0;
		z-index: 95;
		display: flex;
		align-items: center;
		background:#ffffff;
		width:100%;
		height:80rpx;
		.icon_checkbox{
			display: flex;
			align-items: center;
			margin-left: 31rpx;
			.icon{
				width: 29rpx;
				height: 29rpx;
				background: #ffffff;
				border: 2rpx solid #ababab;
				border-radius: 16rpx;
			}
			.tits{
				font-size: 22rpx;
				color:#141313;
				font-weight: bold;
				margin-left:18rpx;
			}
			image{
				width:29rpx;
				height:29rpx;
			}
		}
		.total_box{
			flex:1;
			text-align: right;
			margin-right:18rpx;
			font-size:22rpx;
			color:#141313;
			font-weight: bold;
			.price{
				font-size: 28rpx;
				color:#FD4E1F;
			}
		}
		.confirm_btn{
			width: 272rpx;
			height: 80rpx;
			background: #19BEF4;
			border-radius: 0;
			font-size: 22rpx;
			color:#FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;
			&.disable{
				background: #f7f7f7;
				color:rgb(192, 196, 204);
			}
		}
	}
</style>
