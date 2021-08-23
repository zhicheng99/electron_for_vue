<template> 
		<div class="loading text-center">
			<div class="loading_c">
				
				<!-- <i class="icon-spinner icon-spin m-r-10"></i>授权成功！正在跳转...  -->
				<img src="../../static/img/loading.gif" width="180" alt="">
			</div>
		</div> 
</template>
<script>
  import  config  from '../common/js/config.js';

import VConsole from 'vconsole';
	export default{
		components:{},
		props:[],
		data(){
			return {
				ssoUrl:config.ssoUrl
			}
		},
		methods:{

			getMenu:function(data){
				this.$fetch('/admin/system/user/getUserMenu',{}).then(({code,obj})=>{

					if(code != '00'){
						return false;
					}
				 	
				 	if(data.identity == '1'){  //管理员
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



						this.$router.push({ path: '/index' });
				 	}else{ 
				 		//普通用户
				 		
						//普通用户
			 		let authorityMenu = ['/index','/info','/trend','/market','/idea','/case','/customer','/data','/help','/listMore','/detail']; //需要把二级菜单记录到本地  路由守卫据此进行判断是否有权限进入相应页面
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
					this.$router.push({ path: '/index' });


				 	}
				 	// if(data.identity == '2'){
				 	// 	let authorityMenu = ['/review','/reviewRewards','/reviewList'];

				 	// 	if(data.perm3 == '1'){  //有收集权限
				 	// 		authorityMenu = authorityMenu.concat(['/collect','/myContribute','/contribute','/viewContribute']);
				 	// 	}


						// localStorage.setItem('authorityMenu',config.encode(authorityMenu.join(',')));
						// this.$router.push({ path: '/review' });
				 	// }
				 	// if(data.identity == '3'){
				 	// 	let authorityMenu = ['/collect','/myContribute','/contribute','/viewContribute'];

				 	// 	if(data.perm2 == '1'){  //有评审权限
				 	// 		authorityMenu = authorityMenu.concat(['/review','/reviewRewards','/reviewList']);
				 	// 	}

						// localStorage.setItem('authorityMenu',config.encode(authorityMenu.join(',')));
						// this.$router.push({ path: '/collect' });
				 	// }
				 
				})
			},

		},
		mounted(){

			//在飞书内部打开调试工具
			if(typeof window.h5sdk !== 'undefined'){

				var vConsole = new VConsole();
			}


			var code = this.$route.query.code;
			var state = this.$route.query.state;

			if((typeof code != 'undefined') && (typeof state !='undefined')){

				this.$post('/admin/ssoLogin',{code:code,state:state}).then(({code,data})=>{

					if(code == '00'){
						// _czc.push(["_trackEvent", "[案例中心][SSO登录]", "登录", "sso"]);
						console.log('/admin/ssoLogin接口数据：');
						console.log(data);
						this.getMenu(data);
					}


				}).catch(()=>{


					setTimeout(()=>{

						history.back(-1);

					},2000)

				})

			}else{


				if(typeof window.h5sdk == 'undefined'){

					this.$router.push({ path: '/judgeLogin' });

				}else{ //飞书内部打开 
					location.href = this.ssoUrl;
					

					// setTimeout(()=>{

					//     console.log(window.h5sdk.biz.util.openLink);
					//     window.h5sdk.biz.util.openLink({
					// 	    url: this.ssoUrl,
					// 	    // url: 'http://www.baidu.com',

					// 	    title: "SSO登录",
					// 	    newTab: false
					// 	});

					// },200)
 
					

				}


			}


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

.loading{
	height:100%;
	font-size: 16px;
	/*background: #3370FF;*/
	color: #fff;
	text-align: center;
}
.loading_c{
	top:35%;
	position: relative;
}
.text-center{
	text-align: center;
} 

</style>