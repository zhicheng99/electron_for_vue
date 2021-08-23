<template>
	<div>
		<Header v-bind:curr-index="headerIndex"></Header>

		<div class="main">
				<SearchBarList
				  v-bind:call-back="getList"
				  v-bind:search-text.sync="filters.searchText"
				  ></SearchBarList>
	
			<div class="clear moreList m-t-40">
				
				<template v-for="(item,index) in users">
					<SmallTmp v-bind:item-data="item" v-bind:header-index="headerIndex" v-bind:class="{'m':index%4==0}"></SmallTmp>
				</template>

			</div>

			<div class="text-center p-t-40 p-b-40" id="more" v-if="users!==null && users.length>0">
					<el-button type="primary" class="more m-t-30 m-b-30  fz_font" :disabled="tip == '没有更多了'" @click="next" round :loading="listLoading">
						{{tip}}
					</el-button>
				</div>
			
		</div>
		
	</div>
</template>
<script>
	import Header from '../../components/next/Header.vue'
	import SearchBarList from './SearchBarList.vue'
	import SmallTmp from './SmallTmp.vue'


	export default{
		components:{Header,SearchBarList,SmallTmp},
		props:[],
		data(){
			return {

				users: null,
				total: 0,
				page: 1,
				size:16,
				listLoading: false,
				sels: [],//列表选中列 
				tip:'查看更多',

				headerIndex:0,

				filters:{
					modularCode:'',
					searchText:''
				}

			}
		},
		methods:{
			next:function(){
				this.page++;
				this.getList()
			},
			getList:function(){

				var para = {
					current:this.page,
						size:this.size,
					...this.filters
				}
				this.$post('/api/data/resourcesList',para).then(({code,obj})=>{

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
		mounted(){
			this.headerIndex = this.$route.query.headerIndex;
			this.filters.modularCode = this.$route.query.modularCode;

			this.getList();

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

	.main{
		width: 1200px;
		margin:0 auto;
		padding-top:50px;
		padding-bottom: 100px;
	}
.samll_tmp{
	margin-left:12px;
	margin-bottom: 40px;
}
.samll_tmp.m{
	margin-left:0;
}
.moreList{
	width: 1200px;
}
</style>