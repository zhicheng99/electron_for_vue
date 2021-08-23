<template>
	<div>
		<el-dialog
		    title="视频封面"
		    :visible.sync="show"
		    width="300px"
		    @close="close"
		    :append-to-body="true"
		    > 
		    <el-form :model="form" ref="form" label-width="80px">
		        <el-form-item label="封面：" prop="url">
		        	<UploadImg v-if="show"
		 			v-bind:max-num="'1'" 
		 			v-bind:upload-img.sync="form.url"
		 			v-bind:piece-size="1024000"
		 			v-bind:is-cut="true"
					v-bind:fixed-number="'5:7'"
		 			></UploadImg>
		 			<div class="tip"><i class="el-icon-warning"></i> 图片宽高比：5:7</div>

		        </el-form-item>
		        <el-form-item>
		            <el-button size="small" @click="close">取消</el-button>
		            <el-button size="small" type="primary" @click="onSubmit" :disabled="form.url==''">确定</el-button>
		        </el-form-item>
		    </el-form>
		</el-dialog>
	</div>
</template>
<script>
	import UploadImg from './UploadImgChunk.vue'

	export default{
		components:{UploadImg},
		props:['isShow','videoCover'],
		data(){
			return {
				show:false,
				form:{
					url:''
				}

			}
		},
		methods:{
			close:function(){
				this.$emit('update:isShow',false)
			},
			onSubmit:function(){

				if(this.form.url !==''){
					this.$emit('update:videoCover',this.form.url);
					this.$refs.form.resetFields();
					this.close();
				}
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
.tip{
	font-size: 12px;
	line-height: 12px;
}
.tip i{
	color: #0166FF
}

</style>