<template>
	<div>
		<el-dialog
		    title="视频上传"
		    :visible.sync="show"
		    width="30%"
		    @close="close" :append-to-body="true">

		    <el-form :model="form" :rules="formRules" ref="form" class="p-t-10">
		        <el-form-item label="" prop="url" class="p-b-10">
		            <el-input size="small" v-model="form.url" placeholder="请输入视频地址">
		  
		            	<template slot="append">
		            		<el-upload ref="upload"
								action="/next/admin/system/uploadFile?module=dc_video"
								accept=".mov,.mp4,.m4a,.3gp,.3g2"
								:show-file-list="false"
								:on-success="handleVideoSuccess"
								:before-upload="handleBeforeUpload"
								:on-error="handleUploadError"
							>
								<el-button size="small" type="primary" icon="el-icon-upload2" :loading="upLoaidng">上传视频</el-button>
							</el-upload>
		            	</template>
		            </el-input>
		        </el-form-item>
		        <el-form-item>
		            <el-button size="small" @click="close">取消</el-button>
		            <el-button size="small" type="primary" @click="onSubmit">提交</el-button>
		        </el-form-item>
		    </el-form>
		</el-dialog>
	</div>
</template>
<script>
	export default{
		components:{},
		props:['editorQuill','isShow'],
		data(){
			return {
				show:false,
				form:{
					url:''
				},
				formRules:{
					url:[
						{ required: true, message: '请输入视频地址或上传视频！', trigger: 'blur' },
					]
				},
				upLoaidng:false
			}
		},
		methods:{
			close:function(){
				this.$emit('update:isShow',false);
			},
			handleBeforeUpload() {
				this.upLoaidng = true;
				return true;
			},
			handleVideoSuccess(res, file) {
				this.upLoaidng = false;
				let { code, msg, obj } = res;
				if (code == '00') {
					let urls = obj.split('#');
					this.form.url = urls[0]; 
					this.$message({
						type: 'success',
						message: '上传成功',
					});


					this.$nextTick(()=>{
						this.$refs.form.validateField('url');
					}) 


				} else {
					this.$message({
						type: 'warning',
						message: msg,
					});
				}
			},
			insertVideo:function(url){
				let quill = this.editorQuill;
				console.log(quill);
                console.log(quill.getSelection());

                console.log(quill.selection.savedRange.index);
 
                // 获取光标所在位置 
               let length = quill.getSelection() !==null? quill.getSelection().index: quill.selection.savedRange.index

                // 插入图片  res.info为服务器返回的图片地址
                // quill.insertEmbed(length, 'image', res.info)
                quill.insertEmbed(length, 'video', url);


                // 调整光标到最后
                quill.setSelection(length + 1)

                this.$refs.upload.clearFiles();

 

			},
			onSubmit:function(){

				this.$refs.form.validate(valid=>{

					if(valid){

						// this.callBack && this.callBack(this.form.url);

						this.insertVideo(this.form.url);

						this.form.url = '';

						this.$nextTick(()=>{

							this.close();

						})
					}

				})
			}
		},
		mounted(){ 
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

</style>
