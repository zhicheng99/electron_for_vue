<template>
	<div>

		<el-dialog
		    title="文件查看"
		    :visible.sync="show"
		    width="800"
		    @close="close">
		    <ShowPdf
		v-bind:file-id="fileId"
		v-bind:file-name="fileName"
		v-bind:file-url="fileUrl"
		v-bind:article-id="articleId"
		></ShowPdf>
		    
		    <span slot="footer">
		        <el-button size="small" @click="close">取 消</el-button>
		    </span>
		</el-dialog>

		
	</div>
</template>
<script>
	import ShowPdf from './ShowPdf.vue'
	export default{
		components:{ShowPdf},
		props:['isShow','fileId','articleId','fileName','fileUrl'],
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
				console.log(v);
				this.show =v;
			}

		}
	}

</script>
<style scoped>

</style>