<template>
	<div>
		<div class="wrapper " ref="wrapper1"  style="overflow: hidden;" v-loading="loading">
			<div class="content" ref="content">
				<div >
					<slot></slot>
				</div>

			</div>
		</div>
	</div>
</template>
<script>

	import BScroll from 'better-scroll'

	export default{
		components:{},
		props:[],
		data(){
			return {
				scroll:{},
				loading:true
			}
		},
		methods:{
			initScrollArea:function(){
				var area = this.$refs.content;

				// if(area.offsetHeight <= 100){

				// 	return false;
				// }

				this.$nextTick(()=>{

					this.scroll = new BScroll(this.$refs.wrapper1, {
							 //  	pullUpLoad: {
								//   threshold: -20 // 在上拉到超过底部 20px 时，触发 pullingUp 事件
								// },
							  	//开启点击事件 默认为false
							  	click:true,
							  	scrollbar: {
							  	 fade: false,
							  	 interactive: false // 1.8.0 新增
							  	},
							  	mouseWheel: {
							  	 speed: 20,
							  	 invert: false,
							  	 easeTime: 300
							  	},
							  	probeType:3

							    })

					this.loading = false;

				})
			}
		},
		mounted(){
			this.$nextTick(()=>{

				setTimeout(this.initScrollArea,300);

			});
		},
		created(){
			
		},
		computed:{

		},
		watch:{

		}
	}

</script>
<style scoped>

.wrapper{
	  position:absolute; 
	  left:0;
	  top:0;
	  right:0;
	  bottom: 0; 
	} 

</style>