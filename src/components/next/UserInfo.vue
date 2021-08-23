<template>
	<span class="pull-right m-t-10 m-l-10">
		<img :src="face"  class="face"> 
		<!-- <span class="name">{{name}}</span>  -->
		<el-dropdown trigger="hover" @command="handleCommand" >
			<span class="el-dropdown-link userinfo-inner">
				{{name}} <i class="el-icon-arrow-down" style="color: #fff"></i></span>
			<el-dropdown-menu slot="dropdown">

				<el-dropdown-item command="manage" v-if="isAdmin">进入后台</el-dropdown-item>

				
				<el-dropdown-item  command="logout" >退出登录</el-dropdown-item>


			</el-dropdown-menu>
		</el-dropdown>


		<!-- <i class="iconfont icon-tuichu m-l-10" @click="logout"></i> -->
		
	</span>
</template>
<script>
	export default{
		components:{},
		props:[],
		data(){
			return {
				face:'../../../static/img/user1.png',
				name:'',
				isAdmin:false
			}
		},
		methods:{
			handleCommand(command) {
				// this.$message('click on item ' + command);
				
				switch(command){
					case 'manage':
						this.$router.push({ path: '/manage' });
					break; 
					case 'logout':
						this.logout();
					break;
				}
				 
				
				
			},
			contain:function(path,paths){
				var tmp = false;
				for (var i = 0; i < paths.length; i++) {
					if(paths[i] == path){
						tmp = true;
						break;
					}
				}
				return tmp;
			},
			getInfo:function(){
				this.$post('/admin/system/user/userInfo',{}).then(({code,obj})=>{
					(code == '00') && (()=>{

						this.name = obj.nickName;
						this.face = (typeof obj.icon !='undefined' && (obj.icon !=''))?obj.icon:this.face;
						console.log(this.$route.path);

						
						if(obj.identity == '1'){
							this.isAdmin = true;
						}


					})()
				})
			},
			logout: function () {
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
		
					this.$post('/admin/systemLogout',{}).then(res=>{  //测试用
					
						localStorage.removeItem('user');
						localStorage.removeItem('receivingType');
						localStorage.removeItem('authorityMenu');
						
						
						localStorage.removeItem('selectRoleId');
			
						
						//测试用
						this.$router.push({ path: '/login' });
					})
				}).catch(() => {
				});
			},
		},
		mounted(){
			this.getInfo();

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
.face{
	width: 30px;
	height: 30px;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
	border-radius: 15px;
	vertical-align: middle;
	background: #f3f3f3;
	border:solid 2px #3687fd;
	margin-top:-2px;
}
.userinfo-inner{
	color: #fff;
	font-size: 14px;
}
i{
	color: #666666;
	font-size: 16px;


}
</style>