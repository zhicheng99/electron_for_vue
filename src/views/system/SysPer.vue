<template>
	<div>
		<el-row class="m-t-10">
			<el-col :span="24" class="toolbar  m-b-20"> 
						<el-button  size="small" icon="el-icon-plus" class="pull-right" @click="addVisible=true">增加根菜单</el-button> 
			</el-col>
			
		</el-row>

		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" >
			
			<!-- 二级 -->

			<el-table-column type="expand">

		  <template slot-scope="props">


			 <el-table :data="props.row.children" :show-header="false" class="children"> 

			
			<!-- 三级 -->
			<el-table-column type="expand">
					<template slot-scope="props">
					 <el-table :data="props.row.children" :show-header="false"> 
						
						<el-table-column width="48"></el-table-column> 

					 	<el-table-column type="index" width="60" label="序号">
							<template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>
						</el-table-column>
					 	<el-table-column prop="name" label="菜单名称">
						</el-table-column>
						<el-table-column prop="vueHref" label="链接地址">
						</el-table-column>
						<el-table-column prop="permission" label="权限标识">
						</el-table-column>
						<el-table-column prop="sort" label="排序">
						</el-table-column>
						<el-table-column label="是否显示为菜单">
				<template slot-scope="scope">
					{{scope.row.isShow?'是':'否'}}
				</template>
			</el-table-column>
						<el-table-column prop="createDate" label="创建时间">
						</el-table-column>
						<el-table-column label="操作" width="200">
							<template slot-scope="scope">
								
								<!-- <el-button type="text" size="small" @click="handleCopy(scope.row)" icon="el-icon-plus" title="新增">新增</el-button>  -->
								<el-button type="text" size="small" @click="handleEdit(scope.row)" icon="el-icon-edit" title="编辑">编辑</el-button>
								  <el-button type="text" size="small" @click="handleDel(scope.row.id)" icon="el-icon-delete" title="删除">删除</el-button>
							</template>
						</el-table-column>
					 </el-table>
					  
				  </template> 


			</el-table-column>

			 	<el-table-column type="index" width="60" label="序号">
					<template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>
				</el-table-column>
			 	<el-table-column prop="name" label="菜单名称">
				</el-table-column>
				<el-table-column prop="vueHref" label="链接地址">
				</el-table-column>
				<el-table-column prop="permission" label="权限标识">
				</el-table-column>
				<el-table-column prop="sort" label="排序">
				</el-table-column>
				<el-table-column label="是否显示为菜单">
				<template slot-scope="scope">
					{{scope.row.isShow?'是':'否'}}
				</template>
			</el-table-column>
				<el-table-column prop="createDate" label="创建时间">
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template slot-scope="scope">
						
						<el-button type="text" size="small" @click="handleCopy(scope.row)" icon="el-icon-plus" title="新增">新增</el-button> 
						<el-button type="text" size="small" @click="handleEdit(scope.row)" icon="el-icon-edit" title="编辑">编辑</el-button>
						  <el-button type="text" size="small" @click="handleDel(scope.row.id)" icon="el-icon-delete" title="删除">删除</el-button>
					</template>
				</el-table-column>
			 </el-table>
			  
		  </template> 
		</el-table-column>
			
			<el-table-column type="index" width="60" label="序号">
				<template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>
			</el-table-column>
			<el-table-column prop="name" label="菜单名称">
			</el-table-column>
			<el-table-column prop="vueHref" label="链接地址">
			</el-table-column>
			<el-table-column prop="permission" label="权限标识">
			</el-table-column>
			<el-table-column prop="sort" label="排序">
			</el-table-column>
			<el-table-column label="是否显示为菜单">
				<template slot-scope="scope">
					{{scope.row.isShow?'是':'否'}}
				</template>
			</el-table-column>
			<el-table-column prop="createDate" label="创建时间">
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template slot-scope="scope">
					
					<el-button type="text" size="small" @click="handleCopy(scope.row)" icon="el-icon-plus" title="新增">新增</el-button> 
					<el-button type="text" size="small" @click="handleEdit(scope.row)" icon="el-icon-edit" title="编辑">编辑</el-button>
					  <el-button type="text" size="small" @click="handleDel(scope.row.id)" icon="el-icon-delete" title="删除">删除</el-button>
				</template>
			</el-table-column>
			
			
		</el-table>

		<el-dialog title="添加系统菜单" :visible.sync="addVisible">
		 	<el-form :model="addForm" :rules="addFormRules" ref="addForm">
		 		<el-form-item label="菜单名称:" :label-width="formLabelWidth" prop="name">
		 			<el-input v-model="addForm.name" size="small"></el-input>
		 		</el-form-item> 
		 		<!-- <el-form-item label="菜单地址:" :label-width="formLabelWidth" prop="href">
		 			<el-input v-model="addForm.href" size="small"></el-input>
		 		</el-form-item>  -->
		 		<el-form-item label="Vue菜单地址:" :label-width="formLabelWidth"  prop="vueHref">
		 			<el-input v-model="addForm.vueHref" size="small"></el-input>
		 		</el-form-item> 
		 		 <el-form-item label="菜单权限:" :label-width="formLabelWidth"  prop="permission">
		 			<el-input v-model="addForm.permission" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="是否显示为菜单:" :label-width="formLabelWidth">
		 			<el-switch size="small"
					  v-model="addForm.isShow" >
					</el-switch>
		 		</el-form-item>
		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button @click="addVisible = false" size="small">取消</el-button>
		 			<el-button type="primary" @click="addSubmit" size="small">保存</el-button>
		 		</el-form-item>
		 	</el-form>
		 </el-dialog> 


		 <el-dialog title="添加子菜单" :visible.sync="addChildVisible">
		 	<el-form :model="addChildForm" :rules="addFormRules" ref="addChildForm">
		 		<el-form-item label="父菜单名称:" :label-width="formLabelWidth" prop="parentName">
		 			<el-input v-model="addChildForm.parentName" size="small" :disabled="true"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="菜单名称:" :label-width="formLabelWidth" prop="name">
		 			<el-input v-model="addChildForm.name" size="small"></el-input>
		 		</el-form-item> 
		 		<!-- <el-form-item label="菜单地址:" :label-width="formLabelWidth" prop="href">
		 			<el-input v-model="addChildForm.href" size="small"></el-input>
		 		</el-form-item>  -->
		 		<el-form-item label="Vue菜单地址:" :label-width="formLabelWidth"  prop="vueHref">
		 			<el-input v-model="addChildForm.vueHref" size="small"></el-input>
		 		</el-form-item> 
		 		 <el-form-item label="菜单权限:" :label-width="formLabelWidth"  prop="permission">
		 			<el-input v-model="addChildForm.permission" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="是否显示为菜单:" :label-width="formLabelWidth">
		 			<el-switch size="small"
					  v-model="addChildForm.isShow" >
					</el-switch>
		 		</el-form-item>
		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button @click="addChildVisible = false" size="small">取消</el-button>
		 			<el-button type="primary" @click="addChildSubmit" size="small">保存</el-button>
		 		</el-form-item>
		 	</el-form>
		 </el-dialog> 


		 <el-dialog title="编辑系统菜单" :visible.sync="editVisible">
		 	<el-form :model="editForm" :rules="addFormRules" ref="editForm">
		 		<el-form-item label="菜单名称:" :label-width="formLabelWidth" prop="name">
		 			<el-input v-model="editForm.name" size="small"></el-input>
		 		</el-form-item> 
		 		<!-- <el-form-item label="菜单地址:" :label-width="formLabelWidth" prop="href">
		 			<el-input v-model="editForm.href" size="small"></el-input>
		 		</el-form-item>  -->
		 		<el-form-item label="Vue菜单地址:" :label-width="formLabelWidth"  prop="vueHref">
		 			<el-input v-model="editForm.vueHref" size="small"></el-input>
		 		</el-form-item> 
		 		 <el-form-item label="菜单权限:" :label-width="formLabelWidth"  prop="permission">
		 			<el-input v-model="editForm.permission" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="是否显示为菜单:" :label-width="formLabelWidth">
		 			<el-switch size="small"
					  v-model="editForm.isShow" >
					</el-switch>
		 		</el-form-item>
		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button @click="editVisible = false" size="small">取消</el-button>
		 			<el-button type="primary" @click="editSubmit" size="small">保存</el-button>
		 		</el-form-item>
		 	</el-form>
		 	
		 </el-dialog> 


	</div>
</template>
<script>
	import config from '../../common/js/config.js'

	export default{
		data(){
			return{
				toolLabelWidth:config.toolbarLabelWidth,
				formLabelWidth:config.dialogLabelWidth,
				listLoading:false,
				users:[],

				addVisible:false,
				addForm:{
					name:'',
					bgColor:'',
					href:'',
					vueHref:'',
					permission:'',
					icon:'',
					isShow:true
				},
				addFormRules:{
					name:[
					{ required: true, message: '请输入菜单名称', trigger: 'blur' }
					]
				},

				editVisible:false,
				editForm:{

				},

				addChildVisible:false,
				addChildForm:{
					parentId:'',
					name:'',
					bgColor:'',
					href:'',
					vueHref:'',
					permission:'',
					icon:'',
					isShow:true
				}


				
			}
		},
		methods:{
			selsChange:function(){

			},
			getTree:function(){
				this.$post('/admin/system/menu/treelist',{}).then(({code,data})=>{

					(code == '00') &&
					(this.users = data);

				})
			},
			handleEdit:function(row){
				this.editForm = Object.assign({},row);


				delete this.editForm.createId;
				delete this.editForm.updateDate;
				delete this.editForm.delFlagNameRef;
				delete this.editForm.level;
				delete this.editForm.parentIds;
				delete this.editForm.children;
				this.editVisible = true;
			},
			handleCopy:function(row){
				this.addChildForm.parentId = row.id;
				this.addChildForm.parentName = row.name;

				this.addChildVisible = true;
			},
			handleDel:function(id){
					this.$confirm('确认要删除该菜单吗？', '提示', {}).then(() => {

							this.$post('/admin/system/menu/delete',{id:id}).then(({code})=>{

								(code == '00') && 
								(()=>{

									this.$message({
										message:'删除成功！',
										type:'success'
									}) 
									this.getTree(); 

								})()
							})

					})
			},
			addSubmit:function(){

				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {

							this.$post('/admin/system/menu/add',this.addForm).then(({code})=>{

								(code == '00') && 
								(()=>{

									this.$message({
										message:'添加成功！',
										type:'success'
									})

									this.$refs['addForm'].resetFields();
									this.addVisible = false;
									this.getTree(); 

								})()
							})

						})

					}
				})

			},
			editSubmit:function(){

				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {

							this.$post('/admin/system/menu/edit',this.editForm).then(({code})=>{

								console.log(code);
								(code == '00') && 
								(()=>{

									this.$message({
										message:'编辑成功！',
										type:'success'
									})

									this.$refs['editForm'].resetFields();
									this.editVisible = false;
									this.getTree(); 

								})()
							})

						})

					}
				})
			},
			addChildSubmit:function(){
				this.$refs.addChildForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {

							this.$post('/admin/system/menu/add',this.addChildForm).then(({code})=>{

								console.log(code);
								(code == '00') && 
								(()=>{

									this.$message({
										message:'添加成功！',
										type:'success'
									})

									this.$refs['addChildForm'].resetFields();
									this.addChildVisible = false;
									this.getTree(); 

								})()
							})

						})

					}
				})
			}
		},
		mounted(){
			this.getTree();
		}
	}
</script>