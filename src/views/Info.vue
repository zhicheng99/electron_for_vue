<template> 
	<section class="m-t-10 padding-20" style="background: #fff;">
		<el-form :model="addForm" :rules="addFormRules" ref="addForm">
		 		<el-form-item label="用户名:" :label-width="formLabelWidth" prop="loginName">
		 			<el-input v-model="addForm.loginName" size="small"></el-input>
		 		</el-form-item>  
		 		<el-form-item label="昵称:" :label-width="formLabelWidth" prop="nickName">
		 			<el-input v-model="addForm.nickName" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="手机号码:" :label-width="formLabelWidth" prop="tel">
		 			<el-input v-model="addForm.tel" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="邮箱:" :label-width="formLabelWidth" prop="email">
		 			<el-input v-model="addForm.email" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="自我介绍:" :label-width="formLabelWidth">
		 			<el-input type="textarea" v-model="addForm.remarks" placeholder=""></el-input>
		 				
		 		</el-form-item> 
				 
 

		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button type="primary" @click="addSubmit" size="small">保存</el-button>
		 		</el-form-item>
		 	</el-form>
	</section>
</template>
<script>
	import config from '../common/js/config.js'

	export default{
		data(){
			return {
				toolLabelWidth:config.toolbarLabelWidth,
				formLabelWidth:config.dialogLabelWidth,

				addForm:{
					id:'',
					loginName:'',
					nickName:'',
					tel:'',
					email:'',
					remarks:'',
				},
				addFormRules:{
					loginName:[
						{ required: true, message: '请输入用户名', trigger: 'blur' }

					]
				}
			}
		},
		methods:{
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm); 
							
							this.$post('/admin/system/user/saveUserinfo',para).then(({code,obj})=>{
									 
										this.addLoading = false;
										
										(code == '00') && 
										this.$message({
											message: '修改成功',
											type: 'success'
										});
										
							})
							 
						});
					}
				});
			},
		},
		mounted(){

			var obj =JSON.parse(localStorage.getItem('user'));

			this.addForm = Object.assign({},{
				id:obj.id,
				loginName:obj.loginName,
				nickName:obj.nickName,
				tel:obj.tel,
				email:obj.email,
				remarks:obj.remarks,
			})
			console.log(obj);

		}
	}
</script>