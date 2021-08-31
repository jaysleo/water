<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	page{
		font-family: PingFang SC, PingFang SC-Regular;
		background: #f1f1f1;
	}
	uni-button,button {
		font-weight: normal;
		&.no-border::before,&::after,&.no-border::after {
			border: 0;
		}
	}
	.u-btn::after{
		border:none !important;
	}
</style>