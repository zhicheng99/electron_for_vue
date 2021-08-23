<template>
	<div>
		<el-dialog
		    title="添加"
		    :visible.sync="show" 
		    @close="close" :close-on-click-modal="false">

		    <el-form :model="form" :rules="formRules" ref="form" :label-width="formLabelWidth">
		    	<el-form-item label="所属模块：" prop="modularCode">
		    		<el-select size="small" v-model="form.modularCode" placeholder="请选择所属模块">
		    		    <el-option v-for="item in ModelList"
		    		        :key="item.code"
		    		        :label="item.name"
		    		        :value="item.code">
		    		    </el-option>
		    		</el-select>
		        </el-form-item>
		        <el-form-item label="标题：" prop="title">
		            <el-input v-model="form.title" size="small" placeholder="请输入标题"></el-input>
		        </el-form-item>
				<el-form-item label="关键字：" prop="crux">
		            <el-input v-model="form.crux" size="small" placeholder="请输入关键字,多个以逗号(,)隔开"></el-input>



		        </el-form-item>
				<el-form-item label="数据类型：" prop="type">
					<el-select size="small" v-model="form.type" placeholder="请选择数据类型">
					    <el-option v-for="item in TypeList"
					        :key="item.value"
					        :label="item.label"
					        :value="item.value">
					    </el-option>
					</el-select>
		        </el-form-item>
				<el-form-item label="创作者名称：" prop="author">
					<SelectOpenId
					v-bind:field-name.sync="form.author"
					v-bind:open-id.sync="form.authorId"
					v-bind:place-holder="'请选择创作者'"
					></SelectOpenId>
		        </el-form-item>

		        <hr class="hr">
				<el-form-item label="封面图：" prop="cover">
					<UploadImg v-if="show" 
		 			v-bind:max-num="'1'" 
		 			v-bind:upload-img.sync="form.cover"
		 			v-bind:piece-size="1024000"
		 			v-bind:is-cut="true"
					v-bind:fixed-number="'1.6:1'"
		 			></UploadImg>
 

					<div class="tip">
						<i class="el-icon-warning"></i>
						请选择图片上传,支持png,jpg,gif，图片宽高比（2:1）
					</div>
					<div style="height: 0; overflow: hidden;">
			 			<el-input v-model="form.cover" size="small"  :disabled="true"></el-input>
					</div>
		        </el-form-item>
				<el-form-item label="引言：" prop="introduction">
			 			<el-input type="textarea" v-model="form.introduction" size="small"  placeholder="请输入引言"></el-input>

				</el-form-item>
				<el-form-item label="内容：" prop="content" v-if="form.type == '0'">
			 			<Editor
						v-bind:editor-content.sync="form.content"
						></Editor> 
					<div style="height: 0; overflow: hidden;">
			 			<el-input v-model="form.content" size="small"  :disabled="true"></el-input>
					</div>
				</el-form-item>

				

				<el-form-item 

				v-if="form.type == '1'"
				v-for="(item,index) in form.multiMediaGroup" 
				:label="index==0?'视频:':''" 
				:key="item.key"
			    :prop="'multiMediaGroup.' + index + '.url'"
			    :rules="{
			      required: true, message: '请上传视频', trigger: 'blur'
			    }"
				:label-width="formLabelWidth"
				v-bind:class="form.multiMediaGroup.length>1 && index !=form.multiMediaGroup.length-1?'muitlSelect m-b-0':'muitlSelect'"
				>
				
						<div class="box" >
							<div class="box-flex-1">
								<!-- <HighlightsComponent 
					 			:bind-text.sync="item.multiMedia"
					 			></HighlightsComponent> -->

					 			<UploadVideoByChunk v-if="show" 
								:upload-video.sync="item.url"
								:upload-name.sync="item.name"

								:piece-size="1024000" >
								</UploadVideoByChunk>
							</div>
							<div class="fileName  p-l-10">
								    <el-form-item 
								    :prop="'multiMediaGroup.' + index + '.name'"
								     :rules="{
									      required: true, message: '请添写视频名称', trigger: 'blur'
									    }"
								     style="margin-top:-5px;">
										<el-input size="small" v-model="item.name" placeholder="视频名称"></el-input>
								    	
								    </el-form-item>

							</div>
							<div class="p-l-10"> 
					 			<i class="el-icon-remove-outline" v-if="index>0" @click="del_multiMediaGroup(index)"></i>
					 			<i class="el-icon-circle-plus-outline" v-if="index==0" @click="add_multiMediaGroup()"></i>
								
							</div>
							
						</div> 

						<div style="height: 0; overflow: hidden;">
							<el-input v-model="item.multiMedia" placeholder=""></el-input>
							
						</div>
				
				</el-form-item>	
 

				<el-form-item 

				v-if="form.type == '0' || form.type == '2'"
				v-for="(item,index) in form.multiWordGroup" 
				:label="index==0?'文件:':''" 
				:key="item.key"
			    :prop="'multiWordGroup.' + index + '.url'"
			    :rules="{
			      required: true, message: '请上传文件', trigger: 'blur'
			    }"
				:label-width="formLabelWidth"
				v-bind:class="form.multiWordGroup.length>1 && index !=form.multiWordGroup.length-1?'muitlSelect m-b-0':'muitlSelect'"
				>
				
						<div class="box" >
							<div class="box-flex-1">
								<!-- <HighlightsComponent 
					 			:bind-text.sync="item.multiMedia"
					 			></HighlightsComponent> -->

					 			<UploadOfficeByChunk v-if="show" 
								:upload-video.sync="item.url"
								:upload-name.sync="item.name"
								:piece-size="1024000" >
								</UploadOfficeByChunk>
							</div>
							<div class="fileName p-l-10">
								    <el-form-item 
								    :prop="'multiWordGroup.' + index + '.name'"
								     :rules="{
									      required: true, message: '请添写文件名称', trigger: 'blur'
									    }"
								     style="margin-top:-5px;">
										<el-input size="small" v-model="item.name" placeholder="文件名称"></el-input>
								    	
								    </el-form-item>

							</div>
							<div class="p-l-10"> 
					 			<i class="el-icon-remove-outline" v-if="index>0" @click="del_multiWordGroup(index)"></i>
					 			<i class="el-icon-circle-plus-outline" v-if="index==0" @click="add_multiWordGroup()"></i>
								
							</div>
							
						</div> 

						<div style="height: 0; overflow: hidden;">
							<el-input v-model="item.multiMedia" placeholder=""></el-input>
							
						</div>
				
				</el-form-item>	
		        <hr class="hr">

				<el-form-item 
 
				v-for="(item,index) in form.referenceGroup" 
				:label="index==0?'文献:':''" 
				:key="item.key" 
				:label-width="formLabelWidth"
				v-bind:class="form.referenceGroup.length>1 && index !=form.referenceGroup.length-1?'muitlSelect m-b-0':'muitlSelect'"
				>
				
						<div class="box" >
							<div class="box-flex-1"> 
 								<el-input size="small" v-model="item.url" placeholder="请输入参考文献"></el-input>
							</div> 
							<div class="p-l-10"> 
					 			<i class="el-icon-remove-outline" v-if="index>0" @click="del_referenceGroup(index)"></i>
					 			<i class="el-icon-circle-plus-outline" v-if="index==0" @click="add_referenceGroup()"></i>
								
							</div>
							
						</div> 
 
				
				</el-form-item>	

				<el-form-item label="排序:" :label-width="formLabelWidth"  prop="sort">
		 			<el-input-number size="small" v-model="form.sort" controls-position="right" :min="0"></el-input-number>
		 		</el-form-item>


				











		        <el-form-item>
		            <el-button size="small" @click="close">取消</el-button>
		            <el-button size="small" type="primary" @click="onSubmit('2')" :loading="loading2">暂存</el-button>
		            <el-button size="small" type="primary" @click="onSubmit('1')" :loading="loading1">提交发布</el-button>


		            <el-button size="small" type="primary" @click="onSubmit('0')" :loading="loading0">提交不发布</el-button>
		        </el-form-item>
		    </el-form>

		</el-dialog>
	</div>
</template>
<script>
	import dic from '../../../common/js/dic.js';
	import UploadImg from '../../../components/UploadImgChunk.vue'
	import SelectOpenId from '../../../components/next/SelectOpenId.vue'
	import Editor from '../../../components/editor/Editor.vue'
	import UploadVideoByChunk from '../../../components/UploadVideoByChunk.vue'
	import UploadOfficeByChunk from '../../../components/UploadOfficeByChunk.vue'



	
	


	export default{
		components:{UploadImg,SelectOpenId,Editor,UploadVideoByChunk,UploadOfficeByChunk},
		props:['isShow','modelId','callBack'],
		data(){
			return {
				show:false,
				formLabelWidth:'100px',

				ModelList:[],
				TypeList:[],
				loading0:false,
				loading1:false,
				loading2:false,




				form:{
					rootModularCode:'',//	是	string	文章资源所属一级模块
					modularCode:'',//	是	string	模块编号
					title:'',//	是	string	标题
					crux:'',//	是	string	关键字
					type:'0',//	是	string	数据类型 字典:resources_type
					authorId:'',//	是	string	作者open_id
					author:'',//	是	string	作者
					cover:'',//	是	string	封面图
					introduction:'',//	是	string	引言
					content:'',//	是	string	文章内容
					multiMedia:'',//	是	string	多媒体 视频或者文件
					multiMediaName:'',//	是	string	文件名称
					reference:'',//	是	string	参考文献
					state:'',
					sort:'1',

					multiMediaGroup:[
						{
							url:'',
							name:''
						}
					],
					multiWordGroup:[
						{
							url:'',
							name:''
						}
					],
					referenceGroup:[
						{
							url:''
						}
					]

				},
				formRules:{
					modularCode:[
						{ required: true, message: '请选择所属模块', trigger: 'blur' }
					],
					title:[
						{ required: true, message: '请输入标题', trigger: 'blur' }
					],
					crux:[
						{ required: true, message: '请输入关键字', trigger: 'blur' }
					],
					type:[
						{ required: true, message: '请选择类型', trigger: 'blur' }
					],
					cover:[
						{ required: true, message: '请上传封面图', trigger: 'blur' }
					],
					introduction:[
						{ required: true, message: '请输入引言', trigger: 'blur' }
					],
					content:[
						{ required: true, message: '请输入内容', trigger: 'blur' }
					],
					sort:[
						{ required: true, message: '请输入排序号', trigger: 'blur' }
					],


				}
			}
		},
		methods:{
			close:function(){
				this.$refs.form.resetFields();
				this.form = {
					...this.form,
					...{

						multiMediaGroup:[
							{
								url:'',
								name:''
							}
						],
						multiWordGroup:[
							{
								url:'',
								name:''
							}
						],
						referenceGroup:[
							{
								url:''
							}
						]
					}
				}
				this.$emit('update:isShow',false);
			},
			del_multiMediaGroup:function(index){
				this.form.multiMediaGroup.splice(index,1);
			},
			add_multiMediaGroup:function(index){
				this.form.multiMediaGroup.push({
							
							url:'',
							name:''
						
						});
			}, 
			del_multiWordGroup:function(index){
				this.form.multiWordGroup.splice(index,1);
			},
			add_multiWordGroup:function(index){
				this.form.multiWordGroup.push({
							
							url:'',
							name:''
						
						});
			}, 
			del_referenceGroup:function(index){
				this.form.referenceGroup.splice(index,1);
			},
			add_referenceGroup:function(index){
				this.form.referenceGroup.push({
							
							url:''
						
						});
			}, 
			

			soveForm:function(){

				if(this.form.type == '1'){ //视频

					this.form = {
						...this.form,
						...{
							multiMedia:(()=>{

								let tmp = [];
								this.form.multiMediaGroup.forEach(item=>{
									tmp.push(item.name+'!#!'+item.url);
								})

								return tmp.join('#;#');

							})()

						}
					}

				}

				if(this.form.type == '0' || this.form.type == '2'){ //文章或文件
					this.form = {
						...this.form,
						...{
							multiMedia:(()=>{

								let tmp = [];
								this.form.multiWordGroup.forEach(item=>{
									tmp.push(item.name+'!#!'+item.url);
								})

								return tmp.join('#;#');

							})()

						}
					}

				}



				this.form = {
					...this.form,
					...{
						reference:(()=>{

							let tmp = [];
							this.form.referenceGroup.forEach(item=>{
								(item.url!='') && tmp.push(item.url);
							})

							return tmp.length>0?tmp.join('|#|'):'';

						})()
					}
				}


			},
			
			onSubmit:function(sign){

				if(this.loading0 || this.loading1 || this.loading2){
					return false;
				}

				this.$refs.form.validate(valid=>{

					if(valid && (sign !== '2')){


						this.soveForm();



						if(sign == '0'){this.loading0 = true};
						if(sign == '1'){this.loading1 = true};
						if(sign == '2'){this.loading2 = true};

						this.form = {
							...this.form,
							...{
								state:sign
							}
						}

						console.log(this.form);



						this.$post('/admin/resources/save',this.form).then(({code})=>{

							if(code == '00'){
								this.$message({
									message:'添加成功！',
									type:'success'
								})
								this.loading0 = false;
								this.loading1 = false;
								this.loading2 = false;

								this.callBack();
								this.close();
							}

						}).catch(()=>{

							this.loading0 = false;
							this.loading1 = false;
							this.loading2 = false;

						})





					}
				})

			},
			getModelList:function(){
				this.$post('/admin/modular/list',{pcode:this.modelId}).then(({code,obj})=>{
					(code == '00') && (this.ModelList = obj)
				})
			}

		},
		mounted(){
			dic.ResourcesType().then(res=>{
				let { msg, code, data } = res;
				this.TypeList = data;	 
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
					this.form = {
						...this.form,
						...{
							rootModularCode:v
						}
					}
				},
				immediate:true

			},
			'isShow':function(v){
				this.show = v;

				if(v){
					this.$nextTick(this.getModelList);
				}
			},

		}
	}

</script>
<style scoped>
.tip {
	font-size: 12px;
	line-height: 16px;
	color: #999;
}
.hr{
	border: none;
    border-top: solid #e4e1e1 1px;
}
.tip i {
	color: #fc9153;
}
.muitlSelect i{
	cursor: pointer;
}
.fileName{
	width: 240px;
}
</style>