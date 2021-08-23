<template>
	<section class="m-t-10 ">
		<!--工具条-->
		<el-row class="m-b-20">
			<el-col :span="24" class="toolbar">
				<el-form :model="filters" :inline="true" ref="filters">
					 <el-form-item label="登录名："  prop="loginName">
						 <el-input v-model="filters.loginName" placeholder="请输入登录名" size="small"></el-input>
					 </el-form-item>  
					  <el-form-item label="用户名称："  prop="nickName">
						 <el-input v-model="filters.nickName" placeholder="请输入用户名称" size="small"></el-input>
					 </el-form-item>  
					 <el-form-item>
					 	<el-button    @click.native.prevent="handleCurrentChange(1)" size="small" icon="el-icon-search">查询</el-button>
					 </el-form-item> 
					 <el-form-item>
					 		<el-button size="small" icon="el-icon-refresh" @click="$refs.filters.resetFields()">重置</el-button>
					 </el-form-item>
					<el-form-item>
						<el-button     @click.native.prevent="dialogAreaAddVisible=true" size="small" icon="el-icon-plus">添加用户</el-button>
					</el-form-item> 

					<el-form-item>
						<el-button onclick="javascript:history.back(-1)" size="small" >返回</el-button>
					</el-form-item> 
				</el-form>
			</el-col>
	
		</el-row>
		
		<!--列表-->
		<el-table class="roleUsers_table" :data="users" highlight-current-row v-loading="listLoading" :row-class-name="tableRowClassName"  style="width: 100%;" >
			
			<el-table-column type="index"  width="60" label="序号">
				<template slot-scope="scope"><span>{{scope.$index+(page - 1) * size + 1}} </span></template>
			</el-table-column>
			<el-table-column prop="loginName" label="登录名称" >
			</el-table-column>
			<el-table-column prop="nickName" label="用户名称" >
			</el-table-column> 
			<!-- <el-table-column prop="email" label="邮箱"  >
			</el-table-column> 
			<el-table-column prop="tel" label="电话"   width="160" >
			</el-table-column>  -->
			<!-- <el-table-column prop="lockedNameRef" label="用户状态"   width="160" >
			</el-table-column> 
			<el-table-column prop="userTypeNameRef" label="用户类型"   width="160" >
			</el-table-column> -->
			<el-table-column prop="createDate" label="创建时间"   width="160" >
			</el-table-column>
			<el-table-column label="操作" width="120" fixed="right">
				<template slot-scope="scope" v-if="scope.row.id !=1"> 
				 
					 
					 <el-button type="text" size="small" @click="handleEdit(scope.row)" icon="el-icon-edit" title="编辑">编辑</el-button>
					  <el-button type="text" size="small" @click="handleDel(scope.row.id)" icon="el-icon-delete" title="删除">删除</el-button>

				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar m-t-20" v-if="users.length>0">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination background layout="total,prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		 <el-dialog title="添加用户" :visible.sync="dialogAreaAddVisible">
		 	<el-form :model="addForm" :rules="addFormRules" ref="addForm">
		 		<el-form-item label="登录名:" :label-width="formLabelWidth" prop="loginName">
		 			<el-input v-model="addForm.loginName" size="small" placeholder="请输入邮箱地址"></el-input>
		 		</el-form-item>  
		 		<el-form-item label="用户名称:" :label-width="formLabelWidth" prop="nickName">
		 			<el-input v-model="addForm.nickName" size="small" placeholder="请输入用户名称"></el-input>
		 		</el-form-item> 
		 		<!-- <el-form-item label="邮箱:" :label-width="formLabelWidth" prop="email">
		 			<el-input v-model="addForm.email" size="small"></el-input>
		 		</el-form-item>  -->
		 		<!-- <el-form-item label="手机:" :label-width="formLabelWidth" prop="tel">
		 			<el-input v-model="addForm.tel" size="small"></el-input>
		 		</el-form-item>  -->
		 		<el-form-item label="用户类型:" :label-width="formLabelWidth" prop="userType" style="display: none">
		 			<el-select v-model="addForm.userType" placeholder="" size="small">
		 			    <el-option v-for="item in [{id:1,label:'系统管理员',value:1},{id:2,label:'内部员工',value:2}]"
		 			        :key="item.value"
		 			        :label="item.label"
		 			        :value="item.value">
		 			    </el-option>
		 			</el-select>
		 			
		 		</el-form-item> 
				<!-- <el-form-item label="用户角色:" :label-width="formLabelWidth" prop="roleId">
					 
					<el-select v-model="addForm.roleId" placeholder="" multiple size="small">
					    <el-option v-for="item in roleList" 
					        :key="item.id"
					        :label="item.name"
					        :value="item.id">
					    </el-option>
					</el-select>

		 		</el-form-item>  -->

		 		<!--  
		 		<el-form-item label="是否启用:" :label-width="formLabelWidth">
		 			<el-switch size="small"
					  v-model="addForm.locked" 
					  :active-value="false"
					  :inactive-value="true"
					  >
					</el-switch>
		 		</el-form-item> -->
 

		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button @click="dialogAreaAddVisible = false" size="small">取消</el-button>
		 			<el-button type="primary" @click="addSubmit" size="small">保存</el-button>
		 		</el-form-item>
		 	</el-form>
		 	
		 </el-dialog> 
		  
		 
		 <el-dialog title="编辑" :visible.sync="editFormVisible">
		 	<el-form :model="editForm" :rules="addFormRules" ref="editForm">
				<el-form-item label="登录名:" :label-width="formLabelWidth" prop="loginName">
		 			<el-input v-model="editForm.loginName" size="small" placeholder="请输入邮箱地址"></el-input>
		 		</el-form-item>  
		 		<el-form-item label="用户名称:" :label-width="formLabelWidth" prop="nickName">
		 			<el-input v-model="editForm.nickName" size="small" placeholder="请输入用户名称"></el-input>
		 		</el-form-item> 
		 		<!-- <el-form-item label="邮箱:" :label-width="formLabelWidth" prop="email">
		 			<el-input v-model="editForm.email" size="small"></el-input>
		 		</el-form-item>  -->
		 		<!-- <el-form-item label="手机:" :label-width="formLabelWidth" prop="tel">
		 			<el-input v-model="editForm.tel" size="small"></el-input>
		 		</el-form-item>  -->
		 		<el-form-item label="用户类型:" :label-width="formLabelWidth" prop="userType" style="display: none">
		 			<el-select v-model="editForm.userType" placeholder="" size="small">
		 			    <el-option v-for="item in [{id:1,label:'系统管理员',value:1},{id:2,label:'内部员工',value:2}]"
		 			        :key="item.value"
		 			        :label="item.label"
		 			        :value="item.value+''">
		 			    </el-option>
		 			</el-select>
		 			
		 		</el-form-item> 
				<!-- <el-form-item label="用户角色:" :label-width="formLabelWidth" prop="roleId">
					 
					<el-select v-model="editForm.roleId" placeholder="" multiple size="small">
					    <el-option v-for="item in roleList" 
					        :key="item.id"
					        :label="item.name"
					        :value="item.id">
					    </el-option>
					</el-select>

		 		</el-form-item>  -->

		 		 
		 		<!-- <el-form-item label="是否启用:" :label-width="formLabelWidth">
		 			<el-switch size="small"
					  v-model="editForm.locked" 
					  :active-value="false"
					  :inactive-value="true"
					  >
					</el-switch>
		 		</el-form-item> -->
				 
				 
		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button @click="editFormVisible = false" size="small">取消</el-button>
		 			<el-button type="primary" @click="editSubmit" size="small">保存</el-button>
		 		</el-form-item>
		 	</el-form>
		 	
		 </el-dialog> 
		 
 
		
	</section>
</template>

<script> 
	import config from '../../common/js/config.js'
	import PermissionMenu from '../../components/PermissionMenu.vue';

	export default {
		components:{
			PermissionMenu
		},
		data() {
			return {
				toolLabelWidth:config.toolbarLabelWidth,
				formLabelWidth:config.dialogLabelWidth,
				filters: {
					roleIds:'',
					loginName:'',
					nickName:''
				},
				users: [],
				total: 0,
				page: 1,
				size:10,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false, 
				//编辑界面数据
				editForm: {
					id:'',
					loginName:'',
					nickName:'',
					email:'',
					locked:false,
					tel:'',
					userType:1,
					roleIds:'',
					roleId:[]
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					loginName: [
						{ required: true, message: '请输入登录名！', trigger: 'blur' },
						{ validator:this.validateEmail, trigger: 'blur'},

					],
					userType: [
						{ required: true, message: '请选择用户类型！', trigger: 'blur' }
					],
					nickName:[
						{ required: true, message: '请选择用户名称！', trigger: 'blur' }
					],
					// email: [
					// 	{ required: true, message: '请输入用户邮箱！', trigger: 'blur' },
					// 	{ validator:this.validateEmail, trigger: 'blur'},
					// ],
					roleId: [
						{ required: true, message: '请选择用户角色！', trigger: 'blur' }
					]
				},
				
				copyFormVisible:false,
				copyForm:{
					value:'',
					label:'',
					type:'',
					description:''
				},
				
				
				
				dialogAreaAddVisible:false,
				
				//新增界面数据
				addForm: {
					loginName:'',
					nickName:'',
					email:'',
					locked:false,
					tel:'',
					userType:1,
					roleIds:'',
					roleId:[]
				},

				roleList:[]

			}
		},
		methods: {  
			tableRowClassName:function({row, rowIndex}){
				if(row.id == 1){
					return 'hide';
				}else{
					return ""
				}
			},
			validateEmail:function(rule,value,callback){

				 if((value != '') && ((value+'').indexOf('@')>-1)){

                    if(!(/^([a-zA-Z\d])((\w|-)+\.?)+@([a-zA-Z\d]+\.)+[a-zA-Z]{2,6}$/.test(value+''))){
                        callback('请输入正确的邮箱！');
                    }
                }else{
					callback('请输入正确的邮箱！');

                }
                callback();
			},
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				this.listLoading = true;
				let params = {
					current:this.page,
					size:this.size,
					...this.filters
				}
				this.$post('/admin/system/user/roleUserList',params).then((res)=>{
						 let { msg, code, obj,count } = res;

							this.listLoading = false;
							this.total = obj.total;
							// this.page = Math.ceil(count/this.page);
							this.users = obj.records;	
						 
						
				}).catch(()=>{
					this.listLoading = false;


				})
			},
			//删除
			handleDel: function (id) {
				this.$confirm('确认删除该用户吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					//NProgress.start();
					let para = { id: id,roleId:this.addForm.roleIds };
					
					
					this.$post('/admin/system/user/deleteRoleUser',para).then(({code,obj})=>{
							 
							 
								(code == '00') && 
								this.$message({
									message: '删除成功',
									type: 'success'
								}) && 
								this.getUsers(); 
					})
					
					
					 
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (row) {

				this.$post('/admin/system/user/detail ',{id:row.id}).then(({code,obj})=>{
					(code == '00') && 
					(()=>{

						this.editForm = Object.assign({}, {
							email:obj.email,
							id:obj.id,
							locked: obj.locked,
							loginName: obj.loginName,
							nickName: obj.nickName,
							roleIds: obj.roleIds,
							tel: obj.tel,
							userType: obj.userType,
							roleId:obj.roleIds.indexOf(',')>-1?obj.roleIds.split(','):(obj.roleIds!=''?[obj.roleIds]:[])
						});

						this.editFormVisible = true;
						

					})()
				})

				// this.editForm = Object.assign({}, row);
			},
			//显示编辑界面
			handleCopy: function (row) {
				this.copyFormVisible = true;
				this.copyForm = Object.assign({}, {type:row.type});
			}, 
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm); 
							para.roleIds = para.roleId.join(',');

							
							this.$post('/admin/system/user/edit3',para).then(({code,obj})=>{
									 
										this.addLoading = false;
										
										(code == '00') && 
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										
										this.$refs['editForm'].resetFields();
										this.editFormVisible = false;
										this.getUsers(); 
							})
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm); 
							// para.roleIds = para.roleId.join(',');
							
							this.$post('/admin/system/user/add3',para).then(({code,obj})=>{
									 
										this.addLoading = false;
										
										(code == '00') && 
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										
										this.$refs['addForm'].resetFields();
										this.dialogAreaAddVisible = false;
										this.getUsers(); 
							})
							 
						});
					}
				});
			},
			getRoles:function(){
				this.$post('/admin/system/role/roleList',{}).then(({code,obj})=>{
					(code == '00') && 
					(this.roleList = obj);
				})
			}
			 
		},
		mounted() {

			this.filters.roleIds = this.$route.query.id;
			this.addForm.roleIds = this.$route.query.id;


			this.getUsers(); 
			
		
			}
	}

</script>

<style scoped>

</style>
<style>
	.roleUsers_table .hide{
		display: none;
	}
</style>