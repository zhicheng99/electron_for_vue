<template>
	<div class="p-t-10">
		<el-row class="m-b-20">
			<el-col :span="24" class="toolbar">
				<el-form :model="filters" @submit.native.prevent :inline="true" ref="filters"> 
					 <el-form-item label="名称:" :label-width="toolLabelWidth" prop="name">
					 		<el-input v-model="filters.name" placeholder="请输入名称" size="small"></el-input>
					 </el-form-item>
					 <el-form-item label="省份:" :label-width="toolLabelWidth" prop="parentArea">
					 	<el-select size="small" v-model="filters.parentArea" placeholder="选择省份" @change="areaChange">
					 	    <el-option v-for="item in areaList"
					 	        :key="item"
					 	        :label="item.title"
					 	        :value="item.code">
					 	    </el-option>
					 	</el-select>
					 </el-form-item>
					  
					 <el-form-item label="城市:" :label-width="toolLabelWidth" prop="areaCode">
					  	<el-select size="small"  v-model="filters.areaCode" placeholder="请选择城市" :disabled="filters.parentArea==''">
					  	    <el-option v-for="item in areaChildren"
					  	        :key="item"
					  	        :label="item.title"
					  	        :value="item.code">
					  	    </el-option>
					  	</el-select>
					 </el-form-item>
					 <el-form-item label="状态:" :label-width="toolLabelWidth" prop="state">
					  	<el-select size="small" filterable v-model="filters.state" placeholder="请选择状态">
					  	    <el-option v-for="item in stateList"
					  	        :key="item"
					  	        :label="item.label"
					  	        :value="item.value">
					  	    </el-option>
					  	</el-select>
					 </el-form-item>
					

					 <el-form-item>
					 	<el-button    @click.native.prevent="handleCurrentChange(1)" size="small" icon="el-icon-search">查询</el-button>
					 </el-form-item> 
					 <el-form-item>
					 		<el-button size="small" icon="el-icon-refresh" @click="$refs.filters.resetFields();handleCurrentChange(1)">重置</el-button>
					 </el-form-item>
					<el-form-item>
						<el-button  @click.native.prevent="addVisible=true" size="small" icon="el-icon-plus">添加</el-button>
					</el-form-item>
					<!--  <el-form-item>
						<el-button  @click.native.prevent="ImportReviewCaseVisible=true" size="small" icon="el-icon-upload2">导入</el-button>
					</el-form-item>  -->
					
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
			<el-table-column prop="name" label="村落名称" min-width="200">
			</el-table-column>

			<el-table-column prop="parentAreaName" label="省份">
			</el-table-column>
			<el-table-column prop="areaName" label="城市" >
			</el-table-column>
			<el-table-column  label="热门标签" >
				<template slot-scope="scope">
					{{scope.row.hot == '0'?'否':'是'}}
				</template>
			</el-table-column>
			<el-table-column prop="guard" label="守护人" >
			</el-table-column>
			<el-table-column prop="modelTypeStr" label="视频模板" >
			</el-table-column> 

			
			
			
			<el-table-column prop="stateStr" label="发布状态">
			</el-table-column>
			<el-table-column prop="sort" label="排序" width="160">
				<template slot-scope="scope">
					<el-input-number class="p-l-10" size="mini" v-model="scope.row.sort" controls-position="right" :min="0" @change="upateSort(scope.row)"></el-input-number>
				</template>
			</el-table-column>

			

			<el-table-column prop="createDate" label="创建时间"   width="160" >
			</el-table-column> 
			<el-table-column label="操作" width="320" fixed="right">
				<template slot-scope="scope"> 
 


					<el-button type="text" v-if="scope.row.state == 1" size="small" @click="unRelease(scope.row.id)" icon="el-icon-download" title="撤回">撤回</el-button>
				 	<el-button type="text" v-if="scope.row.state == 0 && scope.row.state != 2" size="small" @click="release(scope.row.id)" icon="el-icon-upload2" title="发布">发布</el-button>
					 
					 <el-button type="text" size="small" @click="handleDetail(scope.row.id)" icon="el-icon-tickets" title="编辑">详情</el-button>
					 <el-button type="text" size="small" @click="handleEdit(scope.row.id)" icon="el-icon-edit" title="编辑">编辑</el-button>
					  <el-button type="text" size="small" @click="handleDel(scope.row.id)" icon="el-icon-delete" title="删除">删除</el-button>
					  <el-button type="text" size="small" @click="handleCancel(scope.row.id)" icon="el-icon-close" title="取消热门">取消热门</el-button>

				</template>
			</el-table-column>
		</el-table>

		<el-col :span="24" class="toolbar m-t-20" v-if="users.length>0">
			<el-pagination background layout="total,prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

 

			 
		
			
			<AddForm 
			v-bind:is-show.sync="addVisible" 
			v-bind:call-back="getUsers"
			></AddForm>


			<EditForm
			v-bind:is-show.sync="editVisible"
			v-bind:row-id.sync="id"
			v-bind:call-back="getUsers"
			></EditForm>

			<Preview
			v-bind:is-show.sync="previewVisible"
			v-bind:row-id.sync="previewId"
			v-bind:call-back="getUsers"
			></Preview>

			<ImportVillage
			v-bind:is-show.sync="ImportReviewCaseVisible"
			v-bind:call-back="getUsers"
			></ImportVillage>

	</div>
</template>
<script>
	import config from '../../../../common/js/config.js';
	import dic from '../../../../common/js/dic.js';
	import UploadImg from '../../../../components/UploadImg.vue'

	import AddForm from './HotAddForm.vue';
	import EditForm from './HotEditForm.vue';
	import Preview from './Preview.vue';


	import ScrollArea from '../../../../components/next/ScrollArea.vue'

	import ImportVillage from '../../../../components/village/ImportVillage.vue';
	


	export default{
		components:{
			UploadImg,
			AddForm,
			EditForm,
			Preview,
			ScrollArea,
			ImportVillage
		},
		props:['modelId'],
		data(){
			return {
				toolLabelWidth:'45px',
				formLabelWidth:'200px',
				filters: {
					parentArea:'',//	否	string	省份
					areaCode:'',//	否	string	城市
					name:'',//	否	string	名称
					state:'',//	否	string	状态
					hot:'1'
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
				id:'',
				previewId:'',
				areaList:[],
				areaChildren:[],
				stateList:[
					{
						label:'上线',
						value:1
					},
					{
						label:'下线',
						value:0
					},
					{
						label:'暂存',
						value:2
					}
				],
				previewVisible:false

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
			upateSort:function(row){

				this.$post('/admin//village/saveSort',{id:row.id,sort:row.sort}).then(({code})=>{

					(code == '00') && (()=>{
						this.$message({
							message:'操作成功！',
							type:'success'
						})

						this.getUsers();

					})()
					
				})


			},
			exportXls:function(){ 
				this.downloading = true;
				this.$downXls('/admin/collectData/case/exportData',this.filters).then(()=>{
					this.downloading = false;


				})


			}, 
			release:function(id){

				this.$confirm('确认要发布该内容吗？', '提示', {}).then(() => {

					this.$post('/admin/village/upState',{id:id,state:'1'}).then(({code})=>{
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

					this.$post('/admin/village/upState',{id:id,state:'0'}).then(({code})=>{
						(code == '00') && 
						this.$message({
							message:'撤回成功！',
							type:'success'
						});


						this.getUsers();
					})
				})
			

			},
			handleCancel:function(id){

				this.$confirm('确认要取消热门吗？', '提示', {}).then(() => {

					this.$post('/admin/village/upHot',{id:id,hot:'0'}).then(({code})=>{
						(code == '00') && 
						this.$message({
							message:'执行成功！',
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
				this.$post('/admin/village/page',params).then((res)=>{
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
			handleEdit: function (id) {
 				this.id = id;
				this.editVisible = true;
			}, 
			handleDetail: function (id) {
 				this.previewId = id;
				this.previewVisible = true;
			}, 
			//删除
			handleDel: function (id) {
				this.$confirm('确认删除该内容吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					//NProgress.start();
					let para = { id: id };
					this.$post('/admin/village/del',para).then(({code,obj})=>{
							 
							 
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
			getArea:function(){
				this.$post('/admin/area/list',{parentId:''}).then((res)=>{
						 let { msg, code, obj } = res;

						 if(code == '00'){ 
						 	this.areaList = obj;

						 }
						
				})
			},
			areaChange:function(){
				this.$nextTick(()=>{

					if(this.filters.parentArea!=''){
						this.filters = {
							...this.filters,
							...{
								areaCode:''
							}
						}

						this.areaList.forEach(item=>{
							if(item.code == this.filters.parentArea){
								this.areaChildren = item.children;
							}
						})
					}


				})
			}
			 

		},
		mounted(){
 
			 

			this.getUsers(); 
			this.getArea();

			 
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