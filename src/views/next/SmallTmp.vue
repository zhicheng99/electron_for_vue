<template>
	<div class="samll_tmp">
			<router-link :to="{path:'detail',query:{uid:itemData.uid,headerIndex:headerIndex}}" class="go">

		<div class="cover_lay">
			<img class="cover" :src="itemData.cover" alt="" lazy>
			<div class="crux text-break" v-html="format(itemData.crux)">
				<!-- <span>标签</span>
				<span>标签</span> -->
			</div>
		</div>

		<div class="title m-t-30 text-break">{{itemData.title}}</div>
		<div class="info m-t-20">{{itemData.introduction}}</div>

		<div class="text-right p-t-20">
			
				<i class="el-icon-right"></i>
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

			format:function(v){
				if(v!=''){
					if(v.indexOf(',')>-1){

						let tmp = v.split(',');
						let s = '';
						tmp.forEach(item=>{
							(item!='') && (s+='<span>'+item+'</span>')
						})

						return s;


					}else{

						return '<span>'+v+'</span>'
					}

				}else{

					return ''
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
.samll_tmp{
	float: left;
	width: 290px;
	height: 390px;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
	/*box-shadow: 0 21px 14px rgb(140 153 191 / 20%);*/

	padding:0 12px 12px 12px;
	transition: box-shadow 0.3s;
-moz-transition: box-shadow 0.3s; /* Firefox 4 */
-webkit-transition: box-shadow 0.3s; /* Safari 和 Chrome */
-o-transition: box-shadow 0.3s; /* Opera */

border:solid #f4f4f4 1px;
}

.samll_tmp:hover{
	-webkit-box-shadow: 0 21px 14px rgb(140 153 191 / 20%);
	box-shadow: 0 21px 14px rgb(140 153 191 / 20%);

}


.samll_tmp a{
	text-decoration: none;
}
.cover_lay{
	position: relative;
	height: 166px;
	background: #F6F6F6;
}

.cover_lay:after{
	content: "";
	display: block;
	position: absolute;
	z-index: 1;
	width: 100%;
	height: 100%;
	left:0;
	top:0;
	background: url(../../../static/img/next/small_cover.png) repeat-x;
}

.cover{
	width: 100%;
	height: 100%;
	background: #F6F6F6;


}
.crux{
	position: absolute;
	z-index: 2;
	left:0;
	bottom:0;
	width: 100%;
	padding: 10px;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
}
.cover_lay span{
	margin-right: 10px;
	display: inline-block;
	height: 18px;
	padding:0 10px;
	background: rgba(0,0,0,0.35);
border-radius: 100px;
font-size: 10px;
color: #FFFFFF;
letter-spacing: 0;
}
.title{
	font-weight: bold;
	font-size: 20px;
	color: #000722;
	letter-spacing: 0;
	text-align: left;
}
.info{
font-size: 14px;
color: #AEAFB0;
letter-spacing: 0;
text-align: justify;

overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    height: 63px;
}
.go i{
	font-weight: bold;
	font-size: 18px;
color: #4E9BFA;
}

</style>
<style>
	.crux span{
		margin-right: 10px;
	display: inline-block;
	height: 18px;
	padding:0 10px;
	background: rgba(0,0,0,0.35);
border-radius: 100px;
font-size: 10px;
color: #FFFFFF;
letter-spacing: 0;
	}
</style>