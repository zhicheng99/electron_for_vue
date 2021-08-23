import {post} from './../../api/http.js'


let useCache = false;  //是否开启缓存
let cacheDic = {};    

let unitFun = function(key,apiUrl,param,fresh){
	
	if(fresh){ //强制请求接口
		if(useCache){
			cacheDic[key] = post(apiUrl,param);
			return cacheDic[key];
		}else{
			return post(apiUrl,param);
		}
	}else{
		
		if(useCache){
			
			if(cacheDic[key]){
				return cacheDic[key];
			}else{
				cacheDic[key] = post(apiUrl,param);
				return cacheDic[key];
			}
			
		}else{
			return post(apiUrl,param);
		}
		
	}
}

export default{
	
	 
	/**
	 * 1.村落视频标签 
	 */
	VideoLabel:function(fresh = false){
		return unitFun('VideoLabel','/admin/system/dictList',{type:'video_label'},fresh);

	} 
	

}