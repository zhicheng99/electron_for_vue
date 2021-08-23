<template>
	<div style="height: 200px;position: relative;">
		<!-- <el-checkbox-group
		v-for="(item,index) in users"
		 v-model="checkboxGroup1[index]" 
		>
			<el-checkbox>{{item.name}}</el-checkbox>


	    </el-checkbox-group> -->


	    <div class="wrapper " ref="wrapper1"  style="overflow: hidden;">
				 	 <div class="content p-r-10">

				 	 	<el-checkbox-group v-model="checkList"  @change="checkListChange">
							<fieldset 
							v-for="(item,index) in users"
							:key="index"
							class="m-t-20" 
							>
							    <legend><el-checkbox :label="item.id">{{item.name}}</el-checkbox></legend>


							   <el-row >
							   <template>
							   	 	<el-col :span="24" v-for="(child,cindex) in item.children" :key="cindex">
							   	 		<div><el-checkbox :label="child.id" @click.native="lev2Click(child)">{{child.name}}</el-checkbox></div>
										<template v-for="d in child.children">
								   			<div class="p-l-20"><el-checkbox :label="d.id">{{d.name}}</el-checkbox></div>
												
										</template>
							   	 	</el-col>
							   	
							   </template>
							   </el-row>
							</fieldset>
				 	 	</el-checkbox-group>


						

					</div>
		</div>

		
		

	</div>
</template>
<script>
	import BScroll from 'better-scroll'

	export default{
		props:['menusData'],
		data(){
			return {
				users:[],
				checkList:['73'],
				scroll:{}
			}
		},
		methods:{
			getTree:function(){
				this.$post('/admin/system/menu/treelist',{}).then(({code,data})=>{

					(code == '00') &&
					(this.users = data);

				})
			},
			returnIds:function(){
		
				var tmp = [];
				this.checkList.map(item=>{
					if(item != ''){
						tmp.push(item);
					}
				})

				return tmp.join(',');
			},
			checkListChange:function(v){
				 console.log(this.checkList);
				 // console.log(v);
			},
			lev2Click:function(obj){

				// setTimeout(()=>{
				// 	    console.log(this.checkList);

				// 		var sign = false;
				// 		this.checkList.map(item=>{
				// 			if(item == obj.id){
				// 				sign = true;
				// 			}
				// 		})

				// 		if(sign){
				// 			console.log('选择')
							




				// 		}else{
				// 			console.log('取消')
				// 			//子项都取消
				// 			var childIds = obj.children.map(item=>{return item.id});
				// 			console.log(childIds);

				// 			var indexIds = [];
				// 			this.checkList.map((item,index)=>{
				// 				for (var i = 0; i < childIds.length; i++) {
				// 					if(childIds[i] == item){
				// 						indexIds.push(index);
				// 					}
				// 				}
				// 			})

				// 			console.log(indexIds);

				// 			for (var i = 0; i < indexIds.length; i++) {

				// 				this.checkList.splice(indexIds[i]+i,1);
				// 			}
							
				// 		}


				// },200)
				

			}
		},
		mounted(){
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

			this.getTree();
		},
		watch:{
			menusData:{
				handler:function(v){
					this.checkList = v.split(',');
				},
				immediate:true
			}
		}
	}
</script>
<style scoped>
	fieldset{
		padding-left:10px;
	}
	.wrapper{
	  width: 100%;
	  position:absolute; 
	  top:0;
	  bottom: 0;
	  line-height: 22px;
	} 
</style>