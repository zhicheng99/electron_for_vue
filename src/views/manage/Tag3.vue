<template>
	<div>
		<!-- 合作行业 -->
		<el-row class="m-b-20">
			<el-col :span="24" class="toolbar">
				<el-form :model="filters" :inline="true" @submit.native.prevent ref="filters"> 
					 <el-form-item label="标签名:" :label-width="toolLabelWidth" prop="label">
					 	<el-input v-model="filters.label" placeholder="请输入标签名" size="small"></el-input>
					 </el-form-item>
					 <el-form-item label="标签组:" :label-width="toolLabelWidth" prop="tagGroup">
					 	<el-input v-model="filters.tagGroup" placeholder="请输入标签组名称" size="small"></el-input>
					 </el-form-item> 
					 <el-form-item>
					 	<el-button    @click.native.prevent="handleCurrentChange(1)" size="small" icon="el-icon-search">查询</el-button>
					 </el-form-item> 
					<el-form-item>
						<!-- <el-button     @click.native.prevent="dialogAreaAddVisible=true" size="small" icon="el-icon-plus">添加标签</el-button> -->

						<el-button  @click="addSubmit" size="small" icon="el-icon-plus">添加标签</el-button>
					</el-form-item> 
					 <el-form-item>
					 		<el-button size="small" icon="el-icon-refresh" @click="$refs.filters.resetFields()">重置</el-button>
					 </el-form-item>
				</el-form>
			</el-col>
	
		</el-row>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading"   style="width: 100%;" >
			
			<el-table-column type="index"  width="80" label="序号">
				<template slot-scope="scope"><span>{{scope.$index+(page - 1) * size + 1}} </span></template>
			</el-table-column>
			<!-- <el-table-column prop="type" label="类型" width="120">
			</el-table-column> -->
			<el-table-column prop="label" label="标签" >
			</el-table-column>
			<el-table-column prop="tagGroup" label="标签组" >
			</el-table-column>	
			<el-table-column prop="sort" label="排序" >
			</el-table-column>  
			<el-table-column prop="createDate" label="创建时间"   width="160" >
			</el-table-column> 
			<el-table-column label="操作" width="150" fixed="right">
				<template slot-scope="scope"> 
				 
					 
					 <el-button type="text" size="small" @click="handleEdit(scope.row)" icon="el-icon-edit" title="编辑">编辑</el-button>
					  <el-button type="text" size="small" @click="handleDel(scope.row.id)" icon="el-icon-delete" title="删除">删除</el-button>

				</template>
			</el-table-column>
		</el-table>

		<el-col :span="24" class="toolbar m-t-20" v-if="users.length>0">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination background layout="total,prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>


		<el-dialog title="新增标签" :visible.sync="dialogAreaAddVisible">
		 	<el-form :model="addForm" :rules="addFormRules" ref="addForm"> 
		 		<el-form-item label="标签名称:" :label-width="formLabelWidth" prop="label">
		 			<el-input v-model="addForm.label" size="small"></el-input>
		 		</el-form-item> 
		 		<!-- <el-form-item label="标签图标:" :label-width="formLabelWidth"  prop="cover">
		 			<UploadImg v-bind:max-num="'1'" v-bind:upload-img.sync="addForm.cover"></UploadImg>
					<div class="tip">
						<i class="el-icon-warning"></i>
						请选择图片上传,支持png,jpg,gif
					</div>
					<div style="height: 0; overflow: hidden;">
			 			<el-input v-model="addForm.cover" size="small"  :disabled="true"></el-input>

					</div>
		 		</el-form-item>  -->
		 		  
		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button @click="dialogAreaAddVisible = false" size="small">取消</el-button>
		 			<el-button type="primary" @click="addSubmit" size="small">保存</el-button>
		 		</el-form-item>
		 	</el-form>
		 	
		 </el-dialog> 
		 <el-dialog title="编辑标签" :visible.sync="editFormVisible">
		 	<el-form :model="editForm" :rules="addFormRules" ref="editForm"> 
		 		<el-form-item label="标签名称:" :label-width="formLabelWidth" prop="label">
		 			<el-input v-model="editForm.label" size="small"></el-input>
		 		</el-form-item>
		 		<el-form-item label="标签组名称:" :label-width="formLabelWidth" prop="tagGroup">
		 			<el-input v-model="editForm.tagGroup" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="标签排序:" :label-width="formLabelWidth" prop="sort">
		 			<el-input type="number" max="500" min="0" v-model="editForm.sort" size="small"></el-input>
		 		</el-form-item>
		 		<!-- <el-form-item label="标签图标:" :label-width="formLabelWidth"  prop="cover">
		 			<UploadImg v-bind:max-num="'1'" v-bind:upload-img.sync="editForm.cover"></UploadImg>
					<div class="tip">
						<i class="el-icon-warning"></i>
						请选择图片上传,支持png,jpg,gif
					</div>
					<div style="height: 0; overflow: hidden;">
			 			<el-input v-model="editForm.cover" size="small"  :disabled="true"></el-input>

					</div>
		 		</el-form-item>  -->
		 		  
		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button @click="editFormVisible = false" size="small">取消</el-button>
		 			<el-button type="primary" @click="editSubmit" size="small">保存</el-button>
		 		</el-form-item>
		 	</el-form>
		 	
		 </el-dialog> 



	</div>
</template>
<script>
	import config from '../../common/js/config.js'
	import UploadImg from '../../components/UploadImg.vue'

	export default{
		components:{
			UploadImg
		},
		props:[],
		data(){
			return {
				toolLabelWidth:config.toolbarLabelWidth,
				formLabelWidth:config.dialogLabelWidth,
				filters: {
					label:'',
					tagGroup:''
				},
				users: [],
				total: 0,
				page: 1,
				size:10,
				listLoading: false,
				sels: [],//列表选中列

				dialogAreaAddVisible:false,
				editFormVisible:false,
				addForm:{
					label:'',
					type:'4',
					cover:'',
					tagGroup:''
				},
				editForm:{
					label:'',
					type:'4',
					cover:'',
					tagGroup:'',
					sort:0
				},
				addFormRules:{
					label:[
						{ required: true, message: '请输入标签名', trigger: 'blur' }
					],
					cover:[
						{ required: true, message: '请上传标签图标', trigger: 'blur' }

					],
					sort:[
						{ required: true, message: '请输入标签排序', trigger: 'blur' }

					]
				}

			}
		},
		methods:{
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
					type:4,
					label:this.filters.label,
					tagGroup:this.filters.tagGroup
				}
				this.$post('/admin/caseData/tags/list',params).then((res)=>{
						 let { msg, code, data,count } = res;

							this.listLoading = false;
							this.total = count;
							// this.page = Math.ceil(count/this.page);
							this.users = data;	
						 
						
				}) 
			},
			addSubmit: function () {
				// this.$refs.addForm.validate((valid) => {
				// 	if (valid) {
				// 		this.$confirm('确认提交吗？', '提示', {}).then(() => {
				// 			this.addLoading = true;
				// 			//NProgress.start();
				// 			let para = Object.assign({}, this.addForm);
							
				// 			this.$post('/admin/caseData/tags/add',para).then(({code,obj})=>{
									 
				// 						this.addLoading = false;
										
				// 						(code == '00') && 
				// 						this.$message({
				// 							message: '提交成功',
				// 							type: 'success'
				// 						});
										
				// 						this.$refs['addForm'].resetFields();
				// 						this.dialogAreaAddVisible = false;
				// 						this.getUsers(); 
				// 			});
							 
				// 		});
				// 	}
				// });

				if(this.filters.label =='' || this.filters.label.length ==0){
					this.$message({
							message: '请输入标签名!',
							type: 'warning'
						});
				}else{
					this.addLoading = true;
					//NProgress.start();

					this.addForm.label = this.filters.label;
					this.addForm.tagGroup = this.filters.tagGroup;

					let para = Object.assign({}, this.addForm);
					
					this.$post('/admin/caseData/tags/add',para).then(({code,obj})=>{
							 
								this.addLoading = false;
								
								(code == '00') && 
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								
								// this.$refs['addForm'].resetFields();
								// this.dialogAreaAddVisible = false;
								this.getUsers(); 
					});
				}

				
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
							delete para.createDate;
							delete para.updateDate;
							
							this.$post('/admin/caseData/tags/edit',para).then(({code,obj})=>{
									 
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
			//删除
			handleDel: function (id) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					//NProgress.start();
					let para = { id: id };
					
					
					this.$post('/admin/caseData/tags/delete',para).then(({code,obj})=>{
							 
							 
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

		},
		mounted(){
			this.getUsers();

		},
		created(){
			
		},
		computed:{

		},
		watch:{

		}
	}

</script>
<style scoped>
.tip {
	font-size: 12px;
	line-height: 16px;
	color: #999;
}
.tip i {
	color: #fc9153;
}

</style>