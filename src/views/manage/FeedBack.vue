<template>
	<div class="p-t-10">
		<!-- 合作行业 -->
		<el-row class="m-b-20">
			<el-col :span="24" class="toolbar">
				<el-form :model="filters" :inline="true" @submit.native.prevent ref="filters"> 
					  <el-form-item label="姓名:" :label-width="toolLabelWidth" prop="name">
					 		<el-input v-model="filters.name" placeholder="请输入姓名" size="small"></el-input>
					 </el-form-item> 
					  <el-form-item label="电话:" :label-width="toolLabelWidth" prop="tel">
					 		<el-input v-model="filters.tel" placeholder="请输入姓名" size="small"></el-input>
					 </el-form-item> 
					 <el-form-item label="公司:" :label-width="toolLabelWidth" prop="company">
					 	<el-select size="small"  v-model="filters.company" placeholder="请选择类型">
					 	    <el-option v-for="(item,index) in companyType"  
					 	        :key="index"
					 	        :label="item"
					 	        :value="item">
					 	    </el-option>
					 	</el-select>
					 </el-form-item> 

					 <el-form-item>
					 	<el-button   @click.native.prevent="handleCurrentChange(1)" size="small" icon="el-icon-search">查询</el-button>
					 </el-form-item> 
					  
					<el-form-item>
					 		<el-button size="small" icon="el-icon-refresh" @click="$refs.filters.resetFields()">重置</el-button>
					 </el-form-item>
					 <el-form-item>
					 		<el-button size="small" :icon="{'el-icon-download':!downing,'el-icon-loading':downing}" @click="exportExcel()">导出</el-button>
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
			<el-table-column prop="name" label="姓名" >
			</el-table-column> 
			<el-table-column prop="company" label="公司" >
			</el-table-column>  
			<el-table-column prop="position" label="职位" >
			</el-table-column> 
			<el-table-column prop="tel" label="电话" >
			</el-table-column>   
			<el-table-column prop="content" label="意见反馈" >
			</el-table-column>  
			<el-table-column prop="createDate" label="提交时间"   width="160" >
			</el-table-column>  
		</el-table>

		<el-col :span="24" class="toolbar m-t-20" v-if="users.length>0">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination background layout="total,prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

 



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
					name:'',
					tel:'',
					company:''
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
					type:'3',
					cover:''
				},
				editForm:{
					label:'',
					type:'3',
					cover:'',
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
				},

				companyType:[
					"代理商",
					"广告主",
					"媒体",
					"其他",
				],
				downing:false,

			}
		},
		methods:{
			exportExcel:function(){

				if(this.downing){
					return false;
				}

				this.downing = true;


				this.$downXls('/admin/caseData/feedback/export',this.filters).then(({code})=>{
					console.log(code);
					(code == '00') && (this.downing = false);

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
					page:this.page,
					limit:this.size,
					...this.filters
				}
				this.$post('/admin/caseData/feedback/list',params).then((res)=>{
						 let { msg, code, data,count } = res;

							this.listLoading = false;
							this.total = count;
							// this.page = Math.ceil(count/this.page);
							this.users = data;	
						 
						
				}) 
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