<template>
	<div>
		<div class="title">
			
		{{fileName}}
		</div>
		<div class="pdf_lay">
			<ScrollArea>

				<img v-for="item in imgs" width="100%" :src="item" alt="">
			
			</ScrollArea>
			<div class="cover text-center p-b-20">
				
					
					<el-button type="primary" size="small" round @click="down" :loading="loading">
					下载观看全部内容
					</el-button>
			</div>
		</div>
		
	</div>
</template>
<script>

	import ScrollArea from '../../components/next/ScrollArea.vue'
	export default{
		components:{ScrollArea},
		props:['fileId','articleId','fileName','fileUrl'],
		data(){
			return {
				imgs:[],
				loading:false
			}
		},
		methods:{
			down:function(){
				if(this.loading){
					return false
				}
				this.loading = true;
				this.$downFile('/api/data/multiMediaDownload',{id:this.fileId,uid:this.articleId,fileUrl:this.fileUrl}).then(({code})=>{

					(code == '00') && (this.loading = false);
				})
			},
			getDetail:function(){

				this.$post('/api/data/resourcesByImagePage',{
					fileId:this.fileId,
					joinCode:this.articleId
				}).then(({code,obj})=>{

					(code == '00') && (()=>{

						if(obj.records.length>0){
							let tmp =  [];
							//只取前三张
							try{
								obj.records.forEach((item,index)=>{
									if(index == 3){
										 throw new Error('LoopTerminates')
									}
									tmp.push(item.imgUrl);
								})
							}catch(e){

							}

							this.imgs = tmp;
						}



					})()


				})
			}
		},
		mounted(){
			this.getDetail()
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
.title{
	font-size: 14px;
	line-height: 30px;
}
.pdf_lay{
	width: 100%;
	height: 800px;
	position: relative;
	border:solid #eee 1px;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
}
.cover{
	position: absolute;
	width: 100%;
	left:0;
	bottom:0;
	padding-top:200px;
	background-image: linear-gradient(0deg, #FFFFFF 13%, rgba(255,255,255,0.00) 71%);
border-radius: 0 0 8px 8px;
}

</style>