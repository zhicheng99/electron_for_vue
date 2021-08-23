<template>
	<div class="item m-t-20">
		<img :src="itemData.cover" class="pull-left m-t-20 m-l-20 m-r-20" width="280" height="175" alt="">
		<h1 class="p-t-40 text-break" v-html="format(itemData.title)"></h1>
		<div class="info p-r-40 m-t-10" v-html="format(itemData.introduction)">
		</div>
		<router-link :to="{path:'detail',query:{uid:itemData.uid,headerIndex:modelMapHeader[itemData.rootModularCode]}}" class="m-t-20">
			查看更多 <i class="el-icon-arrow-right"></i>
		</router-link>
	</div>
</template>
<script>
	import config from '../../common/js/config.js'
	export default{
		components:{},
		props:['itemData','searchText'],
		data(){
			return {

				modelMapHeader:config.modelMapHeader
			}
		}, 
		methods:{
			format:function(v){
				var tmp = this.searchText;
				return v.replace(new RegExp(`${tmp}`,'g'),'<span>'+this.searchText+'</span>');
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
.item{
	width: 1092px;
	height: 220px;
/*box-shadow: 0 20px 20px 0 rgba(0,0,0,0.07);*/
/* Sketch doesnt export pattern fills at this point */
box-shadow: 0 0 14px  rgba(0,34,86,0.19); 
box-shadow: 0 21px 14px rgb(0 0 0 / 7%);

margin:0 auto;
background: #fff;

}

.item img{
	background: #F6F6F6;
	
}

h1{
font-size: 28px;
font-weight: bold;
color: #000722;
letter-spacing: 0;
margin: 0;
padding: 0;
}

.info{
	font-family: SourceHanSansCN-Regular;
	font-size: 16px;
	color: #AEAFB0;
	line-height: 35px;
	overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.item a{
font-family: SourceHanSansCN-Regular;
font-size: 14px;
color: #0166FF;
letter-spacing: 0;
line-height: 16px;
text-decoration: none;
display: inline-block;
}
</style>
<style>
	.item span{
		color:red;
	}
</style>