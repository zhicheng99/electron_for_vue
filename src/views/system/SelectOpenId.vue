<template>
	<div>
		
			 
	<el-select
	popper-class="collect-select-autocomplete"
	size="small"
    v-model="fieldName"
    multiple
    filterable
    remote
    default-first-option
    :reserve-keyword="false"
    :placeholder="placeHolder"
    :remote-method="querySearchAsync"
    :loading="loading" @change="handleSelectExecutionPerson">
    <el-option 
      v-for="item in options"
      :key="item"
      :label="item.name+'('+item.open_id+')'"
      :value="item.open_id">
		    	<img :src="item.avatarShow" width="24" height="24" style="vertical-align: middle;border-radius: 12px;overflow: hidden;" alt="">
		    {{ item.name }} ({{item.open_id}})


    </el-option>
  </el-select>

	</div>
</template>
<script>
	export default{
		components:{},
		props:['fieldName','placeHolder'],
		data(){
			return {
				placeHolder:'请输入执行人',
				loading:false,
				options:[]
			}
		},
		methods:{ 

			handleSelectExecutionPerson:function(){

				// this.addForm.executionPerson = item.name;
				this.$nextTick(()=>{
					console.log(this.fieldName);
					this.$emit('update:fieldName',this.fieldName);

				})
			},
			querySearchAsync:function(queryString){


				// this.list = new Promise((resolve,reject)=>{


					if(queryString.replace(/ /g,'') !=''){
						this.loading = true;


						// new Promise((resolve,reject)=>{


						// 		resolve([
						// 				{
						// 					name:'张三',
						// 					avatarShow:'',
						// 					email:''
						// 				},
						// 				{
						// 					name:'李四',
						// 					avatarShow:'',
						// 					email:''
						// 				},
						// 				{
						// 					name:'王五',
						// 					avatarShow:'',
						// 					email:''
						// 				},
						// 			]) 

						// 		// resolve([])

						// }).then(obj=>{
						// 	this.loading = false;
						// 	this.options = obj;
						// })


						this.$post('/admin/system/user/searchLarkUser',{name:queryString}).then(({code,obj})=>{

							(code == '00') && (obj !==null) && (()=>{
 								
 								
								this.options = obj


							})();

							this.loading = false;
							
						}).catch(()=>{
							this.loading = false;

						})



					}else{
						this.options = [];
					}
				// })

				
			},

		},
		mounted(){

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

</style>
<style>
	.collect-select-autocomplete ul li:nth-child(1){
		position: relative;
		/*display: none;*/
	}
	.collect-select-autocomplete ul li:nth-child(1):after{
		content: "（点击或回车创建新项）";
		font-size: 12px;
		color: #e6a23c;


	}
</style>