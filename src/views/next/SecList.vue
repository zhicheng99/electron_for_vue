<template>
	<div class="sec_list m-t-40 clear">
				<div class="sec_title m-b-20">
					<router-link :to="{path:'listMore',query:{modularCode:itemData.modularCode,headerIndex:headerIndex}}" class="pull-right m-t-10">查看更多 <i class="el-icon-arrow-right"></i></router-link>
				{{itemData.modularName}}</div>

				<template v-if="itemData.resourcesList.length>0">
					<template v-if="itemIndex %2 ==0">
						
						<SmallTmp v-if="typeof itemData.resourcesList[0]!='undefined'" v-bind:item-data="itemData.resourcesList[0]" v-bind:header-index="headerIndex"></SmallTmp>
						<SmallTmp v-if="typeof itemData.resourcesList[1]!='undefined'" v-bind:item-data="itemData.resourcesList[1]" v-bind:header-index="headerIndex"></SmallTmp>
						<BigTmp v-if="typeof itemData.resourcesList[2]!='undefined'" v-bind:item-data="itemData.resourcesList[2]" v-bind:header-index="headerIndex"></BigTmp>

					</template>
					<template v-else>

						<BigTmp v-if="typeof itemData.resourcesList[0]!='undefined'" v-bind:item-data="itemData.resourcesList[0]" v-bind:header-index="headerIndex"></BigTmp>
						<SmallTmp v-if="typeof itemData.resourcesList[1]!='undefined'" v-bind:item-data="itemData.resourcesList[1]" v-bind:header-index="headerIndex"></SmallTmp>
						<SmallTmp v-if="typeof itemData.resourcesList[2]!='undefined'" v-bind:item-data="itemData.resourcesList[2]" v-bind:header-index="headerIndex"></SmallTmp>

					</template>
				</template>
				<template v-else class="text-center">
					暂无内容
				</template>

				


				

				
			</div>
</template>
<script>
	import SmallTmp from './SmallTmp.vue'
	import BigTmp from './BigTmp.vue'
	export default{
		components:{SmallTmp,BigTmp},
		props:['itemData','itemIndex','headerIndex'],
		data(){
			return {

			}
		},
		methods:{

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
.sec_list{
	width: 1200px;
	margin:0 auto;
}
.sec_title{
	font-weight: bold;
font-size: 18px;
color: #000722;
}
.sec_title a{ 
	text-decoration: none;
font-size: 14px;
color: #0070F7;
letter-spacing: 0;
line-height: 16px;
font-weight: normal;
}
</style>
<style>
	
.sec_list>div:nth-child(3),
.sec_list>div:nth-child(4){
	margin-left:12px;

}
	.input-with-select1 .el-input__inner{
	border: 1px solid #C3C3C3;
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
	border-right: none;
	height: 55px;
    line-height: 55px;

}
</style>