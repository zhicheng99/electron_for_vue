<template>
	<div>
		<el-row class="m-t-10">
			<el-col :span="24" class="toolbar  m-b-20"> 
						<el-button  size="small" icon="el-icon-plus" class="pull-right" @click="addVisible=true">增加一级模块</el-button> 
			</el-col>
			
		</el-row>

		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" >
			
			<!-- 二级 -->

			<el-table-column type="expand">

		  <template slot-scope="props">


			 <el-table :data="props.row.children" :show-header="false" class="children"> 

										<el-table-column width="48" ></el-table-column> 
			
			<!-- 三级 -->
			

			 	<el-table-column type="index" width="60" label="序号">
					<template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>
				</el-table-column>
			 	<el-table-column prop="name" label="标签名称" width="350">
				</el-table-column>
				<el-table-column prop="code" label="标签编码">
				</el-table-column>
				<el-table-column prop="sort" label="排序">
				</el-table-column>
				<!-- <el-table-column prop="createDate" label="创建时间">
				</el-table-column> -->
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
			<el-table-column prop="name" label="模块名称" width="350">
			</el-table-column>
			<el-table-column prop="code" label="模块编码">
			</el-table-column>
			<el-table-column prop="sort" label="排序">
			</el-table-column>
			<!-- <el-table-column prop="createDate" label="创建时间">
			</el-table-column> -->
			<el-table-column label="操作" width="200">
				<template slot-scope="scope">
					
					<el-button type="text" size="small" @click="handleCopy(scope.row)" icon="el-icon-plus" title="新增">新增</el-button> 
					<el-button type="text" size="small" @click="handleEdit(scope.row)" icon="el-icon-edit" title="编辑">编辑</el-button>
					  <el-button type="text" size="small" @click="handleDel(scope.row.id)" icon="el-icon-delete" title="删除">删除</el-button>
				</template>
			</el-table-column>
			
			
		</el-table> 



		<el-dialog title="添加一级模块" :visible.sync="addVisible">
		 	<el-form :model="addForm" :rules="addFormRules" ref="addForm">
		 		<el-form-item label="模块名称:" :label-width="formLabelWidth" prop="name">
		 			<el-input size="small" v-model="addForm.name" maxlength="200" show-word-limit placeholder="请输入模块名称"></el-input>
		 		</el-form-item>
		 		<el-form-item label="模块编码:" :label-width="formLabelWidth"  prop="code">
		 			<el-input v-model="addForm.code" size="small" maxlength="10" show-word-limit></el-input>
		 		</el-form-item> 
		 		 <el-form-item label="排序:" :label-width="formLabelWidth"  prop="sort">
		 			<el-input-number size="small" v-model="addForm.sort" controls-position="right" :min="0" :max="200"></el-input-number>
		 		</el-form-item>
		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button @click="addVisible = false" size="small">取消</el-button>
		 			<el-button type="primary" @click="addSubmit" size="small">保存</el-button>
		 		</el-form-item>
		 	</el-form>
		 </el-dialog> 


		 <el-dialog title="添加子模块" :visible.sync="addChildVisible">
		 	<el-form :model="addChildForm" :rules="addFormRules" ref="addChildForm">
		 		<el-form-item label="父模块名称:" :label-width="formLabelWidth" prop="parentName">
		 			<el-input v-model="addChildForm.parentName" size="small" :disabled="true"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="模块名称:" :label-width="formLabelWidth" prop="name">
		 			<el-input v-model="addChildForm.name" size="small" maxlength="200" show-word-limit></el-input>
		 		</el-form-item> 
		 		
		 		<el-form-item label="模块编码:" :label-width="formLabelWidth"  prop="code">
		 			<el-input v-model="addChildForm.code" size="small" maxlength="10" show-word-limit></el-input>
		 		</el-form-item> 
		 		 <el-form-item label="排序:" :label-width="formLabelWidth"  prop="sort">
		 			<el-input-number size="small" v-model="addChildForm.sort" controls-position="right" :min="0" :max="200"></el-input-number>
		 		</el-form-item>
		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button @click="addChildVisible = false" size="small">取消</el-button>
		 			<el-button type="primary" @click="addChildSubmit" size="small">保存</el-button>
		 		</el-form-item>
		 	</el-form>
		 </el-dialog> 


		 <el-dialog title="编辑标签" :visible.sync="editVisible">
		 	<el-form :model="editForm" :rules="addFormRules" ref="editForm">
		 		<el-form-item label="标签名称:" :label-width="formLabelWidth" prop="name">
		 			<el-input v-model="editForm.name" size="small" maxlength="200" show-word-limit></el-input>
		 		</el-form-item> 
		 		
		 		<el-form-item label="标签编码:" :label-width="formLabelWidth"  prop="code">
		 			<el-input v-model="editForm.code" size="small" maxlength="10" show-word-limit :disabled="true"></el-input>
		 		</el-form-item> 
		 		 <el-form-item label="排序:" :label-width="formLabelWidth"  prop="sort">
		 			<el-input-number size="small" v-model="editForm.sort" controls-position="right" :min="0" :max="200"></el-input-number>
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
	import config from '../../../common/js/config.js';
	import dic from '../../../common/js/dic.js';

	export default{
		data(){
			return{
				toolLabelWidth:config.toolbarLabelWidth,
				formLabelWidth:config.dialogLabelWidth,
				listLoading:false,
				users: [], 

				addVisible:false,
				addForm:{
					name:'', 
					sort:1,
					code:'',
					pcode:''
				},
				addFormRules:{
					name:[
					{ required: true, message: '请输入模块名称', trigger: 'blur' }
					],
					code:[
					{ required: true, message: '请输入模块编码', trigger: 'blur' }

					]
				},

				editVisible:false,
				editForm:{

				},

				addChildVisible:false,
				addChildForm:{
					name:'',
					sort:1,
					code:'',
					pcode:''
				},

				testList:[],


				
			}
		},
		methods:{
			selsChange:function(){

			}, 
			getTree:function(){ 
				this.$post('/admin/modular/page',{}).then(({code,obj})=>{

					(code == '00') && (()=>{
							this.users = obj;
 
					})()
				})
			},
			handleEdit:function(row){
				// this.editForm = Object.assign({},row);

				// this.editForm.label = row.name;
				// this.editForm.id = row.id;
				// this.editForm.parent = row.pid;
				// this.editForm.sort = row.sort;
				// this.editForm.code = row.code;

				this.editForm = {
					...this.editForm,
					...{
						name: row.name,
						id: row.id, 
						sort: row.sort,
						code:row.code,
						pcode: row.pcode,

					}
				}


				// this.editForm.parentCode = row.code;

				this.editVisible = true;
			},
			handleCopy:function(row){
				// this.addChildForm.parent = row.id;
				// this.addChildForm.parentName = row.name;
				// this.addChildForm.parentCode = row.code;

				this.addChildForm = {
					...this.addChildForm,
					...{
						// parent: row.id,
						parentName: row.name,
						pcode: row.code,

					}
				}

				this.addChildVisible = true;
			},
			handleDel:function(id){
					this.$confirm('确认要删除该模块吗？', '提示', {}).then(() => {

							this.$post('/admin/modular/del',{id:id}).then(({code})=>{

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

							this.$post('/admin/modular/add',this.addForm).then(({code})=>{

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

							this.$post('/admin/modular/edit',this.editForm).then(({code})=>{

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

							this.$post('/admin/modular/add',this.addChildForm).then(({code})=>{

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

			// dic.ReviewTags(false,'10000').then(res=>{
			// 	let { msg, code, data } = res;
				 
			// 		this.testList = data;	 
			// })
		}
	}
</script>