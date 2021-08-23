<template>
	<section class="m-t-10 ">

		<div class="blogArtical_lay">
			
			<div class="blogArtical_tree">
				
				<BlogChannel
				v-bind:call-back="selectChannel"
				></BlogChannel>

			</div>

			<!--工具条-->
			<el-row class="m-b-20">
				<el-col :span="24" class="toolbar">
					<el-form :model="filters" :inline="true" ref="filters">
						 <el-form-item  prop="s_title" label="标题">
							 <el-input v-model="filters.s_title" placeholder="请输入标题" size="small"></el-input>
						 </el-form-item>   
						  <el-form-item  prop="s_category" label="文章类型">
						  	 <el-select v-model="filters.s_category" placeholder="选择文章类型" size="small">
						  	     <el-option v-for="item in [{id:1,label:'本站文章',value:1},{id:2,label:'外链',value:2}]"
						  	         :key="item.id"
						  	         :label="item.label"
						  	         :value="item.value">
						  	     </el-option>
						  	 </el-select>
						 </el-form-item>  
						 <el-form-item  prop="time" label="发布时间">
								<el-date-picker size="small"
								  v-model="filters.time"
								  type="daterange"
								  start-placeholder="开始日期"
								  end-placeholder="结束日期" value-format="yyyy-MM-dd">
								</el-date-picker>
						 </el-form-item>  

						<el-form-item  prop="s_content" label="内容">
							 <el-input v-model="filters.s_content" placeholder="请输入内容" size="small"></el-input>
							
						 </el-form-item>  

						 <el-form-item>
						 	<el-button    @click.native.prevent="handleCurrentChange(1)" size="small" icon="el-icon-search">查询</el-button>
						 </el-form-item> 
						 <el-form-item>
						 		<el-button size="small" icon="el-icon-refresh" @click="$refs.filters.resetFields()">重置</el-button>
						 </el-form-item> 
						 <el-form-item>
						 		<el-button size="small" icon="el-icon-plus" @click="dialogAreaAddVisible = true">添加</el-button>
						 </el-form-item> 
					</el-form>
					<br>

					<div v-if="filters.s_channelName">
						<el-tag 
					  closable
					  type="warning"
					  size="small"
					  @close="firstClose()"
					  >
					  {{filters.s_channelName}}
					</el-tag>
					</div>
					
				</el-col>
		
			</el-row>
			
			<!--列表-->
			<el-table :data="users" highlight-current-row v-loading="listLoading"   style="width: 100%;" >
				
				<el-table-column type="index"  width="60" label="序号">
					<template slot-scope="scope"><span>{{scope.$index+(page - 1) * size + 1}} </span></template>
				</el-table-column>
				<el-table-column prop="title" label="标题" >
				</el-table-column>
				<el-table-column prop="ip" label="文章类型" width="120"   >
					<template slot-scope="scope"> 
							{{scope.row.category=='1'?'本站文章':'外链'}}
					</template>
				</el-table-column> 
				<el-table-column prop="blogChannel.name" label="所属栏目"  >
				</el-table-column> 
				<el-table-column  label="内容"   width="160" >
					<template slot-scope="scope"> 
							<el-button type="text" size="mini" @click="showCode(scope.row.content)">查看</el-button>

					</template>
				</el-table-column> 
				<el-table-column  label="是否置顶"   width="160" >
						<template slot-scope="scope"> 
							{{scope.row.top?'是':'否'}}
					</template>
				</el-table-column> 
				<el-table-column  label="是否推荐"   width="160" >
						<template slot-scope="scope"> 
							{{scope.row.recommend?'是':'否'}}
					</template>
				</el-table-column> 
				<el-table-column prop="commentCount" label="评论数"   width="160" > 
				</el-table-column> 
				<el-table-column label="发布时间"   width="160" > 
					<template slot-scope="scope"> 
					{{scope.row.publistTime | formatDate}}
					</template>
				</el-table-column>  
				<el-table-column label="操作" width="120" fixed="right">
					<template slot-scope="scope"> 
					 
						 
						 <el-button type="text" size="small" @click="handleEdit(scope.row)" icon="el-icon-edit" title="编辑">编辑</el-button>
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
	 
			
		</div>
		

		 <el-dialog title="添加内容" :visible.sync="dialogAreaAddVisible">
		 	<el-form :model="addForm" :rules="addFormRules" ref="addForm">
		 		<el-form-item label="标题:" :label-width="formLabelWidth" prop="title">
		 			<el-input v-model="addForm.title" size="small"></el-input>
		 		</el-form-item>  
		 		<el-form-item label="副标题:" :label-width="formLabelWidth" prop="subTitle">
		 			<el-input v-model="addForm.subTitle" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="所属栏目:" :label-width="formLabelWidth" prop="channelIds"> 

		 			<el-cascader size="small" style="width: 100%;"
					    expand-trigger="hover"
					    v-model="addForm.channelIds"
					    :options="channelListTree"
					    @change="handleChange">
					</el-cascader>

		 		</el-form-item> 

		 		<el-form-item label="摘要:" :label-width="formLabelWidth" prop="marks">
		 			<el-input type="textarea" v-model="addForm.marks" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="图片:" :label-width="formLabelWidth" prop="showPic">
		 			<el-input v-model="addForm.showPic" size="small"></el-input>
		 		</el-form-item>
		 		<el-form-item label="文章类型:" :label-width="formLabelWidth" prop="category">
		 			<el-radio v-model="addForm.category" label="1">本站文章</el-radio>
  					<el-radio v-model="addForm.category" label="2">外链</el-radio>
		 		</el-form-item>
		 		<el-form-item label="来源:" :label-width="formLabelWidth" prop="resources">
		 			<el-input v-model="addForm.resources" size="small"></el-input>
		 		</el-form-item>
		 		<el-form-item label="文章标签:" :label-width="formLabelWidth"  class="m-b-0">
		 			<!-- <el-input v-model="addForm.blogTags" size="small"></el-input> -->

							<div data-v-6b6082c4="" class="el-select__tags p-r-10 p-t-10">
								<span data-v-6b6082c4="">
									<span data-v-6b6082c4="" class="el-tag el-tag--info el-tag--small m-r-10" 
									v-for="(item,index) in addForm.blogTagsArr"
									>
										<span data-v-6b6082c4="" class="el-select__tags-text">{{item.name}}</span>
										<i data-v-6b6082c4="" class="el-tag__close el-icon-close" @click="delTag(index)"></i>
									</span> 
								
								</span>
							</div>

		 		</el-form-item>
				<el-form-item   :label-width="formLabelWidth">
		 			<BlogTags 
		 			v-bind:call-back="updateBlogTagsArr"
		 			></BlogTags>
		 		</el-form-item>
		 		<el-form-item label="发布时间:" :label-width="formLabelWidth" prop="publistTime">
		 			<!-- <el-input v-model="addForm.publistTime" size="small"></el-input> -->
		 			<el-date-picker size="small"
								  v-model="addForm.publistTime"
								  type="date"
								  value-format="yyyy-MM-dd">
								</el-date-picker>
		 		</el-form-item>
				<el-form-item label="内容:" :label-width="formLabelWidth" prop="content">
		 			 <quill-editor  ref="textEditor" placeholder="" v-model="addForm.content" :options="editorOption">
					</quill-editor>
		 		</el-form-item>

		 		 
		 		<el-form-item label="是否置顶:" :label-width="formLabelWidth">
		 			<el-switch size="small"
					  v-model="addForm.top"  
					  >
					</el-switch>
		 		</el-form-item>

		 		<el-form-item label="是否推荐:" :label-width="formLabelWidth">
		 			<el-switch size="small"
					  v-model="addForm.recommend"  
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
				<el-form-item label="标题:" :label-width="formLabelWidth" prop="title">
		 			<el-input v-model="editForm.title" size="small"></el-input>
		 		</el-form-item>  
		 		<el-form-item label="副标题:" :label-width="formLabelWidth" prop="subTitle">
		 			<el-input v-model="editForm.subTitle" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="所属栏目:" :label-width="formLabelWidth" prop="channelIds"> 

		 			<el-cascader size="small" style="width: 100%;"
					    expand-trigger="hover"
					    v-model="editForm.channelIds"
					    :options="channelListTree"
					    @change="handleChange">
					</el-cascader>

		 		</el-form-item> 

		 		<el-form-item label="摘要:" :label-width="formLabelWidth" prop="marks">
		 			<el-input type="textarea" v-model="editForm.marks" size="small"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="图片:" :label-width="formLabelWidth" prop="showPic">
		 			<el-input v-model="editForm.showPic" size="small"></el-input>
		 		</el-form-item>
		 		<el-form-item label="文章类型:" :label-width="formLabelWidth" prop="category">
		 			<el-radio v-model="editForm.category" label="1">本站文章</el-radio>
  					<el-radio v-model="editForm.category" label="2">外链</el-radio>
		 		</el-form-item>
		 		<el-form-item label="来源:" :label-width="formLabelWidth" prop="resources">
		 			<el-input v-model="editForm.resources" size="small"></el-input>
		 		</el-form-item>
		 		<el-form-item label="文章标签:" :label-width="formLabelWidth"  class="m-b-0">
		 			<!-- <el-input v-model="editForm.blogTags" size="small"></el-input> -->

							<div data-v-6b6082c4="" class="el-select__tags p-r-10 p-t-10">
								<span data-v-6b6082c4="">
									<span data-v-6b6082c4="" class="el-tag el-tag--info el-tag--small m-r-10" 
									v-for="(item,index) in editForm.blogTagsArr"
									>
										<span data-v-6b6082c4="" class="el-select__tags-text">{{item.name}}</span>
										<i data-v-6b6082c4="" class="el-tag__close el-icon-close" @click="delTag(index)"></i>
									</span> 
								
								</span>
							</div>

		 		</el-form-item>
				<el-form-item   :label-width="formLabelWidth">
		 			<BlogTags 
		 			v-bind:call-back="updateBlogTagsArr"
		 			></BlogTags>
		 		</el-form-item>
		 		<el-form-item label="发布时间:" :label-width="formLabelWidth" prop="publistTime">
		 			<!-- <el-input v-model="editForm.publistTime" size="small"></el-input> -->
		 			<el-date-picker size="small"
								  v-model="editForm.publistTime"
								  type="date"
								  value-format="yyyy-MM-dd">
								</el-date-picker>
		 		</el-form-item>
				<el-form-item label="内容:" :label-width="formLabelWidth" prop="content">
		 			 <quill-editor  ref="textEditor" placeholder="" v-model="editForm.content" :options="editorOption">
					</quill-editor>
		 		</el-form-item>

		 		 
		 		<el-form-item label="是否置顶:" :label-width="formLabelWidth">
		 			<el-switch size="small"
					  v-model="editForm.top"  
					  >
					</el-switch>
		 		</el-form-item>

		 		<el-form-item label="是否推荐:" :label-width="formLabelWidth">
		 			<el-switch size="small"
					  v-model="editForm.recommend"  
					  >
					</el-switch>
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

	import CommentDetail from '../../components/CommentDetail.vue'
	import BlogChannel from '../../components/BlogChannel.vue'
	import BlogTags from '../../components/BlogTags.vue'



	



	import { quillEditor } from 'vue-quill-editor'
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'

	export default {
		components:{
			quillEditor,
			CommentDetail,
			BlogChannel,
			BlogTags
		},
		data() {
			return {
				toolLabelWidth:config.toolbarLabelWidth,
				formLabelWidth:config.dialogLabelWidth,
				filters: {
					s_title:'',
					s_category:'',
					time:[],
					s_content:'',
					s_channelId:''
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
					title:'',
					subTitle:'',
					channelId:'',
					channelIds:[],
					marks:'',
					showPic:'',
					category:'1',
					resources:'',
					tags:'',
					publistTime:'',
					content:'',
					top:false,
					recommend:false,

					blogTagsArr:[]

					
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: '请输入标题', trigger: 'blur' }
					],
					channelIds: [
						{ required: true, message: '请选择所属栏目', trigger: 'blur' }
					],
					content: [
						{ required: true, message: '请输入内容', trigger: 'blur' }
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
					title:'',
					subTitle:'',
					channelId:'',
					channelIds:[],
					marks:'',
					showPic:'',
					category:'1',
					resources:'',
					tags:'',
					publistTime:'',
					content:'',
					top:false,
					recommend:false,

					blogTagsArr:[]

				},

				roleList:[],
				editorOption: {
					placeholder: '请输入内容',
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
				paramsCode:'',

				channelListTree:[], 

			}
		},
		filters:{
			formatDate:config.formatDate 
		},
		methods: {  
			delTag:function(index){
				this.addForm.blogTagsArr.splice(index,1);
			},
			updateBlogTagsArr:function(arr){
				this.addForm.blogTagsArr.push(arr);

				var hash = {}; 
				this.addForm.blogTagsArr = this.addForm.blogTagsArr.reduce(function(item, next) { 
				hash[next.id] ? '' : hash[next.id] = true && item.push(next); 
				return item 
				}, []);
			},
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
			firstClose:function(){
				this.filters.s_channelId = '';
				this.filters.s_channelName = '';
				this.page = 1;
				this.getUsers();

			},
			selectChannel:function(id,name){
				this.filters.s_channelId = id;
				this.filters.s_channelName = name;
				this.page = 1;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				this.listLoading = true;
				let params = {
					page:this.page,
					limit:this.size,

					s_title:this.filters.s_title,
					s_category:this.filters.s_category,
					s_beginPublistTime:this.filters.time[0]?this.filters.time[0]:'',
					s_endPublistTime:this.filters.time[1]?this.filters.time[1]:'',

					s_content:this.filters.s_content,
					s_channelId:this.filters.s_channelId

				}
				this.$post('/blogArticle/list',params).then((res)=>{
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

				this.$post('/blogArticle/detail',{id:row.id}).then(({code,obj})=>{
					(code == '00') && 
					(()=>{


					var tmp =  Object.assign({},obj);

					tmp.channelIds = tmp.channelIds.indexOf(',')>-1?tmp.channelIds.split(','):[tmp.channelIds];
					tmp.channelIds = tmp.channelIds.map(item=>{return item*1});

					tmp.tags = tmp.blogTags.map(item=>{return item.id}).toString();
					tmp.blogTagsArr = tmp.blogTags;



					delete tmp.blogTags;
					delete tmp.blogChannel;
					delete tmp.delFlagNameRef;
					delete tmp.updateDate;


					this.editForm = tmp;

					console.log(this.editForm.channelIds);

					this.editFormVisible = true;



					})()
				})

				



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

							para.channelIds = para.channelIds.join(',');
							para.tags = para.blogTagsArr.map(item=>{return item.id}).toString();
							console.log(para);

							delete para.blogTagsArr;


							
							this.$post('/blogArticle/add2',para).then(({code,obj})=>{
									 
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
			},
			getChannel:function(){
				this.$post('/blogChannel/ztreeData',{}).then(({code,data})=>{
					(code == '00') && 
					(()=>{
						data.map(item=>{
							item.label = item.name;
							item.value = item.id;

							if((item.children === null) || ((item.children !== null) && (item.children.length==0))){
								delete item.children;
							}
							

							item.children && item.children.map(lev2=>{
								lev2.label = lev2.name;
								lev2.value = lev2.id;

								if((lev2.children === null) || ((lev2.children !== null) && (lev2.children.length==0))){
									delete lev2.children;
								}

								lev2.children && lev2.children.map(lev3=>{
									lev3.label = lev3.name;
									lev3.value = lev3.id;

									
								})
							})
						})

						this.channelListTree = data;

					})()
				})
			},
			handleChange:function(v){
				console.log(v);
			}

			 
		},
		mounted() {
			this.getUsers();

			this.getRoles();

			this.getChannel();
			
		
		},
		watch:{
			'addForm.channelIds':function(n){
				if(n.length>0){
					this.addForm.channelId = this.addForm.channelIds[this.addForm.channelIds.length-1];
					console.log(this.addForm.channelId);
				}
			}
		}
	}

</script>

<style scoped>

.blogArtical_lay{
	padding-left: 240px;
	position: relative;
}
.blogArtical_tree{
	width: 220px;
	height: 400px;
	background: #fff;
	position: absolute;
	left:0;
	top:0;
}
.el-select__tags{
	min-height: 30px;
    border: 1px solid #dcdfe6;
    position: relative;
    top: auto;
    -webkit-transform: translateY(0);
    transform: translateY(0);
    display: block;
    padding-left: 10px;
    border-radius: 5px;
}

</style>