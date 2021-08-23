<template>
	<div>
		<Header v-bind:curr-index="0"></Header>
		<Banner></Banner>
		<div class="text-center title">
				Insights you want.Inspiration you need.NexT
			<div>洞见灵感下一程。</div>
		</div>

		<div class="index_main m-t-40">
			<el-input  placeholder="搜索你需要的灵感" v-model="key" class="input-with-select" @keyup.enter.native="search" clearable>
			    
			    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
			  </el-input>

			  <div class="result p-t-20" v-loading="loading">
			  	 <div class="text-center empty" v-if="users!==null && users.length==0">
			  	 	<img src="../../../static/img/next/empty.png" height="425" alt="">
			  	 	<div class="m-t-30">
			  	 		
				  	 	我都用了放大镜都没找到啊…
			  	 	</div>
			  	 </div>
				
				<div  v-if="users!==null && users.length>0">
					<h1>搜索结果</h1>
					<template v-for="item in users">
						<ResultItem  
						v-bind:item-data="item"
						v-bind:search-text="key"
						></ResultItem>
						
					</template>

				</div>


			  	<div class="text-center p-t-40 p-b-40" id="more" v-if="users!==null && users.length>0">
					<el-button type="primary" class="more m-t-30 m-b-30  fz_font" :disabled="tip == '没有更多了'" @click="next" round :loading="listLoading">
						{{tip}}
					</el-button>
				</div>
			  </div>

			
			
				<IndexSection v-if="users===null"></IndexSection>
 



		</div>

		<BackTop></BackTop>
	</div>
</template>
<script>
	import Header from '../../components/next/Header.vue'
	import Banner from '../../components/next/Banner.vue'

	import IndexSection from './IndexSection.vue'
	import ResultItem from './ResultItem.vue'
	import BackTop from '../../components/BackTop.vue'





	export default{
		components:{Header,Banner,IndexSection,ResultItem,BackTop},
		props:[],
		data(){
			return {
				key:'',
				loading:false, 

				users: null,
				total: 0,
				page: 1,
				size:10,
				listLoading: false,
				sels: [],//列表选中列 
				tip:'查看更多'

			}
		},
		methods:{
			search:function(){


				if(this.loading || this.key.replace(/ /g,'')==''){
					return false;
				}

				this.loading = true;

				if(this.key.replace(/ /g,'') !=''){

					this.$post('/api/data/resourcesList',{
						searchText:this.key,
						current:this.page,
						size:this.size,}).then(({code,obj})=>{

						this.listLoading = false;
						this.loading = false;

						this.total = obj.total;
						this.totalPage = obj.pages;

						if(this.page == 1){
							this.users = obj.records;

						}else{
							this.users = this.users.concat(obj.records);

						}

						//防止有重复的
						let h = {};
						this.users = this.users.reduce(function(item,next){
						  h[next.id]?'':h[next.id] = true && item.push(next);
						  return item;
						},[]);	

						if((this.page == this.totalPage) || (this.users.length==0)){
							this.tip = '没有更多了'
						}else{
							this.tip = '查看更多'
						}

					})
				}
			},
			next:function(){
				this.page++;
				this.search()
			}
		},
		mounted(){

			window.onscroll = ()=>{
				var top = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
				this.$store.commit('updateScrollTop', top);
			} 
		},
		created(){
			
		},
		computed:{

		},
		watch:{
			'key':function(v){
				if(v == ''){
					console.log('清空了');
					this.$nextTick(()=>{

						this.users = null;
					})
				}
			}
		},
		destroyed(){
			window.onscroll = null;

		}
	}

</script>
<style scoped>
.title{
	margin-top:50px;
	color:#000722;
	font-size: 36px;
	font-family: Source Han Sans CN,Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
    font-weight: bold;
}
.title div{
	font-size: 24px;
	margin-top:45px;
}
.index_main{
	width: 1092px;
	margin:0 auto;
	padding-bottom: 100px;
}
.empty{ 
	font-family: SourceHanSansCN-Heavy;
font-size: 24px;
color: #000722;
}


</style>
<style>
.input-with-select .el-input__inner{
	border: 1px solid #C3C3C3;
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
	border-right: none;
	height: 55px;
    line-height: 55px;

}

.input-with-select .el-input__inner::-webkit-input-placeholder, textarea::-webkit-input-placeholder{
	  
	  font-family: SourceHanSansCN-Heavy;
		font-size: 21px; 
		color: #DFDFDF; 
		position: relative;
		top:3px;
	}

	.input-with-select .el-input__inner:-moz-placeholder, textarea:-moz-placeholder {
	 font-family: SourceHanSansCN-Heavy;
		font-size: 21px; 
		color: #DFDFDF; 
		position: relative;
		top:3px;
	}

	.input-with-select .el-input__inner::-moz-placeholder, textarea::-moz-placeholder {
	  font-family: SourceHanSansCN-Heavy;
		font-size: 21px; 
		color: #DFDFDF; 
		position: relative;
		top:3px;
	}

	.input-with-select .el-input__inner:-ms-input-placeholder, textarea:-ms-input-placeholder {
	  font-family: SourceHanSansCN-Heavy;
		font-size: 21px; 
		color: #DFDFDF; 
		position: relative;
		top:3px;
	}

.input-with-select .el-input-group__append{
	background: transparent;
	    border: 1px solid #C3C3C3;
	    border-left:none;
	    border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
}

.input-with-select .el-icon-search{
	font-weight: bold;
	color:#DFDFDF;
}
	
</style>