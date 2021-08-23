<template>
	<div>

			<el-tooltip class="item" effect="dark" content="问题反馈点击进入飞书群" placement="left-start">
		<div class="question text-center" @click="feedbackChat">

      
					?
		</div>
    			</el-tooltip>
		
		<div class="backTop text-center cursor" v-show="top>0" @click="go">
			<i class="el-icon-download"></i>
		</div> 
	</div>
	
</template>
<script>
	export default{
		data(){
			return {

			}
		},
		methods:{
			go:function(){
				// var obj = document.getElementById('content-container');

				var scrollToTop=setInterval(()=> {
				　　var pos = this.$store.state.scrollTop;

					if ( pos >0 ) {
						window.scrollTo(0, pos - 50 );
					} else {
					　　window.clearInterval( scrollToTop );
					}
				}, 16);
			},
			//问题反馈
			feedbackChat:function(){
				this.$post('/admin/larkBot/addChatUser',{openId:''}).then(({code,obj})=>{
						// (code == '00') && 
						// this.$message({
						// 		message: '加入成功,请您在飞书反馈群中提交问题!',
						// 		type: 'success'
						// 	})
						if(code =='00'){
							this.$message({
								message: '加入成功,请您在飞书反馈群中提交问题!',
								type: 'success'
							});
							setTimeout(_ => {
		          
					          window.open('lark://client/chat/6941278911732924417','_self');

					        }, 350);
						}

					})
			},
		},
		computed:{
			top(){
				return this.$store.state.scrollTop;

			}
		}
	}
</script>
<style scoped>
	.backTop{
		position: fixed;
		z-index: 4;
		right: 20px;
		bottom:50px;
		width: 40px;
		height: 40px;
		background: #e1ecfb;
		color: #000;
		line-height: 40px;
		box-shadow: #ddd 0px 0px 10px;
		border-radius: 20px;

	}
	.backTop i{
		font-size: 22px;
		line-height: 40px;
		color: #0071fe;
		transform: rotate(-180deg);
		-webkit-transform: rotate(-180deg);
		-moz-transform: rotate(-180deg);
		-o-transform: rotate(-180deg);


	}

	.question{
		position: fixed;
		cursor: pointer;
		z-index: 4;
		right: 20px;
		bottom:95px;
		width: 40px;
		height: 40px;
		background: #e1ecfb;
		line-height: 40px;
		box-shadow: #ddd 0px 0px 10px;
		border-radius: 20px;
	    font-size: 20px;
	    color: #3d8bff;

	}

</style>