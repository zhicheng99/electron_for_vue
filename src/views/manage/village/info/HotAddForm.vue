<<template>
	<div>
		<el-dialog
		    title="添加村落"
		    :visible.sync="show"
		    @close="close">

		    <el-form :model="form" :rules="formRules" ref="form" label-width="100px" class="p-t-20">
		        <el-form-item label="村落名称:" prop="name">
		            <el-input size="small" v-model="form.name" placeholder="请输入村落名称"></el-input>
		        </el-form-item>
		        <el-form-item label="城市:" class="is-required">
		        	<el-row :gutter="0" >
		        	    <el-col :span="8" class="p-r-5">
					        <el-form-item prop="parentArea">

		        	    	<el-select size="small" v-model="form.parentArea" placeholder="请选择省" @change="provinceChange">
		        	    	    <el-option v-for="item in areaList"
		        	    	        :key="item.id"
		        	    	        :label="item.title"
		        	    	        :value="item.code">
		        	    	    </el-option>
		        	    	</el-select>
		        	    </el-form-item>

		        	    </el-col>
		        	    <el-col :span="8" class="p-l-5">
					        <el-form-item prop="areaCode">

		        	    	<el-select size="small" v-model="form.areaCode" placeholder="请选择城市"  @change="cityChange" :disabled="form.parentArea==''">
		        	    	    <el-option v-for="item in cityChildren"
		        	    	        :key="item.id"
		        	    	        :label="item.title"
		        	    	        :value="item.code">
		        	    	    </el-option>
		        	    	</el-select>
		        	    </el-form-item>

		        	    </el-col>
		        	     <el-col :span="8" class="p-l-5">
					        <el-form-item prop="townCode">

		        	    	<el-select size="small" v-model="form.townCode" placeholder="请选择区县" :disabled="form.areaCode==''">
		        	    	    <el-option v-for="item in townChildren"
		        	    	        :key="item.id"
		        	    	        :label="item.title"
		        	    	        :value="item.code">
		        	    	    </el-option>
		        	    	</el-select>
		        	    </el-form-item>

		        	    </el-col>

		        	</el-row>
		        </el-form-item>
		        <el-form-item label="详细地址:" prop="address">
		            <el-input size="small" v-model="form.address"  placeholder="请输入详细地址"></el-input>
		        </el-form-item>
		        <el-form-item label="坐标:" prop="pos">
		        	<el-row :gutter="0" >
		        	    <el-col :span="22" class="p-r-5">  
							<el-input size="small" v-model="form.pos" placeholder="请输入经纬度"></el-input>
		        	    </el-col> 
		        	     <el-col :span="2" class="text-center">
		        	     	<el-tooltip class="item" effect="dark" content="拾取坐标" placement="top">
			        	     	<!-- <i class="el-icon-position" @click="posVisible=true"></i> -->
			        	     	<a href="http://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank"><i class="el-icon-position" ></i></a>

						    </el-tooltip>
		        	    </el-col>
		        	</el-row>
		        </el-form-item>
		         <el-form-item label="介绍标题:" prop="title">
		            <el-input size="small" v-model="form.title"  placeholder="请输入介绍标题"></el-input>
  <!--  <el-input size="small" v-model="form.title"  placeholder="请输入介绍标题" maxlength="30"
  show-word-limit></el-input> -->
		        </el-form-item>
		        <el-form-item label="村落简介:" prop="content" >
		            <el-input type="textarea" size="small" v-model="form.content"  placeholder="请输入村落简介" ></el-input>
   <!-- <el-input type="textarea" size="small" v-model="form.content"  placeholder="请输入村落简介" maxlength="200"
  show-word-limit></el-input> -->
		        </el-form-item>
		       <!--   <el-form-item label="热门标签:">
		         	<el-radio v-model="form.hot" label="1" >是</el-radio>
		         	<el-radio v-model="form.hot" label="0" >否</el-radio>

		        </el-form-item> -->
		        <el-form-item label="守护人昵称:" prop="guard"> 
		            <el-input size="small" v-model="form.guard"  placeholder="请输入守护人昵称"></el-input>
		        </el-form-item>
		        <el-form-item label="守护人头像:" prop="guardIcon"> 
		        	<UploadImg v-if="show" 
		 			v-bind:max-num="'1'" 
		 			v-bind:upload-img.sync="form.guardIcon"
		 			v-bind:piece-size="1024000"
		 			v-bind:is-cut="true"
					v-bind:fixed-number="'1:1'"
		 			></UploadImg>
		 			<div class="tip"><i class="el-icon-warning"></i> 图片宽高比：1:1</div>

		        </el-form-item>
		        <el-form-item label="守护人说:" prop="guardSay"> 
		            <el-input type="textarea" size="small" v-model="form.guardSay"  placeholder="请输入守护人说"></el-input>
  <!--  <el-input type="textarea" size="small" v-model="form.guardSay"  placeholder="请输入守护人说" maxlength="70"
  show-word-limit></el-input> -->
		        </el-form-item>
		        <!-- <el-form-item label="守护人主页:" prop="guardHome"> 
		            <el-input size="small" v-model="form.guardHome"  placeholder="请输入守护人主页"></el-input>
		        </el-form-item> -->
		        <el-form-item label="村落首页:" prop="home">
		        	<UploadImg v-if="show"
		 			v-bind:max-num="'1'" 
		 			v-bind:upload-img.sync="form.home"
		 			v-bind:piece-size="1024000"
		 			v-bind:is-cut="true"
					v-bind:fixed-number="'5:7'"
		 			></UploadImg>
		 			<div class="tip"><i class="el-icon-warning"></i> 图片宽高比：5:7</div>
		        </el-form-item>
		        <el-form-item label="村落图集:" prop="atlas"> 
		        	<UploadMutiImgChunk v-if="show" 
		 			v-bind:max-num="'100'" 
		 			v-bind:upload-img.sync="form.atlas"
		 			v-bind:piece-size="1024000"
		 			v-bind:is-cut="true"
					v-bind:fixed-number="'16:9'"
		 			></UploadMutiImgChunk>
		 			<div class="tip"><i class="el-icon-warning"></i> 图片宽高比：16:9</div>

		        </el-form-item>
		        <el-form-item label="视频展示模板:">
		        	<el-radio v-model="form.modelType" label="1">简约版</el-radio>
		         	<el-radio v-model="form.modelType" label="2">精细版</el-radio>
		        </el-form-item>
				
				  <!-- label可以编辑 非必添-->
				<template v-for="(item, index) in form.video">
					 <div class="el-form-item"
						    v-if="(form.modelType=='1' && index==0) || (form.modelType=='2' && index!==0)"

					 >
						
					       <label for="video.0.videoUrl" class="el-form-item__label" style="width: 100px;">
					       	<el-form-item
					       	style="display: inline-block;"
						    :key="item" 
						    label-width="0px"
						  >
					       	<el-input class="p-l-0 p-r-0 label-input" size="mini" v-model="item.labelName" placeholder="自定义标签"></el-input>
				       </el-form-item>
					       :</label>
					    <div class="el-form-item__content" style="margin-left: 100px;">
						  <el-form-item
						    :key="item" 
						    label-width="0px"
						  >

		        			 <UploadVideo v-bind:video-urls.sync="item.videoUrl"></UploadVideo> 

					    	
					      </el-form-item>
					    </div>
					</div>
				</template>
				    
				    <!-- label可以编辑 必添-->
				<!-- <template v-for="(item, index) in form.video">
					 <div class="el-form-item is-required"
						    v-if="(form.modelType=='1' && index==0) || (form.modelType=='2' && index!==0)"

					 >
						
					       <label for="video.0.videoUrl" class="el-form-item__label" style="width: 100px;">
					       	<el-form-item
					       	style="display: inline-block;"
						    :key="item"
						    :prop="'video.' + index + '.labelName'"
						    :rules="{
						      required: true, message: '请输入标签', trigger: 'blur'
						    }"
						    label-width="0px"
						  >
					       	<el-input class="p-l-0 p-r-0 label-input" size="mini" v-model="item.labelName" placeholder="自定义标签"></el-input>
				       </el-form-item>
					       :</label>
					    <div class="el-form-item__content" style="margin-left: 100px;">
						  <el-form-item
						    :key="item"
						    :prop="'video.' + index + '.videoUrl'"
						    :rules="{
						      required: true, message: '请上传视频', trigger: 'blur'
						    }"
						    label-width="0px"
						  >

		        			 <UploadVideo v-bind:video-urls.sync="item.videoUrl"></UploadVideo> 

					    	
					      </el-form-item>
					    </div>
					</div>
				</template> -->
		      
 
		        <!-- <el-form-item
				    v-for="(item, index) in form.video"
				    :label="item.labelName+':'"
				    :key="item"
				    :prop="'video.' + index + '.videoUrl'"
				    :rules="{
				      required: true, message: '请上传视频', trigger: 'blur'
				    }"

				    v-if="(form.modelType=='1' && index==0) || (form.modelType=='2' && index!==0)"
				  > 
        			 <UploadVideo v-bind:video-urls.sync="item.videoUrl"></UploadVideo> 
				  
				  </el-form-item>
 -->
				  <el-form-item label="排序:"> 
				  	<el-input-number size="small" v-model="form.sort" controls-position="right" :min="0"></el-input-number>
		        </el-form-item>



		        <el-form-item>
			        <el-button size="small" @click="close">取 消</el-button>
			        <el-button size="small" type="warning" @click="submit('2')">暂 存</el-button>

			        <el-button size="small" type="primary" @click="submit('0')" :loading="doing">确 定</el-button>
		        </el-form-item>
		    </el-form>
		     
		</el-dialog>

		<GetPosition v-bind:is-show.sync="posVisible"></GetPosition>
	</div>
</template>
<script>
	import UploadImg from '../../../../components/UploadImgChunk.vue'
	import UploadMutiImgChunk from '../../../../components/UploadMutiImgChunk.vue'

	import UploadVideo from '../../../../components/UploadVideo.vue'
	import GetPosition from '../../../../components/village/GetPosition.vue'


	import dic from '../../../../common/js/dic.js'

	export default{
		components:{UploadImg,UploadVideo,GetPosition,UploadMutiImgChunk},
		props:['isShow','callBack'],
		data(){
			return {
				show:false,
				form:{
					// id	否	string	id 编辑时必传 新增时不传
					name:'',//	是	string	村落名称
					parentArea:'',
					areaCode:'',
					townCode:'',//	是	string	乡镇
					address:'',//	是	string	地理信息
					pos:'',
					lng:'',//	是	string	坐标
					lat:'',//	是	string	坐标
					title:'',//	是	string	介绍标题
					content:'',//	是	string	村落简介
					hot:'1',//	是	string	热门标签 1是0否
					guard:'',//	是	string	守护人昵称
					guardIcon:'',//	是	string	守护人头像
					guardSay:'',//	是	string	守护人说
					guardHome:'',//	是	string	守护人主页
					home:'',//	是	string	村落首页
					atlas:'',//	是	string	村落图集
					modelType:'',//	是	string	视频展示模版 1简约2精细
					videoStr:'',//是	string	视频信息 如是如下

					video:[],
					sort:0,
					state:'0'
				},
				formRules:{
					name:[
						{ required: true, message: '请输入村落名称', trigger: 'blur' }
					],
					parentArea:[
						{ required: true, message: '请选择省份', trigger: 'blur' }
					],
					areaCode:[
						{ required: true, message: '请选择城市', trigger: 'blur' }
					],
					townCode:[
						{ required: true, message: '请选择所在区县', trigger: 'blur' }
					],
					address:[
						{ required: true, message: '请输入详细地址', trigger: 'blur' }
					],
					pos:[
						{ required: true, message: '请输入坐标', trigger: 'blur' }
					],
					title:[
						{ required: true, message: '请输入介绍标题', trigger: 'blur' }
					],
					content:[
						{ required: true, message: '请输入村落简介', trigger: 'blur' }
					],
					// guard:[
					// 	{ required: true, message: '请输入守护人昵称', trigger: 'blur' }
					// ],
					// guardSay:[
					// 	{ required: true, message: '请输入守护人说', trigger: 'blur' }
					// ],
					// guardIcon:[
					// 	{ required: true, message: '请上传守护人头像', trigger: 'blur' }
					// ],
					// guardHome:[
					// 	{ required: true, message: '请输入守护人主页', trigger: 'blur' }
					// ],
					atlas:[
						{ required: true, message: '请上传村落图集', trigger: 'blur' }
					],
					home:[
						{ required: true, message: '请上传村落首页', trigger: 'blur' }
					],



				},
				areaList:[],       //省份
				cityChildren:[],   //城市
				townChildren:[],   //乡镇


				labelList:[],
				posVisible:false,
				doing:false

			}
		},
		methods:{
			close:function(){
				this.$emit('update:isShow',false);
			},
			getArea:function(){
				this.$post('/admin/area/list',{parentId:''}).then((res)=>{
						 let { msg, code, obj } = res;

						 if(code == '00'){ 
						 	this.areaList = obj;

						 }
						
				})
			},
			submit:function(state){

				var submit = ()=>{
						var createVideoStr = ()=>{
							var tmp = [];
							if(this.form.modelType=='1'){ //简约版

								//上传了视频才会保存
								if(this.form.video[0].videoUrl != ''){
									return [this.form.video[0]];
								}else{
									return [];
								}

							}else if(this.form.modelType=='2'){
								this.form.video.forEach((item,key)=>{
									if(key>0){
										//上传了视频才会保存
										if(item.videoUrl !=''){
											tmp.push(item);
										}
									}
								})

								return tmp;
							}else{
								return [];
							}
						}
						var posArr = this.form.pos.split(',');
						this.form = {
							...this.form,
							...{
								lng:posArr[0]||'',//	是	string	坐标
								lat:posArr[1]||'',//	是	string	坐标
								videoStr:JSON.stringify(createVideoStr()),
								state:state,
								//如果没有上传视频 modelType置空
								 modelType:(createVideoStr()).length == 0?'':this.form.modelType

							},
						}

						this.doing = true
						this.$post('/admin/village/save',this.form).then(({code})=>{
							(code == '00')&& (()=>{

								this.$message({
									message:'添加成功！',
									type:'success'
								})

								this.doing = false;
								this.callBack && this.callBack();
								this.$refs.form.resetFields();
								this.form = {
									...this.form,
									...{
										name:'',//	是	string	村落名称
										parentArea:'',
										areaCode:'',
										townCode:'',//	是	string	乡镇
										address:'',//	是	string	地理信息
										pos:'',
										lng:'',//	是	string	坐标
										lat:'',//	是	string	坐标
										title:'',//	是	string	介绍标题
										content:'',//	是	string	村落简介
										hot:'0',//	是	string	热门标签 1是0否
										guard:'',//	是	string	守护人昵称
										guardIcon:'',//	是	string	守护人头像
										guardSay:'',//	是	string	守护人说
										guardHome:'',//	是	string	守护人主页
										home:'',//	是	string	村落首页
										atlas:'',//	是	string	村落图集
										modelType:'',//	是	string	视频展示模版 1简约2精细
										videoStr:'',//是	string	视频信息 如是如下

										video:[],
										sort:0,
										state:'0'
									}
								}
								this.initVideo();
								this.close();

							})()

						}).catch(()=>{

							this.doing = false;
						})
				}


				if(state == '2'){  //暂存只验证标题

					if(this.form.name.replace(/ /g,'') == ''){
						this.$message({
							message:'请输入村落名称！',
							type:'warning'
						})
						return false;
					}

					submit();

				}else{
					this.$refs.form.validate(valid=>{

						if(valid){
							submit();
						}
					})
				}

			},
			provinceChange:function(){
				this.$nextTick(()=>{
					
					if(this.form.parentArea!=''){
							this.form = {
								...this.form,
								...{
									areaCode:'',
									townCode:''
								}
							}

							var tmp = [];
							this.areaList.forEach(item=>{
								if(item.code == this.form.parentArea){
									tmp = item.children;
								}
							})

							this.cityChildren = tmp;

					}
				})
			},
			cityChange:function(){
				this.$nextTick(()=>{

					if(this.form.areaCode!=''){
							this.form = {
								...this.form,
								...{
									townCode:''
								}
							}

							var tmp = [];
							this.cityChildren.forEach(item=>{
								if(item.code == this.form.areaCode){
									tmp = item.children;
								}
							})

							this.townChildren = tmp;

					}


				})
			},
			initVideo:function(){
				dic.VideoLabel().then(({code,obj})=>{
					(code == '00') && (()=>{

						var tmp = [];
						obj.forEach(item=>{
							tmp.push({
								"label":item.value,
								"labelName":item.label,
								"videoUrl":""
							})
						})

						this.form.video = tmp;

					})()
				})
			}
		},
		mounted(){
			
			this.initVideo();
			this.getArea();
		},
		created(){
			
		},
		computed:{

		},
		watch:{
			'isShow':function(v){
				this.show = v;
			}

		}
	}

</script>
<style scoped>
.tip{
	font-size: 12px;
	line-height: 12px;
}
.tip i{
	color: #0166FF
}
.label-input{
	display: inline-block;
	width: 70px;
}

</style>
<style>
.label-input .el-input__inner{
	padding:0;
	text-align: right;
	font-size: 14px;
}
</style>