<template>
	<div>
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

			<input multiple :key="key" type="file" @change="addImg" ref="inputer" accept="image/png,image/jpeg,image/gif,image/jpg">


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
	
	<!-- 批量上传提示 -->
		<div role="alert" v-if="isBatch" style="line-height: 14px;" class="el-alert el-alert--warning is-light m-b-5">
			<i class="el-alert__icon el-icon-warning is-big"></i>
		    <div class="el-alert__content">
		    	<span class="el-alert__title is-bold" v-html="batchTip"></span>
		        <p class="el-alert__description" v-html="rejectName"></p><i class="el-alert__closebtn el-icon-close" @click="closeTip"></i>
		    </div>
		</div>

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

	            editLoading:null,


	            isBatch:false,
	            batchTip:'',
	            rejectName:'',

	            batchUploading:false,
	            uploading:false

			}
		},
		methods:{
			closeTip:function(){
				this.isBatch = false;
				this.tip = '';
			},
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
			// 顺序执行promise 构建队列
			queue(arr) {
			    var res=[];
			    var sequence = Promise.resolve();
			    arr.forEach(function (item) {
			        sequence = sequence.then(item).then(data=>{
			                data!== null && (res.push(data));
			                return res
			       })
			    })

			    return sequence
			},
			addImg:function(file){

				if(this.limtNum == this.imgs.length){

					this.$message({
						message:'最多可上传'+this.limtNum+'张图片！',
						type:'warning'

					}) 
					return false;
				}


				if(this.uploading){
					return false;
				}

				this.uploading = true;


				let inputDOM = this.$refs.inputer;  
				if(typeof inputDOM.files[0] == 'undefined'){

					return false;
				}else{

					if(inputDOM.files.length > 1){  //多图批量上传 

						// console.log('多图批量上传')
						//如果开启的裁剪功能 需要过滤掉不符合比例的
						if(!this.isCut){

							//分块上传
							this.batchUploading = true;
							
							this.isBatch = true;
							this.batchTip="<i class=\"el-icon-loading\"></i>正在批量上传中...请不要关闭对话框及窗口！";

							this.createChunk(inputDOM.files);

						}else{ 

							var rejectName = [];
							var resolveFile = [];  //可以上传的文件列表

							// ----promise队列方式---
							// 过滤掉不符合比例的
							var q = [];
							for (var i = 0; i < inputDOM.files.length; i++) {

								((t)=>{

									q.push(_=>{
										return new Promise((resolve,reject)=>{ 
											this.eqScale(inputDOM.files[t]).then(res=>{
												if(res == '0'){
													resolve(inputDOM.files[t])
												}else{
													rejectName.push(inputDOM.files[t].name);
													resolve(null)

													// reject('fail');
												}
											}).catch(_=>{})

										})
									})

								})(i)

							}


							this.queue(q).then(res=>{

								if(res.length == 0){
									this.$message({
										message:'没有符合比例的图片',
										type:'warning'
									})
									this.uploading = false;
									return false;
								}


								this.isBatch = true;
								this.batchTip="<i class=\"el-icon-loading\"></i>正在批量上传中...请不要关闭对话框及窗口！";
								this.createChunk(res);
								this.rejectName = rejectName.length>0?'以下图片不符合比例要求，请稍后重新上传<br>['+rejectName+']':'';
							})


							
							// ------end-------




							// ------递归方式--------
							//过滤掉不符合比例的
							// var filterFile = (index)=>{

							// 		this.eqScale(inputDOM.files[index]).then(res=>{
							// 			var t = index;
							// 			if(res == '0'){
							// 				resolveFile.push(inputDOM.files[t])
							// 			}else{
							// 				rejectName.push(inputDOM.files[t].name)
							// 			}

							// 			if(t == inputDOM.files.length-1){ 

							// 				// console.log('循环完毕')

							// 				if(resolveFile.length == 0){
							// 					this.$message({
							// 						message:'没有符合比例的图片',
							// 						type:'warning'
							// 					})
							// 					return false;
							// 				}
							// 				//分块上传
							// 				this.isBatch = true;
							// 				this.batchTip="<i class=\"el-icon-loading\"></i>正在批量上传中...请不要关闭对话框及窗口！";
							// 				this.createChunk(resolveFile);
							// 				this.rejectName = rejectName.length>0?'以下图片不符合比例要求，请稍后重新上传<br>['+rejectName+']':'';


							// 			}else{
							// 				filterFile(++t);
							// 			}

							// 		})
							// }

							// filterFile(0);

							// -------end--------------
 
							
						}
						

					}else{  //单图上传
						console.log('单图上传')

						this.fileChange(inputDOM.files[0]).then(_=>{
							this.uploading = false;
						});
					}


				}




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

			createChunk:function(files){


				// ----promise队列实现-----
				var q = [];
				for (var i = 0; i < files.length; i++) {

					((t)=>{

						q.push(_=>{
							return new Promise((resolve,reject)=>{
								
								this.initStep(files[t],files[t].name).then(res=>{
									resolve('ok');
								})
							})
						})

					})(i)
				}

				this.queue(q).then(res=>{

					this.batchTip="上传完毕！";
					this.uploading = false;


					if(this.rejectName == ''){
						setTimeout(()=>{
							this.closeTip();
						},1000)
					}
				})
				// ----end------------


				// -----递归实现------
				// var u = (index)=>{
				// 	this.initStep(files[index],files[index].name).then(res=>{
				// 		console.log(res); 
				// 		var t = index;

				// 		if(t == files.length-1){
				// 			this.batchTip="上传完毕！";

				// 			if(this.rejectName == ''){
				// 				setTimeout(()=>{
				// 					this.closeTip();
				// 				},1000)
				// 			}

				// 		}else{
				// 			setTimeout(_=>{

				// 				u(++t);
				// 			},200)
				// 		}
				// 	});
				// }
				// u(0);
				//-----end----------
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

				return new Promise((resolve,reject)=>{

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

		                    // this.formDataList.length >0 &&
		                    // // this.upload();
		                    // this.uploadByStep(0);

		                    if(this.formDataList.length >0){

		                    	if(this.isBatch){  //批量上传

		                    		this.batchUploadChunk().then(res=>{
		                    			resolve('ok')
		                    		})

		                    	}else{
		                    		this.uploadByStep(0)
		                    	}
		                    }



		                    // this.checkMd5();
		                }
					}
					 this.fileReader.onerror = function() {
		                this.$Message.error("读取文件出错，请重试");
		            };
		            this.loadNext();
					// this.fileReader.readAsArrayBuffer(file.raw);


				})


			},

			//选择多文件批量上传时 分块上传某一个文件 把每一块都分成一个promise对象 
			//上传完所有的块 表示一个文件上传完毕 最后返回promise 通知再上传下一个文件（下一个文件开始分块并上传）
			batchUploadChunk:function(){


				return new Promise((resolve,reject)=>{
						var q = [];
						for (var i = 0; i < this.formDataList.length; i++) {

							((t)=>{
								q.push(_=>{
									return new Promise((resolve,reject)=>{

										this.percent = parseInt((t/this.chunks)*100);

										this.$postWithFile('/admin/system/cutFileUpload',this.formDataList[t]).then(({code,obj})=>{
											if(code == '00'){
												resolve(obj);
											}
										})
									})
								})
							})(i)
						}

						this.queue(q).then(res=>{
							//上传完成某一个文件的所有块 res最后的一个值里返回的是文件地址
							console.log(res);
							var obj = res[res.length-1];

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


							setTimeout(_=>{
								this.percent = 0;
								resolve('ok');
							},200)

						})
				})

				


			},
			eqScale:function(imgObj){ 

				var _this = this;
				return new Promise((resolve,reject)=>{

					let reader = new FileReader();
				    reader.onload =  (evt)=> {
				        var img = new Image();
						img.onload = function(){
							// console.log(this.width);
							// console.log(this.height);

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

				console.log(file);

				return new Promise((resolve,reject)=>{
					if(!this.isCut){

						this.initStep(file,file.name).then(()=>{
							resolve('ok')
						});

					}else{

						console.log(file);

						this.eqScale(file).then(res=>{

							if(res == '0'){
								console.log('直接上传')
								this.initStep(file,file.name).then(()=>{
									resolve('ok')
								});
								
							}else{
								this.cut(file,file.name,file.type)
								// this.cut(file,file.name,file.type).then(()=>{
								// 	resolve('ok')
								// });

							}

						})


						// this.cut(file,file.name,file.type);

					}
				})


				
			},
			uploadByStep(num){

				return new Promise((resolve,reject)=>{

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
								this.isBatch = false;


								setTimeout(()=>{

									this.percent = 0;

									resolve('ok');



								},2000)


							}
	 


						}
					})

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
					this.key++;
					this.uploading = false;

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