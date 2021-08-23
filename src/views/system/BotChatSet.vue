<template>
	<div class="p-t-10">
		<!-- 合作行业 -->
		<el-row class="m-b-10"  style="background: #fff">
			<el-col :span="24" class="toolbar">
				<el-form :inline="true"  :model="detailForm" ref="detailForm"> 
					 <el-form-item>
					 	<el-button   @click.native.prevent="dialogAddVisible=true" size="small" icon="el-icon-plus">创建</el-button>
					 </el-form-item> 
					  
					<el-form-item>
					 		<el-button size="small" icon="el-icon-refresh" @click="refreshChat()">刷新</el-button>
					 </el-form-item>
					 
				</el-form>	
			</el-col>
		</el-row>
	
	<div class="padding" style="background: #fff">
		<el-form :model="form" ref="form" label-width="120px">
		    <el-form-item label="反馈群头像:"  prop="name">
				 		<img :src="detailForm.avatar" alt="" width="50">
				 </el-form-item> 
				 <el-form-item label="反馈群ID:"  prop="name">
				 		{{detailForm.chat_id}}
				 </el-form-item> 
				 <el-form-item label="反馈群名称:"  prop="name">
				 		{{detailForm.name}}
				 </el-form-item>
				 <!-- <el-form-item label="反馈群群主OpenId:"  prop="name">
				 		{{detailForm.owner_open_id}}
				 </el-form-item> -->
				 <el-form-item label="反馈群描述:"  prop="name">
				 		{{detailForm.description}}
				 </el-form-item> 
		</el-form>
		
	</div>



		<el-dialog title="创建反馈群" :visible.sync="dialogAddVisible">
		 	<el-form :model="addForm" :rules="addFormRules" ref="addForm"> 

		 		<el-form-item label="反馈群名称:" :label-width="formLabelWidth" prop="name">
		 			<el-input v-model="addForm.name" size="small"  placeholder="请输入反馈群名称" maxlength="20"
  show-word-limit></el-input>
		 		</el-form-item>
		 		<el-form-item label="负责人OpenId:" :label-width="formLabelWidth" prop="openIdArr">
		 			<!-- <el-input v-model="addForm.openId" size="small"  placeholder="请输入负责人OpenId(多个以英文逗号分割)" maxlength="200"
  show-word-limit></el-input> -->
				  <SelectOpenId
					v-bind:field-name.sync="addForm.openIdArr"
					v-bind:place-holder="'请输入反馈群负责人'"
					></SelectOpenId>
		 		</el-form-item>  

		 		<el-form-item label="反馈群描述:" :label-width="formLabelWidth" prop="desc">
		 			<el-input type="textarea"  v-model="addForm.desc"  placeholder="请输入反馈群描述信息" maxlength="150"
  show-word-limit></el-input>
		 		</el-form-item>
		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button @click.native.prevent="dialogAddVisible=false" size="small">取消</el-button>
		 			<el-button type="primary" @click="addSubmit" size="small">保存</el-button>
		 		</el-form-item>
		 	</el-form>
		 	
		 </el-dialog>
	</div>
</template>
<script>
	import config from '../../common/js/config.js';
	import SelectOpenId from './SelectOpenId.vue';

	export default{
		components:{
			SelectOpenId
		},
		props:[],
		data(){
			return {
				toolLabelWidth:'120px',
				formLabelWidth:config.dialogLabelWidth,
				listLoading: false,

				dialogAddVisible:false,
				addForm:{
					name:'',
					desc:'',
					openId:'',
					openIdArr:['ou_2251274ed6c2db02b5ef9e5308e15134'],
				},
				
				detailForm:{},
				addFormRules:{
					name:[
						{ required: true, message: '请输入反馈群名称', trigger: 'blur' }
					],
					openIdArr:[
						{ required: true, message: '请输入反馈群负责人', trigger: 'blur' }
					],
				},
			}
		},
		methods:{			  
			//创建聊天群
			addSubmit: function () {

				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
			
							this.addForm.openId = this.addForm.openIdArr.join(',');

							// delete this.addForm.openIdArr;

							console.log();

							this.$post('/admin/larkBot/createChat',this.addForm).then(({code,obj})=>{
									  
										
										(code == '00') && 
										this.$message({
											message: '创建成功',
											type: 'success'
										});
										
										this.$refs['addForm'].resetFields();
										this.dialogAddVisible = false;
										this.refreshChat();

							})

						})
					}
				})
			},
			refreshChat:function(id,type){
				this.$post('/admin/larkBot/getChatInfo',{}).then(({code,obj})=>{
							 
							(code == '00') && 
							// this.$message({
							// 	message: '操作成功',
							// 	type: 'success'
							// }) && 
							(this.detailForm = obj.data)
				})
			}

		},
		mounted(){

			this.refreshChat();



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
<style>
	.el-tooltip__popper{
	max-width: 50%;
}

.case_table.el-table .cell.el-tooltip{
	width: 150px;
}
</style>