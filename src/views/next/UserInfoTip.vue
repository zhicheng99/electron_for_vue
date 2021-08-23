<template>
	<span>
		<el-tooltip  popper-class="info_tooltip" class="item" effect="light" content="Right Bottom 提示文字" placement="right-end">

			<div slot="content">
				<div class="img_lay text-center"  
				v-bind:style="{
					'background':'url('+info.avatar_url+') center center / cover no-repeat',

				}"
				>
				
				<div class="mask"></div>
					<div class="text text-left">
							
						<div class="m-b-5">{{info.name}}</div>

						<a :href="'lark://applink.feishu.cn/client/chat/open?openId='+openId" target="_self">
							
							<span class="text-center"><i class="el-icon-chat-line-round"></i></span>

						</a>
						
					</div>
				</div>

				<div class="info">
					状态：{{info.description}}<br>
					邮箱：<a :href="'mailTo:'+info.email">{{info.email}}</a>
					
				</div>

			</div>
		<span class="name">
			
		@{{userName}} 
		</span>
    </el-tooltip>
	</span>
</template>
<script>
	export default{
		components:{},
		props:['userName','openId'],
		data(){
			return {
				info:{}
			}
		},
		methods:{
			getInfo:function(v){
				this.$post('/api/data/byByOpenId',{openId:v}).then(({code,obj})=>{
					(code == '00') && (this.info = obj)
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

			'openId':function(v){
				console.log(v);
				this.getInfo(v)
			}

		}
	}

</script>
<style scoped>

.img_lay{
	width: 320px; 
	height: 270px;
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;

	background: #5C8CF7;
	overflow:hidden;
	position: relative;
	background-size:100% auto


}

.img_lay .text{
	position: absolute;
	left:0;
	bottom:0;
	width: 100%;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
	padding: 10px;

}
.mask{
	position: absolute;
	left:0;
	top:0;
	width: 100%;
	height: 100%;
	opacity: .6;
    background-image: -webkit-gradient(linear,left top,left bottom,from(rgba(31,35,41,0)),to(#000));
    background-image: -webkit-linear-gradient(top,rgba(31,35,41,0),#000);
    background-image: -o-linear-gradient(top,rgba(31,35,41,0),#000);
    background-image: linear-gradient(-180deg,rgba(31,35,41,0),#000);
}
.text a{
	color: #fff;
}
.text span{
	display: inline-block;
	width: 30px;
	height: 30px;
	line-height: 35px;

	background: rgba(0,0,0,0.5);
	border-radius: 25px;
	cursor: pointer;
}
.text div{
	font-weight: bold;
	font-size: 24px;
}
.text span:hover{
	background: #5889F6;
}
.text span i{
	font-size: 18px;
}

.img_lay img{
	width: 100%;

}

.info{
	font-size: 14px;
    color: #8f959e;
    padding: 15px;
    line-height: 30px;
    background: #fff;
}

.info a{
	color:#3370ff;
	text-decoration: none;
}

.name{
	color:#5889F6;
}

</style>
<style>
.info_tooltip.el-tooltip__popper.is-light{ 
		padding:0;
		font-size: 10px;
		border-radius: 5px;
		border:none;
		background: transparent;
		color:#fff;
		/*overflow:hidden;*/
		-webkit-box-shadow: 0 3px 12px 2px rgb(31 35 41 / 12%);
	    box-shadow: 0 3px 12px 2px rgb(31 35 41 / 12%);
	}
	.info_tooltip.el-tooltip__popper[x-placement^=right-end] .popper__arrow{
      border-right-color: #5889F6;
    }
    .info_tooltip.el-tooltip__popper[x-placement^=right-end] .popper__arrow:after {
      border-right-color: #5889F6;
    }
</style>