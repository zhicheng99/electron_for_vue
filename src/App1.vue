<template>
	<div id="app">
		<transition name="fade"
		            mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script> 

export default {
	name: 'app',
	components: {
	},
	methods:{
		resize:function(){
			let w = window.innerWidth;

			var u = navigator.userAgent;
			var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
			var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

			if(w <=750 || isAndroid || isIOS){
				this.$store.commit('updatePlatform', 'mobile');

			}else{
				this.$store.commit('updatePlatform', 'pc');
			}
		}
	},
	created() {
		
		//根据登录人员角色跳转不同的页面  上生产环境时再开启
		//config.jumpByInfo(this);
		this.resize();
		window.onresize = this.resize;


		
	},
	mounted(){

	},
	watch:{
		$route(to,from){
			setTimeout(()=>{ 
				this.$store.commit('updateScrollTop', 0);

				window.scrollTo(0,0);

			},200)

		}
	}	
}

</script>

<style lang="scss">
#nprogress .bar {
      background: #0071FE !important //自定义颜色
    }
body {
	margin: 0px;
	padding: 0px;
	/*background: url(assets/bg1.jpg) center !important;
		background-size: cover;*/
	// background: #1F2D3D;
	font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
	font-size: 14px;
	-webkit-font-smoothing: antialiased;
}

#app {
	position: absolute;
	top: 0px;
	bottom: 0px;
	width: 100%;
}

.el-submenu [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.el-menu-item [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.toolbar {
	background: #f2f2f2;
	padding: 10px;
	//border:1px solid #dfe6ec;
	margin: 10px 0px;
	.el-form-item {
		margin-bottom: 10px;
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}
</style>