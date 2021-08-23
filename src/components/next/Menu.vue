<template>
	<div class="menu">
		<ul>
			<li>
				<router-link to="index" v-bind:class="{'curr':currIndex==0}">首页</router-link>
			</li>
			<li>
				<router-link to="info" v-bind:class="{'curr':currIndex==1}">营销资源</router-link>
			</li>
			<li>
				<router-link to="trend" v-bind:class="{'curr':currIndex==2}">趋势洞察</router-link>

			</li>
			<li>
				<router-link to="market" v-bind:class="{'curr':currIndex==3}">市场活动</router-link>

			</li>
			<li>
				<router-link to="idea" v-bind:class="{'curr':currIndex==4}">创意指引</router-link>

			</li>
			<li>
				<router-link to="case" v-bind:class="{'curr':currIndex==5}">成功案例</router-link>

			</li>
			<!-- <li>
				<router-link to="customer" v-bind:class="{'curr':currIndex==6}">客户中心</router-link>

			</li>
			<li>
				<router-link to="data" v-bind:class="{'curr':currIndex==7}">数据中心</router-link>

			</li> -->
			<li>
				<router-link to="help" v-bind:class="{'curr':currIndex==8}">帮助中心</router-link>
			</li>
		</ul>
	</div>
</template>
<script>
	export default{
		components:{},
		props:['currIndex'],
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
.menu{
	float: right;
	height: 50px;
	line-height: 50px;
	position: relative;
}
/*.menu:after{
	content: "";
	display: block;
	width: 100%;
	height: 1px;
	background: #353535;
	position: absolute;
	left:0;
	bottom: 16px;
}*/
.menu ul{
	padding: 0;
	margin: 0;
}
.menu li{
	float: left;
	text-align: center;
	width: 81px;
	list-style-type: none;
	margin-right: 5px;
}
.menu li a{
	color:#979797;
	display: inline-block;
	width: 100%;
	font-size: 14px;
	line-height: 22px;
	text-decoration: none;
	border-bottom: solid transparent 3px;
}

.menu li a:hover,
.menu li a.curr{
	color:#D8D8D8;
	font-weight: bold;
	border-bottom: solid #0193FF 3px;

}


</style>