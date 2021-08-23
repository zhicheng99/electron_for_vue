import axios from 'axios';
class Api{
	constructor() {
	    this.base = '/tiktok/api';
	}
	
	post(url,params){
		
		return axios.post(this.base+url,params);
		
	}
	
	get(url,params){
		return axios.get(this.base+url,params);
	}
	
}

export const api = new Api();
