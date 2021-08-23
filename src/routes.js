
import { Message,MessageBox } from 'element-ui';
import {encode,decode,safeEncode} from './common/js/base64.js';

let isLogined = function(){
	var obj = localStorage.getItem('user');

	if(obj === null){
		return false
	}else{
		return true;
	}
}

let beforeEnter = (to,from,next)=>{
 		let goBack = ()=>{
 			setTimeout(()=>{

	 			history.back(-1);
 			},3000)
 		}
		var authorityMenu = localStorage.getItem('authorityMenu');
		if( (authorityMenu !== null)){	

		  	var t = decode(authorityMenu); 
		  	


		    var arr = t.split(',');   
		    var tmp = false;


		    for (var i = 0; i < arr.length; i++) { 
		    	var a = arr[i].split('').filter(item=>{
		    		return item !='';
		    	})


		    	if(arr[i] === to.path){
		    		tmp = true;
		    		break;
		    	}
		    }


		    if(tmp){
				next();

		    }else{

		    	if(!isLogined()){
					location.href="/login"

		    	}else{

		    		Message({
						message:'您没有访问该页面的权限,页面即将自动返回',
						duration:3000,
						type:'warning'
					});
					goBack()
		    	}


		    	

		    }
			

		}else{

			if(!isLogined()){
				location.href="/login"
	    	}else{

	    		Message({
					message:'您没有访问该页面的权限,页面即将自动返回',
					duration:3000,
					type:'warning'
				});
				goBack()
	    	}

		}
		
		// next();

}

let routes = [
    {
        path: '/login',
        component: (resolve) => require(['./views/JudgeLogin.vue'],resolve),
        name: 'login',
        hidden: true,
		sortVal:0,
    },  
	{
	    path: '/', 
	    hidden: true,
		sortVal:0,
		redirect: { path: '/login' }

	},
	{
	    path: '/',
	    component: (resolve) => require(['./views/Home.vue'],resolve),
	    hidden: true,
		sortVal:0,
		children: [
			{ path: '/404', component: (resolve) => require(['./views/404.vue'],resolve), name: '404',sortVal:0,iconCls: 'fa fa-address-card',hidden:true},

		]
	}, 
	
	//---------管理员 需要后台配置生成 用户登录后直接注入到路由里--------
	{
	    path: '/',
	    component: (resolve) => require(['./views/Home.vue'],resolve),
	    name: '',
	    iconCls: 'fa fa-address-card', 
		hidden: true,
	    children: [
	        { path: '/manage', component: (resolve) => require(['./views/manage/User.vue'],resolve), name: '首页',iconCls: 'fa fa-address-card',hidden:true,beforeEnter: beforeEnter,},
		]
	},
	{
	    path: '/',
	    component: (resolve) => require(['./views/Home.vue'],resolve),
	    name: '代码生成器m',
	    iconCls: ' icon-align-justify', 
		hidden: true,
	    children: [
			  { path: '/dataModel', component: (resolve) => require(['./views/code/DataModelDetail.vue'],resolve), name: '数据模型',iconCls: 'fa fa-address-card',hidden:true,beforeEnter: beforeEnter,},
			  
		]
	},
	{
	    path: '/',
	    component: (resolve) => require(['./views/Home.vue'],resolve),
	    name: '定时任务m',
	    iconCls: ' icon-align-justify', 
		hidden: true,
	    children: [
	        { path: '/taskList', component: (resolve) => require(['./views/task/TaskList.vue'],resolve), name: '任务列表',iconCls: 'fa fa-address-card',hidden:true,beforeEnter: beforeEnter,},
			{ path: '/taskLog', component: (resolve) => require(['./views/task/TaskLog.vue'],resolve), name: '任务执行日志',iconCls: 'fa fa-address-card',hidden:true,beforeEnter: beforeEnter,}
		]
	},
	{
	    path: '/',
	    component: (resolve) => require(['./views/Home.vue'],resolve),
	    name: '系统管理m',
	    iconCls: ' icon-align-justify', 
		hidden: true,
	    children: [
	        { path: '/sysDic', component: (resolve) => require(['./views/system/SysDic.vue'],resolve), name: '系统字典管理',iconCls: 'fa fa-address-card',hidden:true,beforeEnter: beforeEnter,},
			{ path: '/sysTable', component: (resolve) => require(['./views/system/SysTable.vue'],resolve), name: '数据库管理',iconCls: 'fa fa-address-card',hidden:true,beforeEnter: beforeEnter,},
			{ path: '/sysInfo', component: (resolve) => require(['./views/system/SysInfo.vue'],resolve), name: '网站基本信息',iconCls: 'fa fa-address-card',hidden:true,beforeEnter: beforeEnter,},
			{ path: '/sysLog', component: (resolve) => require(['./views/system/SysLog.vue'],resolve), name: '系统日志管理',iconCls: 'fa fa-address-card',hidden:true,beforeEnter: beforeEnter,},
			{ path: '/sysRes', component: (resolve) => require(['./views/system/SysRes.vue'],resolve), name: '系统资源管理',iconCls: 'fa fa-address-card',hidden:true,beforeEnter: beforeEnter,},
			{ path: '/sysPer', component: (resolve) => require(['./views/system/SysPer.vue'],resolve), name: '系统权限管理',iconCls: 'fa fa-address-card',hidden:true,beforeEnter: beforeEnter,},
			{ path: '/sysRole', component: (resolve) => require(['./views/system/SysRole.vue'],resolve), name: '系统角色管理',iconCls: 'fa fa-address-card',hidden:true,beforeEnter: beforeEnter,},
			{ path: '/collectBotChat', component: (resolve) => require(['./views/system/BotChatSet.vue'],resolve), name: '客服群配置',iconCls: 'fa fa-address-card',hidden:true,beforeEnter: beforeEnter,},

		
		]
	},
	
	{
	    path: '/',
	    component: (resolve) => require(['./views/Home.vue'],resolve),
	    name: '村落管理',
	    iconCls: ' icon-align-justify', 
		hidden: true,
	    children: [
			{ path: '/manageInfo', component: (resolve) => require(['./views/manage/village/info/List.vue'],resolve), name: '村落列表',iconCls: 'fa fa-address-card',hidden:true,beforeEnter: beforeEnter,},
			{ path: '/hotInfo', component: (resolve) => require(['./views/manage/village/info/HotList.vue'],resolve), name: '热门村落',iconCls: 'fa fa-address-card',hidden:true,beforeEnter: beforeEnter,},

			 
		]
	},
	{
	    path: '/',
	    component: (resolve) => require(['./views/Home.vue'],resolve),
	    name: '区域管理',
	    iconCls: ' icon-align-justify', 
		hidden: true,
	    children: [
			{ path: '/areaList', component: (resolve) => require(['./views/manage/village/area/AreaList.vue'],resolve), name: '村落列表',iconCls: 'fa fa-address-card',hidden:true,beforeEnter: beforeEnter,},
			 
		]
	},
	{
	    path: '/',
	    component: (resolve) => require(['./views/Home.vue'],resolve),
	    name: '活动管理',
	    iconCls: ' icon-align-justify', 
		hidden: true,
	    children: [
			{ path: '/activityList', component: (resolve) => require(['./views/manage/village/activity/ActivityList.vue'],resolve), name: '村落列表',iconCls: 'fa fa-address-card',hidden:true,beforeEnter: beforeEnter,},
			 
		]
	},
	 
	
	//-----------end--------------
	
	//非配置页面的路由
	{
	    path: '/',
	    component: (resolve) => require(['./views/Home.vue'],resolve),
	    name: '',
	    iconCls: ' icon-align-justify', 
		hidden: true,
		sortVal:0,
		lev2: true,
	    children: [
			  
			
			{ path: '/taskLogManage', 
			component: (resolve) => require(['./views/task/TaskLog.vue'],resolve), 
			name: '计划任务日志',
			iconCls: 'fa fa-address-card',
			hidden: true,
			sortVal:0,
			fromListRoute:'/taskList',  //通过列表路由 找到父路由名称
			beforeEnter: beforeEnter,
			},

			{ path: '/pwd', 
			component: (resolve) => require(['./views/Pwd.vue'],resolve), 
			name: '修改密码',
			iconCls: 'fa fa-address-card',
			hidden: true,
			sortVal:0,
			fromListRoute:'/manage',
			beforeEnter: beforeEnter,
			},
			{ path: '/sysRoleUsers', 
			component: (resolve) => require(['./views/system/SysRoleUsers.vue'],resolve), 
			name: '角色用户',
			iconCls: 'fa fa-address-card',
			hidden: true,
			sortVal:0,
			fromListRoute:'/sysRole',
			beforeEnter: beforeEnter,
			},
 
 

			

			

		]
	}, 
	
];

export default routes;