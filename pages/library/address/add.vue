<template>
	<view class="container">
		<view class="address_form">
			<view class="item">
				<image src="/static/img/example/icon_users.png" mode="aspectFit" class="icon"></image>
				<text class="label">收 货 人</text>
				<input type="text" class="input" placeholder="请填写收货人姓名" v-model="form.name" />
			</view>
			<view class="item">
				<image src="/static/img/example/icon_mob.png" mode="aspectFit" class="icon" style="width: 17rpx;height: 24rpx;"></image>
				<text class="label">联系方式</text>
				<input type="number" class="input" placeholder="请填写联系方式" v-model="form.phone" />
			</view>
			<view class="item" @click="showRegionPicker">
				<image src="/static/img/example/icon_city.png" mode="aspectFit" class="icon" style="width: 23rpx;height: 20rpx;"></image>
				<text class="label">所在城市</text>
				<input type="text" class="input" placeholder="点击选择所在城市" disabled="true" v-if="form.province==''" />
				<view class="city">{{form.province}} {{form.city}} {{form.area}}</view>
			</view>
			<!-- <view class="item">
				<image src="/static/img/example/icon_map.png" mode="aspectFit" class="icon" style="width: 22rpx;height: 19rpx;"></image>
				<text class="label">所在地址</text>
				<input type="text" class="input" placeholder="点击进行地址选择" disabled="true" />
			</view> -->
			<view class="item">
				<image src="/static/img/example/icon_map.png" mode="aspectFit" class="icon" style="width: 22rpx;height: 19rpx;"></image>
				<text class="label">详细地址</text>
				<input type="text" class="input" placeholder="请填写详细地址" v-model="form.address" />
			</view>
			<view class="tip" @click="onCheck">
				<view class="icon" v-if="isCheck">
					<image src="/static/img/example/icon_checked.png" mode="aspectFit" style="width: 24rpx;height: 24rpx;margin-right:20rpx;"></image>
				</view>
				<view class="icon" v-else>
					<image src="/static/img/example/icon_check.png" mode="aspectFit" style="width: 24rpx;height: 24rpx;margin-right:20rpx;"></image>
				</view>
				<text>默认地址</text>
			</view>
		</view>
		<view class="btnbox">
			<button type="default" class="btn_primary" @click="submit">保存</button>
		</view>
		<u-picker mode="region" ref="uPicker" v-model="show" @confirm="confirm" />
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default{
		data(){
			return {
				form:{
					name:"",
					phone:"",
					province:"",
					city:"",
					area:"",
					address:""
				},
				isCheck:true,
				show:false,
				editType:"",
				address_id:0
			}
		},
		methods:{
			onCheck(){
				this.isCheck = !this.isCheck;
			},
			showRegionPicker() {
				this.show = true;
			},
			//地址确认
			confirm(e){
				this.form.province = e.province.label;
				this.form.city = e.city.label;
				this.form.area = e.area.label;
			},
			//提交
			submit(){
				if(this.form.name==""){
					this.$refs.uToast.show({
						title: '请填写收货人'
					})
					return false;
				}
				if(this.form.phone==""){
					this.$refs.uToast.show({
						title: '请填写联系方式'
					})
					return false;
				}
				if(this.form.province==""){
					this.$refs.uToast.show({
						title: '请选择所在地区'
					})
					return false;
				}
				if(this.form.address==""){
					this.$refs.uToast.show({
						title: '请填写详细地址'
					})
					return false;
				}
				let pram = {
					city:this.form.city,
					province:this.form.province,
					area:this.form.area,
					name:this.form.name,
					number:this.form.phone,
					address:this.form.address,
					is_default:this.isCheck==true?1:0
				}
				if(this.editType=="edit"){
					let epram = {
						address_id:this.address_id,
						city:this.form.city,
						province:this.form.province,
						area:this.form.area,
						name:this.form.name,
						number:this.form.phone,
						address:this.form.address,
						is_default:this.isCheck==true?1:0
					}
					this.$api.http.addressEdit(epram).then(res => {
						if(res.code == 200){
							this.$refs.uToast.show({
								title: '保存成功'
							})
							setTimeout(()=>{
								uni.navigateBack();
							},1000);
						}else{
							this.$refs.uToast.show({
								title: res.message
							})
						}
					});
				}else{
					this.$api.http.addressAdd(pram).then(res => {
						if(res.code == 200){
							this.$refs.uToast.show({
								title: '保存成功'
							})
							setTimeout(()=>{
								uni.navigateBack();
							},1000);
						}else{
							this.$refs.uToast.show({
								title: res.message
							})
						}
					});
				}
			}
		},
		onLoad(e){
			this.editType = e.type;
			if(e.type=='edit'){
				uni.getStorage({
					key:'address',
					success: ((e) => {
						this.address_id = e.data.address_id;
						this.form.name = e.data.name;
						this.form.phone = e.data.number;
						this.form.province = e.data.province;
						this.form.city = e.data.city;
						this.form.area = e.data.area;
						this.form.address = e.data.address;
						this.isCheck = e.data.is_default==0?false:true;
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.address_form{
		padding:18rpx 24rpx;
		.item{
			background: #ffffff;
			border-radius: 18rpx;
			box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0,0,0,0.16);
			height: 82rpx;
			line-height: 82rpx;
			padding:0 38rpx;
			display: flex;
			align-items: center;
			margin-bottom: 18rpx;
			.icon{
				width:21rpx;
				height: 21rpx;
				flex-shrink: 0;
			}
			.label{
				font-size: 22rpx;
				color:#000000;
				font-weight: bold;
				margin-left: 15rpx;
				margin-right: 27rpx;
			}
			.input{
				font-size: 22rpx;
				color:#000000;
			}
		}
		.tip{
			display: flex;
			align-items: center;
			font-size: 22rpx;
			color:#000000;
			.icon{
				display: flex;
			}
		}
	}
	.btnbox{
		position: fixed;
		bottom: 80rpx;
		left:0;
		z-index: 20;
		width: 100%;
		.btn_primary{
			margin:0 24rpx;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 24rpx;
			color:#ffffff;
			text-align: center;
			background: #19bef4;
			border-radius: 18rpx;
		}
	}
</style>
