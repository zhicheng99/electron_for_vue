<template>
	<div>
		<el-dialog
		    title="导入村落"
		    :visible.sync="show" 
		    @close="close"> 
			<div v-loading="loading">
				  <el-form :model="addForm" :rules="addFormRules" ref="addForm" :label-width="formLabelWidth">
			        <!-- <el-form-item label="手机：" prop="tel">
			            <el-input size="small" maxlength="11" v-model="addForm.tel" @input="inputTel"></el-input>
			        </el-form-item>
			        <el-form-item label="姓名：" prop="name">
			            <el-input size="small" v-model="addForm.name" disabled></el-input>
			        </el-form-item>
			        <el-form-item label="邀请码：" prop="shareCode">
			            <el-input size="small" v-model="addForm.shareCode" disabled></el-input>
			        </el-form-item> -->


			       
			        <el-form-item label="数据文件:" :label-width="formLabelWidth" prop="file">
						<el-upload class="upload-demo" ref="upload" action="/offices/api/admin/system/uploadFile"
						 :file-list="file" 
						 limit="1"
						 :auto-upload="false" 
						 :on-remove="fileRemove" 
						 :on-change="fileChange" 
						 :on-success="uploadSuccess"
						 :before-upload="beforeUpload"
						 :on-exceed="overNum"

			
						 accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
							<el-button slot="trigger" size="small" icon="el-icon-upload">选择文件</el-button>
							<!-- <el-button size="small" @click="submitUpload" icon="el-icon-upload2">上传</el-button> -->
			
							<div slot="tip" class="el-upload__tip">只允许上传xls/xlsx文件</div>
						</el-upload>
						<div style="height: 0; overflow: hidden;">
							<el-input v-model="addForm.file" placeholder=""></el-input>
						</div>
			
			
						<span class="tip" @click="down"><i class="el-icon-download"></i>下载模板</span>
			
			
					</el-form-item>
					  
			        <el-form-item>
			            <el-button size="small" @click="close">取消</el-button>
			            <el-button size="small" type="primary" @click="onSubmit">提交</el-button>
			        </el-form-item>
			    </el-form>	
			</div>
		  


		</el-dialog>
	</div>
</template>
<script>
	import config from '../../common/js/config.js'

	export default{
		components:{},
		props:['isShow','callBack'],
		data(){
			return {
				toolLabelWidth:config.toolbarLabelWidth,
				formLabelWidth:config.dialogLabelWidth,
				loading:false,
				show:false,
				packageList:[],
				selectObj:null,
				addForm:{ 

					file:'', 
				},
				addFormRules:{
					file:[
						{ required: true, message: '请上传导入文件', trigger: 'blur' },
					], 	

				}
			}
		},
		methods:{
			down:function(){
				this.$downXls('/admin/village/downLoadVillageModel',{})
			},
			fileRemove:function(){
				this.addForm.file = '';
			},
			fileChange:function(file){

				this.addForm.file = file.raw;

				this.$nextTick(()=>{

					this.$refs.addForm.validateField('file');

				})
			},
			 
			close:function(){
				this.$emit('update:isShow',false);
			}, 
			onSubmit:function(){
				this.$refs.addForm.validate(valid=>{

					if(valid){

						this.loading = true;
						this.$postWithFile('/admin/village/batchSave',this.addForm).then(({code})=>{

							(code == '00') && 
							(()=>{

								this.$message({
									message:'导入成功！',
									type:'success'
								})

								this.callBack && this.callBack();

								this.$refs.addForm.resetFields();

								this.loading = false;
 


								this.close();

							})()
						}).catch(()=>{

							this.$nextTick(()=>{
								
								this.loading = false;
							})

						})
					}


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
			}

		}
	}

</script>
<style scoped>
.tip{
	color: #FC9153;
}
</style>