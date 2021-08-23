<template>
	<section class="m-t-10">
		 <el-row>
		 	<el-col :span="24" class="toolbar m-b-20" >
		 		<el-form :inline="true" :model="filters" ref="filters">
		 			<el-form-item label="任务名称:" :label-width="toolbarLabelWidth" prop="s_name">
		 				<el-input v-model="filters.s_name" size="small" placeholder="请输入任务名称"></el-input>
		 			</el-form-item>
		 			
		 			<el-form-item>
		 				<el-button  v-on:click="handleCurrentChange(1)" size="small" icon="el-icon-search">查询</el-button>
		 			</el-form-item>
		 			<el-form-item>
		 					<el-button size="small" icon="el-icon-refresh" @click="$refs.filters.resetFields()">重置</el-button>
		 			</el-form-item>
		 			<el-button size="small" class="pull-right" type="primary" onclick="history.back(-1)" >返回</el-button>
		 			
		 		</el-form>
		 	</el-col>
		 </el-row>
		
		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" >
		    <!-- <el-table-column type="selection" width="55">
		    </el-table-column>	 -->
			<el-table-column type="index" width="80" label="序号">
				<template slot-scope="scope"><span>{{scope.$index+(page - 1) * size + 1}} </span></template>
			</el-table-column>
			<el-table-column prop="name" label="计划任务名称" width="180" >
			</el-table-column>
			<el-table-column prop="targetBean" label="执行的类"   >
			</el-table-column>  
			
			<el-table-column prop="trgetMethod" label="执行的方法"   >
			</el-table-column> 
			<el-table-column prop="times" label="执行时间"   >
			</el-table-column> 
			<el-table-column prop="createTime" label="创建时间"  >
			</el-table-column> 
			 
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar" v-if="users.length>0">
			<!-- <el-button @click="batchRemove" size="small" :disabled="this.sels.length===0" icon="el-icon-delete">批量删除</el-button> -->
			<!-- <el-button @click="batchStart" size="small" :disabled="this.sels.length===0" icon="iconfont icon-kaishi">批量恢复</el-button> -->

			
			
			<el-pagination background layout="total,prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
 
		 
 
		
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
				},
				jobId:'',
				TaskStateDic:[],
				stateListDic:[],
				areaList:[],
				users: [],
				total: 0,
				page: 1,
				size:10,
				listLoading: false,
				sels: [],//列表选中列

				

			}
		},
		methods: { 
			exportXls(){
				alert('导出')
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
					page:this.page,
					limit:this.size,
					name:this.filters.s_name
				}
				this.$post('/quartzTaskLog/list',params).then((res)=>{
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
							message: '删除成功',
							type: 'success'
						}) && 
						this.getUsers();
					});
				}).catch(() => {
			
				});
			},
		},
		mounted() {
			this.jobId = this.$route.query.jobId;
			this.filters.s_name = this.$route.query.jobName;
			this.getUsers(); 
			 
		}
	}

</script>

<style scoped>

</style>