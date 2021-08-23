<template>
	<div class="p-t-10">
		<el-row class="m-b-20">
			<el-col :span="24" class="toolbar">
				<el-form :model="filters" @submit.native.prevent :inline="true" ref="filters"> 
					  <el-form-item label="标题:" :label-width="toolLabelWidth" prop="title">
					 		<el-input v-model="filters.title" placeholder="请输入案例标题" size="small"></el-input>
					 </el-form-item> 
					  <el-form-item label="合作行业:" :label-width="toolLabelWidth" prop="industryLabel">
					  	<el-select size="small" filterable v-model="filters.industryLabel" placeholder="请选择合作行业">
					  	    <el-option v-for="item in Tag3"
					  	        :key="item.id"
					  	        :label="item.label"
					  	        :value="item.label">
					  	    </el-option>
					  	</el-select>
					 </el-form-item> 
					 <el-form-item label="营销目的:" :label-width="toolLabelWidth" prop="caseAppeal">
					  	<el-select size="small" filterable v-model="filters.caseAppeal" placeholder="请选择营销目的">
					  	    <el-option v-for="item in Tag2"
					  	        :key="item.id"
					  	        :label="item.label"
					  	        :value="item.label">
					  	    </el-option>
					  	</el-select>
					 </el-form-item>
					 <el-form-item label="合作资源:" :label-width="toolLabelWidth" prop="coreResources">
					  	<el-select size="small" filterable v-model="filters.coreResources" placeholder="请选择合作资源">
					  	    <el-option v-for="item in Tag4"
					  	        :key="item.id"
					  	        :label="item.label"
					  	        :value="item.label">
					  	    </el-option>
					  	</el-select>
					 </el-form-item>
					 <el-form-item label="合作平台:" :label-width="toolLabelWidth" prop="cooperateHosts">
					  	<el-select size="small" filterable v-model="filters.cooperateHosts" placeholder="请选择合作平台">
					  	    <el-option v-for="item in Tag1"
					  	        :key="item.id"
					  	        :label="item.label"
					  	        :value="item.label">
					  	    </el-option>
					  	</el-select>
					 </el-form-item>
					 <el-form-item label="发布状态:" :label-width="toolLabelWidth" prop="status">
					  	<el-select size="small" filterable v-model="filters.status" placeholder="请选择发布状态">
					  	    <el-option v-for="item in statusArr"
					  	        :key="item.value"
					  	        :label="item.title"
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
						<el-button     @click.native.prevent="addVisible=true" size="small" icon="el-icon-plus">添加</el-button>
					</el-form-item> 
				</el-form>
			</el-col>
		</el-row>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading"   style="width: 100%;" >
			
			<el-table-column type="index"  width="80" label="序号">
				<template slot-scope="scope"><span>{{scope.$index+(page - 1) * size + 1}} </span></template>
			</el-table-column>
			<el-table-column prop="title" label="标题" width="120">
			</el-table-column>
			<el-table-column prop="sort" label="排序" width="80">
			</el-table-column>
			<el-table-column prop="cover" label="封面图" >
				<template slot-scope="scope">
					<img :src="scope.row.cover" width="50" height="50" alt="">
				</template>
			</el-table-column> 
			<el-table-column prop="logo" label="Logo" >
				<template slot-scope="scope">
					<img :src="scope.row.logo" width="50" height="50" alt="">
				</template>
			</el-table-column>   
			<el-table-column prop="cooperateBrand" label="案例品牌名称" width="160">
			</el-table-column>
			
			<el-table-column prop="industryLabel" label="合作行业" width="120">
			</el-table-column>
			<el-table-column prop="caseAppeal" label="营销目的" width="120">
			</el-table-column>
			<el-table-column prop="coreResources" label="合作资源" width="120">
			</el-table-column>
			<el-table-column prop="cooperateHosts" label="合作平台" width="120">
			</el-table-column>
			<el-table-column prop="number" label="点赞数" width="120">
			</el-table-column>
			<el-table-column prop="statusName" label="发布状态" width="120">
			</el-table-column>
			

			<el-table-column prop="createDate" label="创建时间"   width="160" >
			</el-table-column> 
			<el-table-column label="操作" width="180" fixed="right">
				<template slot-scope="scope"> 

					<el-button type="text" v-if="scope.row.status == 1" size="small" @click="unRelease(scope.row.id)" icon="el-icon-download" title="撤回">撤回</el-button>
				 	<el-button type="text" v-if="scope.row.status == 2" size="small" @click="release(scope.row.id)" icon="el-icon-upload2" title="发布">发布</el-button>
					 
					 <el-button type="text" size="small" @click="handleEdit(scope.row)" icon="el-icon-edit" title="编辑">编辑</el-button>
					  <el-button type="text" size="small" @click="handleDel(scope.row.id)" icon="el-icon-delete" title="删除">删除</el-button>

				</template>
			</el-table-column>
		</el-table>

		<el-col :span="24" class="toolbar m-t-20" v-if="users.length>0">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination background layout="total,prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>


<el-dialog title="新增" :visible.sync="addVisible">
		 	<el-form :model="addForm" :rules="addFormRules" ref="addForm"> 
		 		<el-form-item label="标题:" :label-width="formLabelWidth" prop="title">
		 			<el-input v-model="addForm.title" size="small"  placeholder="请输入案例标题"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="封面图:" :label-width="formLabelWidth"  prop="cover">
		 			<UploadImg v-if="addVisible" v-bind:max-num="'1'" v-bind:upload-img.sync="addForm.cover"></UploadImg>
					<div class="tip">
						<i class="el-icon-warning"></i>
						请选择图片上传,支持png,jpg,gif
					</div>
					<div style="height: 0; overflow: hidden;">
			 			<el-input v-model="addForm.cover" size="small"  :disabled="true"></el-input>

					</div>
		 		</el-form-item> 
		 		<el-form-item label="案例logo:" :label-width="formLabelWidth"  prop="logo">
		 			<UploadImg v-if="addVisible" v-bind:max-num="'1'" v-bind:upload-img.sync="addForm.logo"></UploadImg>
					<div class="tip">
						<i class="el-icon-warning"></i>
						请选择图片上传,支持png,jpg,gif
					</div>
					<div style="height: 0; overflow: hidden;">
			 			<el-input v-model="addForm.logo" size="small"  :disabled="true"></el-input>

					</div>
		 		</el-form-item>  
		 		<el-form-item label="案例品牌名称:" :label-width="formLabelWidth" prop="cooperateBrand">
		 			<el-input v-model="addForm.cooperateBrand" size="small"  placeholder="请输入案例品牌名称"></el-input>
		 			 
		 		</el-form-item> 
		 		<el-form-item label="案例亮点:" :label-width="formLabelWidth" prop="highlights">
		 			<el-input type="textarea" v-model="addForm.highlights" size="small"  placeholder="请输入案例亮点"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="合作平台:" :label-width="formLabelWidth" prop="cooperateHostsArr">
		 			<el-select filterable size="small" multiple v-model="addForm.cooperateHostsArr" placeholder="请选择合作平台">
					  	    <el-option v-for="item in Tag1"
					  	        :key="item.id"
					  	        :label="item.label"
					  	        :value="item.label">
					  	    </el-option>
					  	</el-select>
		 		</el-form-item>
		 		<el-form-item label="营销目的:" :label-width="formLabelWidth" prop="caseAppeal">
		 			<el-select filterable size="small"  v-model="addForm.caseAppeal" placeholder="请选择营销目的">
					  	    <el-option v-for="item in Tag2"
					  	        :key="item.id"
					  	        :label="item.label"
					  	        :value="item.label">
					  	    </el-option>
					  	</el-select>
		 		</el-form-item>
		 		<el-form-item label="合作行业:" :label-width="formLabelWidth" prop="industryLabelArr">
		 			<el-select filterable size="small" multiple v-model="addForm.industryLabelArr" placeholder="请选择合作行业">
					  	    <el-option v-for="item in Tag3"
					  	        :key="item.id"
					  	        :label="item.label"
					  	        :value="item.label">
					  	    </el-option>
					  	</el-select>
		 		</el-form-item>
		 		<el-form-item label="合作资源:" :label-width="formLabelWidth" prop="coreResourcesArr">
		 			<el-select filterable size="small" multiple v-model="addForm.coreResourcesArr" placeholder="请选择合作资源">
					  	    <el-option v-for="item in Tag4"
					  	        :key="item.id"
					  	        :label="item.label"
					  	        :value="item.label">
					  	    </el-option>
					  	</el-select>
		 		</el-form-item>
		 		<el-form-item label="稿件链接:" :label-width="formLabelWidth" prop="prUrl">
		 			<el-input  v-model="addForm.prUrl" size="small"  placeholder="请输入稿件链接"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="排序:" :label-width="formLabelWidth" prop="sort">
		 			<el-input  v-model="addForm.sort" type="number" max="500" min="0" size="small"  placeholder="请输入排序"></el-input>
		 		</el-form-item>
		 		<el-form-item label="发布状态:" :label-width="formLabelWidth" prop="status">
		 			<el-select filterable size="small" v-model="addForm.status" placeholder="请选择发布状态">
					  	    <el-option v-for="item in statusArr"
					  	        :key="item.value"
					  	        :label="item.title"
					  	        :value="item.value">
					  	    </el-option>
					  	</el-select>
		 		</el-form-item> 
				<el-form-item label="营销效果:" :label-width="formLabelWidth" >
					<el-table :show-header="false" :data="addForm.marketingEffectJson">
					   <el-table-column
						  label="原价(元)" >
						  <template slot-scope="scope">
							  <el-form-item
								  :prop="'marketingEffectJson.'+scope.$index+'.title'"
								   :rules="[
								  {required: true, message: '请输入标签!', trigger: 'blur'}


								  ],
								  " >
							  	<el-input v-model="scope.row.title" size="small" @input="validateLen(scope.$index,'0')"  placeholder="标签(最多6个字符)"></el-input>
							  </el-form-item> 


						  </template>
						</el-table-column>
						<el-table-column
						  label="原价(元)" >
						  <template slot-scope="scope">

							  <el-form-item
								  :prop="'marketingEffectJson.'+scope.$index+'.value'"
								   :rules="[
								  {required: true, message: '请输入标签!', trigger: 'blur'}, 

								  ],
								  " >
							  	<el-input v-model="scope.row.value" size="small"  placeholder="值"></el-input>
							  </el-form-item> 


						  </template>
						</el-table-column>
						<el-table-column >
						  <template slot-scope="scope"> 
							  <el-form-item
								  :prop="'marketingEffectJson.'+scope.$index+'.unit'"
								   :rules="[
								  {required: true, message: '请输入标签!', trigger: 'blur'}, 

								  ],
								  " >
							  	<el-input v-model="scope.row.unit" size="small"  placeholder="单位"></el-input>
							  </el-form-item>


						  </template>
						</el-table-column>
						<el-table-column width="80">
							<template slot-scope="scope">
								
								<span class="op" v-if="scope.$index != 0" @click="del(scope.$index,'0')">
									[<i class="el-icon-close"  ></i>删除]
								</span>
								<span class="op" v-if="scope.$index == 0" @click="add('0')" >
									[<i class="el-icon-plus" ></i>增加]
								</span>
								
								
							</template>


						</el-table-column>




					</el-table>
					 
					    


					</el-row>

		 		</el-form-item> 
		 		
		 	
		 		  
		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button @click="addVisible = false" size="small">取消</el-button>
		 			<el-button type="primary" @click="addSubmit" size="small">保存</el-button>
		 		</el-form-item>
		 	</el-form>
		 	
		 </el-dialog> 

		 <el-dialog title="编辑" :visible.sync="editVisible">
		 	<el-form :model="editForm" :rules="addFormRules" ref="editForm"> 
		 		<el-form-item label="标题:" :label-width="formLabelWidth" prop="title">
		 			<el-input v-model="editForm.title" size="small"  placeholder="请输入案例标题"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="封面图:" :label-width="formLabelWidth"  prop="cover">
		 			<UploadImg v-if="editVisible" v-bind:max-num="'1'" v-bind:upload-img.sync="editForm.cover"></UploadImg>
					<div class="tip">
						<i class="el-icon-warning"></i>
						请选择图片上传,支持png,jpg,gif
					</div>
					<div style="height: 0; overflow: hidden;">
			 			<el-input v-model="editForm.cover" size="small"  :disabled="true"></el-input>

					</div>
		 		</el-form-item> 
		 		<el-form-item label="案例logo:" :label-width="formLabelWidth"  prop="logo">
		 			<UploadImg v-if="editVisible" v-bind:max-num="'1'" v-bind:upload-img.sync="editForm.logo"></UploadImg>
					<div class="tip">
						<i class="el-icon-warning"></i>
						请选择图片上传,支持png,jpg,gif
					</div>
					<div style="height: 0; overflow: hidden;">
			 			<el-input v-model="editForm.logo" size="small"  :disabled="true"></el-input>

					</div>
		 		</el-form-item>  
		 		<el-form-item label="案例品牌名称:" :label-width="formLabelWidth" prop="cooperateBrand">
		 			<el-input v-model="editForm.cooperateBrand" size="small"  placeholder="请输入案例品牌名称"></el-input>
		 			 
		 		</el-form-item> 
		 		<el-form-item label="案例亮点:" :label-width="formLabelWidth" prop="highlights">
		 			<el-input type="textarea" v-model="editForm.highlights" size="small"  placeholder="请输入案例亮点"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="合作平台:" :label-width="formLabelWidth" prop="cooperateHostsArr">
		 			<el-select filterable size="small" multiple v-model="editForm.cooperateHostsArr" placeholder="请选择合作平台">
					  	    <el-option v-for="item in Tag1"
					  	        :key="item.id"
					  	        :label="item.label"
					  	        :value="item.label">
					  	    </el-option>
					  	</el-select>
		 		</el-form-item>
		 		<el-form-item label="营销目的:" :label-width="formLabelWidth" prop="caseAppeal">
		 			<el-select filterable size="small" v-model="editForm.caseAppeal" placeholder="请选择营销目的">
					  	    <el-option v-for="item in Tag2"
					  	        :key="item.id"
					  	        :label="item.label"
					  	        :value="item.label">
					  	    </el-option>
					  	</el-select>
		 		</el-form-item>
		 		<el-form-item label="合作行业:" :label-width="formLabelWidth" prop="industryLabelArr">
		 			<el-select filterable size="small" multiple v-model="editForm.industryLabelArr" placeholder="请选择合作行业">
					  	    <el-option v-for="item in Tag3"
					  	        :key="item.id"
					  	        :label="item.label"
					  	        :value="item.label">
					  	    </el-option>
					  	</el-select>
		 		</el-form-item>
		 		<el-form-item label="合作资源:" :label-width="formLabelWidth" prop="coreResourcesArr">
		 			<el-select filterable size="small" multiple v-model="editForm.coreResourcesArr" placeholder="请选择合作资源">
					  	    <el-option v-for="item in Tag4"
					  	        :key="item.id"
					  	        :label="item.label"
					  	        :value="item.label">
					  	    </el-option>
					  	</el-select>
		 		</el-form-item>
		 		<el-form-item label="稿件链接:" :label-width="formLabelWidth" prop="prUrl">
		 			<el-input  v-model="editForm.prUrl" size="small"  placeholder="请输入稿件链接"></el-input>
		 		</el-form-item> 
		 		<el-form-item label="排序:" :label-width="formLabelWidth" prop="sort">
		 			<el-input  v-model="editForm.sort" type="number" max="500" min="0" size="small"  placeholder="请输入排序"></el-input>
		 		</el-form-item>
		 		<el-form-item label="点赞数:" :label-width="formLabelWidth" prop="number">
		 			<el-input  v-model.number="editForm.number" type="number" min="1" size="small"  placeholder="请输入点赞数"></el-input>
		 		</el-form-item>  
				<el-form-item label="营销效果:" :label-width="formLabelWidth" >
					<el-table :show-header="false" :data="editForm.marketingEffectJson">
					   <el-table-column
						  label="原价(元)" >
						  <template slot-scope="scope">
							  <el-form-item
								  :prop="'marketingEffectJson.'+scope.$index+'.title'"
								   :rules="[
								  {required: true, message: '请输入标签!', trigger: 'blur'}, 

								  ],
								  " >
							  	<el-input v-model="scope.row.title" size="small"  placeholder="标签" @input="validateLen(scope.$index,'1')"></el-input>
							  </el-form-item> 


						  </template>
						</el-table-column>
						<el-table-column
						  label="原价(元)" >
						  <template slot-scope="scope">

							  <el-form-item
								  :prop="'marketingEffectJson.'+scope.$index+'.value'"
								   :rules="[
								  {required: true, message: '请输入标签!', trigger: 'blur'}, 

								  ],
								  " >
							  	<el-input v-model="scope.row.value" size="small"  placeholder="值"></el-input>
							  </el-form-item> 


						  </template>
						</el-table-column>
						<el-table-column >
						  <template slot-scope="scope"> 
							  <el-form-item
								  :prop="'marketingEffectJson.'+scope.$index+'.unit'"
								   :rules="[
								  {required: true, message: '请输入标签!', trigger: 'blur'}, 

								  ],
								  " >
							  	<el-input v-model="scope.row.unit" size="small"  placeholder="单位"></el-input>
							  </el-form-item>


						  </template>
						</el-table-column>
						<el-table-column width="80">
							<template slot-scope="scope">
								
								<span class="op" v-if="scope.$index != 0" @click="del(scope.$index,'1')">
									[<i class="el-icon-close"  ></i>删除]
								</span>
								<span class="op" v-if="scope.$index == 0" @click="add('1')" >
									[<i class="el-icon-plus" ></i>增加]
								</span>
								
								
							</template>


						</el-table-column>




					</el-table>
					 
					    


					</el-row>

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
	import UploadImg from '../../components/UploadImgChunk.vue'
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
					title:'', 
					cooperateHosts:'',
					caseAppeal:'',
					industryLabel:'',
					coreResources:'',
					status:''
				},
				users: [],
				total: 0,
				page: 1,
				size:10,
				listLoading: false,
				sels: [],//列表选中列 

				Tag1:[],
				Tag2:[],
				Tag3:[],
				Tag4:[],
				addVisible:false,
				editVisible:false,
				statusArr:[{"title":"发布","value":"1"},{"title":"未发布","value":"2"}],

				addForm:{
					title:'',
					cover:'',
					logo:'',
					cooperateBrand:'',
					highlights:'',
					cooperateHosts:'',
					cooperateHostsArr:[],
					cooperateHostsLogo:'',
					caseAppeal:'',
					caseAppealArr:[],
					industryLabel:'',
					industryLabelArr:[],
					marketingEffect:'',
					prUrl:'',
					coreResources:'',
					coreResourcesArr:[],
					sort:'1',
					status:'1',
					marketingEffectJson:[
						{
							title:'',
							value:'',
							unit:'',
							op:''
						}
					]
				},
				editForm:{
					title:'',
					cover:'',
					logo:'',
					cooperateBrand:'',
					highlights:'',
					cooperateHosts:'',
					cooperateHostsArr:[],
					cooperateHostsLogo:'',
					caseAppeal:'',
					caseAppealArr:[],
					industryLabel:'',
					industryLabelArr:[],
					marketingEffect:'',
					prUrl:'',
					coreResources:'',
					coreResourcesArr:[],
					sort:'1',
					marketingEffectJson:[
						{
							"title":'',
							"value":'',
							"unit":'',
							"op":''
						}
					],
					number:1
				},
				addFormRules:{
					title:[
						{ required: true, message: '请输入标题', trigger: 'blur' }
					],
					cover:[
						{ required: true, message: '请上传封面图', trigger: 'blur' }
					],
					logo:[
						{ required: true, message: '请上传案例logo', trigger: 'blur' }
					],
					cooperateBrand:[
						{ required: true, message: '请输入案例品牌名称', trigger: 'blur' }
					],
					highlights:[
						{ required: true, message: '请输入案例亮点', trigger: 'blur' }
					],
					cooperateHostsArr:[
						{ required: true, message: '请选择合作平台', trigger: 'blur' }
					],
					caseAppeal:[
						{ required: true, message: '请选择营销目的', trigger: 'blur' }
					],
					industryLabelArr:[
						{ required: true, message: '请选择合作行业', trigger: 'blur' }
					],
					coreResourcesArr:[
						{ required: true, message: '请选择合作资源', trigger: 'blur' }

					],
					// prUrl:[
					// 	{ required: true, message: '请输入稿件链接', trigger: 'blur' }
					// ],
					sort:[
						{ required: true, message: '请输入排序', trigger: 'blur' }
					],
					number:[
						{ required: true, message: '请输入点赞数', trigger: 'blur' },
						{ type:'number',message: '请添写整数',trigger: 'blur'},

					],
					status:[
						{ required: true, message: '请选择发布状态', trigger: 'blur' }
					],
				}


			}
		},
		methods:{
			validateLen:function(index,sign){
				if(sign == '0'){ //添加

					this.$nextTick(()=>{
						if(this.addForm.marketingEffectJson[index].title.length>6){

								this.addForm.marketingEffectJson[index].title = this.addForm.marketingEffectJson[index].title.slice(0,6);

						}
					})

				}else{
					this.$nextTick(()=>{
						if(this.editForm.marketingEffectJson[index].title.length>6){

								this.editForm.marketingEffectJson[index].title = this.editForm.marketingEffectJson[index].title.slice(0,6);

						}
					})
				}
				
            },
			release:function(id){

				this.$confirm('确认要发布该案例吗？', '提示', {}).then(() => {

					this.$post('/admin/caseData/main/release',{id:id}).then(({code})=>{
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

				this.$confirm('确认要撤回该案例吗？', '提示', {}).then(() => {

					this.$post('/admin/caseData/main/unrelease',{id:id}).then(({code})=>{
						(code == '00') && 
						this.$message({
							message:'撤回成功！',
							type:'success'
						});


						this.getUsers();
					})
				})
			

			},
			add:function(sign){

				if(sign == '0'){ //添加表单
					if(this.addForm.marketingEffectJson.length == 3){

						this.$message({
							message:'最多三项',
							type:'warning'
						})
						return false;
					}


					this.addForm.marketingEffectJson.push(
						{
								"title":'',
								"value":'',
								"unit":'',
								"op":''

						}

					)
				}else{ //编辑表单
					if(this.editForm.marketingEffectJson.length == 3){

						this.$message({
							message:'最多三项',
							type:'warning'
						})
						return false;
					}


					this.editForm.marketingEffectJson.push(
						{
								"title":'',
								"value":'',
								"unit":'',
								"op":''

						}

					)
				}
				

			},
			del:function(index,sign){

				if(sign == '0'){

				this.addForm.marketingEffectJson.splice(index,1);
				}else{
				this.editForm.marketingEffectJson.splice(index,1);

				}


			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				this.listLoading = true;
				let params = {

						...{page:this.page,
						limit:this.size,},
					...this.filters

				} 
				this.$post('/admin/caseData/main/list',params).then((res)=>{
						 let { msg, code, data,count } = res;

							this.listLoading = false;
							this.total = count;
							// this.page = Math.ceil(count/this.page);
							this.users = data;	
						 
						
				}) 
			},
			getTag:function(type){

				return	new Promise((resolve,reject) => {

					this.$post('/admin/caseData/tags/tagList',{type:type}).then(({code,obj})=>{
						if(code == '00'){
							resolve(obj);
						}else{
							reject([]);
						}
					})

				})
				
			},
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true; 

							let para = {
								title:this.addForm.title,
								cover:this.addForm.cover,
								logo:this.addForm.logo,
								cooperateBrand:this.addForm.cooperateBrand,
								highlights:this.addForm.highlights,
								cooperateHosts:this.addForm.cooperateHosts,
								cooperateHostsLogo:this.addForm.cooperateHostsLogo,
								caseAppeal:this.addForm.caseAppeal,
								industryLabel:this.addForm.industryLabel,
								marketingEffect:JSON.stringify(this.addForm.marketingEffectJson),
								prUrl:this.addForm.prUrl,
								coreResources:this.addForm.coreResources,
								sort:this.addForm.sort,
								status:this.addForm.status
								
							}
 
 
							
							this.$post('/admin/caseData/main/add',para).then(({code,obj})=>{
									 
										this.addLoading = false;
										
										(code == '00') && 
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										
										this.$refs['addForm'].resetFields();
										this.addVisible = false;
										this.getUsers(); 
							})
							 
						});
					}
				});
			},
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true; 


							if(this.editForm.cooperateHostsArr.length >0){
								let title = [];
								let cover = [];
								this.editForm.cooperateHostsArr.map(item=>{
									this.Tag1.map(t=>{
										if(t.label == item){
											title.push(t.label);
											cover.push(t.cover);
										}
									})
								})
								this.editForm.cooperateHosts = title.join(',');
								this.editForm.cooperateHostsLogo = cover.join(',');

							}else{
								this.editForm.cooperateHosts = title.join(',');
								this.editForm.cooperateHostsLogo = cover.join(',');
							}




							let para = {
								id:this.editForm.id,
								title:this.editForm.title,
								cover:this.editForm.cover,
								logo:this.editForm.logo,
								cooperateBrand:this.editForm.cooperateBrand,
								highlights:this.editForm.highlights,
								cooperateHosts:this.editForm.cooperateHosts,
								cooperateHostsLogo:this.editForm.cooperateHostsLogo,
								caseAppeal:this.editForm.caseAppeal,
								industryLabel:this.editForm.industryLabel,
								marketingEffect:JSON.stringify(this.editForm.marketingEffectJson),
								prUrl:this.editForm.prUrl,
								coreResources:this.editForm.coreResources,
								sort:this.editForm.sort,
								number:this.editForm.number
								
							}
 
 
							
							this.$post('/admin/caseData/main/edit',para).then(({code,obj})=>{
									 
										this.addLoading = false;
										
										(code == '00') && 
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										
										this.$refs['editForm'].resetFields();
										this.editVisible = false;
										this.getUsers(); 
							})
							 
						});
					}
				});
			},
			handleEdit: function (row) {

				this.editForm = Object.assign({}, row,{

					cooperateHostsArr:row.cooperateHosts!=''?row.cooperateHosts.split(','):[],
					// caseAppealArr:row.caseAppeal!=''?row.caseAppeal.split(','):[],
					industryLabelArr:row.industryLabel!=''?row.industryLabel.split(','):[],
					coreResourcesArr:row.coreResources!=''?row.coreResources.split(','):[],
					marketingEffectJson:row.marketingEffect!=''?JSON.parse(row.marketingEffect):[]

				});
				this.editVisible = true;
			},
			//删除
			handleDel: function (id) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					//NProgress.start();
					let para = { id: id };
					
					
					this.$post('/admin/caseData/main/delete',para).then(({code,obj})=>{
							 
							 
								(code == '00') && 
								this.$message({
									message: '删除成功',
									type: 'success'
								}) && 
								this.getUsers(); 
					})
					
					
					 
				}).catch(() => {

				});
			}
		},
		mounted(){
			this.getUsers();
			this.getTag('1').then((res)=>{ 
				this.Tag1 = res;
			});
			this.getTag('2').then((res)=>{ 
				this.Tag2 = res;
			});
			this.getTag('3').then((res)=>{ 
				this.Tag3 = res;
			});
			this.getTag('4').then((res)=>{ 
				this.Tag4 = res;
			});


		},
		created(){
			
		},
		computed:{

		},
		watch:{
			'addForm.cooperateHostsArr':function(v){ 
				if(v.length >0){
					let title = [];
					let cover = [];
					v.map(item=>{
						this.Tag1.map(t=>{
							if(t.label == item){
								title.push(t.label);
								cover.push(t.cover);
							}
						})
					})
					this.addForm.cooperateHosts = title.join(',');
					this.addForm.cooperateHostsLogo = cover.join(',');

				}else{
					this.addForm.cooperateHosts = title.join(',');
					this.addForm.cooperateHostsLogo = cover.join(',');
				}
			},
			// 'addForm.caseAppealArr':function(v){

			// 	if(v.length>0){ 

			// 		this.addForm.caseAppeal = v.join(',');
					 
			// 	}else{
			// 		this.addForm.caseAppeal = '';
			// 	}
			// },
			'addForm.industryLabelArr':function(v){
				if(v.length>0){ 
					this.addForm.industryLabel = v.join(',');
					 
				}else{
					this.addForm.industryLabel = ''; 
				} 
			},
			'addForm.coreResourcesArr':function(v){
				if(v.length>0){ 
					this.addForm.coreResources = v.join(',');

				}else{
					this.addForm.coreResources = '';

				}
			},
			'editForm.cooperateHostsArr':function(v){ 
				if(v.length >0){
					let title = [];
					let cover = [];
					v.map(item=>{
						this.Tag1.map(t=>{
							if(t.label == item){
								title.push(t.label);
								cover.push(t.cover);
							}
						})
					})
					this.editForm.cooperateHosts = title.join(',');
					this.editForm.cooperateHostsLogo = cover.join(',');

				}else{
					this.editForm.cooperateHosts = title.join(',');
					this.editForm.cooperateHostsLogo = cover.join(',');
				}
			},
			// 'editForm.caseAppealArr':function(v){

			// 	if(v.length>0){ 

			// 		this.editForm.caseAppeal = v.join(',');
					 
			// 	}else{
			// 		this.editForm.caseAppeal = '';
			// 	}
			// },
			'editForm.industryLabelArr':function(v){
				if(v.length>0){ 
					this.editForm.industryLabel = v.join(',');
					 
				}else{
					this.editForm.industryLabel = ''; 
				} 
			},
			'editForm.coreResourcesArr':function(v){
				if(v.length>0){ 
					this.editForm.coreResources = v.join(',');

				}else{
					this.editForm.coreResources = '';

				}
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

</style>