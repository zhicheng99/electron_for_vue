<template>
	<section class="m-t-10">
		<!--工具条-->
		<el-row>
			<el-col :span="24" class="toolbar m-b-20" >
				<el-form :inline="true" :model="filters" ref="filters">
					<el-form-item label="任务名称:" :label-width="toolbarLabelWidth" prop="s_name">
						<el-input v-model="filters.s_name" size="small" placeholder="请输入任务名称"></el-input>
					</el-form-item>
					<el-form-item label="任务状态:" :label-width="toolbarLabelWidth" prop="s_status">
						<el-select v-model="filters.s_status" size="small">
							<el-option v-for="item in TaskStateDic"
							  :key="item.id"
							  :label="item.label"
							  :value="item.value*1"
							  ></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button  v-on:click="handleCurrentChange(1)" size="small" icon="el-icon-search">查询</el-button>
					</el-form-item>
					<el-form-item>
							<el-button size="small" icon="el-icon-refresh" @click="$refs.filters.resetFields()">重置</el-button>
					</el-form-item>
					<el-form-item>
						 
						<el-button   size="small" icon="el-icon-plus" @click="addFormVisible = true">增加</el-button>
						 
					</el-form-item> 
				</el-form>
			</el-col>
			
		</el-row>
		
		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" >
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="80" label="序号">
				<template slot-scope="scope"><span>{{scope.$index+(page - 1) * size + 1}} </span></template>
			</el-table-column>
			<el-table-column prop="name" label="计划任务名称" width="180" >
			</el-table-column>
			<el-table-column prop="cron" label="计划表达式" width="120"    >
			</el-table-column>
			<el-table-column prop="targetBean" label="执行的类" width="200"  >
			</el-table-column> 
			<el-table-column prop="trgetMethod" label="执行的方法"  width="200">
			</el-table-column> 
			<el-table-column label="状态"  >
				<template slot-scope="scope">
					<div v-if="scope.row.status == '1'">暂停</div>
					<div v-if="scope.row.status == '0'">正常</div>

				</template>
			</el-table-column> 
			<el-table-column prop="remarks" label="说明"  >
			</el-table-column> 
			<el-table-column prop="createTime" label="创建时间"  width="200">
			</el-table-column> 
			
			
			<el-table-column label="操作" width="340" fixed="right">
				<template slot-scope="scope"> 
					<el-button type="text" size="small" @click="handleEdit(scope.row)" icon="el-icon-edit" title="编辑">编辑</el-button> 
					<el-button type="text" size="small"  @click="handleExc(scope.row.id)" icon="el-icon-refresh" title="立即执行">立即执行</el-button>

					<el-button type="text" size="small" v-if="scope.row.status == '1'" @click="handleStart(scope.row.id)" icon="iconfont icon-kaishi" title="恢复"> 恢复</el-button>
					<el-button type="text" size="small" v-if="scope.row.status == '0'" @click="handleStop(scope.row.id)" icon="iconfont icon-zanting " title="暂停"> 暂停</el-button>

					<el-button type="text" size="small" @click="handleDel(scope.row.id)" icon="el-icon-delete" title="删除">删除</el-button>
					
					 
					
					<router-link :to="{path:'taskLogManage',query:{jobId:scope.row.id,jobName:scope.row.name}}"  class="m-l-10">
						<el-button type="text" size="small" icon="el-icon-document" title="查看日志">查看日志</el-button>
						
					</router-link>
					
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar m-t-20" v-if="users.length>0">
			<el-button @click="batchRemove" size="small" :disabled="this.sels.length===0" icon="el-icon-delete">批量删除</el-button>
			<el-button @click="batchStart" size="small" :disabled="this.sels.length===0" icon="iconfont icon-kaishi"> 批量恢复</el-button>

			
			
			<el-pagination background layout="total,prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		 <el-dialog title="增加计划任务" :visible.sync="addFormVisible">
		 	<el-form :model="addForm" :rules="addFormRules" ref="addForm">
		 		<el-form-item label="计划任务名称:" :label-width="formLabelWidth" prop="name">
		 			<el-input v-model="addForm.name" size="small"></el-input>
		 		</el-form-item> 
				<el-form-item label="计划表达式:" :label-width="formLabelWidth" prop="cron">
					<el-input v-model="addForm.cron" size="small"></el-input>
				</el-form-item> 
				<el-form-item label="执行的类:" :label-width="formLabelWidth" prop="targetBean">
					<el-input v-model="addForm.targetBean" size="small"></el-input>
				</el-form-item> 
				<el-form-item label="执行方法:" :label-width="formLabelWidth" prop="trgetMethod">
					<el-input v-model="addForm.trgetMethod" size="small"></el-input>
				</el-form-item> 
				
				 
				<el-form-item label="状态:" :label-width="formLabelWidth" prop="state"> 
					 
					<el-select v-model="addForm.status"   size="small">
						<el-option v-for="item in TaskStateDic"
						  :key="item.id"
						  :label="item.label"
						  :value="item.value"
						  ></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="计划任务说明:" :label-width="formLabelWidth">
					 <el-input type="textarea" v-model="addForm.remarks" size="small"></el-input>
				</el-form-item>
		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button @click="addFormVisible = false" size="small">取消</el-button>
		 			<el-button type="primary" size="small" @click="addSubmit">保存</el-button>
		 		</el-form-item>
		 	</el-form>
		 	
		 </el-dialog> 
		 
		 <el-dialog title="编辑区域" :visible.sync="editFormVisible">
		 	<el-form :model="editForm" :rules="addFormRules" ref="editForm">
		 		<el-form-item label="计划任务名称:" :label-width="formLabelWidth" prop="name">
		 			<el-input v-model="editForm.name" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="计划表达式:" :label-width="formLabelWidth" prop="cron">
		 			<el-input v-model="editForm.cron" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="执行的类:" :label-width="formLabelWidth" prop="targetBean">
		 			<el-input v-model="editForm.targetBean" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="执行方法:" :label-width="formLabelWidth" prop="trgetMethod">
		 			<el-input v-model="editForm.trgetMethod" size="small"></el-input>
		 		</el-form-item> 
		 		
		 		 
		 		<el-form-item label="数据状态:" :label-width="formLabelWidth" prop="state"> 
		 			 
		 			<el-select v-model="editForm.status"   size="small">
		 				<el-option v-for="item in TaskStateDic"
		 				  :key="item.id"
		 				  :label="item.label"
		 				  :value="item.value*1"
		 				  ></el-option>
		 			</el-select>
		 		</el-form-item>
		 		<el-form-item label="计划任务说明:" :label-width="formLabelWidth">
		 			 <el-input type="textarea" v-model="editForm.remarks" size="small"></el-input>
		 		</el-form-item>
		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button @click="editFormVisible = false" size="small">取消</el-button>
		 			<el-button type="primary" size="small" @click="editSubmit">保存</el-button>
		 		</el-form-item>
		 	</el-form>
		 	
		 </el-dialog> 
		 
 
		
	</section>
</template>

<script> 
	import config from '../../common/js/config.js'
	import dic from '../../common/js/dic.js'
 

	export default {
		data() {
			return {
				toolbarLabelWidth:config.toolbarLabelWidth,
				formLabelWidth:config.dialogLabelWidth1,
				filters: {
					s_name: '', 
					s_status:''
				},
				TaskStateDic:[],
				stateListDic:[],
				areaList:[],
				users: [],
				total: 0,
				page: 1,
				size:10,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					name:'',
					cron:'',
					targetBean:'',
					trgetMethod:'',
					status:'',
					remarks:''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					 
					name: [
						{ required: true, message: '请输入计划任务名称', trigger: 'blur' }
					],
					cron: [
						{ required: true, message: '请输入计划表达式', trigger: 'blur' }
					],
					targetBean: [
						{ required: true, message: '请输入执行的类', trigger: 'blur' }
					],
					trgetMethod: [
						{ required: true, message: '请输入执行的方法', trigger: 'blur' }
					],
					status: [
						{ required: true, message: '请选择计划任务状态', trigger: 'blur' }
					],
				},
				
				
				
				dialogAreaAddVisible:false,
				
				//新增界面数据
				addForm: {
					name:'',
					cron:'',
					targetBean:'',
					trgetMethod:'',
					status:'',
					remarks:''
				}

			}
		},
		methods: { 
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			handleStop(id){
				this.$confirm('确认要暂停任务吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids:id };
					this.$post('/quartzTask/paush',para).then(({code,obj}) => {
						this.listLoading = false;
						//NProgress.done();
						(code == '00') && 
						this.$message({
							message: '操作成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {
				
				});
			},
			handleStart(id){
				this.$confirm('确认要开始任务吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids:id };
					this.$post('/quartzTask/resume',para).then(({code,obj}) => {
						this.listLoading = false;
						//NProgress.done();
						
						(code == '00') && 
						this.$message({
							message: '操作成功',
							type: 'success'
						}) && 
						this.getUsers();
					});
				}).catch(() => {
				
				});
			},
			handleExc(id){
				this.$confirm('确认要立即执行该任务吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids:[id] };
					this.$post('/quartzTask/run',para).then(({code,obj}) => {
						this.listLoading = false;
						//NProgress.done();
						(code == '00') && 
						this.$message({
							message: '操作成功',
							type: 'success'
						}) && 
						this.getUsers();
					});
				}).catch(() => {
				
				});
			},
			//获取用户列表
			getUsers() {
				this.listLoading = true; 
				let params = {
					page:this.page,
					limit:this.size,
					s_name:this.filters.s_name,
					s_status:this.filters.s_status
				}
				this.$post('/quartzTask/list',params).then((res)=>{
						let { msg, code, data,count } = res;
						 
							this.listLoading = false;
							this.total = count;
							// this.page = Math.ceil(count/this.page);
							this.users = data;	
						 
						
				}) 
			},
			batchResume: function () {
				var ids = this.sels.map(item => item.id).toString();

				this.$confirm('确认要恢复所选的计划任务吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					this.$post('/quartzTask/resume',para).then(({code,obj}) => {
						this.listLoading = false;
						//NProgress.done();
						(code == '00') && 
						this.$message({
							message: '操作成功',
							type: 'success'
						}) && 
						this.getUsers();
					});
				}).catch(() => {
			
				});
			},
			handleResume: function (id) {
				this.$confirm('确认要恢复该计划任务吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: [id] };
					this.$post('/quartzTask/resume',para).then(({code,obj}) => {
						this.listLoading = false;
						//NProgress.done();
						(code == '00') && 
						this.$message({
							message: '操作成功',
							type: 'success'
						}) && 
						this.getUsers();
					});
				}).catch(() => {
			
				});
			},
			//删除
			handleDel: function (id) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: id };
					this.$post('/quartzTask/delete',para).then(({code,obj}) => {
						this.listLoading = false;
						//NProgress.done();
						(code == '00') && 
						this.$message({
							message: '删除成功',
							type: 'success'
						}) && 
						this.getUsers();
					});
				}).catch(() => {

				});
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
							this.$post('/quartzTask/edit',para).then(({code,obj}) => {
								this.editLoading = false;
								//NProgress.done();
								(code == '00') && 
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
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
							this.$post('/quartzTask/add',para).then(({code,obj}) => {
								this.addLoading = false;
								//NProgress.done();
								(code == '00') && 
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.dialogAreaAddVisible = false;
								this.getUsers();
							});
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
					this.$post('/quartzTask/delete',para).then(({code,obj}) => {
						this.listLoading = false;
						//NProgress.done();
						
						(code == '00') && 
						this.$message({
							message: '删除成功',
							type: 'success'
						}) && 
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//批量恢复
			batchStart: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认恢复选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids }; 
					
					this.$post('/quartzTask/resume',para).then(({code,obj}) => {
						this.listLoading = false;
						//NProgress.done();
						
						(code == '00') && 
						this.$message({
							message: '操作成功',
							type: 'success'
						}) && 
						this.getUsers();
					});
				}).catch(() => {
			
				});
			},
		},
		mounted() {
			this.getUsers(); 
			
			dic.TaskState().then(res=>{
				let { msg, code, data } = res;
				 
					this.TaskStateDic = data;	 
			})
		}
	}

</script>

<style scoped>

</style>