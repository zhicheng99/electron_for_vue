<template> 
	<section class="m-t-10 padding-20" style="background: #fff;">
		<el-form :model="addForm" :rules="addFormRules" ref="addForm">
		 		<el-form-item label="用户名:" :label-width="formLabelWidth" prop="loginName">
		 			<el-input v-model="addForm.loginName" size="small" :disabled="true"></el-input>
		 		</el-form-item>  
		 		<el-form-item label="旧密码:" :label-width="formLabelWidth" prop="oldPwd">
		 			<el-input type="password" v-model="addForm.oldPwd" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="新密码:" :label-width="formLabelWidth" prop="newPwd">
		 			<el-input type="password"v-model="addForm.newPwd" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="确认密码:" :label-width="formLabelWidth" prop="confirmPwd">
		 			<el-input type="password" v-model="addForm.confirmPwd" size="small"></el-input>
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

			var validatePass = (rule, value, callback) => {            
                              if (value !== this.addForm.newPwd) {
                                callback('两次输入密码不一致!');
                              } else {
                                callback();
                              }
                      };
			return {
				toolLabelWidth:config.toolbarLabelWidth,
				formLabelWidth:config.dialogLabelWidth,

				addForm:{
					loginName:'', 
				},
				addFormRules:{
					oldPwd:[
						{ required: true, message: '请输入旧密码', trigger: 'blur' }
					],
					newPwd:[
						{ required: true, message: '请输入新密码', trigger: 'blur' },
						{ min: 6,  message: '密码长度不能小于6位'},
					],
					confirmPwd:[
						{ required: true, message: '请输入确认密码', trigger: 'blur' },
						{ min: 6,  message: '密码长度不能小于6位'},
						{validator: validatePass, trigger: 'blur' }

					],
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
							
							this.$post('/admin/system/user/changePassword',para).then(({code,obj})=>{
									 
										this.addLoading = false;
										
										(code == '00') && 
										(()=>{
											this.$message({
												message: '修改成功',
												type: 'success'
											});

											return true; 

										})() && 

										this.$post('/admin/systemLogout',{}).then(res=>{  //测试用
											//this.$fetch('/didipark/logout?jumpto=index',{}).then(res=>{             //正式用

												
												
												localStorage.removeItem('user');
												localStorage.removeItem('receivingType');
												localStorage.removeItem('authorityMenu');

												localStorage.removeItem('selectRoleId');
												
												//正式用
												//location.href = res;
												
												
												//测试用
												this.$router.push({ path: '/login' });
										})
										 
							})
							 
						});
					}
				});
			},
		},
		mounted(){

			var obj =JSON.parse(localStorage.getItem('user'));

			this.addForm = Object.assign({},{
				loginName:obj.loginName, 
			})
			console.log(obj);

		}
	}
</script>