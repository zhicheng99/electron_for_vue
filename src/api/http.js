import axios from 'axios';
import { Message,MessageBox } from 'element-ui';
import config from '../common/js/config.js';
// import router from './../routes'

import FileSaver from 'file-saver';

var md5 = require('md5');

// axios.defaults.timeout = 5000;
axios.defaults.baseURL ='/utopia';


//http request 拦截器
axios.interceptors.request.use(


  config => {
    // const token = getCookie('名称');注意使用的时候需要引入cookie方法，推荐js-cookie
    // config.data = JSON.stringify(config.data);

    let t = (new Date()).getTime()+''+parseInt(Math.random()*100000000);

    config.headers = {
      'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
      'utoken':md5('M4CtBRGNWY6S6c3Q'+t),
      'timeMillis':t
    }
   
	 //调用滴滴退出接口 不需要baseURL定义的前缀
// 	 if(config.url.indexOf('/offices/logout')>-1){
// 	 	config.baseURL = '';
// 	 	config.url.replace('/offices/api/admin','');
// 	 }
	 
		
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);


//http response 拦截器
axios.interceptors.response.use(

  response => {  

  	if(response.data.code == '03'){
		Message({
				message:'登录已过期 正在跳转登录页面...',
				duration:3000
			});
		
		setTimeout(function(){

			sessionStorage.removeItem('user');

			// location.hash="#login";

			history.pushState({},'','/login');

			location.reload();

		},200)

		return false;
	}

	if((typeof response.data.code !='undefined') && 
		(response.data.code != '00') && 
		(response.data.code != '03')){
		
		setTimeout(function(){
			Message({
				message:response.data.msg,
				duration:3000,
				type:'warning'
			});
		},200)

    return Promise.reject(response)
	

	}
	
		return response;
	
  },
  error => { 
		// console.log(error);
		// if(error.response.status == 401){
			
		// 	Message({
		// 		message:'登录已过期 正在跳转登录页面...',
		// 		duration:3000
		// 	});
			
		// 	setTimeout(()=>{
				
		// 		console.log(error);
		// 		console.log(error.response.data);
		// 		location.href=error.response.data;
				
		// 	},200)
		// }
    return Promise.reject(error)
  }
)


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url){
  return new Promise((resolve,reject) => {
//     axios.get(url,{
//       params:params
//     })
//     .then(response => {
//       resolve(response.data);
//     })
//     .catch(err => {
//       reject(err)
//     })


	axios({
		method:'get',
		url: url,  
	}).then(response => {
		resolve(response.data);
	  },err => {
		reject(err)
	  })
	
	
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

 export function post(url,data = {}){
   return new Promise((resolve,reject) => { 
	axios({
		method:'post',
		url: url,
		data:data,
		transformRequest: [function (data) {
	          // Do whatever you want to transform the data
	          let ret = ''
	          for (let it in data) { 
	            // 如果要发送中文 编码 
	            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
	          }
	          return ret.slice(0,ret.length-1);
	        }],
		
	}).then(response => {
		resolve(response.data);
	  },err => {
		reject(err)
	  })
		  
   })
 }

 /**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.patch(url,data)
         .then(response => {
           resolve(response.data);
         },err => {
           reject(err)
         })
  })
}

 /**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.put(url,data)
         .then(response => {
           resolve(response.data);
         },err => {
           reject(err)
         })
  })
}

/**
 * 带二进制文件表单提交
 */
export function postWithFile(url,data={}){
	 let header={
	 	 'Content-Type': 'multipart/form-data'
	 };
	 let fd = new FormData();
	 for(var i in data){
		 fd.append(i, data[i]);

	 }
	 
	 return new Promise((resolve,reject) => {
		 
		  axios.post(url,fd,header).then(response => {
		         resolve(response.data);
		       },err => {
		         reject(err)
		       })
		 
	 })

	
}


function arraybufferError(data){
	let r = new FileReader()
    r.onload = function () {
    	let res = JSON.parse(this.result);
		// resolve({data:JSON.parse(this.result)});

		Message({
			message:res.msg,
			duration:3000,
			type:'warning'
		});

    }
    r.readAsText(new Blob([data],{type:'application/json;charset=UTF-8'})) // FileReader的API
}

/**
 * post下载xls文件
 */
export function downXls(url,data = {},fileName = new Date().getFullYear()+''+(new Date().getMonth()+1)+''+new Date().getDate()+''+parseInt(Math.random()*10000)){
   return new Promise((resolve,reject) => { 
	axios({
		method:'post',
		url: url,
		data:data,
		transformRequest: [function (data) {
	          // Do whatever you want to transform the data
	          let ret = ''
	          for (let it in data) { 
	            // 如果要发送中文 编码 
	            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
	          }
			  
	          return ret.slice(0,ret.length-1);
	        }],
		responseType: 'arraybuffer', // 表明返回服务器返回的数据类型
	}).then(response => { 
		
		 

		// if(response.headers['content-type'] == 'application/octet-stream;charset=utf-8'){
			FileSaver.saveAs(new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'}), decodeURI(fileName)+'.xlsx');
		
			resolve({code:'00'});
		// }else{

		// 	arraybufferError(response.data);
			
		// 	resolve({code:-1});
		// }
			 
		
	  },err => {
		reject(err)
	  })
		  
   })
 }



export function downZip(url,data = {},fileName = new Date().getFullYear()+''+(new Date().getMonth()+1)+''+new Date().getDate()+''+parseInt(Math.random()*10000)){
   return new Promise((resolve,reject) => { 
	axios({
		method:'post',
		url: url,
		data:data,
		transformRequest: [function (data) {
	          // Do whatever you want to transform the data
	          let ret = ''
	          for (let it in data) { 
	            // 如果要发送中文 编码 
	            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
	          }
	          return ret.slice(0,ret.length-1);
	        }],
		responseType: 'arraybuffer', // 表明返回服务器返回的数据类型
	}).then(response => { 


		// if(response.headers['content-type'] == 'multipart/form-data;charset=utf-8'){
		if(response.headers['content-type'] == 'application/zip;charset=UTF-8'){
			
			FileSaver.saveAs(new Blob([response.data], {type: 'application/zip;charset=UTF-8'}), decodeURI(fileName)+'.zip');
		
			resolve({retCode:0});
		}else{

			arraybufferError(response.data);

			resolve({retCode:-1});
		}
		
		
			 
		
	  },err => {
		reject(err)
	  })
		  
   })
 }
 
 export function downCSV(url,data = {},fileName = new Date().getFullYear()+''+(new Date().getMonth()+1)+''+new Date().getDate()+''+parseInt(Math.random()*10000)){
    return new Promise((resolve,reject) => { 
 	axios({
 		method:'post',
 		url: url,
 		data:data,
 		transformRequest: [function (data) {
 	          // Do whatever you want to transform the data
 	          let ret = ''
 	          for (let it in data) { 
 	            // 如果要发送中文 编码 
 	            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
 	          }
 	          return ret.slice(0,ret.length-1);
 	        }],
 		responseType: 'arraybuffer', // 表明返回服务器返回的数据类型
 	}).then(response => { 
 		
 		if(response.headers['content-type'] == 'multipart/form-data;charset=utf-8'){
	 		FileSaver.saveAs(new Blob([response.data], {type: 'text/csv;charset=UTF-8'}), decodeURI(fileName)+'.csv');
		
			resolve({retCode:0});
		}else{

			arraybufferError(response.data);
			
		}
 			 
 		
 	  },err => {
 		reject(err)
 	  })
 		  
    })
  }
export function downFile(url,data = {},fileName = new Date().getFullYear()+''+(new Date().getMonth()+1)+''+new Date().getDate()+''+parseInt(Math.random()*10000)){
    return new Promise((resolve,reject) => { 
 	axios({
 		method:'post',
 		url: url,
 		data:data,
 		transformRequest: [function (data) {
 	          // Do whatever you want to transform the data
 	          let ret = ''
 	          for (let it in data) { 
 	            // 如果要发送中文 编码 
 	            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
 	          }
 	          return ret.slice(0,ret.length-1);
 	        }],
 		responseType: 'arraybuffer', // 表明返回服务器返回的数据类型
 	}).then(response => { 
 		console.log(response);
 		
 		if(response.status == 200){
 			let tmp = data.fileUrl.split('.');
 			let ext = tmp[tmp.length-1].toLowerCase();



 			let extMap = { 
		        "doc":"application/msword;charset=utf-8",
		        "docx":"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		        "xls":'application/vnd.ms-excel',
		        "xlsx":'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		        "ppt":'application/vnd.ms-powerpoint',
		        "pptx":'application/vnd.openxmlformats-officedocument.presentationml.presentation',
		        "txt":'text/plain',
		        "mp4":"video/mp4",
		        "png":"image/png",
		        "jpg":"image/jpeg",
		        "gif":"image/gif",
		        "pdf":"application/pdf",
		        "zip":"application/x-zip-compressed",
 			}
 			

	 		FileSaver.saveAs(new Blob([response.data], {type: extMap[ext]}), decodeURI(fileName)+'.'+ext);
		
			resolve({code:'00'});
		}else{

			arraybufferError(response.data);
			
		}
 			 
 		
 	  },err => {
 		reject(err)
 	  })
 		  
    })
  }

