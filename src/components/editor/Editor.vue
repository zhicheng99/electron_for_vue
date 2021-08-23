<template>
	<div ref="cn" class="editor" @mousemove="mousemove($event)">

		<quill-editor  ref="textEditor_cn" placeholder="请输入停车场使用规范" v-model="editorContent" :options="editorOption_cn" @change="change">
				</quill-editor>

				<!-- 中文插入图片 -->
		<VueQuillUpload
		class="cn"
		style="display: none"
		v-bind:quill-updateImg.sync="quillUpdateImg_cn"
		v-bind:editor-quill.sync = "quill_cn"
		></VueQuillUpload>


		<VueQuillUploadVideo
		v-bind:is-show.sync="VueQuillUploadVideoVisible" 
		v-bind:editor-quill.sync = "quill_cn"

		></VueQuillUploadVideo>

		<ImgTip 
		v-bind:position-left="positionLeft"
		v-bind:position-top="positionTop"
		v-bind:img-obj="imgOrIframe"
		v-bind:editor-content.sync="editorContent"
		v-bind:editor-quill.sync = "quill_cn"

		></ImgTip>
	</div>
</template>
<script>
	import VueQuillUpload from './VueQuillUpload.vue';
	import VueQuillUploadVideo from './VueQuillUploadVideo.vue';
	import ImgTip from './ImgTip.vue';




	import { quillEditor } from 'vue-quill-editor'
// import Quill from 'quill'  // 引入编辑器
// 	import ImageResize from 'quill-image-resize-module';
//  Quill.register('modules/imageResize',ImageResize)


	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'

	export default{
		components:{
			quillEditor,
			VueQuillUpload,
			VueQuillUploadVideo,
			ImgTip
		},
		props:['editorContent'],
		data(){
			return {
				quillUpdateImg_cn:false,
				imgOrIframe:null,
				quill_cn:{},
				editorOption_cn: { 
					placeholder: '请输入内容',
					height:400,
				     modules: {
				      toolbar: 

				       {
                            container: [// 工具栏
						        ['bold', 'italic', 'underline', 'strike','link','image','video'],
						        // ['blockquote'],
						        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
						        // [{ 'script': 'sub' }, { 'script': 'super' }],
						        [{ 'indent': '-1' }, { 'indent': '+1' }],
						        [{ 'size': ['small', false, 'large', 'huge'] }],
						        [{ 'color': [] }, { 'background': [] }],
						        // ['clean'],
						        [{ 'align': [] }],  
						        ['fullscreen'] 


						      ],

                            handlers: {
                                'image': function (value) {
                                    if (value) {

                                    	// VueQuillUpload组件
                                    	document.querySelector('.cn .avatar-uploader input').click()
                                        // document.querySelector('#quill-upload input').click()
                                    } else {
                                        this.quill.format('image', false);
                                    }
                                },
                                'video': (value)=> {
                                	if(value){

		                              	this.VueQuillUploadVideoVisible = true;

                                	}else{
                                        this.quill.format('video', false);


                                	}
	                            }
                            }
                        },
                        // imageResize:{
                        //     displayStyles:{
                        //         backgroundColor:'black',
                        //         border:'none',
                        //         color:'white'
                        //     },
                        //     modules:['Resize','DisplaySize','Toolbar']
                        // }
					 }
				},
				VueQuillUploadVideoVisible:false,
				ImgTipVisible:false,
				positionLeft:0,
				positionTop:0,
				content:'',

			}
		},
		methods:{ 

			change:function(){ 
				this.$nextTick(()=>{

					this.$emit('update:editorContent',this.editorContent);

				})
			},
			getElementLeft: function(element,className){
			　　　　var actualLeft = element.offsetLeft;
			　　　　var current = element.offsetParent;

			　　　　while (current !== null){
			　　　　　　actualLeft += current.offsetLeft;
			　　　　　　current = current.offsetParent;

					 if(current.className != className){
						  	break;
						  }
			　　　　}

			　　　　return actualLeft;
			},
			getElementTop:function(element,className){

		　　　　var actualTop = element.offsetTop;
		　　　　var current = element.offsetParent;

		　　　　while (current !== null){ 

		　　　　　　actualTop += current.offsetTop;
		　　　　　　current = current.offsetParent;

				  if(current.className != className){
				  	break;
				  }

		　　　　}

		　　　　return actualTop;
		　　},
			//生成图片设置工具
			createHandler:function(){
				// console.log(scrollTop)

				//计算图片this.imgOrIframe距 editor的距离  

				if(this.imgOrIframe !==  null){
					this.positionLeft =  this.getElementLeft(this.imgOrIframe,'editor');
					this.positionTop =  this.getElementTop(this.imgOrIframe,'editor')-document.getElementsByClassName('ql-editor')[0].scrollTop;
					 

				}else{
					this.ImgTipVisible = false
				}
 


			},
			mousemove:function(event){
 
				if(this.imgOrIframe === null){
						if(event.target.tagName.toLowerCase() == 'img' || 
							event.target.tagName.toLowerCase() == 'iframe' ){
 
							console.log('图片或iframe');
							this.imgOrIframe = event.target;
							// this.createHandler();


						}
				}else if(
					(event.target.tagName.toLowerCase() == 'img' || 
					event.target.tagName.toLowerCase() == 'iframe') && 
					this.imgOrIframe.getAttribute('src') != event.target.src){

					this.imgOrIframe = event.target;
					console.log('换图或iframe了');
					// this.createHandler();

				}

				this.$nextTick(this.createHandler) 

		

			}
		},
		mounted(){

			this.quill_cn = this.$refs.textEditor_cn.quill;

			this.$nextTick(()=>{

				this.quill_cn.container.firstChild.onscroll = ()=>{
					this.imgOrIframe = null;
				}

			})

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
	.editor{
		position:relative;
		/*padding-bottom: 60px;*/
		overflow: hidden;
	}
</style>
<style>

	.editor .ql-toolbar.ql-snow{
		border: 1px solid #DCDFE6;
		border-top-left-radius: 4px;
		border-top-right-radius: 4px;

	}
	.editor .ql-container.ql-snow{
		border: 1px solid #DCDFE6;
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
	}
	.editor .ql-editor.ql-blank::before {
	    color: rgba(165, 160, 160, 0.6);
	    content: attr(data-placeholder);
	    font-style: normal;
	    left: 15px;
	    pointer-events: none;
	    position: absolute;
	    right: 15px;
	}
	.editor .quill-editor{
		/*height: 400px; */
	}
	.editor .ql-editor{
		min-height: 200px;

		max-height: 400px;
	}
	.editor .ql-editor p{
		margin-bottom: 10px;
	}
	.editor .ql-editor .ql-video{
	/*	width: 660px;
		height: 508px;*/
		margin:0 auto;
		overflow: hidden;
	}
</style>

