<template>
	<div class="big_tmp">
			<router-link :to="{path:'detail',query:{uid:itemData.uid,headerIndex:headerIndex}}" class="go">
		
		<!-- <div class="cover_lay"> -->
			<img class="cover" :src="itemData.cover" alt="" lazy>
		<!-- </div> -->

		<div class="bottom">
			<div class="title text-break crux" v-html="format(itemData)">
				<!-- {{itemData.title}} -->
				<!-- <span>标题</span>
				<span>标题</span> -->

			</div>
			<div class="info">{{itemData.introduction}}</div>
		</div>
	</router-link>
	</div>
</template>
<script>
	export default{
		components:{},
		props:['itemData','headerIndex'],
		data(){
			return {

			}
		},
		methods:{
			format:function({crux:v,title}){
				if(v!=''){
					if(v.indexOf(',')>-1){

						let tmp = v.split(',');
						let s = '';
						tmp.forEach(item=>{
							s+='<span>'+item+'</span>'
						})

						return title+s;


					}else{

						return title+'<span>'+v+'</span>'
					}

				}else{

					return title+''
				}
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
.big_tmp{
	float: left;
	width: 595px;
	height: 390px;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
	/*box-shadow: 0 21px 14px rgb(140 153 191 / 20%);*/
	padding:0 12px 12px 12px;

	position: relative;

	transition: box-shadow 0.3s;
-moz-transition: box-shadow 0.3s; /* Firefox 4 */
-webkit-transition: box-shadow 0.3s; /* Safari 和 Chrome */
-o-transition: box-shadow 0.3s; /* Opera */
border:solid #f4f4f4 1px;
cursor: pointer;

} 
.big_tmp:after{
	content: "";
	display: block;
	position: absolute;
	z-index: 1;
	left:12px;
	right:12px;
	bottom:12px;
	top:0;
	background: url(../../../static/img/next/big_cover.png) repeat-x;

	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
	pointer-events: none;
}

.big_tmp:hover{
	-webkit-box-shadow: 0 21px 14px rgb(140 153 191 / 20%);
	box-shadow: 0 21px 14px rgb(140 153 191 / 20%);

}
.big_tmp a{
	display: block;
	height: 100%;
	text-decoration: none;
	cursor: pointer;
}
.cover{
	width: 100%;
	height: 100%;
	background: #F6F6F6;
}

.bottom{
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
	padding:20px;

	width: 100%;
	position: absolute;
	z-index: 2;
	left:0;
	bottom:0;

}
.title{
	font-weight: bold;
font-size: 20px;
color: #FFFFFF;
letter-spacing: 0;
text-align: left;
}
.title span{
	vertical-align: middle;
	background: rgba(0,0,0,0.35);
border-radius: 100px;
font-size: 10px;
color: #FFFFFF;
letter-spacing: 0;
margin-left: 5px;
margin-right: 5px;

	display: inline-block;
	height: 18px;
	padding:0 10px;
}
.info{
	overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

font-size: 14px;
color: #E3E3E3;
letter-spacing: 0;
text-align: justify; 
}
</style>
<style>
	.crux span{
		vertical-align: middle;
	background: rgba(0,0,0,0.35);
border-radius: 100px;
font-size: 10px;
color: #FFFFFF;
letter-spacing: 0;
margin-left: 5px;
margin-right: 5px;

	display: inline-block;
	height: 18px;
	padding:0 10px;
	}
</style>