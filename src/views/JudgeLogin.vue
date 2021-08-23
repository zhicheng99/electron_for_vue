<template>
	<section style=" min-height: 100%;">
	<!-- <div class="header">
		<div>
			<img src="./../../static/img/logo1.png" width="200" alt="">
		<span class="m-l-5 m-r-5">|</span>泊车管理系统
		</div>
			
	</div> -->
	<!-- <div class="login_main" style="background-image: url('../../static/img/login1.png');
   background-position: 50% 50%;
    background-size: cover
    filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(
    src='../../static/img/login1.png',
    sizingMethod='scale');"> -->
    <div class="login_main">
		
				<div class="form_lay">
					<div class="form_left"></div>

					<el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="top" label-width="0px" class="judge-ruleForm login-container pull-left">

						<template v-if="!loginType">
							<h1 class="title text-center m-t-30 m-b-30">飞书登录</h1>

							<a :href="ssoUrl" class="sso">
									
									<div class="sso_btn text-center">
										
										<div class="p-t-30">
											
										<img src="../../static/img/login_logo.png" class="m-t-40" width="70" alt="">
										</div>
										<div class="m-t-25">
											
											请<span>点击</span>使用飞书<br>授权登录
										</div>
									</div>

							</a>
							
						</template>
						<template v-else>
							<h1 class="title text-center m-t-30 m-b-30">登录</h1>
							<div class="p-l-40 p-r-40">
								<el-form-item prop="username"  label="账号"> 
									<el-input type="text" v-model="ruleForm2.username" auto-complete="off" placeholder="请输入账号" @keyup.enter.native="searchEnterFun"></el-input>
								</el-form-item>
								<el-form-item prop="password" label="密码">
									<el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="请输入密码" @keyup.enter.native="searchEnterFun"></el-input>

								</el-form-item>
								<el-form-item prop="code" class="code_lay m-b-40" label="验证码">
									<!-- <el-col :span="14"> -->
										<el-input type="code" v-model="ruleForm2.code" auto-complete="off" placeholder="请输入验证码" @keyup.enter.native="searchEnterFun">
											

											
										</el-input>

										<div class="code_img_lay">
											<img :src="captche" style="width:80px;height:30px;" @click="genCaptcha()" class="cursor"/>
										</div> 


									
								</el-form-item>
								<!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
								<el-form-item style="width:100%; text-align: center;" >
									<el-button type="primary" round style="width:40%;" @click.native.prevent="onSubmit" :loading="logining">登录</el-button>
									 
								</el-form-item>
							</div>
							
							

						</template>

					<!-- 	<div class="right_toggle" @click="toggle">
							<img v-if="!loginType" src="../../static/img/loginType1.png" width="56" alt="">
							<img v-if="loginType" src="../../static/img/loginType2.png" width="56" alt="">

						</div> -->
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
		  code:'',

		  
		  
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
        ssoUrl:config.ssoUrl,
        loginType:true
      };
    },
    methods: {
    	toggle:function(){
    		this.loginType = !this.loginType;
    	},
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
				  
				  localStorage.setItem('user',JSON.stringify(obj));
				  
				  
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
			 	
			 		let authorityMenu = ['/manage','/index','/info','/trend','/market','/idea','/case','/customer','/data','/help','/listMore','/detail']; //需要把二级菜单记录到本地  路由守卫据此进行判断是否有权限进入相应页面

					obj.map(item=>{
						item.children  &&
						(item.children.map(child=>{
							
							authorityMenu.push(child.vueHref); 
						}))
					})
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

					console.log(authorityMenu);
					

					localStorage.setItem('authorityMenu',config.encode(authorityMenu.join(',')));



					this.$router.push({ path: '/manage' });
			 
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

							// _czc.push(["_trackEvent", "网站登陆", "登录", "账号密码"]);
				  		 	

				  		 	this.getMenu(data);
				  
				  			
				  
				  		 })()  || (()=>{
				  
				  				this.genCaptcha();
				  				this.ruleForm2 = {
				  					...this.ruleForm2,
				  					...{code:''}
				  				};
				  
				  
				  		 })()
				 
				  		 this.logining = false;
				  		  
				  
				  	  }).catch(()=>{

				  	  	 this.genCaptcha();
				  	  	 this.ruleForm2 = {
				  	  	 	...this.ruleForm2,
				  	  	 	...{code:''}
				  	  	 }

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
		
								localStorage.setItem('user', JSON.stringify(obj));
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
										localStorage.setItem('user', JSON.stringify(obj));

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

h3{
	margin:0;
	font-size:26px;
	line-height:28px
}
h2{
	margin:0;
	font-size:32px;
	line-height:60px


}
	.form_left{
		width: 550px;
		height:500px;
		background:url(../../static/img/form_left_bg.png) center center no-repeat;
		background-size:cover;
		float:left;
		position:relative;

	}
	.form_left>div{
		position: absolute;
		color:#fff;
		font-size:12px;
		left:30px;
		right:20px;
		top:80px;
		line-height:22px;

	}
	.login_main{
		position:absolute;
		left:0;
		top:0;
		right:0;
		bottom:0;
	}
	
	.form_lay{
		position: absolute;
		left:50%;
		width:968px;
		height:500px;
		margin:0 auto;
		top:50%;
		margin-left:-484px;
		margin-top:-233px;
		box-shadow: 0 0 5px #e6e4e4;
		background:#fff;
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
    //-webkit-border-radius: 5px;
    //border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    // margin: 120px auto;
    width: 414px;
    padding: 35px 0 15px 0;
    background: #fff;
    //border: 1px solid #eaeaea;
    //box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto; 
      color: #333333;
      font-size:36px;

    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }

  .code_lay{
  	position:relative;
  }
  .code_img_lay{
  	    position: absolute;
    right: 0;
    top: -1px;
  }
.sso{
    font-size: 16px;
    text-decoration: none;
    color: #333;
    cursor:pointer;
}
.sso span{
	color:#3c8bff;
}
.fs{
	height: 13px;
    vertical-align: middle;
}

.more_login{
	font-size: 12px;
	color: #8f959e;
	position: relative;
	width: 80%;
	margin:0 auto;
}
.more_login:after{
	position: absolute;
	z-index: 0;
	content: "";
	display: block;
	width: 100%;
	top:50%;
	left:0;
	border-top:solid #dee0e3 1px;
}
.more_login span{
	background: #fff;
	position: relative;
	z-index: 1;
}
.judge-ruleForm {
	position: relative;
}



</style>
<style>
.sso_btn{
	width: 260px;
	height: 260px;
	margin:0 auto;
	border-radius: 130px;
	-webkit-box-shadow: #eae7e7 0 0 21px;
	box-shadow: #eae7e7 0 0 21px;


}
.right_toggle{
	position: absolute;
	top:0;
	right:-4px;
	width:56px;
	height:56px;
	background:#3c8bff;
	cursor: pointer;

}
.right_toggle:after{
	content: "";
	display: block;
	position: absolute;
	left:0;
	top:0;
	width: 0;
	height: 0;
	border-top: solid transparent 28px;
    border-left: solid #fff 28px;
    border-right: solid transparent 28px;
    border-bottom: solid #fff 28px;


}
#app{
		position: absolute;
	}
	.judge-ruleForm .el-form-item__label{
		padding: 0;
		color: #A6A6AA;
		line-height: 30px;
	}
	.judge-ruleForm .el-form-item__label:before{
		display: none !important;
	}
	.judge-ruleForm .el-form-item__content{
	    line-height: 30px;

	}
	.judge-ruleForm .el-input__inner{
		border:none;
		border-bottom:solid #24252A 1px;
		border-radius: 0;

		padding-left:0;
		color: #1D1D26;
		height: 30px;
	    line-height: 30px;
	}
	.judge-ruleForm .el-form-item{
		position: relative;
	}
	.judge-ruleForm .el-form-item .tip{
		position: absolute;
		left:13px;
		top:10px;
		width: 20px;
		height: 20px;

	}

	.judge-ruleForm .el-input__inner::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
	  color: #999999;
	  font-size: 12px;
	}

	.judge-ruleForm .el-input__inner:-moz-placeholder, textarea:-moz-placeholder {
	  color: #999999;
	  font-size: 12px;
	}

	.judge-ruleForm .el-input__inner::-moz-placeholder, textarea::-moz-placeholder {
	  color: #999999;
	  font-size: 12px;
	}

	.judge-ruleForm .el-input__inner:-ms-input-placeholder, textarea:-ms-input-placeholder {
	  color: #999999;
	  font-size: 12px;
	}
</style>