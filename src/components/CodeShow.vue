<template> 
		<el-dialog title="数据" :visible.sync="show" @closed="close" @opened="open">
			 <div class="" style="height: 240px;position: relative;">
				 <div class="wrapper " ref="wrapper1"  style="overflow: hidden;">
				 	 <div class="content padding-20" >

												 
						<json-viewer :value="code" :expand-depth='5' copyable></json-viewer>

					</div>
				</div>
				<div class="dialog_bottom"></div>
			 </div>
		</el-dialog> 
</template>


<script>
	import BScroll from 'better-scroll'
	
	import JsonViewer from 'vue-json-viewer'


	export default {
		components:{
			JsonViewer
		},
		props:[
			'isShow',
			'setVal',
			'paramsCode'
			],
	  data() {
	    return { 
			show:false,
			scroll:{},
			
			code:{}
	    };
	  },
	  methods:{
		  close:function(){
			  this.show = false;
			  this.setVal(false); 
		  },
		  open:function(){
			  
			  if(this.scroll.refresh){
				  this.scroll.refresh();
			  }else{
				this.scroll = new BScroll(this.$refs.wrapper1, {
					//开启点击事件 默认为false
					click:true,
					scrollbar: {
					 fade: false,
					 interactive: false // 1.8.0 新增
					},
					mouseWheel: {
					 speed: 20,
					 invert: false,
					 easeTime: 300
					}
				  })	  
			  }
			  
		  }
	  },
	  
	  watch:{
		  paramsCode:function(v){ 
			  
			  this.code = JSON.parse(v);
			  
		  },
		  isShow:function(){
		  	if(this.isShow){
		  		this.show = true; 
				
		  	}
		  }
	  }
	}
	
</script>

<style scoped>
	.wrapper{
	  width: 100%;
	  position:absolute; 
	  top:0;
	  bottom: 20px;
	  line-height: 22px;
	} 
	
	.dialog_bottom{
		position: absolute;
		left:0;
		bottom:0;
		height:20px;
		width: 100%;
		border-top:1px solid #E9E9E9 
	}
</style>
