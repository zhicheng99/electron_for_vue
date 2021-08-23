<template>
	<div>
		<el-dialog
		    title="查看视频"
		    :visible.sync="show"
		    width="800"
		    @close="close">

				<Player v-bind:video-url="videoUrl"></Player>

		    
		    <span slot="footer">
		        <el-button size="small" @click="close">取 消</el-button>
		    </span>
		</el-dialog>
	</div>
</template>
<script>
	import Player from './Player.vue'

	export default{
		components:{Player},
		props:['isShow','videoUrl'],
		data(){
			return {
				show:false
			}
		},
		methods:{
			close:function(){

				this.$emit('update:isShow',false);

			}
		},
		mounted(){

		},
		created(){
			
		},
		computed:{

		},
		watch:{
			'isShow':function(v){
				this.show = v;
			}

		}
	}

</script>
<style scoped>

</style>