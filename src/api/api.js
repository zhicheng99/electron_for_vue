import axios from 'axios';
import Qs from 'qs'
let base = '';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };



export const getParkRecordPage = params => { return axios.get(`${base}/user/parkRecordlistpage`, { params: params }); };

class Api{
	constructor() {
	    this.base = '/didipark/api';
	}
	
	post(url,data){
		
		// return axios.post(this.base+url,params);
		
		return axios({
			method:'post',
			url:url,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			},
			data:data,
			transformRequest: [function (data) {
                  // Do whatever you want to transform the data
				  console.log(data);
                  let ret = ''
                  for (let it in data) {
					  console.log('ddd');
                    // 如果要发送中文 编码 
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                  }
                  return ret.slice(0,ret.length-1);
                }],
			
		})
		
	}
	
	get(url,params){
		// return axios.get(this.base+url,params);
		return axios({
			method:'get',
			url:this.base+url,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			},
			
			params:Qs.stringify(params),
		})
	}
	
}

export const api = new Api();