<template>
	<section class="m-t-10 ">
		<!--工具条-->
		<el-row class="m-b-20">
			<el-col :span="24" class="toolbar">
				<el-form :model="filters" :inline="true" ref="filters">
					 <el-form-item  prop="s_content" label="评论内容">
						 <el-input v-model="filters.s_content" placeholder="请输入评论内容" size="small"></el-input>
					 </el-form-item>  
					  <el-form-item  prop="s_isAdminReply" label="是否回复">
					  	 <el-select v-model="filters.s_isAdminReply" placeholder="选择是否回复" size="small">
					  	     <el-option v-for="item in [{id:1,label:'是',value:true},{id:2,label:'否',value:false}]"
					  	         :key="item.id"
					  	         :label="item.label"
					  	         :value="item.value">
					  	     </el-option>
					  	 </el-select>
					 </el-form-item>  
					 <el-form-item>
					 	<el-button    @click.native.prevent="handleCurrentChange(1)" size="small" icon="el-icon-search">查询</el-button>
					 </el-form-item> 
					 <el-form-item>
					 		<el-button size="small" icon="el-icon-refresh" @click="$refs.filters.resetFields()">重置</el-button>
					 </el-form-item> 
				</el-form>
			</el-col>
	
		</el-row>
		
		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading"   style="width: 100%;" >
			
			<el-table-column type="index"  width="60" label="序号">
				<template slot-scope="scope"><span>{{scope.$index+(page - 1) * size + 1}} </span></template>
			</el-table-column>
			<el-table-column label="评论内容" >
				<template slot-scope="scope"> 
						<el-button type="text" size="mini" @click="showCode(scope.row.content)">查看</el-button>

					</template>
			</el-table-column>
			<el-table-column prop="ip" label="IP" width="120"   >
			</el-table-column> 
			<el-table-column prop="system" label="操作系统"  >
			</el-table-column> 
			<el-table-column prop="browser" label="浏览器"   width="160" >
			</el-table-column> 
			<el-table-column  label="管理员是否回复"   width="160" >
					<template slot-scope="scope"> 
						{{scope.row.adminReply?'是':'否'}}
				</template>
			</el-table-column> 
			<el-table-column prop="userTypeNameRef" label="管理员回复内容"   width="160" >
				<template slot-scope="scope"> 
						<el-button type="text" size="mini" @click="showCode(scope.row.replyContent)">查看</el-button>

				</template>
			</el-table-column> 
			<el-table-column label="操作" width="120" fixed="right">
				<template slot-scope="scope"> 
				 
					 
					 <el-button type="text" size="small" @click="handleEdit(scope.row)" icon="el-icon-edit" title="回复">回复</el-button>
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
		 			<el-input v-model="addForm.loginName" size="small"></el-input>
		 		</el-form-item>  
		 		<el-form-item label="昵称:" :label-width="formLabelWidth" prop="nickName">
		 			<el-input v-model="addForm.nickName" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="邮箱:" :label-width="formLabelWidth" prop="email">
		 			<el-input v-model="addForm.email" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="手机:" :label-width="formLabelWidth" prop="tel">
		 			<el-input v-model="addForm.tel" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="用户类型:" :label-width="formLabelWidth" prop="userType">
		 			<el-select v-model="addForm.userType" placeholder="" size="small">
		 			    <el-option v-for="item in [{id:1,label:'系统管理员',value:1},{id:2,label:'内部员工',value:2}]"
		 			        :key="item.value"
		 			        :label="item.label"
		 			        :value="item.value">
		 			    </el-option>
		 			</el-select>
		 			
		 		</el-form-item> 
				<el-form-item label="用户角色:" :label-width="formLabelWidth" prop="roleId">
					 
					<el-select v-model="addForm.roleId" placeholder="" multiple size="small">
					    <el-option v-for="item in roleList"
					        :key="item.id"
					        :label="item.name"
					        :value="item.id">
					    </el-option>
					</el-select>

		 		</el-form-item> 

		 		 
		 		<el-form-item label="是否启用:" :label-width="formLabelWidth">
		 			<el-switch size="small"
					  v-model="addForm.locked" 
					  :active-value="false"
					  :inactive-value="true"
					  >
					</el-switch>
		 		</el-form-item>
 

		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button @click="dialogAreaAddVisible = false" size="small">取消</el-button>
		 			<el-button type="primary" @click="addSubmit" size="small">保存</el-button>
		 		</el-form-item>
		 	</el-form>
		 	
		 </el-dialog> 
		  
		 
		 <el-dialog title="回复" :visible.sync="editFormVisible">
		 	<el-form :model="editForm" :rules="addFormRules" ref="editForm">
				<el-form-item label="评论内容:" :label-width="formLabelWidth" prop="content">
		 			<el-input v-model="editForm.content" size="small" :disabled="true"></el-input>
		 		</el-form-item>  
		 		<el-form-item label="IP:" :label-width="formLabelWidth" prop="ip">
		 			<el-input v-model="editForm.ip" size="small" :disabled="true"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="操作系统:" :label-width="formLabelWidth" prop="system">
		 			<el-input v-model="editForm.system" size="small" :disabled="true"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="浏览器:" :label-width="formLabelWidth" prop="browser">
		 			<el-input v-model="editForm.browser" size="small" :disabled="true"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="回复内容:" :label-width="formLabelWidth">
		 			 <quill-editor  ref="textEditor" placeholder="" v-model="editForm.replyContent" :options="editorOption">
					</quill-editor>
		 			
		 		</el-form-item> 
				 
		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button @click="editFormVisible = false" size="small">取消</el-button>
		 			<el-button type="primary" @click="editSubmit" size="small">保存</el-button>
		 		</el-form-item>
		 	</el-form>
		 	
		 </el-dialog> 
		 
 
		 <CommentDetail
	  v-bind:is-show="show"
	  v-bind:params-code="paramsCode"
	  v-bind:set-val="setCodeVisible">
	  </CommentDetail>


	</section>
</template>

<script> 
	import config from '../../common/js/config.js'
	import PermissionMenu from '../../components/PermissionMenu.vue';

	import CommentDetail from '../../components/CommentDetail.vue'



	import { quillEditor } from 'vue-quill-editor'
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'

	export default {
		components:{
			PermissionMenu,
			quillEditor,
			CommentDetail
		},
		data() {
			return {
				toolLabelWidth:config.toolbarLabelWidth,
				formLabelWidth:config.dialogLabelWidth,
				filters: {
					s_content:'',
					s_isAdminReply: '',
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
					content:'',
					ip:'',
					system:'',
					browser:'',
					replyContent:''

					
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					loginName: [
						{ required: true, message: '请输入登录名', trigger: 'blur' }
					],
					userType: [
						{ required: true, message: '请选择用户类型', trigger: 'blur' }
					],
					roleId: [
						{ required: true, message: '请选择用户角色', trigger: 'blur' }
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
					userType:'',
					roleIds:'',
					roleId:[]
				},

				roleList:[],
				editorOption: {
					placeholder: '请输入回复内容',
				     modules: {
				      toolbar: [
				        ['bold', 'italic', 'underline', 'strike'],
				        ['blockquote'],
				        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
				        // [{ 'script': 'sub' }, { 'script': 'super' }],
				        [{ 'indent': '-1' }, { 'indent': '+1' }],
				        [{ 'size': ['small', false, 'large', 'huge'] }],
				        // [{ 'color': [] }, { 'background': [] }],
				        // ['clean'],
				        [{ 'align': [] }],
				      ],
					 }
				},

				show:false,
			paramsCode:''

			}
		},
		methods: {  
			 setCodeVisible:function(){
			  this.show = false;
		  },
		  showCode:function(code){
			  this.paramsCode = code,
			  this.show = true;
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
					s_content:this.filters.s_content,
					s_isAdminReply: this.filters.s_isAdminReply,
				}
				this.$post('/blogComment/list',params).then((res)=>{
						 let { msg, code, data,count } = res;

							this.listLoading = false;
							this.total = count;
							// this.page = Math.ceil(count/this.page);
							this.users = data;	
						 
						
				}) 
			},
			//删除
			handleDel: function (id) {
				this.$confirm('确认删除该评论吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					//NProgress.start();
					let para = { id: id };
					
					
					this.$post('/blogComment/delete',para).then(({code,obj})=>{
							 
							 
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

				

				this.editForm =  Object.assign({},row);
				this.editFormVisible = true;


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

							
							this.$post('/blogComment/adminReplay',para).then(({code,obj})=>{
									 
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
							para.roleIds = para.roleId.join(',');
							
							this.$post('/system/user/add2',para).then(({code,obj})=>{
									 
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
							
							this.$post('/system/dict/add',para).then(({code,obj})=>{
									 
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
			getRoles:function(){
				this.$post('system/role/roleList',{}).then(({code,obj})=>{
					(code == '00') && 
					(this.roleList = obj);
				})
			}
			 
		},
		mounted() {
			this.getUsers();

			this.getRoles()
			
		
			}
	}

</script>

<style scoped>

</style>