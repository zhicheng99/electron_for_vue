<template>
	<div>
		<el-upload ref="upload"
                class="avatar-uploader"
                action="/next/admin/system/uploadFile?module=dc_video"
				limit="1" 
				:auto-upload="true" 
                name="file"
                :headers="header"
                :show-file-list="false"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :before-upload="beforeUpload"
                accept="image/png,image/jpeg,image/gif">
        </el-upload>
	</div>
</template>
<script>
	export default{
		props:['editorQuill','quillUpdateImg'],
		data(){
			return {

			}
		},
		methods:{
			// 富文本图片上传前
            beforeUpload() {
                // 显示loading动画
                this.quillUpdateImg = true
            },
  
            uploadSuccess(res, file) {
                // res为图片服务器返回的数据
                // 获取富文本组件实例
                // let quill = this.$refs.myQuillEditor.quill; 
  
                let quill = this.editorQuill;

                // 如果上传成功
                if (res.code === '00') {
                    // 获取光标所在位置
                    let length = quill.getSelection().index;
                    // 插入图片  res.info为服务器返回的图片地址
                    // quill.insertEmbed(length, 'image', res.info)
                    quill.insertEmbed(length, 'image', res.obj)


                    // 调整光标到最后
                    quill.setSelection(length + 1)

                    this.$refs.upload.clearFiles();



                } else {
                    this.$message.error('图片插入失败')
                }
                // loading动画消失
                this.quillUpdateImg = false
            },
   
            // 富文本图片上传失败
            uploadError() {
                // loading动画消失
                this.quillUpdateImg = false
                this.$message.error('图片插入失败')
            }
		}
	}
</script>
