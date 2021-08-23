<template>
	<div>
		<el-dialog
		    :title="'拾取坐标 http://api.map.baidu.com/lbsapi/getpoint/index.html'"
		    :visible.sync="show" 
		    width="1100px"
		    @close="close">
		     <el-form :model="form" ref="form" label-width="80px">
		     	<div>
		     		<iframe width="100%" height="600" src="http://api.map.baidu.com/lbsapi/getpoint/index.html" frameborder="0"></iframe>
		     	</div>
		         <el-form-item>
		             <el-button size="small" @click="close">取消</el-button>
		         </el-form-item>
		     </el-form>
		</el-dialog>
	</div>
</template>
<script>
	export default{
		components:{},
		props:['isShow'],
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