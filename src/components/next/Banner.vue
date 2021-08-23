<template>
	<div class="banner_lay">
		<div class="banner_con">
			
			<div class="pull-right top p-t-20">
				<template  v-for="(item,index) in list">
			    	<!-- <div class="text-left m-t-15">0{{index+1}}</div> -->
					<router-link class="text-break" :to="{path:'detail',query:{uid:item.uid}}">{{item.title}} >>></router-link>
				</template>
			</div>
			
		</div>
	</div>
</template>
<script>
	export default{
		components:{},
		props:[],
		data(){
			return {
				list:[]
			}
		},
		methods:{
			getTop:function(){
				this.$post('/api/data/getHeadTop',{}).then(({code,obj})=>{
					(code == '00') && (this.list = obj);
				})
			}
		},
		mounted(){
			this.getTop()
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
.banner_lay{
	position: relative;
	width: 100%;
	height: 200px;
	background: url(../../../static/img/next/banner.png) center center no-repeat;
	background-size:auto 100%;
	background-color: #000;
	overflow: hidden;
}
.banner_lay:after{
	content: "";
	display: block;
	width: 100%;
	height: 1px;
	background: #3F3F3F;
	position: absolute;
	left:0;
	top:0;
	-webkit-transform: scale(1,0.5);
	-ms-transform: scale(1,0.5);
	-o-transform: scale(1,0.5);
	transform: scale(1,0.5);

}
.banner_con{
	width: 900px;
	height: 200px;
	margin:0 auto;
}
.top div{
font-size: 18px;
font-weight: bold;
color: #FFFFFF;
letter-spacing: 0;
}

.top{
	line-height: 50px;
}

.top a{
	display: block;
    width: 150px;
	font-family: SourceHanSansCN-Regular;
font-size: 14px;
color: #FFFFFF;
}

</style>