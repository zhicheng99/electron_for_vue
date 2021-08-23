<template>
	<div>
		<el-input  placeholder="搜索全内容" v-model="key" class="input-with-select1" @keyup.enter.native="callBack" clearable style="margin-top:8px">
				    
				    <el-button slot="append" icon="el-icon-search" @click="callBack"></el-button>
				  </el-input>
	</div>
</template>
<script>
	export default{
		components:{},
		props:['callBack','searchText'],
		data(){
			return {
				key:''
			}
		},
		methods:{

		},
		mounted(){

		},
		created(){
			
		},
		computed:{

		},
		watch:{
			'key':function(v){
				this.$emit('update:searchText',v);
			}
		}
	}

</script>
<style scoped>

</style>
<style>
	
.input-with-select1 .el-input__inner::-webkit-input-placeholder, textarea::-webkit-input-placeholder{
	  
	  /*font-family: SourceHanSansCN-Heavy;*/
		font-size: 21px; 
		color: #DFDFDF; 
		position: relative;
		top:3px;

	}

	.input-with-select1 .el-input__inner:-moz-placeholder, textarea:-moz-placeholder {
	 /*font-family: SourceHanSansCN-Heavy;*/
		font-size: 21px; 
		color: #DFDFDF; 
		position: relative;
		top:3px;
	}

	.input-with-select1 .el-input__inner::-moz-placeholder, textarea::-moz-placeholder {
	  /*font-family: SourceHanSansCN-Heavy;*/
		font-size: 21px; 
		color: #DFDFDF; 
		position: relative;
		top:3px;
	}

	.input-with-select1 .el-input__inner:-ms-input-placeholder, textarea:-ms-input-placeholder {
	  /*font-family: SourceHanSansCN-Heavy;*/
		font-size: 21px; 
		color: #DFDFDF; 
		position: relative;
		top:3px;
	}

.input-with-select1 .el-input-group__append{
	background: transparent;
	    border: 1px solid #C3C3C3;
	    border-left:none;
	    border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
}

.input-with-select1 .el-icon-search{
	font-weight: bold;
	color:#DFDFDF;
}
</style>