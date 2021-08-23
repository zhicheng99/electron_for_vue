<template>
	<div>
		<div v-for="item in list" class="item m-b-20">
			<img :src="item.cover" width="100%" alt="">
			<div class="intro">
				<div class="title text-break">{{item.title}}</div>
				<div class="des m-t-20">
					{{item.introduction}}基基基基基基基基基基基基基基基基基基基基基基基基基基基基基基基基基基基基基基基基基基基基基基基基
				</div>
				<router-link :to="{path:'detail',query:{uid:item.uid,headerIndex:headerIndex}}" class="m-t-20">了解更多 
				<i class="el-icon-right"></i>
				</router-link>
			</div>
		</div>
	</div>
</template>
<script>
	export default{
		components:{},
		props:['rootCode','articleId','headerIndex'],
		data(){
			return {
				list:[]
			}
		},
		methods:{
			getList:function(){
				this.$post('/api/data/byFollowerList',{rootModularCode:this.rootCode,uid:this.articleId}).then(({code,obj})=>{

					(code=='00') && (this.list = obj);

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
			'rootCode':function(v){
				console.log(v);
				this.$nextTick(this.getList)
			}
		}
	}

</script>
<style scoped>
.item{
	margin:0 auto;
	width: 350px;
	height: 392px;
	background: #FFFFFF;
/*box-shadow: 0 2px 30px 0 rgba(140,153,191,0.20);*/
border-radius: 4px;
-webkit-box-sizing: border-box;
-moz-box-sizing: border-box;
box-sizing: border-box;
transition: box-shadow 0.3s;
-moz-transition: box-shadow 0.3s; /* Firefox 4 */
-webkit-transition: box-shadow 0.3s; /* Safari 和 Chrome */
-o-transition: box-shadow 0.3s; /* Opera */
border:solid #f4f4f4 1px;


}
.item:hover{
	-webkit-box-shadow: 0 2px 30px 0 rgba(140,153,191,0.20);
	box-shadow: 0 2px 30px 0 rgba(140,153,191,0.20);

}

.intro{
	padding:10px 30px 30px 30px;
}
.title{
font-size: 18px;
font-weight: bold;
color: #1A1A1A; 
}
.des{
font-size: 14px;
color: #1A1A1A; 
line-height: 24px;
display:-webkit-box;
  -webkit-box-orient:vertical;
  text-overflow:ellipsis;
  -webkit-line-clamp:2;
  overflow:hidden;
}
.intro a{
	text-decoration: none;
font-size: 18px;
color: #1848F2; 
display: inline-block;

}
.intro i{
	font-weight: bold;
	font-size: 18px;
color: #1848F2;
}

</style>