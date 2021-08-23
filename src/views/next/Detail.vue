<template>
	<div>
		<Header v-bind:curr-index="headerIndex"></Header>
		<div class="fix_lay">
			<div class="fix_area" v-bind:class="{'fixed':isFixed}">
						<div class="title">{{detail.title}}</div>
						<div class="author p-b-20">
							

							<!-- type:0 文章 -->
							<el-dropdown size="small" class="pull-right" v-if="detail.type == '0' && detail.files.length>0"  >
							  <el-button type="primary" size="small" :loading="loading">
							    下载<i class="el-icon-arrow-down el-icon--right"></i>
							  </el-button>
							  <el-dropdown-menu slot="dropdown">
							    <el-dropdown-item v-for="item in detail.files" :key="item">
							    	<!-- <a :href="item.fileUrl" class="down_link" target="_blank">{{item.fileName}}</a> -->
							    	<div @click="down(item.id,item.fileUrl)" class="fileItem">
							    	 	<img width="20" :src="returnFileUrl(item.fileUrl)" alt="">	{{item.fileName}}
							    	</div>
							    
							</el-dropdown-item>
							   
							  </el-dropdown-menu>
							</el-dropdown>


						{{detail.rootModularName}}-{{detail.modular}} 

						 

				    <UserInfoTip 
				    v-bind:user-name="detail.author"
				    v-bind:open-id="detail.authorId"
				    ></UserInfoTip>


						/{{detail.createDate |format}}
					</div>
			</div>

			
			
		</div>
	
	

	<div class="main clear">

		<div class="main_left pull-left">

			<div class="intro m-b-20">{{detail.introduction}}</div>

			<!-- type:0 文章 -->
			<div class="ql-editor con p-l-0 p-r-0" v-if="detail.type == '0'">
				<div v-html="detail.content">
					
				</div>
			</div>

			
			<!-- type:2 文件类型 -->
			<template v-if="detail.type == '2'">
				<!--  如果只有一个文件且是pdf 展示前三张图片 -->
				<template v-if="(detail.files.length ==1) && isPdf(detail.files[0])">
					<!-- 是pdf 需要展示前三页 -->
					<ShowPdf
					v-bind:file-id="detail.files[0].id"
					v-bind:file-name="detail.files[0].fileName"
					v-bind:file-url="detail.files[0].fileUrl"
					v-bind:article-id="uid"
					></ShowPdf>
				</template>
				<template v-else>
					<!-- 多个文件排列 -->
					
					<div class="clear m-t-40">
						<template v-for="(item,index) in detail.files">
							<FileTemplate 
							:key="item"
							v-bind:item-data="item"  
							v-bind:article-id="uid" 

							v-bind:class="{'file_tmp m':index%4==0}"></FileTemplate>
						</template>

					</div>


					
				</template>
			</template>

			<!-- type:1 视频 -->
			<template v-if="detail.type == '1'">
				<template v-if="detail.files.length ==1">
					<!-- 一个视频直接播放 -->
					<Player v-bind:video-url="detail.files[0].fileUrl"></Player>
					
				</template>
				<template v-else>
					<!-- 多个视频排列 -->
					<div class="clear m-t-40">
					
						<template v-for="(item,index) in detail.files">
							<FileTemplate  
							:key="item"
							v-bind:item-data="item"  
							v-bind:article-id="uid" 

							v-bind:class="{'m':index%4==0}"></FileTemplate>
						</template>

					</div>

					
				</template>
				
			</template>
			
			<div v-if="typeof detail.reference!='undefined' &&  detail.reference !=''">
				<el-collapse v-model="activeNames">
				  <el-collapse-item :title="'参考文献('+formatReference(detail.reference).length+')'" name="1">
				  	<div v-for="(item,index) in formatReference(detail.reference)">{{index+1}}、{{item}}</div> 
				  </el-collapse-item>

				</el-collapse>
				
			</div>



		</div>
		<div class="main_right pull-left">
			<DetailRight
			v-bind:root-code="detail.rootModularCode"
			v-bind:article-id="uid"
			v-bind:header-index="headerIndex"
			></DetailRight>
		</div>


		
		
	</div>
	 
	
	<BackTop></BackTop>


	
	</div>
</template>
<script>
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'
	import Header from '../../components/next/Header.vue'

	import ShowPdf from './ShowPdf.vue'
	import FileTemplate from './FileTemplate.vue'

	import Player from './Player.vue'

	import UserInfoTip from './UserInfoTip.vue'

	import DetailRight from './DetailRight.vue'
	import BackTop from '../../components/BackTop.vue'





	export default{
		components:{Header,ShowPdf,FileTemplate,Player,UserInfoTip,DetailRight,BackTop},
		props:[],
		data(){
			return {
				headerIndex:'',
				detail:{},
				uid:'',
				loading:false,
			    activeNames: [],
			    isFixed:false
			}
		},
		filters:{
			format:function(v){
				return typeof v !='undefined'?v.split(' ')[0]:'';
			}
		},
		methods:{
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
			returnFileUrl:function(v){
				let tmp = v.split('.');
				return '../../../static/img/next/file/'+tmp[tmp.length-1].toLowerCase()+'.png';
			},
			down:function(id,url){
				if(this.loading){
					return false
				}
				this.loading = true;
				this.$downFile('/api/data/multiMediaDownload',{id:id,uid:this.uid,fileUrl:url}).then(({code})=>{

					(code == '00') && (this.loading = false);
				}).catch(()=>{

					this.loading = false
				})
			},
 
			isPdf:function(fileObj){
				let tmp = fileObj.fileUrl.split('.');
				let ext = tmp[tmp.length-1];
				console.log(ext);

				if(ext.toLowerCase() == 'pdf'){
					return true;
				}else{
					return false;
				}

			},
			go:function(){
				console.log('ddd');
			},
			getDetail:function(){
				this.$post('/api/data/resourcesById',{uid:this.uid}).then(({code,obj})=>{
					(code == '00') && (this.detail = obj);
				})
			}

		},
		mounted(){
			this.headerIndex = this.$route.query.headerIndex;
			this.uid = this.$route.query.uid;
			this.getDetail()


			window.onscroll = ()=>{
				var top = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
				this.$store.commit('updateScrollTop', top);


				if(top>=50){
					this.isFixed = true;
				}else{
					this.isFixed = false;

				}
			} 
		},
		created(){
			
		},
		computed:{

		},
		watch:{
			
			'$route' (to, from) {
				console.log(to);

		        if (to.query.uid !== this.uid) {
					this.uid = this.$route.query.uid;
					this.getDetail()

		         }
		     } 

		},
		destroyed(){
			window.onscroll = null;

		}
	}

</script>
<style scoped>
.fix_lay{
	width: 100%;
	height: 106px;
}
.fix_area{
	width: 100%;
	height: 96px;
	background: #fff;

}

.fix_area.fixed{
	width: 100%;
	height: 96px;
	position: fixed;
	z-index: 1;
	left:0;
	top:0;
    border-bottom: 1px solid #DEDEDE;
}


.title{
	width: 1200px;
	margin:0 auto;
	padding-top:20px;
	/*font-family: SourceHanSansCN-Heavy;*/
font-size: 24px;
color: #000722;
}

.author{
	width: 1200px;
	margin:0 auto;
font-size: 16px;
color: #67687C;
letter-spacing: 1.3px;

border-bottom: 1px solid #DEDEDE;
}
.fix_area.fixed .author{
border-bottom: 1px solid #ffff;

}



.con{
	font-size: 14px;
	line-height: 24px;
}
.con img{
	max-width: 100%;
}
.intro{
	width: 100%;
	margin:0 auto;
font-size: 14px;
color: #666D70;
letter-spacing: -0.2px;
text-align: left;
line-height: 24px; 
}
.main{
	width: 1200px;
	margin:0 auto;
	margin-top:30px;
	padding-bottom: 100px;
}
.down_link{
	color:inherit;
	text-decoration: none;
}
.file_tmp{
	margin-left:12px;
	margin-bottom: 40px;
}
.file_tmp.m{
	margin-left:0;
}

.fileItem img{
	vertical-align: middle;
}
.main_left{
	width: 765px;
	margin-right: 35px;
}
.main_right{
	width: 400px;
}


</style>