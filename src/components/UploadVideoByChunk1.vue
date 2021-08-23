<template>
	<div>

				<el-upload
			action="/admin/file/uploadVideoFile?module=dc_video"
			:auto-upload="false"
			limit="1"
			:show-file-list="false"
			:on-success="handletopSuccess"
			:on-change="fileChange" 
			:before-upload="handleBeforeUpload"
			:on-error="handleUploadError"
			ref="upload"
			accept=".flv,.mp4" 
			class="videoUp"
		>
			<el-button size="small" type="primary"> 
			{{percent!=0?percent+'%':''}}选择视频</el-button>

			 <div class="pro_lay" v-if="loading">
					<div class="progress" v-bind:style="{'width':percent+'%'}"></div>
			 </div>
		</el-upload>

	</div>
</template>
<script>
	export default{
		components:{},
		props:['uploadVideo','uploadCover','pieceSize','uploadName'],
		data(){
			return {
				loading:false,

				showVideo: false,
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
	            snapshotFlag:1,
	            saveType:'local'

			}
		},
		methods:{
			getExt:function(name){
				var tmp = name.split('.');

				return tmp[tmp.length-1];
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
			fileChange:function(file){
				console.log(file);
				if(file.name !=''){
					this.$emit('update:uploadName',file.name.replace(/\..*?$/,''));
				}
				this.file = file.raw;
				this.taskId =(new Date()).getTime()+''+parseInt(Math.random()*10000000);


				this.chunks = Math.ceil(this.file.size / this.chunkSize);

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
	                        	    "fileType": this.getExt(this.file.name),
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
			uploadByStep(num){

				if(num == 0){this.loading =true};

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
							this.$refs.upload.clearFiles();


							if(this.snapshotFlag){  //封面图
								var tmp = obj.split('#');
								this.$emit('update:uploadVideo',tmp[0]);
								this.$emit('update:uploadCover',tmp[1]);

							}else{

								this.$emit('update:uploadVideo',obj);

							}

							this.loading = false

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

		},
		watch:{
			'pieceSize':{
				handler:function(v){
					console.log(typeof v);
					if(typeof v !='undefined'){

						if(v <=1024000){
							this.chunkSize = 1024000
						}else{
							this.chunkSize = v;
						}
					}

				},
				immediate:true
			}
		}
	}

</script>
<style scoped>
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
</style>
<style>
.videoUp button{
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
}

</style>
