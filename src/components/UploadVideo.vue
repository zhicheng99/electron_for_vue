<template>
	<div>

		<div class="item up" v-for="(item,index) in covers"
		v-bind:style="{
			'background': 'url('+item+') center center no-repeat',
			'backgroundSize':'cover',
			'position':'relative',
			'backgroundColor':'#fff'}"
		@click="showPre(item,index)"
		>


			<i class="el-icon-close" @click.stop="close(index)" v-if="!onlyPreview"></i>


			<span class="el-icon-back" title="前移" @click="prev(index)" v-if="!onlyPreview && index>0"></span>
			<span class="el-icon-right" title="后移" @click="next(index)" v-if="!onlyPreview && index<covers.length-1"></span>

			<span class="modi el-icon-upload" v-if="!onlyPreview" @click="modiCover(index)">
			</span>
			
		</div>

		<div class="item up box box-align-center"  v-if="!onlyPreview">
			<i class="el-icon-upload"></i>
			<UploadVideoByChunk 
			v-bind:upload-video.sync="tmpUrl"
			v-bind:upload-cover.sync="tmpCover"
			v-bind:call-back="setTip"
			:piece-size="1024000" 
			></UploadVideoByChunk>
		</div>

		<!-- 批量上传提示 -->
		<div role="alert" v-if="isBatch" style="line-height: 14px;" class="el-alert el-alert--warning is-light m-b-5">
			<i class="el-alert__icon el-icon-warning is-big"></i>
		    <div class="el-alert__content">
		    	<span class="el-alert__title is-bold">
		    		<i class="el-icon-loading"></i>正在批量上传中...请不要关闭对话框及窗口！
		    	</span>
		    </div>
		</div>

		
		<ModiCover 
		v-bind:is-show.sync="ModiCoverVisible"
		v-bind:video-cover.sync="videoCover"
		></ModiCover>


	</div>
</template>
<script>
	// import UploadVideoByChunk from './UploadVideoByChunk1.vue'
	import UploadVideoByChunk from './UploadMutiVideoByChunk.vue'

	import ModiCover from './ModiCover.vue'

	export default{
		components:{UploadVideoByChunk,ModiCover},
		props:['videoUrls','onlyPreview'],
		data(){
			return {
				urls:[], //视频地址
				covers:[], //视频封面

				tmpUrl:'',
				tmpCover:'',
				key:0,

				ModiCoverVisible:false,
				modiIndex:'',
				videoCover:'',
				isBatch:false
			}
		},
		methods:{
			setTip:function(v){
				this.isBatch = v;
			},
			prev:function(index){


				if(index == 0){
					return false;
				}

				var tmp = this.covers[index-1];
				this.covers[index -1 ] = this.covers[index];
				this.covers[index] = tmp;


				var tmp = this.urls[index-1];
				this.urls[index -1 ] = this.urls[index];
				this.urls[index] = tmp;

 				
				this.sovleData();

			},
			next:function(index){

				if(index == this.covers.length -1){
					return false;
				}

				var tmp = this.covers[index+1];
				this.covers[index +1 ] = this.covers[index];
				this.covers[index] = tmp;

				var tmp = this.urls[index+1];
				this.urls[index +1 ] = this.urls[index];
				this.urls[index] = tmp;


				this.sovleData();

			},
			showPre:function(){

			},
			modiCover:function(index){
				this.modiIndex = index;
				this.videoCover = this.covers[index];
				this.ModiCoverVisible = true;

			},
			updateVideoUrls:function(v){
				this.$emit('update:videoUrls',v);
			},
			close:function(index){

				this.urls.splice(index,1);
				this.covers.splice(index,1);
				this.sovleData();
				
			},
			sovleData:function(){
				var t = [];
				for (var i = 0; i < this.urls.length; i++) {
					t.push(this.urls[i]+'#'+this.covers[i]);
				}
				this.updateVideoUrls(t.join(','));
			}

		},
		mounted(){

		},
		created(){
			
		},
		computed:{

		},
		watch:{
			'tmpUrl':function(v){
				console.log(v);
				if(v!= ''){
					this.urls.push(v);

					this.$nextTick(()=>{
						this.tmpUrl = '';
						this.sovleData();
						this.key++;
					})
				}

			},
			'tmpCover':function(v){
				console.log(v);


				if(v!= ''){
					this.covers.push(v);

					this.$nextTick(()=>{
						this.tmpCover = '';
						this.sovleData();
						this.key++;

					})
				}

			},
			'videoUrls':{
				handler:function(v){
					if(v!=''){
						if(v.indexOf(',')>-1){
							var tmp = v.split(',');

							//视频地址#视频封面图
							var urls = [];
							var covers = [];
							for (var i = 0; i < tmp.length; i++) {

								var t = tmp[i].split('#');
								urls.push(t[0]);
								covers.push(t[1]);
							}

							this.urls = urls;
							this.covers = covers;


						}else{

							var t = v.split('#');
							this.urls = [t[0]];
							this.covers = [t[1]]; 
						}
					}
				},
				immediate:true
			},
			'videoCover':function(v){
				if(v!==''){

					this.covers[this.modiIndex] = v;
					this.sovleData();

				}
			}


		}
	}

</script>
<style scoped>

.clear:after{
		content: "";
		display: block;
		clear: both;
		line-height: 0;
		font-size: 0;
		height: 0;
	}
	.item{
		position: relative;
		float: left;
		width: 100px;
		height: 100px;

		-webkit-transform-origin: left top;
		-moz-transform-origin: left top;
		-ms-transform-origin: left top;
		-o-transform-origin: left top;
		transform-origin: left top;
		-webkit-transform: scale(0.9);
		-ms-transform: scale(0.9);
		-o-transform: scale(0.9);
		transform: scale(0.9);
	}
	.item:after{
		content: "";
		display: block;

		margin-top:100%;
		
	}
	.up{
		box-sizing:border-box;
		border:dashed #c3c3c3 1px; 
		background: #fff;
		border-radius: 4px;
		background-size: contain !important;

	}
	.el-icon-upload{
		font-size: 50px;
		color: #999
	}
	.item .el-icon-close{
		position: absolute;
		top: 1px;
	    right: 1px;
	    font-size: 14px;
		background: #0166FF;
		color: #fff;
		border-radius: 15px;
		padding:5px;
		cursor: pointer;


	}
.modi{
	position: absolute;
	right:0;
	bottom:0;
	/*line-height: 22px;*/
	color:#0166FF;
	font-size: 18px;


} 

.el-icon-back{
		position: absolute;
		color:#fff;
		right:38px;
		bottom:1px;
		background: #0166FF;
		cursor: pointer;


	}
.el-icon-right{
	position: absolute;
	color:#fff;
	right:20px;
	bottom:1px;
	background: #0166FF;
	cursor: pointer;


}

</style>