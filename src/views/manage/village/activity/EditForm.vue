<template>
	<div>
		<el-dialog
		    title="添加"
		    :visible.sync="show"
		    @close="close"> 

		    <el-form :model="addForm" :rules="formRules" ref="form" label-width="100px">
		        <el-form-item label="标题：" prop="title">
		            <el-input size="small" v-model="addForm.title" placeholder="请输入标题"></el-input>
		        </el-form-item>
		        <el-form-item label="图片：" prop="imageUrl">
		        	<UploadImg v-if="show" 
		 			v-bind:max-num="'1'" 
		 			v-bind:upload-img.sync="addForm.imageUrl"
		 			v-bind:piece-size="1024000"
		 			v-bind:is-cut="true"
					v-bind:fixed-number="'16:10'"
		 			></UploadImg>
		 			<div class="tip"><i class="el-icon-warning"></i> 图片宽高比：16:10</div>

		        </el-form-item>
		        <el-form-item label="跳转地址：" prop="jumpUrl">
		            <el-input size="small" v-model="addForm.jumpUrl" placeholder="请输入跳转地址"></el-input>
		        </el-form-item>
		        <el-form-item label="排序：" prop="sort">
		        	<el-input-number size="small" v-model="addForm.sort" controls-position="right" :min="0"></el-input-number>
		        </el-form-item>
		        <el-form-item>
		            <el-button  size="small" @click="close">取消</el-button>
		            <el-button size="small" type="primary" @click="onSubmit" :loading="doing">确认</el-button>
		        </el-form-item>
		    </el-form>
		</el-dialog>
	</div>
</template>
<script>
	import UploadImg from '../../../../components/UploadImgChunk.vue'

	export default{
		components:{UploadImg},
		props:['isShow','rowId','callBack'],
		data(){
			return {
				show:false,
				addForm:{
					// id:'',//	否	string	id 新增时不传 编辑时必传
					title:'',//	是	string	活动标题
					imageUrl:'',//	是	string	图片地址
					jumpUrl:'',//	否	string	跳转地址
					state:'',//	是	string	状态
					sort:0,//	是	string	排序
				},
				formRules:{
					title:[
						{ required: true, message: '请输入标题', trigger: 'blur' }
					],
					imageUrl:[
						{ required: true, message: '请上传图片', trigger: 'blur' }
					]

				},
				doing:false
			}
		},
		methods:{
			close:function(){
				this.$emit('update:isShow',false);
			},
			onSubmit:function(){	

				this.$refs.form.validate(valid=>{
					if(valid){


						this.doing = true;
						this.$post('/admin/activity/save',this.addForm).then(({code})=>{

							(code == '00') && (()=>{

								this.$message({
									message:'编辑成功！',
									type:'success'
								})

								this.callBack && this.callBack();
								this.doing = false;
								this.$refs.form.resetFields();
								this.close();

							})()

						}).catch(()=>{
								this.doing = false;

						})


					}
				})

			},
			getDetail:function(id){
				this.$post('/admin/activity/query',{id:id}).then(({code,obj})=>{
					(code == '00') && (()=>{

						this.addForm = {
							...this.addForm,
							...obj
						}

						delete this.addForm.createDate;
						delete this.addForm.updateDate;

					})()
				})
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
			},
			'rowId':function(v){
				if(v!=''){
					this.getDetail(v);
				}
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