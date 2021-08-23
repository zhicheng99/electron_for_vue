import { encode, decode, safeEncode } from './base64.js';
export default {
	toolbarLabelWidth:'80px',  //工具栏label文字区宽度 
	dialogLabelWidth:'120px',  //弹出dialog框label文字区宽度
	dialogLabelWidth1:'150px',  //弹出dialog框label文字区宽度
	dialogInnerLabelWidth:'100px',  //弹出dialog框label文字区宽度
	bgNameColor:'#f3f3f3',			//用户名称背景水印颜色
	filterChinese:function(rul,value,callback,tip='编号不能输入汉字'){
		if (value) {
			 if (/[\u4E00-\u9FA5]/g.test(value)) {
			   callback(tip);
			 } else {
			   callback();
			 }
		   }
		   callback();
	},
	licensePlateValidate:function(rul,value,callback,tip='车牌号格式不正确'){
		
		var str = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
		
		if(value){
			if(value.length == 7){
		 
				 // return creg.test(value);
				 
				 if(!str.test(value)){
					 callback(tip);
				 }else{
					 callback();
				 }
				 
			 
			   } else if(value.length == 8){
			 
				 // return xreg.test(value);
				 if(!str.test(value)){
				 	callback(tip);
				 }else{
				 	callback();
				 }
			 
			   }
		}
		callback();
		
	}, 
	// host:'http://'+location.host, 
	host:location.origin,
	jumpByInfo:function(context){
		let judgfinished = ()=>{
			context.$root.eventHub.$emit('judgfinishedEvent',1);
		};
		context.$post('/system/getUserInfo',{}).then(({msg, code, obj})=>{
			
			if((code =='00') && (obj !==null)){
				
				
				// if(obj !== null){
				// 	waterMark({
				// 		systemId: '2426',
				// 		userId: obj.username,
				// 		containerEl: document.querySelector('.main_lay'),
				// 		textStyle: 'rgba(0,0,0,0.03)',
				// 		zIndex: 0,
				// 	});
				// }
	// 
				sessionStorage.setItem('user',JSON.stringify(obj));
				
				if(obj.receiveRoleType){
					//App.vue监听该事件 标识有批量使用权限
					context.$root.eventHub.$emit('batchEvent',1);
				}
				
				//如果是管理员 不判断权限
				if(obj.roleDtoList && obj.roleDtoList !==null && obj.roleDtoList.length >0){
					localStorage.setItem('selectRoleId',obj.roleDtoList[0].authType);

					context.$router.push({ path: '/manage' });
					
					//通知Home页 角色权限判断完成
					setTimeout(()=>{
						let judgfinished = ()=>{
							this.$root.eventHub.$emit('judgfinishedEvent',1);
						};
					},1000)

				}else{
					let sign = this.roleJudg(obj);
					if(sign == '0'){
						//context.$router.push({ path: '/user' });
						
						//是否是管理员
						//if(obj.roleDtoList && obj.roleDtoList !==null && obj.roleDtoList.length >0){		 
							 //管理员
							//context.$router.push({ path: '/manage' });
						
											 
						//}else{
							//普通用户
							localStorage.setItem('selectRoleId','0');
							
							// if(context.$route.path == '/login'){
								context.$router.push({ path: '/user' });
					
							// }
							 //通知Home页 角色权限判断完成
							 setTimeout(()=>{
							 	let judgfinished = ()=>{
							 		this.$root.eventHub.$emit('judgfinishedEvent',1);
							 	};
							 },1000)
											 
						//} 
						
					}else{
						context.$router.push({path: '/noWorkPlace', query: {sign: sign}});
					}
				}

				
				
				
			}
	
	
		})
		
		
	},
	roleJudg:function(info){  // '0':可以进主页，'1'：没有使用权限，'2'：需要强制绑定空间，'3'：需要选择一个职场进入首页
		console.log(info);
		
		let judg = function(){
			//是否有空间信息 (是否有职场)
			if((info.parkCode !='') && (info.parkCode !== null)){
				console.log('有职场');
				return '0';
			}else{
				
				//是否强制绑定空间
				if(info.workplaceFlag=='1'){
					console.log('强制绑定空间');
					return '2';
				}else{
					console.log('手动选一个职场  进入首页');
					return '3';
					
				}
			}
		}
		
		//是否为外包人员
		if(info.empFlag){
			console.log('外包员工');
			
			//是否有使用该系统的权限
			if(info.accredit){
				console.log('外包人员可以使用');
				return judg();
			}else{
				
				return '1';
			}
			
		}else{
			console.log('内部员工');
			return judg();
		}
		
		
	},
	formatDate:function(time) {
                var date = new Date(time);

                function formatDate(date, fmt) {
			    if (/(y+)/.test(fmt)) {
			        fmt = fmt.replace(RegExp.$1, 
			                (date.getFullYear() + '').substr(4 - RegExp.$1.length));
			    }
			    let o = {
			        'M+': date.getMonth() + 1,
			        'd+': date.getDate(),
			        'h+': date.getHours(),
			        'm+': date.getMinutes(),
			        's+': date.getSeconds()
			    };
			    for (let k in o) {
			        if (new RegExp(`(${k})`).test(fmt)) {
			            let str = o[k] + '';
			            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? 
			            str : padLeftZero(str));
			        }
			    }
			    return fmt;
			};
			function padLeftZero(str) {
			    return ('00' + str).substr(str.length);
			};


                return formatDate(date, 'yyyy-MM-dd');
    },
    encode: function (v) {
		return v != '' ? encode(v) : '';
	},
	decode: function (v) {
		return v != '' ? decode(v) : '';
	},
	safeEncode: function (v) {
		return v != '' ? safeEncode(v) : '';
	},
	ssoUrl:'https://open.feishu.cn/open-apis/authen/v1/index?redirect_uri='+encodeURIComponent('http://47.105.36.183:7002/auth')+'&app_id=cli_a0c2fe5f0378500d&state='+Math.random(),
	// ssoUrl:'https://open.feishu.cn/open-apis/authen/v1/index?redirect_uri='+encodeURIComponent('https://99cases.oceanengine.com/auth')+'&app_id=cli_9c6f90e0ad2a9101&state='+Math.random()
	modelMapHeader:{
					'10001':1,
					'10002':2,
					'10003':3,
					'10004':4,
					'10005':5,
					'10006':6,
					'10007':7
				}
	
	
}


