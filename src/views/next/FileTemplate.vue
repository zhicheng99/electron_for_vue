<template>
	<div class="file_tmp" >
		<div @click="showOrDown" v-loading="loading" element-loading-text="正在下载...">

			<div class="cover_lay" >
				<img class="cover" :src="returnFileUrl(itemData.fileUrl)" alt="" lazy>
				<div class="crux text-break" >
					<!-- <span>标签</span>
					<span>标签</span> -->
				</div>
			</div>

			<div class="title m-t-30 text-break">{{itemData.fileName}}</div>
			<!-- <div class="info m-t-20">{{itemData.introduction}}</div> -->

			<div class="text-right p-t-20 go" >
					<i class="el-icon-right" ></i>
			</div>

		</div>
	

		<ShowPdfDialog
		v-bind:is-show.sync="pdfVisible"
		v-bind:file-id="itemData.id"
		v-bind:article-id="articleId"
		v-bind:file-name="itemData.fileName"
		v-bind:file-url="itemData.fileUrl"
		></ShowPdfDialog>
	


		<ShowVideoDialog
		v-bind:is-show.sync="videoVisible"
		v-bind:video-url="itemData.fileUrl"
		></ShowVideoDialog>

	</div>
</template>
<script>
	import ShowPdfDialog from './ShowPdfDialog.vue'
	import ShowVideoDialog from './ShowVideoDialog.vue'

	export default{
		components:{ShowPdfDialog,ShowVideoDialog},
		props:['itemData','articleId'],
		data(){
			return {
				pdfVisible:false,
				videoVisible:false,
				loading:false
			}
		},
		methods:{
			isVideo:function(v){
				var fileExt = {
					'flv':1,
					'mov':1,
					'mp4':1,
					'm4a':1,
					'3gp':1,
					'3g2':1
				}

				if(fileExt[v]){
					return true;
				}else{
					return false;
				}

			},
			down:function(){
				if(this.loading){
					return false
				}
				this.loading = true;
				this.$downFile('/api/data/multiMediaDownload',{id:this.itemData.id,uid:this.articleId,fileUrl:this.itemData.fileUrl}).then(({code})=>{

					(code == '00') && (this.loading = false);
				})
			},
			showOrDown:function(){

				if(this.returnExt(this.itemData.fileUrl) == 'pdf'){
					this.pdfVisible = true;
				}else if(this.isVideo(this.returnExt(this.itemData.fileUrl))){
					this.videoVisible = true;
				}else{
					// alert('直接下载文件');
					this.down();

				}

			},
			returnExt:function(v){
				let tmp = v.split('.');
				return tmp[tmp.length-1].toLowerCase();
			},
			returnFileUrl:function(v){
				let tmp = v.split('.');
				return '../../../static/img/next/'+tmp[tmp.length-1].toLowerCase()+'.png';
			},
			format:function(v){
				if(v!=''){
					if(v.indexOf(',')>-1){

						let tmp = v.split(',');
						let s = '';
						tmp.forEach(item=>{
							s+='<span>'+item+'</span>'
						})

						return s;


					}else{

						return '<span>'+v+'</span>'
					}

				}else{

					return ''
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

		}
	}

</script>
<style scoped>
.file_tmp{
	cursor: pointer;
	float: left;
	width: 290px;
	height: 290px;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
	/*box-shadow: 0 21px 14px rgb(140 153 191 / 20%);*/

	padding:0 12px 12px 12px;
	transition: box-shadow 0.3s;
-moz-transition: box-shadow 0.3s; /* Firefox 4 */
-webkit-transition: box-shadow 0.3s; /* Safari 和 Chrome */
-o-transition: box-shadow 0.3s; /* Opera */
border:solid #f4f4f4 1px;

}
.file_tmp:hover{
	box-shadow: 0 21px 14px rgb(140 153 191 / 20%);


}
.file_tmp a{
	text-decoration: none;
}
.cover_lay{
	position: relative;
	height: 166px;
	background: #F6F6F6;
}
.cover{
	width: 100%;
	height: 100%

}
.crux{
	position: absolute;
	left:0;
	bottom:0;
	width: 100%;
	padding: 10px;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
}
.cover_lay span{
	margin-right: 10px;
	display: inline-block;
	height: 18px;
	padding:0 10px;
	background: rgba(0,0,0,0.35);
border-radius: 100px;
font-size: 10px;
color: #FFFFFF;
letter-spacing: 0;
}
.title{
	font-weight: bold;
	font-size: 20px;
	color: #000722;
	letter-spacing: 0;
	text-align: left;
}
.info{
font-size: 14px;
color: #AEAFB0;
letter-spacing: 0;
text-align: justify;

overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    height: 63px;
}
.go i{
	font-weight: bold;
	font-size: 18px;
color: #4E9BFA;
}

</style>
<style>
	.crux span{
		margin-right: 10px;
	display: inline-block;
	height: 18px;
	padding:0 10px;
	background: rgba(0,0,0,0.35);
border-radius: 100px;
font-size: 10px;
color: #FFFFFF;
letter-spacing: 0;
	}
</style>