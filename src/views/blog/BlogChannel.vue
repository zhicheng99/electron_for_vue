<template>
	<div>
		<el-row class="m-t-10">
			<el-col :span="24" class="toolbar  m-b-20"> 
						<el-button  size="small" icon="el-icon-plus" class="pull-right" @click="addVisible=true">增加根栏目</el-button> 
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
					 	<el-table-column prop="name" label="栏目名称">
			</el-table-column>
			<el-table-column prop="id" label="ID">
			</el-table-column> 
			<el-table-column prop="sort" label="排序">
			</el-table-column> 
			<el-table-column prop="createDate" label="创建时间">
			</el-table-column>
						<el-table-column label="操作" width="220">
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
			 	<el-table-column prop="name" label="栏目名称">
			</el-table-column>
			<el-table-column prop="id" label="ID">
			</el-table-column> 
			<el-table-column prop="sort" label="排序">
			</el-table-column> 
			<el-table-column prop="createDate" label="创建时间">
			</el-table-column>
				<el-table-column label="操作" width="220">
					<template slot-scope="scope">
						
						<el-button type="text" size="small" @click="handleCopy(scope.row)" icon="el-icon-plus" title="添加子栏目">添加子栏目</el-button> 
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
			<el-table-column prop="name" label="栏目名称">
			</el-table-column>
			<el-table-column prop="id" label="ID">
			</el-table-column> 
			<el-table-column prop="sort" label="排序">
			</el-table-column> 
			<el-table-column prop="createDate" label="创建时间">
			</el-table-column>
			<el-table-column label="操作" width="220">
				<template slot-scope="scope">
					
					<el-button type="text" size="small" @click="handleCopy(scope.row)" icon="el-icon-plus" title="添加子栏目">添加子栏目</el-button> 
					<el-button type="text" size="small" @click="handleEdit(scope.row)" icon="el-icon-edit" title="编辑">编辑</el-button>
					  <el-button type="text" size="small" @click="handleDel(scope.row.id)" icon="el-icon-delete" title="删除">删除</el-button>
				</template>
			</el-table-column>
			
			
		</el-table>

		<el-dialog title="添加根栏目" :visible.sync="addVisible">
		 	<el-form :model="addForm" :rules="addFormRules" ref="addForm">
		 		<el-form-item label="名称:" :label-width="formLabelWidth" prop="name">
		 			<el-input v-model="addForm.name" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="栏目图标:" :label-width="formLabelWidth" prop="logo">
		 			<el-input v-model="addForm.logo" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="所属站点:" :label-width="formLabelWidth"  prop="siteId" style="display: none">
		 			<el-input v-model="addForm.siteId" size="small"></el-input>
		 		</el-form-item> 
		 		 <el-form-item label="栏目地址:" :label-width="formLabelWidth"  prop="href">
		 			<el-input v-model="addForm.href" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="是否首页展示:" :label-width="formLabelWidth">
		 			<el-switch size="small"
					  v-model="addForm.baseChannel" >
					</el-switch>
		 		</el-form-item>
		 		<el-form-item label="是否能够评论:" :label-width="formLabelWidth">
		 			<el-switch size="small"
					  v-model="addForm.canComment" >
					</el-switch>
		 		</el-form-item>
		 		<el-form-item label="是否匿名:" :label-width="formLabelWidth">
		 			<el-switch size="small"
					  v-model="addForm.noName" >
					</el-switch>
		 		</el-form-item>
				<el-form-item label="网页title(seo):" :label-width="formLabelWidth">
		 			<el-input type="textarea" v-model="addForm.seoTitle" placeholder=""></el-input>
		 		</el-form-item>
		 		<el-form-item label="网页关键字(seo):" :label-width="formLabelWidth">
		 			<el-input type="textarea" v-model="addForm.seoKeywords" placeholder=""></el-input>
		 		</el-form-item>
		 		<el-form-item label="网页描述(seo):" :label-width="formLabelWidth">
		 			<el-input type="textarea" v-model="addForm.seoDescription" placeholder=""></el-input>
		 		</el-form-item>


		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button @click="addVisible = false" size="small">取消</el-button>
		 			<el-button type="primary" @click="addSubmit" size="small">保存</el-button>
		 		</el-form-item>
		 	</el-form>
		 </el-dialog> 


		 <el-dialog title="添加子栏目" :visible.sync="addChildVisible">
		 	<el-form :model="addChildForm" :rules="addFormRules" ref="addChildForm">
		 		<el-form-item label="父菜单名称:" :label-width="formLabelWidth" prop="parentName">
		 			<el-input v-model="addChildForm.parentName" size="small" :disabled="true"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="名称:" :label-width="formLabelWidth" prop="name">
		 			<el-input v-model="addChildForm.name" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="栏目图标:" :label-width="formLabelWidth" prop="logo">
		 			<el-input v-model="addChildForm.logo" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="所属站点:" :label-width="formLabelWidth"  prop="siteId" style="display: none">
		 			<el-input v-model="addChildForm.siteId" size="small"></el-input>
		 		</el-form-item> 
		 		 <el-form-item label="栏目地址:" :label-width="formLabelWidth"  prop="href">
		 			<el-input v-model="addChildForm.href" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="是否首页展示:" :label-width="formLabelWidth">
		 			<el-switch size="small"
					  v-model="addChildForm.baseChannel" >
					</el-switch>
		 		</el-form-item>
		 		<el-form-item label="是否能够评论:" :label-width="formLabelWidth">
		 			<el-switch size="small"
					  v-model="addChildForm.canComment" >
					</el-switch>
		 		</el-form-item>
		 		<el-form-item label="是否匿名:" :label-width="formLabelWidth">
		 			<el-switch size="small"
					  v-model="addChildForm.noName" >
					</el-switch>
		 		</el-form-item>
				<el-form-item label="网页title(seo):" :label-width="formLabelWidth">
		 			<el-input type="textarea" v-model="addChildForm.seoTitle" placeholder=""></el-input>
		 		</el-form-item>
		 		<el-form-item label="网页关键字(seo):" :label-width="formLabelWidth">
		 			<el-input type="textarea" v-model="addChildForm.seoKeywords" placeholder=""></el-input>
		 		</el-form-item>
		 		<el-form-item label="网页描述(seo):" :label-width="formLabelWidth">
		 			<el-input type="textarea" v-model="addChildForm.seoDescription" placeholder=""></el-input>
		 		</el-form-item>
		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button @click="addChildVisible = false" size="small">取消</el-button>
		 			<el-button type="primary" @click="addChildSubmit" size="small">保存</el-button>
		 		</el-form-item>
		 	</el-form>
		 </el-dialog> 


		 <el-dialog title="编辑栏目" :visible.sync="editVisible">
		 	<el-form :model="editForm" :rules="addFormRules" ref="editForm">
		 		<el-form-item label="名称:" :label-width="formLabelWidth" prop="name">
		 			<el-input v-model="editForm.name" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="栏目图标:" :label-width="formLabelWidth" prop="logo">
		 			<el-input v-model="editForm.logo" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="所属站点:" :label-width="formLabelWidth"  prop="siteId" style="display: none">
		 			<el-input v-model="editForm.siteId" size="small"></el-input>
		 		</el-form-item> 
		 		 <el-form-item label="栏目地址:" :label-width="formLabelWidth"  prop="href">
		 			<el-input v-model="editForm.href" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="是否首页展示:" :label-width="formLabelWidth">
		 			<el-switch size="small"
					  v-model="editForm.baseChannel" >
					</el-switch>
		 		</el-form-item>
		 		<el-form-item label="是否能够评论:" :label-width="formLabelWidth">
		 			<el-switch size="small"
					  v-model="editForm.canComment" >
					</el-switch>
		 		</el-form-item>
		 		<el-form-item label="是否匿名:" :label-width="formLabelWidth">
		 			<el-switch size="small"
					  v-model="editForm.noName" >
					</el-switch>
		 		</el-form-item>
				<el-form-item label="网页title(seo):" :label-width="formLabelWidth">
		 			<el-input type="textarea" v-model="editForm.seoTitle" placeholder=""></el-input>
		 		</el-form-item>
		 		<el-form-item label="网页关键字(seo):" :label-width="formLabelWidth">
		 			<el-input type="textarea" v-model="editForm.seoKeywords" placeholder=""></el-input>
		 		</el-form-item>
		 		<el-form-item label="网页描述(seo):" :label-width="formLabelWidth">
		 			<el-input type="textarea" v-model="editForm.seoDescription" placeholder=""></el-input>
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
					logo:'',
					siteId:'1',
					href:'',
					seoTitle:'',
					seoKeywords:'',
					seoDescription:'',
					baseChannel:false,
					canComment:false,
					noName:false,
					canAduit:false

					
				},
				addFormRules:{
					name:[
						{ required: true, message: '请输入栏目名称', trigger: 'blur' }
					]
				},

				editVisible:false,
				editForm:{

				},

				addChildVisible:false,
				addChildForm:{
					parentId:'',
					name:'',
					logo:'',
					siteId:'1',
					href:'',
					seoTitle:'',
					seoKeywords:'',
					seoDescription:'',
					baseChannel:false,
					canComment:false,
					noName:false,
					canAduit:false
				}


				
			}
		},
		methods:{
			selsChange:function(){

			},
			getTree:function(){
				this.$post('/blogChannel/list',{}).then(({code,data})=>{

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
					this.$confirm('确认要删除该栏目吗？', '提示', {}).then(() => {

							this.$post('/blogChannel/delete',{id:id}).then(({code})=>{

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

							this.$post('/blogChannel/add',this.addForm).then(({code})=>{

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

							this.$post('/blogChannel/edit',this.editForm).then(({code})=>{

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

							this.$post('/blogChannel/add',this.addChildForm).then(({code})=>{

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