<template>
	<div>
		<Header v-bind:curr-index="8"></Header>
		<div class="main clear">
			<div class="main_left  pull-left text-center p-t-30 p-b-20">
				<div v-for="(item,index) in items" 
				v-bind:class="{'curr':active == index}"
				@click="clickItem(index)"
				>{{item.name}}</div>
			</div>
			<div class="main_right pull-left p-t-40 p-l-30">
				<div class="title p-b-30">{{items[active].name}}</div>
				<div class="con">
					{{items[active].content}}
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import Header from '../../components/next/Header.vue'
	export default{
		components:{Header},
		props:[],
		data(){
			return {
				active:0,
				items:[
					{
						name:'产品简介',
						content:'产品简介产品简介产品简介产品简介产品简介产品简介产品简介产品简介'
					},
					{
					 	name:'功能说明',
					 	content:'功能说明功能说明功能说明功能说明功能说明功能说明功能说明'
					 },
					 {
						name:'常见问题说明',
						content:'常见问题说明常见问题说明常见问题说明常见问题说明常见问题说明',
					},
					// {
					// 	name:'版权说明',
					// 	content:'版权说明版权说明版权说明版权说明版权说明',
					// },
					// {
					// 	name:'免责说明',
					// 	content:'免责说明免责说明免责说明免责说明',
					// },
					// {
					// 	name:'用户协议',
					// 	content:'用户协议用户协议用户协议用户协议用户协议',
					// },
					// {
					// 	name:'隐私政策',
					// 	content:'隐私政策隐私政策隐私政策隐私政策隐私政策'
					// }


				]
			}
		},
		methods:{
			clickItem:function(v){
				this.active = v;
			}
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
.main{
	width: 1200px;
	margin: 0 auto;
}
.main_left div{
font-size: 16px;
color: #3B3D40;
letter-spacing: 0;
line-height: 40px;
cursor: pointer;

}
.main_left div.curr{

color: #0166FF; 
}
.main_left{
	width: 165px;
	background: #FCFCFC;
}

.main_right{
	width: 1000px;
}

.title{
font-size: 20px;
font-weight: bold;
color: #000722;
}
.con{
font-size: 14px;
color: #67687C;
letter-spacing: 0;
line-height: 24px;
}

</style>