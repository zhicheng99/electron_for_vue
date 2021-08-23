<template>
	<div class="p-t-10">
		<el-row class="m-b-20">
			<el-col :span="24" class="toolbar">
				<el-form :model="filters" @submit.native.prevent :inline="true" ref="filters"> 
					 <el-form-item label="标题:" :label-width="toolLabelWidth" prop="title">
					 		<el-input v-model="filters.title" placeholder="请输入标题" size="small"></el-input>
					 </el-form-item>
					 <el-form-item label="关键字:" :label-width="toolLabelWidth" prop="crux">
					 		<el-input v-model="filters.crux" placeholder="请输入关键字" size="small"></el-input>
					 </el-form-item>
					  
					 <el-form-item label="状态:" :label-width="toolLabelWidth" prop="state">
					  	<el-select size="small"  v-model="filters.state" placeholder="请选择状态">
					  	    <el-option v-for="item in ResourcesStatus"
					  	        :key="item.id"
					  	        :label="item.label"
					  	        :value="item.value">
					  	    </el-option>
					  	</el-select>
					 </el-form-item>
					 <el-form-item label="类型:" :label-width="toolLabelWidth" prop="type">
					  	<el-select size="small" filterable v-model="filters.type" placeholder="请选择类型">
					  	    <el-option v-for="item in ResourcesType"
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
					<el-form-item>
						<el-button  @click.native.prevent="addVisible=true" size="small" icon="el-icon-plus">添加</el-button>
					</el-form-item>
					<!-- <el-form-item>
						<el-button  @click.native.prevent="ImportReviewCaseVisible=true" size="small" icon="el-icon-upload2">导入</el-button>
					</el-form-item> 
					-->
					<!-- <el-form-item>
						<el-button  @click.native.prevent="exportXls" size="small" icon="el-icon-download" :loading="downloading">导出</el-button>
					</el-form-item>   -->
					
				</el-form>
			</el-col>
		</el-row>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading"   style="width: 100%;" >
			
			<el-table-column type="index"  width="80" label="序号">
				<template slot-scope="scope"><span>{{scope.$index+(page - 1) * size + 1}} </span></template>
			</el-table-column>
			<el-table-column prop="title" label="标题" min-width="200">
			</el-table-column>

			<el-table-column prop="crux" label="关键词">
			</el-table-column>
			<el-table-column prop="typeRef" label="类型" >
			</el-table-column>
			<el-table-column prop="modular" label="所属模块" >
			</el-table-column>
			<el-table-column prop="sort" label="排序" >
			</el-table-column>
			<el-table-column label="是否推荐" >
				<template slot-scope="scope">

					<template v-if="scope.row.topSort == 0">否</template>
					<template v-else>
						<font color="#0166FF">是</font>
					</template>


					
				</template>
			</el-table-column>
			<el-table-column label="是否置顶" >
				<template slot-scope="scope">

					<template v-if="scope.row.headFlag == 0">否</template>
					<template v-else>
						<font color="#0166FF">是</font>
					</template>


					
				</template>
			</el-table-column>

			
			
			
			<el-table-column prop="stateRef" label="发布状态">
			</el-table-column>

			<el-table-column prop="createName" label="创建人" >
			</el-table-column>
			 
			

			<el-table-column prop="createDate" label="创建时间"   width="160" >
			</el-table-column> 
			<el-table-column label="操作" width="240" fixed="right">
				<template slot-scope="scope"> 

					<el-button type="text" v-if="scope.row.headFlag == 0" size="small" @click="top(scope.row.uid)" icon="el-icon-top" title="置顶">置顶</el-button>

					<el-button type="text" v-if="scope.row.headFlag == 1" size="small" @click="unTop(scope.row.uid)" icon="el-icon-bottom" title="取消置顶">取消置顶</el-button>


					<el-button type="text" v-if="scope.row.topSort == 0" size="small" @click="recommend(scope.row.uid)" icon="el-icon-star-off" title="推荐">推荐</el-button>

					<el-button type="text" v-if="scope.row.topSort == 1" size="small" @click="unRecommend(scope.row.uid)" icon="el-icon-star-on" title="取消推荐">取消推荐</el-button>



					<el-button type="text" v-if="scope.row.state == 1" size="small" @click="unRelease(scope.row.uid)" icon="el-icon-download" title="撤回">撤回</el-button>
				 	<el-button type="text" v-if="scope.row.state == 0 || scope.row.state == 2" size="small" @click="release(scope.row.uid)" icon="el-icon-upload2" title="发布">发布</el-button>
					 
					 <el-button type="text" size="small" @click="handleDetail(scope.row.uid)" icon="el-icon-tickets" title="编辑">详情</el-button>
					 <el-button type="text" size="small" @click="handleEdit(scope.row.uid)" icon="el-icon-edit" title="编辑">编辑</el-button>
					  <el-button type="text" size="small" @click="handleDel(scope.row.id)" icon="el-icon-delete" title="删除">删除</el-button>

				</template>
			</el-table-column>
		</el-table>

		<el-col :span="24" class="toolbar m-t-20" v-if="users.length>0">
			<el-pagination background layout="total,prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>


		 


		 <el-dialog title="详情" :visible.sync="detailVisible">
		 	<el-form :model="detailForm" ref="detailForm"> 

		 		<el-form-item label="所属模块:" :label-width="formLabelWidth" prop="name">
		 			{{detailForm.modular}}
		 		</el-form-item>  
		 		
		 		<el-form-item label="标题:" :label-width="formLabelWidth" prop="industry">
		 			{{detailForm.title}}
		 		</el-form-item>
		 		<el-form-item label="关键字:" :label-width="formLabelWidth" prop="brand">
		 			{{detailForm.crux}}
		 		</el-form-item>

		 		<el-form-item label="数据类型:" :label-width="formLabelWidth" prop="business">
		 			{{detailForm.typeRef}}
		 		</el-form-item>
		 		<el-form-item label="创作者名称:" :label-width="formLabelWidth" prop="reportBusinessLine">
		 			{{detailForm.author}} 
		 		</el-form-item>

		        <hr class="hr">


		 		<el-form-item label="封面图:" :label-width="formLabelWidth" prop="executionTime">
					<img :src="detailForm.cover" width="200" alt="">
		 		</el-form-item>
		 		<el-form-item label="引言:" :label-width="formLabelWidth" prop="executionTime">
		 			{{detailForm.introduction}}
		 		</el-form-item>  
		 		<el-form-item label="内容:" v-if="detailForm.type == '0'" :label-width="formLabelWidth" prop="target">
		 			<div class="content">
		 				<ScrollArea>
			 			<div v-html="detailForm.content"></div>
		 					
		 				</ScrollArea>
		 				
		 			</div>
		 		</el-form-item>

		 		<el-form-item label="视频:" v-if="detailForm.type == '1'" :label-width="formLabelWidth" prop="target">

		 			<div v-for="item in detailForm.files">
						{{item.fileUrl}}({{item.fileName}})
					</div>


		 		</el-form-item>
		 		<el-form-item label="文件:" v-if="detailForm.type == '0' || detailForm.type == '2'" :label-width="formLabelWidth" prop="target">
					
					<div v-for="item in detailForm.files">
						{{item.fileUrl}}({{item.fileName}})
					</div>

		 		</el-form-item>

		        <hr class="hr">
		 		<el-form-item label="文献:"  :label-width="formLabelWidth" prop="target">
					<div v-for="(item,index) in formatReference(detailForm.reference)">{{index+1}}、{{item}}</div>
		 		</el-form-item>

 
		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button @click="detailVisible = false" size="small">关闭</el-button>
		 		</el-form-item>
		 	</el-form>
		 	
		 </el-dialog>

			 
		
			
			<AddForm 
			v-bind:is-show.sync="addVisible" 
			v-bind:model-id="filters.rootModularCode"
			v-bind:call-back="getUsers"
			></AddForm>


			<EditForm
			v-bind:is-show.sync="editVisible"
			v-bind:model-id="filters.rootModularCode"
			v-bind:row-id.sync="uid"
			v-bind:call-back="getUsers"
			></EditForm>



	</div>
</template>
<script>
	import config from '../../../common/js/config.js';
	import dic from '../../../common/js/dic.js';
	import UploadImg from '../../../components/UploadImg.vue'

	import AddForm from './AddForm.vue';
	import EditForm from './EditForm.vue';

	import ScrollArea from '../../../components/next/ScrollArea.vue'

	


	export default{
		components:{
			UploadImg,
			// ImportCollectCase,
			AddForm,
			EditForm,
			ScrollArea
		},
		props:['modelId'],
		data(){
			return {
				toolLabelWidth:config.toolbarLabelWidth,
				formLabelWidth:'200px',
				filters: {
					rootModularCode:'10001',
					title:'',
					crux:'',
					state:'',
					type:''
				},
				users: [],
				total: 0,
				page: 1,
				size:10,
				listLoading: false,
				sels: [],//列表选中列 

				ResourcesStatus:[],
				ResourcesType:[],

				targetProps:{
					label:'name',
					value:'code'
				},

				addVisible:false,
				editVisible:false,
				detailVisible:false,

				
				editForm:{
				},
				detailForm:{
					reference:''
				},
				
				actid:'',
				ImportReviewCaseVisible:false,
				downloading:false,
				statusList:[],


				reportBusinessList:[],
				activityList:[],
				reviewStateList:[],
				uid:''

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
			exportXls:function(){ 
				this.downloading = true;
				this.$downXls('/admin/collectData/case/exportData',this.filters).then(()=>{
					this.downloading = false;


				})


			},
			top:function(id){
				this.$confirm('确认要置顶该内容吗？', '提示', {}).then(() => {

					this.$post('/admin/resources/upHeadFlagData',{uid:id,headFlag:'1'}).then(({code})=>{
						(code == '00') && 
						this.$message({
							message:'操作成功！',
							type:'success'
						});


						this.getUsers();
					})
				})
			},
			unTop:function(id){
				this.$confirm('确认要取消置顶该内容吗？', '提示', {}).then(() => {

					this.$post('/admin/resources/upHeadFlagData',{uid:id,headFlag:'0'}).then(({code})=>{
						(code == '00') && 
						this.$message({
							message:'操作成功！',
							type:'success'
						});


						this.getUsers();
					})
				})
			},
			recommend:function(id){
				this.$confirm('确认要推荐该内容吗？', '提示', {}).then(() => {

					this.$post('/admin/resources/recommend',{uid:id,topFlag:'1'}).then(({code})=>{
						(code == '00') && 
						this.$message({
							message:'操作成功！',
							type:'success'
						});


						this.getUsers();
					})
				})
			},
			unRecommend:function(id){
				this.$confirm('确认要取消推荐该内容吗？', '提示', {}).then(() => {

					this.$post('/admin/resources/recommend',{uid:id,topFlag:'0'}).then(({code})=>{
						(code == '00') && 
						this.$message({
							message:'操作成功！',
							type:'success'
						});


						this.getUsers();
					})
				})
			},
			formatReference:function(v){
				if(v!=''){

					if(v.indexOf('|#|')>-1){
						return v.split('|#|');
					}else{
						return [v];
					}

				}else{
					return [];
				}
			},
			 
			release:function(id){

				this.$confirm('确认要发布该内容吗？', '提示', {}).then(() => {

					this.$post('/admin/resources/upstate',{uid:id,state:'1'}).then(({code})=>{
						(code == '00') && 
						this.$message({
							message:'发布成功！',
							type:'success'
						});


						this.getUsers();
					})
				})
			

			},
			unRelease:function(id){

				this.$confirm('确认要撤回该内容吗？', '提示', {}).then(() => {

					this.$post('/admin/resources/upstate',{uid:id,state:'0'}).then(({code})=>{
						(code == '00') && 
						this.$message({
							message:'撤回成功！',
							type:'success'
						});


						this.getUsers();
					})
				})
			

			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				this.listLoading = true;
				let params = {

						...{current:this.page,
						size:this.size},
					...this.filters

				} 
				this.$post('/admin/resources/page',params).then((res)=>{
						 let { msg, code, obj } = res;

						 if(code == '00'){
							this.listLoading = false;
							this.total = obj.total;
							// this.page = Math.ceil(count/this.page);
							this.users = obj.records;	

						 }
							
						 
						
				}).catch(()=>{
					this.listLoading = false;


				})
			},
			handleEdit: function (uid) {
 				console.log(uid);
 				this.uid = uid

				this.editVisible = true;
			},
			handleDetail:function(uid){
				this.$post('/admin/resources/details',{uid:uid}).then(({code,obj})=>{
					(code == '00') && (this.detailForm = obj);
				})
				// this.detailForm = {...row};
				this.detailVisible =true;
			},
			//删除
			handleDel: function (id) {
				this.$confirm('确认删除该内容吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					//NProgress.start();
					let para = { id: id };
					this.$post('/admin/resources/del',para).then(({code,obj})=>{
							 
							 
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

			// if(typeof this.$route.query.actId != 'undefined'){
			// 	this.filters.actId = this.$route.query.actId
			// }
			 

			// this.getUsers();
  
			
			//案例特点
			dic.ResourcesStatus().then(res=>{
				let { msg, code, data } = res;
				this.ResourcesStatus = data;	 
			});
			dic.ResourcesType().then(res=>{
				let { msg, code, data } = res;
				this.ResourcesType = data;	 
			});
			 
		},
		created(){
			
		},
		computed:{

		},
		watch:{
			'modelId':{
				handler:function(v){
					console.log(v);
					this.filters.rootModularCode = v;

					this.getUsers();
				},
				immediate:true

			}
			
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