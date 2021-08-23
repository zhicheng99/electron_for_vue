<template>
	<div>
		<Header v-bind:curr-index="headerIndex"></Header>

		<div class="title">
			<el-row :gutter="0">
			    <el-col :span="12">
			       <h1>创意指引</h1>
			       <span>Creative  guidelines</span>
			    </el-col>
			    <el-col :span="12" class="text-right">

			      
				<div class="searchBar_lay pull-right">
					<SearchBarList
				  v-bind:call-back="getList"
				  v-bind:search-text.sync="filters.searchText"
				  ></SearchBarList>
				</div>
				  
	
				

			    </el-col>
			</el-row>
		</div>

		<div class="main">

		
	
			<template v-if="list !== null">
				<template v-if="list.length >0"  >

					<SecList v-for="(item,index) in list" :key="item"
					v-bind:item-data="item"
					v-bind:item-index="index"
					v-bind:header-index="headerIndex"
					></SecList>
				</template>
				<template v-else>
					模块还未划分
				</template>
			</template>
			
		</div>
 

	<BackTop></BackTop>


	</div>
</template>
<script>
	import Header from '../../components/next/Header.vue'
	 

	import SecList from './SecList.vue'
	import SearchBarList from './SearchBarList.vue'
	import BackTop from '../../components/BackTop.vue'



	export default{
		components:{Header,SecList,SearchBarList,BackTop},
		props:[],
		data(){
			return {

				filters:{
					searchText:'',
					modularCode:'10004'
				},
				headerIndex:4,


				list:[]
				
			}
		},
		methods:{
			getList:function(){

				this.$post('/api/data/resourcesBymodular',this.filters).then(({code,obj})=>{
					(code == '00') && (this.list = obj);
				})

			}
		},
		mounted(){
			this.getList();

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

		},
		destroyed(){
			window.onscroll = null;

		}
	}

</script>
<style scoped>
.title{
	width: 1200px;
	margin:0 auto;
	margin-top:50px;
}
h1{
	margin:0;
	padding:0;
	font-weight: bold;
font-size: 30px;
color: #000722;
letter-spacing: 0;
}
.title span{
font-size: 20px;
color: #DBE9FF;
text-align: left;
}

.main{
	width: 1200px;
	margin:0 auto;
	padding-bottom: 100px;
}
.searchBar_lay{
	width: 510px;
}
</style> 