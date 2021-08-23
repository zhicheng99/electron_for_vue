<template>
	<section class="m-t-10">
		<!--工具条-->
		<el-row>
			<el-col :span="24" class="toolbar m-b-20" >
				<el-form :inline="true" :model="filters" ref="filters">
					<el-form-item label="表名:" :label-width="toolbarLabelWidth" prop="s_name">
						<el-input v-model="filters.s_name" size="small" placeholder="数据表名称"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button  v-on:click="handleCurrentChange(1)" size="small" icon="el-icon-search">查询</el-button>
					</el-form-item>
					<el-form-item>
							<el-button size="small" icon="el-icon-refresh" @click="$refs.filters.resetFields()">重置</el-button>
					</el-form-item>
					
					<el-form-item>
							<el-button size="small" icon="el-icon-download" @click="toDownloadFile()">下载源码</el-button>
					</el-form-item>
					
					<el-button size="small" class="pull-right" type="primary" onclick="history.back(-1)" >返回</el-button>
					
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
			<el-table-column
			  type="selection"
			  width="55">
			</el-table-column>
			<el-table-column type="index" width="60" label="序号">
				<template slot-scope="scope"><span>{{scope.$index+(page - 1) * size + 1}} </span></template>
			</el-table-column>
			<el-table-column prop="name" label="表名">
			</el-table-column>
			<el-table-column prop="tableRows" label="数据量">
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间">
			</el-table-column>
			<el-table-column prop="updateTime" label="更新时间">
			</el-table-column>
			
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar m-t-20" v-if="users.length>0">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination background layout="total,prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		 


		 <el-dialog title="下载源码" :visible.sync="addFormVisible">
		 	<el-form :model="addForm" :rules="addFormRules" ref="addForm">
		 		<el-form-item label="包路径:" :label-width="formLabelWidth" prop="moduleParent">
		 			<el-input v-model="addForm.moduleParent" size="small"></el-input>
		 		</el-form-item>
		 		<el-form-item label="模块名:" :label-width="formLabelWidth" prop="moduleName">
		 			<el-input v-model="addForm.moduleName" size="small"></el-input>
		 		</el-form-item>
		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button @click="addFormVisible = false" size="small">取消</el-button>
		 			<el-button type="primary" @click="downloadFile" size="small">下载源码</el-button>
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
					s_name:'',
					s_table_schema:''
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
				addForm: {
					id:'',
					moduleParent:'com.wicrecend',
					moduleName:'base'
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					moduleParent: [
						{ required: true, message: '请输入包路径!', trigger: 'blur' }
					],
					moduleName: [
						{ required: true, message: '请输入模块名!', trigger: 'blur' }
						
					]
				},
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
					s_tableSchema:this.$route.query.dataName,
					s_name:this.filters.s_name
				}
				
				this.$post('/admin/system/table/list',params).then((res)=>{
						let { msg, code, data,count } = res;
						 
							this.listLoading = false;
							this.total = count;
							// this.page = Math.ceil(count/this.page);
							this.users = data;	 
						
				})


 
			},
			//显示编辑界面
			handleEdit: function (row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			}, 
			
			selsChange: function (sels) {
				this.sels = sels;
				console.log(this.sels);
				console.log(this.sels.length);
			},
			toDownloadFile:function(){
				if(this.sels.length==0){
					this.$message({
						message: '请选择要下载源码的表信息!',
						type: 'info'
					});
				}else{
					this.addFormVisible = true;
				}
			},
			downloadFile:function(){
				if(this.sels.length==0){
					this.$message({
						message: '请选择要下载源码的表信息!',
						type: 'info'
					});
				}else{
					
					let param={
						id:this.filters.id,
						moduleParent:this.addForm.moduleParent,
						moduleName:this.addForm.moduleName,
						baseTablesStr:this.sels.map(item=>{return item.name}).toString()
					};
					this.$downZip('/admin/system/table/download',param);

					this.addFormVisible = false;
				}
			}
		},
		mounted() {
			this.filters.s_table_schema = this.$route.query.dataName;
			this.filters.id=this.$route.query.id;
			console.log(this.$route.query.dataName);
			this.getUsers(); 
			
		}
	}

</script>

<style scoped>

</style>