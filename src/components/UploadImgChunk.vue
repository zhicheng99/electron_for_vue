<template>
	<div class="clear" id="uu">
		<div class="item up" v-for="(item,index) in imgs"
		v-bind:style="{
			'background': 'url('+item+') center center no-repeat',
			'backgroundSize':'cover',
			'position':'relative',
			'backgroundColor':'#fff'}"
		>
		<!-- @click="showPre(item,index)" -->


			<i class="el-icon-close" @click.stop="close(index)" v-if="!onlyPreview"></i>
			
			<i v-if="showDown"  class="down" v-bind:class="{'el-icon-download':pindex != index,'el-icon-loading':pindex==index}" @click.stop="down(item,index)"></i>


			<span class="el-icon-back" title="前移" @click="prev(index)" v-if="!onlyPreview && index>0"></span>
			<span class="el-icon-right" title="后移" @click="next(index)" v-if="!onlyPreview && index<imgs.length-1"></span>


		  <div class="pro_lay" v-if="editIndex == index && percent!=0">
				<div class="progress" v-bind:style="{'width':percent+'%'}"></div>
		  </div>
		</div>
		<div class="item up box box-align-center" v-if="imgs.length<limtNum && !onlyPreview">
			<i class="el-icon-upload"></i>

			<input :key="key" type="file" @change="addImg" ref="inputer" accept="image/png,image/jpeg,image/gif,image/jpg">


			<div class="pro_lay" v-if="editIndex == -1 && percent!=0">
				<div class="progress" v-bind:style="{'width':percent+'%'}"></div>
			</div>
		</div>

	

		<CutImg
  		v-bind:is-show.sync="isShow"
  		v-bind:img-url="imgUrl"
  		v-bind:call-back="initStep"
  		v-bind:file-name="fileName"
  		v-bind:file-type="fileType"
  		v-bind:fixed-number="fixedNumber"
  		></CutImg>
		
	
	</div>
</template>
<script>
	import FileSaver from 'file-saver';
	import CutImg from './CutImg.vue'


	export default{
		components:{
			CutImg
		},
		props:['maxNum','uploadImg','isDown','onlyPreview','pieceSize','isCut','fixedNumber'],
		data(){
			return {
				key:'0',

				isShow:false,
				img:'',

				imgs:[
					// '../../static/img/no.jpg'
				],
				editIndex:-1,
				limtNum:2,

				maxW :500,
        		maxH :500,

        		showDown:false,
        		downing:[],
        		pindex:-1, 



        		//分块上传
        		blobSlice: null,
	            file: null,
	            identifier: null,
	            chunkSize: 1024000,
	            chunks: 0,
	            currentChunk: 0,
	            spark: null,
	            fileReader: null,
	            tmpDataList: [],
	            formDataList: [],
	            uploadedList: [],
	            start: 0,
	            end: 0,
	            headers: {},
	            // urlCode: code.urlCode.lectureDemand,
	            xhr: null,
	            pauseStatus: false,
	            showProgress: false,
	            percent: 0,


	            uploadingChunk:0,  //正在上传的块
	            snapshotFlag:0,
	            saveType:'local',
	            taskId:'',


	            //在线裁图
	            isShow:false,
	            isCut:false,
	            imgUrl:'',
	            fileName:'',
	            fileType:'',

	            editLoading:null


			}
		},
		methods:{
			prev:function(index){


				if(index == 0){
					return false;
				}

				var tmp = this.imgs[index-1];
				this.imgs[index -1 ] = this.imgs[index];
				this.imgs[index] = tmp;

				this.$emit('update:uploadImg',this.imgs.join(','));


			},
			next:function(index){

				if(index == this.imgs.length -1){
					return false;
				}

				var tmp = this.imgs[index+1];
				this.imgs[index +1 ] = this.imgs[index];
				this.imgs[index] = tmp;

				this.$emit('update:uploadImg',this.imgs.join(','));

			},
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

			showPre:function(url,editIndex){

				if(!this.isCut){
					return false;
				}

				this.editLoading = this.$loading({
		          lock: true,
		          text: 'Loading',
		          spinner: 'el-icon-loading',
		          background: 'rgba(0, 0, 0, 0.7)'
		        });


				this.editIndex = editIndex;

				var _this = this;
				var i = new Image();
				i.onload = function(){

					let w = i.width;
					let h = i.height;

					let canvas = document.createElement('canvas');
					let ctx = canvas.getContext('2d');
					canvas.width = w;
					canvas.height = h;
					
					ctx.drawImage(i,0,0);

					try{

						let reader = new FileReader();
					    reader.onload =  (evt)=> {
					      var base64 = evt.target.result
						      _this.imgUrl = base64;

						      var t = url.split('/')

						      _this.fileName = t[t.length-1];
						      _this.fileType = 'image/png';
				              _this.isShow = true;
				              _this.editLoading.close();
					    };
					    reader.onerror = ()=>{
				              _this.editLoading.close();
					    }
					    reader.readAsDataURL(_this.dataURLtoBlob(canvas.toDataURL("image/png")));



					} catch(e){
						console.log(e);
						_this.$message({
							message:'图片数据转换失败（可能原因：图片跨域）',
							type:'warning'
						})
				        _this.editLoading.close();

					}

					
				}
				url = url.indexOf(location.protocol)>-1?url:url.replace(/http.*?\/\//g,location.protocol+'//');
				console.log(url);
				i.src = url;



				



				// this.img = img;
				// this.isShow = true;
			},

			close:function(index){
				this.imgs.splice(index,1);


				if(typeof this.uploadImg != 'undefined'){
					    this.$emit('update:uploadImg',this.imgs.join(','));
						
				}


			}, 
			addImg:function(file){

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

				this.fileChange(inputDOM.files[0]);



				// this.$postWithFile('/admin/system/uploadFile',{
				// 	file:inputDOM.files[0], 
				// }).then(({code,obj})=>{



				// 	(code == '00') &&
				// 	(()=>{
				// 		this.imgs.push(obj);

				// 	})()

				// 	if(typeof this.uploadImg != 'undefined'){
				// 	    this.$emit('update:uploadImg',this.imgs.join(','));

				// 	    this.key++;
				// 	}

				// })
			},
			getExt:function(name){
				var tmp = name.split('.');

				return tmp[tmp.length-1].toLowerCase();
			},
			cut:function(file,fileName,fileType){

				let reader = new FileReader();
			    reader.onload =  (evt)=> {
			      var base64 = evt.target.result
				      this.imgUrl = base64;
				      this.fileName = fileName;
				      this.fileType = fileType;
		              this.isShow = true;
			    };
			    reader.readAsDataURL(file);  

			},
			// taskId 任务 ID 索引
			// chunk 当前 第 N 块
			// size 上传文件块大小
			// totalChunk 总文件 块数 
			// totalSize 文件总大小 
			// chunkFile 文件块对象 
			//  fileType 文件类型 后缀名
			//  snapshotFlag  是否生成快照(视频类型专用)
			// saveType  文件保存路径（oss 、local）
			// module 文件归属模块 (默认 others)
			initStep:function(file,fileName){
				console.log('initStep');
				this.file = file;
				this.taskId =(new Date()).getTime()+''+parseInt(Math.random()*10000000);


				console.log(this.file.size);
				console.log(this.chunkSize);


				this.chunks = Math.ceil(this.file.size / this.chunkSize);


				console.log(this.taskId,this.file.size,this.chunks,this.chunkSize);

				// return false;

				this.fileReader.onload = e => {
					console.log(e.target.result);
					// this.spark.append(e.target.result); // Append array buffer
	                this.currentChunk++;
	                if (this.currentChunk < this.chunks) {
	                    this.loadNext();
	                } else {

	                	console.log('片分完了');
	                	console.log(this.tmpDataList);
	                    // this.identifier = this.spark.end(); //文件的MD5身份标识
	                    this.tmpDataList.map((el, i) => {
	                        // let formData = new FormData();


	                        // formData.append("fileType", this.getExt(this.file.name));
	                        // formData.append("totalSize", this.file.size);
	                        // formData.append("taskId", el.taskId);
	                        // formData.append("totalChunk", this.chunks);
	                        // formData.append("chunkFile", el.file);
	                        // formData.append("chunk", el.currentNum + 1);


	                        // this.formDataList.push(formData);

	                        this.formDataList.push({
	                        	    "fileType": this.getExt(fileName),
			                        "totalSize": this.file.size,
			                        "taskId": el.taskId,
			                        "totalChunk": this.chunks,
			                        "file": el.file,
			                        "size": el.currentSize,
			                        // "chunk": (el.currentNum + 1)
			                        "chunk": this.formDataList.length,
			                        'snapshotFlag':this.snapshotFlag,
			                        'saveType':this.saveType,
			                        'module':'video'

	                        });



	                    });


	                    console.log('生成多个formData表单');
	                    console.log(this.formDataList);

	                    this.formDataList.length >0 &&
	                    // this.upload();
	                    this.uploadByStep(0);



	                    // this.checkMd5();
	                }
				}
				 this.fileReader.onerror = function() {
	                this.$Message.error("读取文件出错，请重试");
	            };
	            this.loadNext();
				// this.fileReader.readAsArrayBuffer(file.raw);

			},
			eqScale:function(imgObj){ 

				var _this = this;
				return new Promise((resolve,reject)=>{

					let reader = new FileReader();
				    reader.onload =  (evt)=> {
				        var img = new Image();
						img.onload = function(){
							console.log(this.width);
							console.log(this.height);

							let n = _this.fixedNumber.split(":"); 
							let rate1 = n[0]/n[1];
							let rate2 = this.width/this.height; 
							if(parseInt(rate1*100) == parseInt(rate2*100)){
								resolve('0')
							}else{
								resolve('1')
							}

						}
						img.src = evt.target.result

				    };
				    reader.readAsDataURL(imgObj);  

				})


			},
			fileChange:function(file){


				if(!this.isCut){

					this.initStep(file,file.name);

				}else{

					console.log(file);

					this.eqScale(file).then(res=>{

						if(res == '0'){
							console.log('直接上传')
							this.initStep(file,file.name);
							
						}else{
							this.cut(file,file.name,file.type);

						}

					})


					// this.cut(file,file.name,file.type);

				}
			},
			uploadByStep(num){

				this.percent = parseInt((num/this.chunks)*100);

				this.uploadingChunk = num;

				this.$postWithFile('/admin/system/cutFileUpload',this.formDataList[this.uploadingChunk]).then(({code,obj})=>{
					if(code == '00'){

						if(this.uploadingChunk < (this.formDataList.length-1)){
 
								num++;
								this.uploadByStep(num); 
								 
						}else{

							this.percent = 100;


							console.log('上传完成了');
							// this.$refs.upload.clearFiles();
							this.key++;

							if(this.maxNum == 1){
								this.imgs = [obj];
							}else if(this.editIndex != -1){ //编辑某一个图片
								this.imgs[this.editIndex]  = obj;
							}else{
								this.imgs.push(obj); 

							}

							if(typeof this.uploadImg != 'undefined'){
							    this.$emit('update:uploadImg',this.imgs.join(','));
							}
							this.currentChunk = 0;
							this.uploadingChunk = 0;
							this.start =  0;
							this.end = 0;
							this.formDataList = [];
							this.tmpDataList = [];
							this.editIndex = -1;
							this.taskId = '';

							setTimeout(()=>{

								this.percent = 0;

							},2000)


						}
 


					}
				})

			},
			upload:function(){
				var tmp = [];
				this.formDataList.forEach(item=>{
					tmp.push(
							new Promise((resolve, reject)=>{
								this.$postWithFile('/admin/file/cutFileUpload',item).then((code)=>{
									if(code == '00'){
										resolve();
									}
								})	
							})
						)
				})

				Promise.all(tmp).then(()=>{ 
				    console.log('callback')

					this.$refs.upload.clearFiles();

				})


			},
			loadNext:function(){
				(this.start = this.currentChunk * this.chunkSize),
	                (this.end =
	                    this.start + this.chunkSize >= this.file.size
	                        ? this.file.size
	                        : this.start + this.chunkSize);
	            let pieceFile = this.blobSlice.call(
	                this.file,
	                this.start,
	                this.end
	            );

	            console.log(pieceFile);


	            pieceFile.name = this.file.name;
	            let tmpObj = {
	                file: pieceFile,
	                currentSize: this.end - this.start,
	                currentNum: this.currentChunk,
	                taskId:this.taskId
	            };
	            this.tmpDataList.push(tmpObj);
	            this.fileReader.readAsArrayBuffer(pieceFile);
			}

		},
		mounted(){

			if(typeof this.maxNum !='undefined'){
				this.limtNum = this.maxNum;
			} 
			
			console.log(this.chunkSize);

		},
		created(){

			this.blobSlice =
	            window.File.prototype.slice ||
	            window.File.prototype.mozSlice ||
	            window.File.prototype.webkitSlice;
	        // this.spark = new SparkMD5.ArrayBuffer();
	        this.fileReader = new FileReader();
	        this.percent = 0;
			
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
			},
			'pieceSize':{
				handler:function(v){
					console.log(typeof v);
					if(typeof v !='undefined'){

						if(v <=1024000){
							this.chunkSize = 1024000
						}else{
							this.chunkSize = v;
						}
					}else{
						this.chunkSize = 1024000
					}

					console.log(this.chunkSize);

				},
				immediate:true
			},
			'isCut':{
				handler:function(v){
					if(typeof v !='undefined'){
						this.isCut = v;
					}
				},
				immediate:true
			},
			'isShow':function(v){
				if(!v){
					// console.log('需要清空input file');
					this.key++;
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
		background: #0166FF;
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

	.pro_lay{
		position: absolute;
		height: 3px;
		line-height:10px;
		left:10px;
		right:10px;
		bottom:10px;
		background: #c3c3c3;
	}
	.progress{
		position: absolute;
		left:0;
		top:0;
		height: 3px;
		background: #409EFF
	}
	.el-icon-back{
		position: absolute;
		color:#fff;
		right:18px;
		bottom:1px;
		background: #0166FF;
		cursor: pointer;


	}
	.el-icon-right{
		position: absolute;
		color:#fff;
		right:1px;
		bottom:1px;
		background: #0166FF;
		cursor: pointer;


	}

</style>