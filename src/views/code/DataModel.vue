<template>
	<section class="m-t-10">
		<!--工具条-->
		<el-row>
			<el-col :span="24" class="toolbar m-b-20" >
				<el-form :inline="true" :model="filters" ref="filters">
					<!-- <el-form-item label="地区编号:" :label-width="toolbarLabelWidth" prop="code">
						<el-input v-model="filters.code" size="small" placeholder="请输入地区编号"></el-input>
					</el-form-item>
					<el-form-item label="地区名称:" :label-width="toolbarLabelWidth" prop="name">
						<el-input v-model="filters.name" size="small" placeholder="请输入地区名称"></el-input>
					</el-form-item>  
					<el-form-item>
						<el-button  v-on:click="handleCurrentChange(1)" size="small" icon="el-icon-search">查询</el-button>
					</el-form-item>
					<el-form-item>
							<el-button size="small" icon="el-icon-refresh" @click="$refs.filters.resetFields()">重置</el-button>
					</el-form-item> -->
					
					<el-button size="small" class="pull-right" icon="el-icon-plus" @click.native.prevent="addFormVisible=true" >增加</el-button>
					
				</el-form>
			</el-col>
		</el-row>
		<!-- <el-row>
			<el-col :span="24" class="toolbar  m-b-10" >
				<el-form :inline="true"   class="text-right">
					<el-form-item>
						<el-button class="pull-right" size="small" icon="el-icon-plus" @click.native.prevent="addFormVisible=true" >增加</el-button>
					</el-form-item> 
				</el-form>
			</el-col>
		</el-row> -->
		
		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			
			<el-table-column type="index" width="80" label="序号">
				<template slot-scope="scope"><span>{{scope.$index+(page - 1) * size + 1}} </span></template>
			</el-table-column>
			<el-table-column prop="serverIp" label="数据库地址">
			</el-table-column>
			<el-table-column prop="dataType" label="数据库类型">
			</el-table-column>
			<el-table-column prop="dataDrive" label="数据驱动">
			</el-table-column>
			<el-table-column prop="username" label="用户名">
			</el-table-column>
			<el-table-column prop="password" label="密码">
			</el-table-column>
			<el-table-column prop="dataName" label="数据库名称">
			</el-table-column>
			<el-table-column label="操作" width="220" fixed="right">
				<template slot-scope="scope"> 
					 <el-button type="text" size="small" @click="handleEdit(scope.row)" icon="el-icon-edit" title="编辑">编辑</el-button>
					  <el-button type="text" size="small" @click="handleDel(scope.row.id)" icon="el-icon-delete" title="删除">删除</el-button>
					  <el-button type="text" size="small" @click="handleModel(scope.row)" icon="el-icon-share" title="模型模型">数据模型</el-button> 
					   
				</template>
			</el-table-column>
			
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar m-t-20" v-if="users.length>0">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination background layout="total,prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		 <el-dialog title="增加区域" :visible.sync="addFormVisible">
		 	<el-form :model="addForm" :rules="addFormRules" ref="addForm">
		 		<el-form-item label="数据库地址:" :label-width="formLabelWidth" prop="serverIp">
		 			<el-input v-model="addForm.serverIp" size="small"></el-input>
		 		</el-form-item>
		 		<el-form-item label="数据类型:" :label-width="formLabelWidth" prop="dataType">
		 			<el-input v-model="addForm.dataType" size="small"></el-input>
		 		</el-form-item>
				<el-form-item label="数据驱动:" :label-width="formLabelWidth" prop="dataDrive">
					<el-input v-model="addForm.dataDrive" size="small"></el-input>
				</el-form-item>
				<el-form-item label="用户名:" :label-width="formLabelWidth" prop="username">
					<el-input v-model="addForm.username" size="small"></el-input>
				</el-form-item>
				<el-form-item label="密码:" :label-width="formLabelWidth" prop="password">
					<el-input v-model="addForm.password" size="small"></el-input>
				</el-form-item>
				<el-form-item label="数据库名称:" :label-width="formLabelWidth" prop="dataName">
					<el-input v-model="addForm.dataName" size="small"></el-input>
				</el-form-item>
		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button @click="addFormVisible = false" size="small">取消</el-button>
		 			<el-button type="primary" @click="addSubmit" size="small">保存</el-button>
		 		</el-form-item>
		 	</el-form>
		 	
		 </el-dialog> 
		 
		 <el-dialog title="编辑区域" :visible.sync="editFormVisible">
		 	<el-form :model="editForm" :rules="addFormRules" ref="editForm">
				<el-form-item label="数据库地址:" :label-width="formLabelWidth" prop="serverIp">
					<el-input v-model="editForm.serverIp" size="small"></el-input>
				</el-form-item>
				<el-form-item label="数据类型:" :label-width="formLabelWidth" prop="dataType">
					<el-input v-model="editForm.dataType" size="small"></el-input>
				</el-form-item>
				<el-form-item label="数据驱动:" :label-width="formLabelWidth" prop="dataDrive">
					<el-input v-model="editForm.dataDrive" size="small"></el-input>
				</el-form-item>
				<el-form-item label="用户名:" :label-width="formLabelWidth" prop="username">
					<el-input v-model="editForm.username" size="small"></el-input>
				</el-form-item>
				<el-form-item label="密码:" :label-width="formLabelWidth" prop="password">
					<el-input v-model="editForm.password" size="small"></el-input>
				</el-form-item>
				<el-form-item label="数据库名称:" :label-width="formLabelWidth" prop="dataName">
					<el-input v-model="editForm.dataName" size="small"></el-input>
				</el-form-item>
				
		 		
		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button @click="editFormVisible = false" size="small">取消</el-button>
		 			<el-button type="primary" @click="editSubmit" size="small">保存</el-button>
		 		</el-form-item>
		 	</el-form>
		 	
		 </el-dialog> 
		 
 
		
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
	import config from '../../common/js/config.js'
	import dic from '../../common/js/dic.js'

	export default {
		data() {
			return {
				formLabelWidth:config.dialogLabelWidth,
				toolbarLabelWidth:config.toolbarLabelWidth,

				filters: {
					name:'',
					code:'',
					// state:''
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
					serverIp:'',
					dataDrive:'com.mysql.jdbc.Driver',
					dataName:'',
					dataType:'MySql',
					password:'',
					username:''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					serverIp: [
						{ required: true, message: '请输入数据库地址', trigger: 'blur' }
					],
					username: [
						{ required: true, message: '请输入用户名', trigger: 'blur' }
						
					],
					password:{ required: true, message: '请输入密码', trigger: 'blur' }
				},
				
				 
				//新增界面数据
				addForm: {
					serverIp:'',
					dataDrive:'com.mysql.jdbc.Driver',
					dataName:'',
					dataType:'MySql',
					password:'',
					username:''
				}

			}
		},
		methods: {   
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				this.listLoading = true;
				let params = {
					page:this.page,
					limit:this.size, 
					// state:this.filters.state,
				}
				
				this.$post('/sys/sysDataModel/list',params).then((res)=>{
						let { msg, code, data,count } = res;
						 
							this.listLoading = false;
							this.total = count;
							// this.page = Math.ceil(count/this.page);
							this.users = data;	 
						
				})


 
			},
			//删除
			handleDel: function (id) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: id };
					
					this.$post('/sys/sysDataModel/delete',para).then(({code,obj})=>{
						 
							this.listLoading = false;
							
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
			handleModel:function(row){
				// this.$router.push({ path: '/dataModelDetail',params:{'id':id} });
				
				this.$router.push({ path: 'dataModelDetail', query: { id:row.id,dataName: row.dataName }});
			},
			//显示编辑界面
			handleEdit: function (row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			}, 
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							
							this.$post('/sys/sysDataModel/edit',para).then(({code,obj})=>{
									 
										this.editLoading = false;
										
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
							 
							this.$post('/sys/sysDataModel/add',para).then(({code,obj})=>{
									 
										this.addLoading = false;
										
										(code == '00') && 
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										
										this.$refs['addForm'].resetFields();
										this.addFormVisible = false;
										this.getUsers(); 
							})
							
							
							
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then(({code,obj}) => {
						this.listLoading = false;
						
						(code == '00') && 
						this.$message({
							message: '删除成功',
							type: 'success'
						}) && 
						this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getUsers(); 
			
		}
	}

</script>

<style scoped>

</style>