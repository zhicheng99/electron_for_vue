<template>
	<div>
		<i class="el-icon-setting tip" @click="openSetting" title="设置" 
		v-if="imgObj!== null && positionTop>30"
		v-bind:style="{
			'left':positionLeft+10+'px',
			'top':positionTop+10+'px'
		}"
		></i>


		<el-dialog
		    title="设置"
		    :visible.sync="show"
		    width="30%"
		    @close="close" :append-to-body="true">
		    <el-form :model="form" :rules="formRules" ref="form" label-width="100px" class="p-t-0">
		    	 <el-tabs v-model="activeName" @tab-click="handleClick" class="p-t-0 p-l-10 p-r-10">
				    <el-tab-pane label="尺寸" name="first">
					      <el-row :gutter="0">
			            <el-col :span="12" class="padding">
					        <el-form-item label="宽：" prop="width">
								<el-input size="small" v-model="form.width" placeholder="" @input="wInput"></el-input>
					        </el-form-item>
			           
			            </el-col>
			            <el-col :span="12"  class="padding">
			                 <el-form-item label="高：" prop="height">
								<el-input size="small" v-model="form.height" placeholder=""  @input="hInput"></el-input>
					        </el-form-item>
			            </el-col>
			        </el-row>

				    </el-tab-pane>
				    <el-tab-pane label="链接" name="second"  :disabled="type=='iframe'">
				    	<el-row :gutter="0">
			            	<el-col :span="24" >

				    	 <el-form-item label="链接地址：" prop="link">
								<el-input size="small" v-model="form.link" placeholder="" @input="linkInput"></el-input>
					        </el-form-item>
					    </el-col>
				            <el-col :span="24" >

					        <el-form-item label="打开方式：" prop="target">
								<el-select size="small" v-model="form.target" placeholder="">
								    <el-option v-for="item in targetList"
								        :key="item.value"
								        :label="item.label"
								        :value="item.value">
								    </el-option>
								</el-select>
					        </el-form-item>
					    </el-col>
					</el-row>
				    </el-tab-pane> 
				  </el-tabs>
		  
		        <el-form-item>
		            <el-button size="small" @click="close">取消</el-button>
		            <el-button size="small" type="primary" @click="onSubmit">修改</el-button>
		        </el-form-item>
		    </el-form>
		</el-dialog>
	</div>
</template>
<script>
	export default{
		components:{},
		props:['positionLeft','positionTop','imgObj','editorContent','editorQuill'],
		data(){
			return {
				aimObj:null,
				show:false,
				form:{
					width:0,
					height:0,
					link:'',
				},
				formRules:{
					width:[
						{ required: true, message: '请图片宽度', trigger: 'blur' },
					],
					height:[
						{ required: true, message: '请图片高度', trigger: 'blur' },
					]
				},
				rate:1,

				targetList:[
					{
						label:'当前页',
						value:'_self'
					},
					{
						label:'新页打开',
						value:'_blank'
				
					}
				],
				activeName:'first',
				type:'img'
			}
		},
		methods:{
			wInput:function(){
				this.$nextTick(()=>{

					if(this.form.width.replace(/ /g,'') == ''){

						return false;
					}

					this.form = {
						...this.form,
						...{
							width:this.form.width.replace(/[^\d]/g,''),
							height:parseInt(this.form.width.replace(/[^\d]/g,'')*1/this.rate)
						}
					}

				})
			},
			hInput:function(){
				this.$nextTick(()=>{

					if(this.form.height.replace(/ /g,'') == ''){

						return false;
					}

					this.form = {
						...this.form,
						...{
							width:parseInt(this.form.height.replace(/[^\d]/g,'')*1*this.rate),
							height:this.form.height.replace(/[^\d]/g,'')
						}
					}

				})
			},


			openSetting:function(){ 

				if(this.imgObj == null){
					return false;
				}


				if(this.imgObj.tagName.toLowerCase() == 'iframe'){
					console.log(this.imgObj.offsetWidth);

					console.log(this.imgObj.style);
					var h = this.imgObj.offsetHeight
					var w = this.imgObj.offsetWidth;
				}else{

					var w = this.imgObj.width;
					var h = this.imgObj.height;
				}
				 

				this.rate = w/h;
 

				this.form = {
					...this.form,
					...{

						width:w,
						height:h
					}
				}

				this.show = true

			},
			close:function(){
				this.show = false;
			},
			onSubmit:function(){

				this.$refs.form.validate(valid=>{

					if(valid){
 

						// this.imgObj.style.width = this.form.width+'px';
						// this.imgObj.style.height = this.form.height+'px';


						this.imgObj.setAttribute('width',this.form.width);
						this.imgObj.setAttribute('height',this.form.height);

						(this.type =='img') && 
						this.createAParent();

						// console.log(this.editorQuill.getContents());
						this.$emit('update:editorContent',this.editorQuill.container.firstChild.innerHTML);

						this.close();

					}
				})
			},
			 domToString:function(node) {  
			     let tmpNode = document.createElement('div')
			     tmpNode.appendChild(node) 
			     let str = tmpNode.innerHTML
			     tmpNode = node = null; // 解除引用，以便于垃圾回收  
			     return str;  
			},
			createAParent:function(){
				var parent = this.imgObj.parentNode;

				if(this.form.link.replace(/ /g,'') !=''){
				   if(parent.tagName.toLowerCase() == 'a'){ //有链接
				   		parent.setAttribute('href',this.form.link);
				   		parent.setAttribute('target',this.form.target);

					}else{

					//如果没有a 则创建
					console.log('如果没有a 则创建'); 

					var a = document.createElement('a');
			        a.href=this.form.link;
			        a.target = this.form.target==''?'_self':this.form.target;
			        this.imgObj.parentNode.replaceChild(a,this.imgObj);
			        a.appendChild(this.imgObj);


					}
			
				}else{

				   if(parent.tagName.toLowerCase() == 'a'){ //有链接

					//清掉父 a标签 
					this.imgObj.parentNode.parentNode.insertBefore(this.imgObj.cloneNode(true),this.imgObj.parentNode);
				    this.imgObj.parentNode.parentNode.removeChild(this.imgObj.parentNode);

				   }

			

				}
			},
			getUrlOfImg:function(){ 
			   var parent = this.imgObj.parentNode;

			   if(parent.tagName.toLowerCase() == 'a'){ //有链接
			   		this.form = {
			   			...this.form,
			   			...{
			   				link: parent.getAttribute('href'),
			   				target:parent.getAttribute('target')?parent.getAttribute('target'):'_self'
			   			}
			   		};

			   }else{

			   	this.form = {
			   		...this.form,
			   		...{
			   			link:'',
			   			target:''
			   		}
			   	}
			   }

			}

		},
		mounted(){

		},
		created(){
	
		},
		computed:{

		},
		watch:{
			'show':function(v){
				if(v){ 
					this.activeName = 'first';
					this.getUrlOfImg();
					if(this.imgObj.tagName.toLowerCase() == 'img'){
						this.type ='img'
					}else{
						this.type ='iframe';
					}
 
				}
			}
		}
	}

</script>
<style scoped>
	.tip{
		position: absolute; 
		color:#E6A23C;
		font-size: 20px;
		font-weight: bold;
		cursor: pointer;
	}

</style>
