<template>
	<div class="clear" id="uu">
		<div class="item up" v-for="(item,index) in imgs"
		v-bind:style="{
			'background': 'url('+item+') center center no-repeat',
			'backgroundSize':'cover',
			'position':'relative',
			'backgroundColor':'#fff'}"
		@click="showPre(item)"
		>


			<i class="el-icon-close" @click.stop="close(index)" v-if="!onlyPreview"></i>
			
			<i v-if="showDown"  class="down" v-bind:class="{'el-icon-download':pindex != index,'el-icon-loading':pindex==index}" @click.stop="down(item,index)"></i>
		  
		</div>
		<div class="item up box box-align-center" v-if="imgs.length<limtNum">
			<i class="el-icon-upload"></i>

			<input :key="key" type="file" @change="addImg" ref="inputer" accept="image/png,image/jpeg,image/gif,image/jpg">
		</div>


		
	
	</div>
</template>
<script>
	import FileSaver from 'file-saver';


	export default{
		components:{
		},
		props:['maxNum','uploadImg','isDown','onlyPreview'],
		data(){
			return {
				key:'0',

				isShow:false,
				img:'',

				imgs:[
					// '../../static/img/no.jpg'
				],
				limtNum:2,

				maxW :500,
        		maxH :500,

        		showDown:false,
        		downing:[],
        		pindex:-1, 

			}
		},
		methods:{
			dataURLtoBlob:function(baseurl) {
				    let arr = baseurl.split(','),
				        mime = arr[0].match(/:(.*?);/)[1],
				        bstr = atob(arr[1]),
				        n = bstr.length,
				        u8arr = new Uint8Array(n);
				    while (n--) {
				        u8arr[n] = bstr.charCodeAt(n);
				    }
				    return new Blob([u8arr], {
				        type: mime
				    });
			},
			down:function(url,index){

 

				if(this.pindex != -1){

					return false;
				}
				
				this.pindex = index;

				var img = new Image();
				img.onload = ()=>{

					let w = img.width;
					let h = img.height;

					let canvas = document.createElement('canvas');
					let ctx = canvas.getContext('2d');
					canvas.width = w;
					canvas.height = h;
					
					ctx.drawImage(img,0,0);


					let fileName = new Date().getFullYear()+''+(new Date().getMonth()+1)+''+new Date().getDate()+''+parseInt(Math.random()*10000);

					FileSaver.saveAs(this.dataURLtoBlob(canvas.toDataURL("image/png")), fileName+".png");

					setTimeout(()=>{
						this.pindex = -1;
					})

				}
				img.src = url;
			},
			hide:function(){
				this.isShow = false;
			},

			showPre:function(img){
				this.img = img;
				this.isShow = true;
			},

			close:function(index){
				this.imgs.splice(index,1);


				if(typeof this.uploadImg != 'undefined'){
					    this.$emit('update:uploadImg',this.imgs.join(','));
						
				}


			}, 
			addImg:function(){

				if(this.limtNum == this.imgs.length){

					this.$message({
						message:'最多可上传'+this.limtNum+'张图片！',
						type:'warning'

					}) 
					return false;
				}


				let inputDOM = this.$refs.inputer;  
				if(typeof inputDOM.files[0] == 'undefined'){

					return false;
				}




				this.$postWithFile('/admin/system/uploadFile',{
					file:inputDOM.files[0], 
				}).then(({code,obj})=>{



					(code == '00') &&
					(()=>{
						this.imgs.push(obj);

					})()

					if(typeof this.uploadImg != 'undefined'){
					    this.$emit('update:uploadImg',this.imgs.join(','));

					    this.key++;
					}

				})



			}

		},
		mounted(){

			if(typeof this.maxNum !='undefined'){
				this.limtNum = this.maxNum;
			} 
			

		},
		created(){
			
		},
		computed:{
			// doing:function(){
			// 	return this.index!=-1?this.downing[this.index]:false;
			// }
		},
		watch:{
			'uploadImg':{
				handler:function(v){

					if(typeof v !='undefined' && v!=''){

						if(v.indexOf(',')>-1){  //多个图片
							this.imgs = v.split(',');
						}else{
							this.imgs = [v];
						}

					}else{
						this.imgs = [];
					}

				},
				immediate:true
			},
			'isDown':{
				handler:function(v){
					if(typeof v !='undefined'){
						this.showDown = v;
					}
				},
				immediate:true
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
		/*background-size: cover;*/
		border-radius: 4px;

	}
	.up input{
		position: absolute;
		left:0;
		top:0;
		bottom:0;
		width: 100%;
		height:100%;
		opacity: 0;
	}
	.item .el-icon-close{
		position: absolute;
		top: 1px;
	    right: 1px;
	    font-size: 14px;
		background: #FC9153;
		color: #fff;
		border-radius: 15px;
		padding:5px;
		cursor: pointer;


	}
	.item .down{
		position: absolute;
		bottom:0;
		right:0;
		font-size: 20px;
		/*background: #FC9153;*/
		color: #FC9153;
		border-radius: 15px;
		padding:5px;
		cursor: pointer;
	}
	.el-icon-upload{
		font-size: 50px;
		color: #999
	}

</style>