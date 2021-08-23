<template>
	<div>
		<el-row class="m-t-10">
			<el-col :span="24" class="toolbar  m-b-20"> 
						<el-button  size="small" icon="el-icon-plus" class="pull-right" @click="parentId='0';addVisible=true">添加一级区域</el-button> 
			</el-col>
			
		</el-row>

		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			
			<!-- 二级 -->

			<el-table-column type="expand">

		  <template slot-scope="props">


			 <el-table :data="props.row.children" :show-header="false" class="children"> 
				

				<el-table-column type="expand">

					  <template slot-scope="props">

						<!-- 三级 -->
						 <el-table :data="props.row.children" :show-header="false" class="children"> 

									<el-table-column width="48"></el-table-column> 
									<!-- <el-table-column width="48"></el-table-column>  -->
									
						 

						 	<el-table-column type="index" width="60" label="序号">
								<template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>
							</el-table-column>
						 	<el-table-column prop="title" label="区域名称">
							</el-table-column>
							<!-- <el-table-column prop="code" label="编号">
							</el-table-column>  -->
							<el-table-column prop="sort" label="排序">
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



						<!-- <el-table-column width="48"></el-table-column>  -->
			 	<el-table-column type="index" width="60" label="序号">
					<template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>
				</el-table-column>
			 	<el-table-column prop="title" label="区域名称">
				</el-table-column>
				<!-- <el-table-column prop="code" label="编号">
				</el-table-column>  -->
				<el-table-column prop="sort" label="排序">
				</el-table-column>  
				<el-table-column label="操作" width="200">
					<template slot-scope="scope">
						
						<el-button type="text" size="small" @click="parentId=scope.row.code;addVisible=true" icon="el-icon-plus" title="新增">新增</el-button> 
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
			<el-table-column prop="title" label="区域名称">
			</el-table-column>
			<!-- <el-table-column prop="code" label="编号">
			</el-table-column>  -->
			<el-table-column prop="sort" label="排序">
			</el-table-column>  
			<el-table-column label="操作" width="200">
				<template slot-scope="scope">
					
					<el-button type="text" size="small" @click="parentId=scope.row.code;addVisible=true" icon="el-icon-plus" title="新增">新增</el-button> 
					<el-button type="text" size="small" @click="handleEdit(scope.row)" icon="el-icon-edit" title="编辑">编辑</el-button>
					  <el-button type="text" size="small" @click="handleDel(scope.row.id)" icon="el-icon-delete" title="删除">删除</el-button>
				</template>
			</el-table-column>
			
			
		</el-table> 


		 
     <AddForm 
     v-bind:is-show.sync="addVisible" 
     v-bind:parent-id="parentId"
     v-bind:call-back="getUsers"
     ></AddForm>

     <EditForm 
     v-bind:is-show.sync="editVisible" 
     v-bind:form-data="editForm" 
     v-bind:call-back="getUsers"></EditForm>
			 
	</div>
</template>
<script>
	import config from '../../../../common/js/config.js';
	import dic from '../../../../common/js/dic.js';
	import UploadImg from '../../../../components/UploadImg.vue'
 

	import ScrollArea from '../../../../components/next/ScrollArea.vue'
	import AddForm from './AddForm.vue'
	import EditForm from './EditForm.vue'


	export default{
		components:{
			UploadImg, 
			ScrollArea,
			AddForm,
			EditForm
		},
		props:[],
		data(){
			return {
				toolLabelWidth:config.toolbarLabelWidth,
				formLabelWidth:config.dialogLabelWidth,
				filters: {
					parentId:'',
				},
				parentId:'0',
				users: [], 
				addVisible:false, 
				editVisible:false, 

				editForm:{}

			}
		},
		filters:{
			targetFormat:function(v){
				if(typeof v !=='undefined'){

					return v.replace(/\d|(\|#\|)/g,'').replace(/\|\&.*?\|/g,'#. #');
				}else{

					return ''
				} 
			}
		},
		methods:{

			//获取用户列表
			getUsers() {
				this.listLoading = true;
				let params = {
 
					...this.filters

				} 
				this.$post('/admin/area/list',params).then((res)=>{
						 let { msg, code, obj } = res;

						 if(code == '00'){ 
						 	this.users = obj;

						 }

				this.listLoading = false;

							
						 
						
				}).catch(()=>{
					this.listLoading = false;


				})
			},
			handleEdit: function (row) { 
				this.editForm = row;
				this.editVisible = true;
			},  
			//删除
			handleDel: function (id) {
				this.$confirm('确认删除该区域吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					//NProgress.start();
					let para = { id: id };
					this.$post('/admin/area/del',para).then(({code,obj})=>{
							 
							 
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
.op{
	font-size: 12px;
	color: #409eff;
	cursor: pointer;
}
.hr{
	border: none;
    border-top: solid #e4e1e1 1px;
}

.content{
	height: 240px;
	overflow:hidden;
	position: relative;
    border: solid #f9f7f7 1px;
}

</style>