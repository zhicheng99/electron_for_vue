<<template>
	<div>
		<el-dialog
		    title="村落详情"
		    :visible.sync="show"
		    @close="close">

		    <el-form :model="form" :rules="formRules" ref="form" label-width="100px" class="p-t-20">
		        <el-form-item label="村落名称:" prop="name">
		            <el-input size="small" v-model="form.name" placeholder="请输入村落名称" :disabled="true"></el-input>
		        </el-form-item>
		        <el-form-item label="城市:" prop="areaCode">
		        	<el-row :gutter="0" >
		        	    <el-col :span="8" class="p-r-5">
		        	    	<el-select size="small" v-model="form.parentArea" placeholder="请选择省" @change="areaChange" :disabled="true">
		        	    	    <el-option v-for="item in areaList"
		        	    	        :key="item.id"
		        	    	        :label="item.title"
		        	    	        :value="item.code">
		        	    	    </el-option>
		        	    	</el-select>

		        	    </el-col>
		        	   <el-col :span="8" class="p-l-5">

		        	    	<el-select size="small" v-model="form.areaCode" placeholder="请选择城市" @change="cityChange" :disabled="true">
		        	    	    <el-option v-for="item in cityChildren"
		        	    	        :key="item.id"
		        	    	        :label="item.title"
		        	    	        :value="item.code">
		        	    	    </el-option>
		        	    	</el-select>

		        	    </el-col>
		        	    <el-col :span="8" class="p-l-5">

		        	    	<el-select size="small" v-model="form.townCode" placeholder="请选择区县" :disabled="true">
		        	    	    <el-option v-for="item in townChildren"
		        	    	        :key="item.id"
		        	    	        :label="item.title"
		        	    	        :value="item.code">
		        	    	    </el-option>
		        	    	</el-select>

		        	    </el-col>

		        	</el-row>
		        </el-form-item>
		        <el-form-item label="地理信息:" prop="address">
		            <el-input size="small" v-model="form.address"  placeholder="请输入地理信息" :disabled="true"></el-input>
		        </el-form-item>
		        <el-form-item label="坐标:" prop="pos">
		        	<el-row :gutter="0" >
		        	    <el-col :span="22" class="p-r-5">  
							<el-input size="small" v-model="form.pos" placeholder="请输入经纬度" :disabled="true"></el-input>
		        	    </el-col> 
		        	     <el-col :span="2" class="text-center">
		        	     	<el-tooltip class="item" effect="dark" content="拾取坐标" placement="top">
			        	     	<i class="el-icon-position" @click="posVisible=true"></i>
						    </el-tooltip>
		        	    </el-col>
		        	</el-row>
		        </el-form-item>
		         <el-form-item label="介绍标题:" prop="title">
		            <el-input size="small" v-model="form.title"  placeholder="请输入介绍标题" :disabled="true"></el-input>
		        </el-form-item>
		        <el-form-item label="村落简介:" prop="content" >
		            <el-input type="textarea" size="small" v-model="form.content"  placeholder="请输入村落简介" maxlength="200"
  show-word-limit :disabled="true"></el-input>
		        </el-form-item>
		         <el-form-item label="热门标签:">
		         	<el-radio v-model="form.hot" label="1" :disabled="true">是</el-radio>
		         	<el-radio v-model="form.hot" label="0" :disabled="true">否</el-radio>

		        </el-form-item>
		        <el-form-item label="守护人昵称:" prop="guard"> 
		            <el-input size="small" v-model="form.guard"  placeholder="请输入守护人昵称" :disabled="true"></el-input>
		        </el-form-item>
		        <el-form-item label="守护人头像:" prop="guardIcon"> 
		        	<UploadImg v-if="show" 
		 			v-bind:max-num="'1'" 
		 			v-bind:upload-img.sync="form.guardIcon"
		 			v-bind:piece-size="1024000"
		 			v-bind:is-cut="true"
					v-bind:fixed-number="'1:1'"
					v-bind:only-preview="true"

		 			></UploadImg>
		        </el-form-item>
		        <el-form-item label="守护人说:" prop="guardSay"> 
		            <el-input type="textarea" size="small" v-model="form.guardSay"  placeholder="请输入守护人说" maxlength="100"
  show-word-limit :disabled="true"></el-input>
		        </el-form-item>
		      <!--   <el-form-item label="守护人主页:" prop="guardHome"> 
		            <el-input size="small" v-model="form.guardHome"  placeholder="请输入守护人主页" :disabled="true"></el-input>
		        </el-form-item> -->
		        <el-form-item label="村落首页:" prop="home">
		        	<UploadImg v-if="show"
		 			v-bind:max-num="'1'" 
		 			v-bind:upload-img.sync="form.home"
		 			v-bind:piece-size="1024000"
		 			v-bind:is-cut="true"
					v-bind:fixed-number="'1:1'"
					v-bind:only-preview="true"

		 			></UploadImg>
		        </el-form-item>
		        <el-form-item label="村落图集:" prop="atlas"> 
		        	<UploadImg v-if="show" 
		 			v-bind:max-num="'10'" 
		 			v-bind:upload-img.sync="form.atlas"
		 			v-bind:piece-size="1024000"
		 			v-bind:is-cut="true"
					v-bind:fixed-number="'1:1'"
					v-bind:only-preview="true"
		 			></UploadImg>
		        </el-form-item>
		        <el-form-item label="视频展示模板:">
		        	<el-radio v-model="form.modelType" label="1" :disabled="true">简约版</el-radio>
		         	<el-radio v-model="form.modelType" label="2" :disabled="true">精细版</el-radio>
		        </el-form-item>

		           <!-- label可以编辑 -->
				<template v-for="(item, index) in form.video">
					 <div class="el-form-item"
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
					       	<el-input class="p-l-0 p-r-0 label-input" size="mini" v-model="item.labelName" placeholder="自定义标签" :disabled="true"></el-input>
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

		        			 <UploadVideo v-bind:video-urls.sync="item.videoUrl" v-bind:only-preview="true"></UploadVideo> 

					    	
					      </el-form-item>
					    </div>
					</div>
				</template>
 
		       <!--  <el-form-item
				    v-for="(item, index) in form.video"
				    :label="item.labelName+':'"
				    :key="item"
				    :prop="'video.' + index + '.videoUrl'"
				    :rules="{
				      required: true, message: '请上传视频', trigger: 'blur'
				    }"

				    v-if="(form.modelType=='1' && index==0) || (form.modelType=='2' && index!==0)"
				  > 
					
        			 <UploadVideo v-bind:video-urls.sync="item.videoUrl" v-bind:only-preview="true"></UploadVideo> 
				  
				  </el-form-item> -->
				<el-form-item label="排序:"> 
				  	<el-input-number size="small" v-model="form.sort" controls-position="right" :min="0" :disabled="true"></el-input-number>
		        </el-form-item>

		        <el-form-item>
			        <el-button size="small" @click="close">取 消</el-button>
			        <!-- <el-button size="small" type="primary" @click="submit" :loading="doing">确 定</el-button> -->
		        </el-form-item>
		    </el-form>
		     
		</el-dialog>

		<GetPosition v-bind:is-show.sync="posVisible"></GetPosition>
	</div>
</template>
<script>
	import UploadImg from '../../../../components/UploadImgChunk.vue'
	import UploadVideo from '../../../../components/UploadVideo.vue'
	import GetPosition from '../../../../components/village/GetPosition.vue'


	import dic from '../../../../common/js/dic.js'

	export default{
		components:{UploadImg,UploadVideo,GetPosition},
		props:['isShow','callBack','rowId'],
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
					hot:'0',//	是	string	热门标签 1是0否
					guard:'',//	是	string	守护人昵称
					guardIcon:'',//	是	string	守护人头像
					guardSay:'',//	是	string	守护人说
					guardHome:'',//	是	string	守护人主页
					home:'',//	是	string	村落首页
					atlas:'',//	是	string	村落图集
					modelType:'1',//	是	string	视频展示模版 1简约2精细
					videoStr:'',//是	string	视频信息 如是如下

					video:[],
					sort:0

				},
				formRules:{
					name:[
						{ required: true, message: '请输入村落名称', trigger: 'blur' }
					],
					areaCode:[
						{ required: true, message: '请选择城市', trigger: 'blur' }
					],
					address:[
						{ required: true, message: '请输入地理信息', trigger: 'blur' }
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
					guard:[
						{ required: true, message: '请输入守护人昵称', trigger: 'blur' }
					],
					guardSay:[
						{ required: true, message: '请输入守护人说', trigger: 'blur' }
					],
					guardIcon:[
						{ required: true, message: '请上传守护人头像', trigger: 'blur' }
					],
					guardHome:[
						{ required: true, message: '请输入守护人主页', trigger: 'blur' }
					],
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
				this.$emit('update:rowId','');
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
			submit:function(){
				this.$refs.form.validate(valid=>{

					if(valid){
						var posArr = this.form.pos.split(',');
						var createVideoStr = ()=>{
							var tmp = [];
							if(this.form.modelType=='1'){ //简约版
								return [this.form.video[0]];
							}else{
								this.form.video.forEach((item,key)=>{
									if(key>0){
										tmp.push(item);
									}
								})
								return tmp;
							}
						}
						this.form = {
							...this.form,
							...{
								lng:posArr[0],//	是	string	坐标
								lat:posArr[1],//	是	string	坐标
								videoStr:JSON.stringify(createVideoStr())
							}
						}

						this.doing = true
						this.$post('/admin/village/save',this.form).then(({code})=>{
							(code == '00')&& (()=>{

								this.$message({
									message:'编辑成功！',
									type:'success'
								})

								this.doing = false;
								this.callBack && this.callBack();
								// this.$refs.form.resetFields();
								this.close();

							})()

						}).catch(()=>{

							this.doing = false;
						})

					}
				})
			},
			areaChange:function(){
				this.$nextTick(()=>{

					if(this.form.parentArea!=''){
							this.form = {
								...this.form,
								...{
									areaCode:''
								}
							}

							var tmp = [];
							this.areaList.forEach(item=>{
								if(item.code == this.form.parentArea){
									tmp = item.children;
								}
							})

							this.areaChildren = tmp;

					}
				})
			},
			createVideo:function(data){
				//创建出this.form.video
				//取得所有标签
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

						//根据标签中label做对应 重置videoUrl
						tmp.forEach(item=>{
							data.videos.forEach(v=>{
								if(item.label == v.label){
									item.videoUrl = v.videoUrl
								}
							})
						})

						this.form = {
							...this.form,
							...{
								video:tmp,
								 //如果没有上传视频 modelType置空
								modelType:data.videos.length ==0?'':this.form.modelType
							}
						};

						delete this.form.videos;


					})()
				})
			},
			getDetail:function(id){
				this.$post('/admin/village/query',{id:id}).then(({code,obj})=>{
					(code == '00') && (()=>{
						//初始化
						this.form = {
							...obj,
							...{
								pos:obj.lng||''+','+(obj.lat||'')
							}
						}
						delete this.form.updateDate;
						delete this.form.createDate;

						//根据parentArea{省份id}匹配出二级的城市列表
						var tmp = [];
						this.areaList.forEach(item=>{
							if(item.code == this.form.parentArea){
								tmp = item.children;
							}
						})
						this.cityChildren = tmp;


						//根据areaCode匹配出三级县区
						var tmp1 = [];
						this.cityChildren.forEach(item=>{
							if(item.code == this.form.areaCode){
								tmp1 = item.children;
							}
						})
						this.townChildren = tmp1;


						//创建出this.form.video
						this.createVideo(obj)



					})()
				})
			}
		},
		mounted(){
			// dic.VideoLabel().then(({code,obj})=>{
			// 	(code == '00') && (()=>{

			// 		var tmp = [];
			// 		obj.forEach(item=>{
			// 			tmp.push({
			// 				"label":item.value,
			// 				"labelName":item.label,
			// 				"videoUrl":""
			// 			})
			// 		})

			// 		this.form.video = tmp;

			// 	})()
			// })

			this.getArea();
		},
		created(){
			
		},
		computed:{

		},
		watch:{
			'isShow':function(v){
				this.show = v;
			},
			'rowId':function(v){
				if(v!= ''){
					this.getDetail(v);
				}
			}

		}
	}

</script>
<style scoped>
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