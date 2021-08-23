/**
* js使用canvas将文字转换成图像数据base64
* @param {string}    text              文字内容  "abc"
* @param {string}    fontsize          文字大小  20
* @param {function}  fontcolor         文字颜色  "#000"
* @param {boolean}   imgBase64Data     图像数据
*/
export default{
	textToImg:function(text,fontsize,fontcolor){
	    // var canvas = document.createElement('canvas');
	   var c=document.createElement("canvas");
	c.height = text.split('').length*fontsize* 1.2;
	c.width = text.split('').length*fontsize*0.707+40;
var ctx=c.getContext("2d");
	
ctx.translate(c.width*0.5,c.height*0.5);
ctx.rotate(-45*Math.PI/180);

ctx.font=fontsize +"px Microsoft YaHei";
ctx.textBaseline = "middle";
ctx.textAlign = "center";
ctx.fillStyle = fontcolor;
ctx.fillText(text,0,0);
	
  
	 
	    var dataUrl = c.toDataURL('image/png');//注意这里背景透明的话，需要使用png
	    return dataUrl;
	}
	
} 