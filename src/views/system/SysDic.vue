<template>
	<section class="m-t-10">
		<!--工具条-->
		<el-row class="m-b-20">
			<el-col :span="24" class="toolbar">
				<el-form :model="filters" :inline="true" ref="filters">
					 <el-form-item label="类型:" :label-width="toolLabelWidth" prop="s_type">
						 <el-input v-model="filters.s_type" placeholder="请输入类型" size="small"></el-input>
					 </el-form-item> 
					  <el-form-item label="标签名:" :label-width="toolLabelWidth" prop="s_label">
					 		<el-input v-model="filters.s_label" placeholder="请输入标签名" size="small"></el-input>
					 </el-form-item> 
					 <el-form-item>
					 	<el-button    @click.native.prevent="handleCurrentChange(1)" size="small" icon="el-icon-search">查询</el-button>
					 </el-form-item> 
					 <el-form-item>
					 		<el-button size="small" icon="el-icon-refresh" @click="$refs.filters.resetFields()">重置</el-button>
					 </el-form-item>
					<el-form-item>
						<el-button     @click.native.prevent="dialogAreaAddVisible=true" size="small" icon="el-icon-plus">添加字典</el-button>
					</el-form-item> 
				</el-form>
			</el-col>
	
		</el-row>
		
		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading"   style="width: 100%;" >
			
			<el-table-column type="index"  width="80" label="序号">
				<template slot-scope="scope"><span>{{scope.$index+(page - 1) * size + 1}} </span></template>
			</el-table-column>
			<el-table-column prop="type" label="类型" >
			</el-table-column>
			<el-table-column prop="label" label="标签" width="120"   >
			</el-table-column>
			<el-table-column prop="value" label="值" width="100"  >
			</el-table-column>
			<el-table-column prop="description" label="描述" >
			</el-table-column> 
			<el-table-column prop="createDate" label="创建时间"   width="160" >
			</el-table-column> 
			<el-table-column label="操作" width="260" fixed="right">
				<template slot-scope="scope"> 
				
					<el-button type="text" size="small" @click="handleCopy(scope.row)" icon="el-icon-plus" title="新增一个Type值">新增一个Type值</el-button> 
					 
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

		 <el-dialog title="新增字典" :visible.sync="dialogAreaAddVisible">
		 	<el-form :model="addForm" :rules="addFormRules" ref="addForm">
		 		<el-form-item label="类型:" :label-width="formLabelWidth" prop="type">
		 			<el-input v-model="addForm.type" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="标签:" :label-width="formLabelWidth" prop="label">
		 			<el-input v-model="addForm.label" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="值:" :label-width="formLabelWidth"  prop="value">
		 			<el-input v-model="addForm.value" size="small"></el-input>
		 		</el-form-item> 
		 		 
		 		<el-form-item label="描述:" :label-width="formLabelWidth">
		 			<el-input type="textarea" v-model="addForm.description" size="small"></el-input>
		 		</el-form-item>
		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button @click="dialogAreaAddVisible = false" size="small">取消</el-button>
		 			<el-button type="primary" @click="addSubmit" size="small">保存</el-button>
		 		</el-form-item>
		 	</el-form>
		 	
		 </el-dialog> 
		 
		 <el-dialog title="新增一个Type值" :visible.sync="copyFormVisible">
		 	<el-form :model="copyForm" :rules="addFormRules" ref="copyForm">
		 		<el-form-item label="类型:" :label-width="formLabelWidth" prop="type">
		 			<el-input v-model="copyForm.type" disabled size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="标签:" :label-width="formLabelWidth" prop="label">
		 			<el-input v-model="copyForm.label" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="值:" :label-width="formLabelWidth"  prop="value">
		 			<el-input v-model="copyForm.value" size="small"></el-input>
		 		</el-form-item> 
		 		 
		 		<el-form-item label="描述:" :label-width="formLabelWidth">
		 			<el-input type="textarea" v-model="copyForm.description" size="small"></el-input>
		 		</el-form-item>
		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button @click="copyFormVisible = false" size="small">取消</el-button>
		 			<el-button type="primary" @click="copySubmit" size="small">保存</el-button>
		 		</el-form-item>
		 	</el-form>
		 	
		 </el-dialog> 
		 
		 <el-dialog title="编辑" :visible.sync="editFormVisible">
		 	<el-form :model="editForm" :rules="addFormRules" ref="editForm">
				<el-form-item label="类型:" :label-width="formLabelWidth" prop="type">
					<el-input v-model="editForm.type"></el-input>
				</el-form-item> 
				<el-form-item label="标签:" :label-width="formLabelWidth" prop="label">
					<el-input v-model="editForm.label"></el-input>
				</el-form-item> 
				<el-form-item label="值:" :label-width="formLabelWidth" prop="value">
					<el-input v-model="editForm.value"></el-input>
				</el-form-item> 
				 
				<el-form-item label="描述:" :label-width="formLabelWidth">
					<el-input type="textarea" v-model="editForm.description"></el-input>
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

	export default {
		data() {
			return {
				toolLabelWidth:config.toolbarLabelWidth,
				formLabelWidth:config.dialogLabelWidth,
				filters: {
					s_label: '',
					s_type:'' 
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
					value:'',
					label:'',
					type:'',
					description:''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					value: [
						{ required: true, message: '请输入字典值', trigger: 'blur' }
					],
					label: [
						{ required: true, message: '请输入标签名称', trigger: 'blur' }
					],
					type: [
						{ required: true, message: '请输入类型', trigger: 'blur' }
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
					value:'',
					label:'',
					type:'',
					description:''
				}

			}
		},
		methods: {  
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
					page:this.page,
					limit:this.size,

					s_type:this.filters.s_type,
					s_label:this.filters.s_label
				}
				this.$post('/admin/system/dict/list',params).then((res)=>{
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
					//NProgress.start();
					let para = { id: id };
					
					
					this.$post('/admin/system/dict/deleteById',para).then(({code,obj})=>{
							 
							 
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
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
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
							
							this.$post('/admin/system/dict/edit',para).then(({code,obj})=>{
									 
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
							
							this.$post('/admin/system/dict/add',para).then(({code,obj})=>{
									 
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
			copySubmit: function () {
				this.$refs.copyForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.copyForm);
							
							this.$post('/admin/system/dict/add',para).then(({code,obj})=>{
									 
										this.addLoading = false;
										
										(code == '00') && 
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										this.$refs['addForm'].resetFields();
										this.copyFormVisible = false;
										this.getUsers(); 
							})
							 
						});
					}
				});
			},
			 
		},
		mounted() {
			this.getUsers();
			
		}
	}

</script>

<style scoped>

</style>