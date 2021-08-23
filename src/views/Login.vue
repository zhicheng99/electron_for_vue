<template>
	<section style=" min-height: 100%;">
	<!-- <div class="header">
		<div>
			<img src="./../../static/img/logo1.png" width="200" alt="">
		<span class="m-l-5 m-r-5">|</span>泊车管理系统
		</div>
			
	</div> -->
	<div class="login_main" style="background-image: url('../../static/img/login.jpg');
   background-position: 50% 50%;
    background-size: cover
    filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(
    src='../../static/img/login.jpg',
    sizingMethod='scale');">
		
				<div class="form_lay">
					<el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container pull-right">
						<h3 class="title text-left m-b-20">登录</h3>
						<el-form-item prop="username" label="账号:" :label-width="'80px'"> 
							<el-input type="text" v-model="ruleForm2.username" auto-complete="off" placeholder="账号" @keyup.enter.native="searchEnterFun"></el-input>
						</el-form-item>
						<el-form-item prop="password" label="密码:" :label-width="'80px'">
							<el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="密码" @keyup.enter.native="searchEnterFun"></el-input>
						</el-form-item>
						<el-form-item prop="code" label="验证码:" :label-width="'80px'">
							<el-col :span="14">
								<el-input type="code" v-model="ruleForm2.code" auto-complete="off" placeholder="验证码" @keyup.enter.native="searchEnterFun"></el-input>
							</el-col>
							<el-col :span="10" class="p-l-10">
								<img :src="captche" style="width:95px;height:38px" @click="genCaptcha()" class="cursor"/>
							</el-col>
							
						</el-form-item>
						<!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
						<el-form-item style="width:100%;" :label-width="'80px'">
							<el-button type="primary" style="width:100%;" @click.native.prevent="onSubmit" :loading="logining">登录</el-button>
							<!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
						</el-form-item>
					</el-form>
				</div>		
				
				
	</div>
		

	
	
  
	
	</section>

</template>

<script> 
  import  config  from '../common/js/config.js';


  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
		captche:"",
        ruleForm2: {
//           username: 'mafengyu_v',
//           password: '123456',
		  username: '',
		  password: '',
		  code:''
		  
        },
        rules2: {
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ],
          code: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true,
      };
    },
    methods: {
    	searchEnterFun(e){
				var keyCode = window.event? e.keyCode:e.which;
                //  console.log('回车搜索',keyCode,e);
                 if(keyCode == 13){
 
             		// this.getUsers();
             		this.onSubmit();
                 }
			},
	  genCaptcha:function(){
		  console.log("1");
		  this.captche = location.origin+"/utopia/admin/genCaptcha?time="+Math.random();
	  },
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
	  judgeRole:function(){
		  this.$post('/system/getUserInfo',{}).then(({code,obj})=>{
			  
			  (code == '00') && 
			  (()=>{
				  
				  sessionStorage.setItem('user',JSON.stringify(obj));
				  
				  
				  if(obj.roleDtoList && obj.roleDtoList !==null && obj.roleDtoList.length >0){		 
					 //管理员
					 this.$router.push({ path: '/manage' });

					 
				  }else{
				  	//普通用户
				  	this.$router.push({ path: '/user' });
	 
				  					 
				  }
				  
			  })()
			  
		  })

	  },
	  getMenu:function(data){
			this.$fetch('/admin/system/user/getUserMenu',{}).then(({code,obj})=>{

				if(code != '00'){
					return false;
				}


				let authorityMenu = ['/manage']; //需要把二级菜单记录到本地  路由守卫据此进行判断是否有权限进入相应页面

				obj.map(item=>{
					item.children  &&
					(item.children.map(child=>{
						
						authorityMenu.push(child.vueHref); 
					}))
				})



				//各角色首页路由也需要加到 authorityMenu
				// var userStr  = sessionStorage.getItem('user');
				// if(userStr !== null){
				// 	var userObj = JSON.parse(userStr);
				// 	if(userObj.userType == '1'){ // 平台用户
				// 			authorityMenu.push('/manage');
				// 			// this.$router.push({ path: '/manage' });

				// 	}else{ //商户

				// 		if((userObj.confirmStatus==0) || (userObj.confirmStatus == 2)){  //没有确认信息或信息有误

				// 			// this.$router.push({ path: '/infoConfirm' });
				// 			authorityMenu.push('/infoConfirm');


			 //  			}else{

			 //  				if(userObj.userType == '4'){  //代理商
				// 				authorityMenu.push('/agency');

				// 				// this.$router.push({ path: '/agency' });

			 //  				}else{
				// 				authorityMenu.push('/user');

				// 				// this.$router.push({ path: '/user' });

			 //  				}

			 //  			}
				// 	}
				// }

				//二级页面的路由权限也得相应的添加进去 routes.js
				// console.log(this.$router.options.routes);
				var childRoute = this.$router.options.routes.filter(item=>item.lev2);
				// console.log(childRoute);
				if(childRoute.length>0){
					var tmp = [];
					authorityMenu.forEach(item=>{

						childRoute[0].children.forEach(c=>{
							if(item == c.fromListRoute){
								tmp.push(c.path);
							}
						})

					})

					// console.log(tmp);

					authorityMenu = authorityMenu.concat(tmp);

				}
				

				localStorage.setItem('authorityMenu',config.encode(authorityMenu.join(',')));

				this.$router.push({ path: '/manage' });

			 	// this.judgeRole(data);



			})
	},
	  onSubmit(){
		  var loginParams = { 
				username: this.ruleForm2.username ,
				password: this.ruleForm2.password ,
				code:this.ruleForm2.code
				};

		  this.$refs.ruleForm2.validate((valid) => {
			  
			  if(valid){
				  
				  var callback = ()=>{
				  	  this.logining = true;
				  	  this.$post('/admin/login/main',this.ruleForm2).then(({code,data}) =>{
				  		  
				  		 (code =='00') && 
				  		 (()=>{

				  		 	this.getMenu(data);
				  
				  		 	//获取个人信息
				  		 	// this.$post('/system/user/userInfo').then(({code,obj}) =>{
				  		 			  
				  		 	// 	(code == '00') &&
				  		 	// 	sessionStorage.setItem('user',JSON.stringify(obj));
				  		 	// 	// this.sysUserName = obj.nickName;
				  		 	// 	 this.$router.push({ path: '/manage' });
				  		 		
				  		 	// });
				  
				  
				  		 })()  || (()=>{
				  
				  				this.genCaptcha();
				  				this.ruleForm2 = {
				  					...this.ruleForm2,
				  					...{code:''}
				  				};
				  
				  
				  		 })()
				 
				  		 this.logining = false;
				  		  
				  
				  	  })
				  }
				  callback();
			  }
		  })

	  },
			
      handleSubmit2(ev) {
				
				
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            //NProgress.start();
            var loginParams = { username: this.ruleForm2.username, password: this.ruleForm2.password };
						
						
						//开发模式下请求模拟数据
						if(process.env.NODE_ENV == 'development'){
							
							//登录用户信息接口
							_this.$fetch( config.host+'/static/mockjson/getUserInfo_m.json').then(({code,obj})=>{
								console.log(obj);
		
								sessionStorage.setItem('user', JSON.stringify(obj));
								this.$router.push({ path: '/user' });

								
							})
						}else{
							// requestLogin(loginParams).then(data => { 
							_this.$post('/login/main',loginParams).then(data =>{	
								this.logining = false;
								//NProgress.done(); 
								console.log(data);
								let { msg, code, obj } = data;
								if (code !== '00') {
									this.$message({
										message: msg,
										type: 'error'
									});
								} else {
									
									//登陆完成请求当前登录用户信息接口
									this.$post('/system/getUserInfo',{}).then(res=>{
										let { msg, code, obj } = res;
										sessionStorage.setItem('user', JSON.stringify(obj));

										this.$router.push({ path: '/user' });
									})
									
								}
							});							
							
						}
						
						
          } else {
            return false;
          }
        });
      }
    },
	mounted(){
		this.genCaptcha();
	}
  }

</script>

<style lang="scss" scoped>
	
	.login_main{
		position:absolute;
		left:0;
		top:0;
		right:0;
		bottom:0;
	}
	
	.form_lay{
		position: absolute;
		left:20%;
		width:60%;
		margin:0 auto;
		top:40%;
		margin-top:-140px;
	}
	
	.header{
		height: 64px;
    box-shadow: #e8e5e5 1px 1px 4px;
    font-size: 22px;
    color: #7b7b7b;
    line-height: 64px;
    background: #fff;
    position: relative;
    z-index: 1;
	}
	.header img{
		vertical-align: middle;
	}
	.header div{
		max-width:1366px;
		margin:0 auto;
	} 
	.header span{
		color:#dddddd;
	}
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    // margin: 120px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto; 
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>