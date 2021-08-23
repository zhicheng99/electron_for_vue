
<template>
	<div>
		
	<el-row class="container"  v-bind:style="{background:bodyBg}">
		<div class="header">
			<div class="logo" :class="collapsed?'logo-collapse-width':'logo-width'" v-bind:style="{background:!isShow?'#fff':''}">
				<template v-if="collapsed">
					<img src="./../../static/img/logo2.png">
				</template>
				<template v-else>
					<img src="./../../static/img/logo2.png"><!-- {{sysName}} -->
				</template>
				<!-- {{collapsed?'':sysName}} -->
			</div>
			<div class="header_c">
				<el-row>
			<el-col :span="24" class="userinfo">
				
				<!-- <router-link to="/" target="_blank">
					Next首页
				</router-link> -->
				<!-- <router-link to="/review" target="_blank" v-if="isReview">
					案例评审首页
				</router-link>
				<router-link to="/collect" target="_blank" v-if="isCollect">
					案例中心首页
				</router-link> -->
				
				<el-dropdown trigger="click" @command="handleCommand" class="pull-right">
					<span class="el-dropdown-link userinfo-inner">
						<img :src="face"  class="face"> 

						{{sysUserName}} <i class="el-icon-arrow-down"></i></span>
					<el-dropdown-menu slot="dropdown">
						<!-- <el-dropdown-item command="info">个人资料</el-dropdown-item> -->

						<el-dropdown-item command="pwd">修改密码</el-dropdown-item>
						
						<el-dropdown-item command="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				
				<rightOptions v-if="selectRoleId==0"
				v-bind:user-detail="UserDetail"
				></rightOptions>
			</el-col>
				</el-row>
			</div>
			
		</div>
		<el-col :span="24" class="main"> 
				
			<aside v-show="isShow" :class="collapsed?'menu-collapsed':'menu-expanded'" style="position: relative; z-index: 2000;" >
				<div class="wrapper" :class="!collapsed?'overHide':''" ref="wrapper" >
					 <div class="content">
						 
						 <!--导航菜单-->
						  <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
						 	 unique-opened router v-if="!collapsed"> 
						 
						 <li  v-if="selectRoleId!='0'" role="menuitem" aria-haspopup="true" class="el-submenu">
						 	<div class="el-submenu__title" style="padding-left: 20px;">
						 		<router-link to="manage" style="color:#48576a; text-decoration: none;display:block;">
						 									<i class="icon-align-justify"></i> 首页
						 								</router-link>
						 	</div>
						 </li>
						 	
						 	<template v-for="(item,index) in routerCopy">
						 		<template v-if="!item.hidden">
						 			
						 			
						 			<el-submenu :index="index+''" v-if="item.children">
						 				<template slot="title"><i :class="item.iconCls"></i> {{item.name}}</template>
						 				<el-menu-item 
										v-for="child in item.children" 
										:index="child.path" 
										:key="child.path" 
										v-if="!child.hidden">
										<i :class="child.iconCls"></i> {{child.name}}
										</el-menu-item>
						 			</el-submenu>
						 		</template>
						 		<!-- <template v-else-if="item.hidden">
						 			<template v-if="item.children && item.children.length>0">
						 				<el-menu-item v-for="child in item.children" :index="child.path" v-if="!child.hidden"><i :class="item.iconCls"></i> {{child.name}}</el-menu-item>
						 			</template>
						 		</template> -->
						 	</template>
						 	 
						 	
						 </el-menu> 
						 
						 
						 <!-- 折叠后的 -->
						 <ul class="el-menu el-menu-vertical-demo collapsed" v-if="collapsed" ref="menuCollapsed">
						 	 
						 
						 	<li v-for="(item,index) in routerCopy" v-if="!item.hidden" class="el-submenu item">
						 		<template v-if="!item.hidden">
						 			<div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseleave="showMenu(index,false)">
										
										<i :class="item.iconCls"></i>
										<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseleave="showMenu(index,false)"> 
											<li v-for="child in item.children" 
											v-if="!child.hidden" 
											:key="child.path" 
											class="el-menu-item" 
											style="padding-left: 40px;" 
											:class="$route.path==child.path?'is-active':''" 
											@click="$router.push(child.path)">
											<i :class="child.iconCls"></i>
											{{child.name}}</li>
										</ul>
									</div>
						 			
						 		</template>
						 		<template v-else>
						 			<li class="el-submenu">
						 				<div class="el-submenu__title el-menu-item" 
						 				style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" 
						 				:class="$route.path==item.children[0].path?'is-active':''" 
						 				@click="$router.push(item.children[0].path)">
						 				<i :class="item.iconCls"></i>
						 				</div>
						 			</li>
						 		</template>
						 	</li> 
						 </ul>
						
					  </div>
				</div>
				
				
			</aside> 				
			<section class="content-container" id="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container" v-if="selectRoleId!=0">

						<el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb-inner" style="float: left;"> 
						<strong class="title" style="width: auto;">当前位置：</strong> 
						  
							<el-breadcrumb-item v-for="item in locationObj" :key="item.name"  v-if="item.name!=''">
								
								{{ item.name }} 
							</el-breadcrumb-item>  
							
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper p-b-40">
						<transition name="fade" mode="out-in">
							<router-view v-bind:recordtype="recordtype" v-on:ListenChild="ShowChild"></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>

		
	</div>
</template>

<script>
	
	
	import txtToImg  from '../common/js/txtToImg.js'
	import config  from '../common/js/config.js'
	import BScroll from 'better-scroll' 
    
    import dic from '../common/js/dic.js' 

import {encode,decode,safeEncode} from '../common/js/base64.js';

	

	

    
	export default {
		components:{
			
		},
		data() {
			return {
				sysName:'管理系统',
				collapsed:false,
				sysUserName: '',
				sysUserAvatar: '',
				form: {
					type: [],
				},
				alarmForm: {
					ldap: '',
					userName: '',
					parkingId: '',
					numbers: '',
					alarmType: '',
					alarmDesc: '',
				},
				alarmFormVisible:false,
				formLabelWidth: config.dialogLabelWidth,
				bodyBg:'',
				
				dialogRoleVisible:false,
				
				loginVisible:false,
				loginForm:{
					username:'',
					password:''
				},
				
				selectRoleId:null,
				role:[],
				ruleVisible:false,
				
				routerCopy:[],
				findPersonVisible:false,
				findNum:'',
				findPersonList:{parkInfoVO:[]},
				alarmtypeList:[],
				ParkList:[],

				routerObj:[],
				locationObj:[],
				UserDetail:[],
				recordtype:1,
				
				workFormVisible:false,

				workplace:'',
				
				receiveRoleType:true,
				
				isShow:true,
				isReview:false,
				isCollect:false,

				face:'../../static/img/user1.png',

				
			}
		},
		methods: {
			setWorkFormVisible:function(){
				this.workFormVisible = false;
			},
			setWorkVisible:function(v){
				this.workVisible = v
			}, 
			changeStatus(){
				if(this.recordtype==1){
					this.recordtype=2
				}else{
					this.recordtype=1;
				}
				console.log(this.recordtype);
			},
			ShowChild: function (data) {
				this.workplace=data.name;
			    console.log(data);
			}, 
			handleCommand(command) {
				// this.$message('click on item ' + command);
				
				switch(command){
					case 'info':
						this.$router.push({ path: '/info' });
					break;
					case 'pwd':
						this.$router.push({ path: '/pwd' });
						
					break;
					case 'logout':
						this.logout();
					break;
				}
				
				if(command.indexOf('selectRole_') > -1){ //切换角色
					this.selectRoleId = command.replace('selectRole_','');
				}
				
				
				
			},
			onSubmit() {
				// console.log('submit!');
			},
			handleopen(a,b) { 
				
				if(this.$route.path == '/user'){ 
					this.$router.push({ path: '/user' ,query:{pid:this.routerCopy[a].id}});
				}
				
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
			 
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			},
			hideMenu(){
				this.$refs.menuCollapsed.getElementsByClassName('submenu')[0].style.display = 'none';
			},
			//根据菜单数据对应路由
			mapRouter(data){
				
				let router = this.$router.options.routes;
				
				let routerFromApi = []; //接口返回二级菜单
				data.map(item=>{
					item.children  &&
					(item.children.map(child=>{
						
						routerFromApi.push({
							"name":child.title,
							"path":child.vueHref,
							"parentName":item.title,
							// "icon":child.icon,
							// "parentIcon":item.icon,
							"icon":'',
							"parentIcon":'',
							"sortVal":child.sortVal,
							"parentSortVal":item.sortVal
						})
					}))
				})
				
				router.map(item=>{
					
					item.hidden = true;
					
					// if(item.name !='个人中心'){
						item.children && item.children.map(child=>{
							child.hidden = true;

							//通过path直接匹配(循环二级菜单)
							routerFromApi.map(per=>{
								if(per.path == child.path){  //和接口过来的数据匹配
									child.hidden = false;
									child.name = per.name;
									child.iconCls = per.icon;
									child.sortVal = per.sortVal;
									
									item.hidden = false;
									item.name  = per.parentName;
									item.iconCls = per.parentIcon==''?'icon-align-justify':per.parentIcon; 
									item.sortVal = per.parentSortVal;
								}
							})
							
							
							
						})	
					// } 
					
				})

				
				this.routerCopy = Object.assign({},router);
				
				console.log(this.routerCopy);
				 
				this.createLocation();
				
			},
			createLocation:function(){ 
				
				let curr = this.$route;
				//当前位置对象
				this.locationObj = []; 
				
				let temp = [];
				this.routerObj.map(item=>{
					
					item.children && item.children.map(child=>{
						if((child.path == curr.path) || (child.url == curr.path)){
							temp.push({
								name:item.name
							});
							temp.push({
								name:child.name
							});
						}
					})
					
				})
				
				if(temp.length>0){
					this.locationObj = temp;
					
				}else{
					
					//非接口的配置的详情页路由

					
					let children = this.$router.options.routes[this.$router.options.routes.length-1].children;
					let fromListRoute = '';
					children.map(item=>{
						if(item.path == this.$route.path){
							fromListRoute = item.fromListRoute;
						}
					})
					
					//通过fromListRoute找到父菜单名称
					this.routerObj.map(item=>{
						item.children && item.children.map(child=>{
							if(child.url == fromListRoute){
								this.locationObj.push({
									name:item.name
								})
							}
						})
					})
					
					this.locationObj.push({
						name:this.$route.name
					})


				}
				

				  
			},
			getProductClass:function(){  //办公用品分类
				
				//数据直接模拟成路由 routerCopy 的格式 渲染成左侧菜单 
				dic.ProductClassList().then(({code,obj})=>{
					
					if(code == '00'){
						
						obj.map(item=>{
      
						  item.hidden = false;
						  item.iconCls = 'icon-align-justify';
						  
						  item.list &&
						  (item.list !== null) &&
						  item.list.map(child=>{
							child.hidden = false;
							child.iconCls = '';
							child.path="/user?pid="+child.parentId+"&id="+child.id;
						  });
						  
						  item.children = (item.list && (item.list !== null))?item.list:[];
						  delete item.list;
						  
						});
						
						
						this.routerCopy = obj;
						
						console.log(this.routerCopy);
						
					}
					
					
				});
				 
				
			},
			//通过角色id取得左侧菜单
			getMenuByRoleId(authType,data){

				//模拟第三方菜单数据
				this.$fetch(config.host+'/static/mockjson/getFeatureByrole.json').then(({code,obj})=>{
				// this.$fetch('https://99cases.oceanengine.com/static/mockjson/getFeatureByrole.json').then(({code,obj})=>{
						 

					this.routerObj = obj;
					
					//放一个管理员的首页
					this.routerObj = this.routerObj.concat({
						name:'',
						children:[{
							name:'首页',
							url:'/manage'
						}]
					});
					
					this.mapRouter(data);
				})
			},
			fileDuplicate(obj){  //过滤掉children里的重复项
				
				obj.map(item=>{
					
					(item.children !== null) && 
					(()=>{
						var hash = {}; 
						item.children = item.children.reduce(function(item, next) { 
						hash[next.id] ? '' : hash[next.id] = true && item.push(next); 
						return item 
						}, []);
					})();
					
					
				})
				
				
			},
			//为原路由生成一个结构性的数据  为显示隐藏菜单
			createCopy(r){
				// console.log(r);
				this.routerCopy = Object.assign({},r);
				
			},
			 
			 

			getMenu:function(){
				this.$fetch('/admin/system/user/getUserMenu',{}).then(({code,obj})=>{

					this.getMenuByRoleId(0,obj);
					//创建菜单
					// this.routerCopy = obj;
				})
			},
			appendCollectMenu:function(roleLists){
				var tmp1 = roleLists.filter(item=>{
					return item.id == '12'  //巨量引擎日常案例收集员
				})
				var tmp2 = roleLists.filter(item=>{
					return item.id == '11'  //巨量引擎日常案例收集管理员
				})


				if(tmp1.length>0 || (tmp1.length>0 && tmp2.length>0)){
					this.isCollect = true;
					var authorityMenu = localStorage.getItem('authorityMenu');
					if( (authorityMenu !== null)){	

					  	var t = decode(authorityMenu); 
					  	var contributePath = ['/collect','/myContribute','/contribute','/viewContribute','/editContribute'];
					  	var newPath=t.split(',').concat(contributePath);
					  	localStorage.setItem('authorityMenu',config.encode(newPath.join(',')));
					}

				}
			},
			appendReviewMenu:function(roleLists){
				var tmp1 = roleLists.filter(item=>{
					return item.id == '10'  //引擎奖评委
				})

				var tmp2 = roleLists.filter(item=>{
					return item.id == '9'  //引擎奖管理委员会
				})



				if(tmp1.length>0  || (tmp1.length>0 && tmp2.length>0)){
					this.isReview = true;
					var authorityMenu = localStorage.getItem('authorityMenu');
					if( (authorityMenu !== null)){	

					  	var t = decode(authorityMenu); 
					  	var contributePath = ['/review','/reviewRewards','/reviewList'];
					  	var newPath=t.split(',').concat(contributePath); 
					  	localStorage.setItem('authorityMenu',config.encode(newPath.join(',')));
					}
				}



			}
		},
		created() { 
			
			// this.createCopy(this.$router.options.routes);
			this.$nextTick(() => {
				//$refs绑定元素
				if(!this.scroll){
					this.scroll = new BScroll(this.$refs.wrapper, {
					//开启点击事件 默认为false
					click:true,
					scrollbar: {
					 fade: true,
					 interactive: false // 1.8.0 新增
					},
					mouseWheel: {
					 speed: 20,
					 invert: false,
					 easeTime: 300
					}
				})
				// console.log(this.scroll)
				}else if(!this.$refs.wrapper){
					return
				}
				else{
					this.scroll.refresh()
				}
			  })
			  
			   
		},
		mounted() { 
			
			//获取个人信息
			this.$post('/admin/system/user/userInfo').then(({code,obj}) =>{

				(code == '00') && (()=>{

					localStorage.setItem('user',JSON.stringify(obj));
					this.sysUserName = obj.nickName;

					this.face = (typeof obj.icon !='undefined' && (obj.icon !=''))?obj.icon:this.face;

					if(obj.roleLists.length>0){


						//如果是案例收集员 赋给相应的路由权限
						// this.appendCollectMenu(obj.roleLists);
						if(obj.perm3 == '1'){
							this.isCollect = true;
							var authorityMenu = localStorage.getItem('authorityMenu');
							if( (authorityMenu !== null)){	

							  	var t = decode(authorityMenu); 
							  	var contributePath = ['/collect','/myContribute','/contribute','/viewContribute','/editContribute'];
							  	var newPath=t.split(',').concat(contributePath);
							  	localStorage.setItem('authorityMenu',config.encode(newPath.join(',')));
							}
						}

						//如果是评委 赋给相应的路由权限
						// this.appendReviewMenu(obj.roleLists);
						if(obj.perm2 == '1'){
							this.isReview = true;
							var authorityMenu = localStorage.getItem('authorityMenu');
							if( (authorityMenu !== null)){	

							  	var t = decode(authorityMenu); 
							  	var contributePath = ['/review','/reviewRewards','/reviewList'];
							  	var newPath=t.split(',').concat(contributePath); 
							  	localStorage.setItem('authorityMenu',config.encode(newPath.join(',')));
							}
						}

						
					}

				})()
			});
			
			

			this.getMenu()
			

		},
		watch:{
			selectRoleId:function(n,o){
				
			},
			$route(to,from){
				 
				this.createLocation();
			}

		}
	}

</script>


<style scoped lang="scss">
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
.userinfo a{
	color:#409EFF;
	margin-right:20px;
}
	@import '~scss_vars';
	.el-scrollbar__wrap {
		  overflow-x: hidden; 
		}
	.el-menu-vertical-demo{
		background: transparent;
	}	 
	.userinfo{ 
		.item {
			line-height: 22px;
		}
	}
	.userinfo i{
		font-size: 20px;
		.item {
			line-height: 22px;
		}
	}
.wrapper{
  width: 100%;
  position:absolute; 
  height: 100%;
} 

.overHide{
	overflow: hidden;
}
.line{
	display:inline-block;
	height:1px;
	background:#ccc;
	width:85%;
	vertical-align: 3px;
}
// .el-submenu:nth-last-child(1) .submenu,
// .el-submenu:nth-last-child(2) .submenu,
// .el-submenu:nth-last-child(3) .submenu{
// 	bottom:0;
// 	top: auto !important;
// }
.home {
	font-style: normal;
	margin-left:50px;
}
.home a{
	color: #FC9153;
}
.el-menu{
	border-right:none;
}
.el-submenu{
}
 
 

	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		background: #f3f5f7;
		.header {
			height: 60px;
			line-height: 60px;
			background: $color-primary;
			border-bottom: solid #eee 1px;
			display: flex;
			position: relative;
			z-index: 4;
			// color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					// color:#fff;
					//img {
					//	width: 40px;
					//	height: 40px;
					//	border-radius: 20px;
					//	margin: 10px 0px 10px 10px;
					//	float: right;
					//}
				}
			}
			.header_c{
				flex: 1;
			}
			.logo {
				//width:230px;
				height:60px;
				font-size: 14px;
				padding-left:10px;
				padding-right:20px; 
				border-right:solid #eee 1px;
				color:#444;
				img {
					// width: 40px;
					width: 175px;
				    float: left;
				    margin-top: 10px;
				    margin-left: 20px;
					// margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:200px;
				/*background: #1b1e2a;*/
			}
			.logo-collapse-width{
				width:40px;
				padding-left:0;
				padding-right:20px; 
				img {
					margin: 5px;
				}

			}
			.tools{
				padding: 0px 23px;
				width:100px;
				height: 60px;
				line-height: 60px; 
				i{
					cursor: pointer;
				}
			}
		}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 230px;
				width: 230px;
				// position: absolute;
				// top: 0px;
				// bottom: 0px;
				.el-menu{
					height: 100%;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
						border: solid #eee 1px;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
				border-right: solid 1px #e6e6e6;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
				border-right: solid 1px #e6e6e6;
				/*background: #1b1e2a;*/

			}
			.content-container {
				// background: #f1f2f7;
				flex:1;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					//margin-bottom: 15px;
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					// background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
	}

</style>