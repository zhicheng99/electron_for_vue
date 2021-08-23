<template>
	<div class="player" id="player">
	 
		 
		
		<video-player  class="video-player vjs-custom-skin"
			 ref="videoPlayer"
			 :playsinline="true"
			 :options="playerOptions"
			 @playing="onPlayerPlaying($event)"
			@canplay="onPlayerCanplay($event)"
			@timeupdate="onPlayerTimeupdate($event)"
			 @pause="onPlayerPause($event)"
		></video-player> 

		<!-- <span v-show="(videoTip!='') && !playing">{{videoTip}}</span> -->
	</div>
	
</template>

<script>
	import VideoPlayer from 'vue-video-player';
	require('video.js/dist/video-js.css')
    require('vue-video-player/src/custom-theme.css')
	
	Vue.use(VideoPlayer)
	
	export default{
		components:{
			// VideoPlayer
		},
		props:['videoUrl','videoId','videoCover','aspectRatio','videoTip'],
		data(){
			return {
				url:'',
				cover:'',
				
				playerOptions : {
					playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
					autoplay: false, //如果true,浏览器准备好时开始回放。
					muted: false, // 默认情况下将会消除任何音频。
					loop: false, // 导致视频一结束就重新开始。
					preload: 'none', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
					language: 'zh-CN',
					aspectRatio: '4:3', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
					fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
					sources: [{
					  type: "",
					  src: "" //url地
					  // src:"https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0300f210000bhv389s74cld7hfagbfg&line=0"

					}],
					poster: "../../static/images/test.jpg", //你的封面地址
					// width: document.documentElement.clientWidth,
					notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
					controlBar: {
					  timeDivider: true,
					  durationDisplay: true,
					  remainingTimeDisplay: false,
					  fullscreenToggle: true  //全屏按钮
					}
				},
				playing:false,

				currDurations:0,
				duration:0,
			}
		},
		methods:{
			onPlayerTimeupdate:function(player){
				this.currDurations = player.cache_.currentTime;
			},
			onPlayerCanplay(player) { 
				this.duration = player.duration();
			 },
			onPlayerPause:function(player){

				this.playing = false;

				this.$nextTick(()=>{
 					
 					//如果播放完了  重置
 					if(this.currDurations == this.duration){  

						this.$refs.videoPlayer.player.src(this.videoUrl);
 					}

				})

			},
			onPlayerPlaying:function(e){
				this.playing = true;
			},
			pause:function(){

				this.playing && 
				this.$refs.videoPlayer.player && this.$refs.videoPlayer.player.pause();

			},
			test:function(ev){
				
				// var _iframe1=_body.document.getElementById('rightMain');
            // document.getElementById('frame').contentWindow.location.reload(true);
				
// 				setTimeout(()=>{
// 				// console.log(document.getElementById('frame').contentWindow.document.getElementsByClassName("tt-video-box"));
// 					
// 					
// 					console.log(document.getElementById('frame').contentWindow.document);
// 
// 				},2000);
				
				//alert(navigator.userAgent);
			},
			change:function(ev){
				console.log(ev);
			},
			dd:function(){
				alert('加载失败')
			},
			getStreamUrl:function(id){  //视频流地址
				this.$post('/business/getVideoPlayUrl',{id:id}).then(({code,obj})=>{
					(code == '00') && (obj !==null) && 
					(this.url = obj);
				})
			},
			createPlayer:function(){
				
				
				let inner = ()=>{
					if( (this.url!='') && (this.cover!='')){
							
							var div = document.createElement('div');
							div.id = 'mediaplayer';
							document.getElementById('player').innerHTML='';
							document.getElementById('player').appendChild(div);
							
							setTimeout(()=>{
								jwplayer("mediaplayer").setup({
									flashplayer: "static/player/player.swf",
									file: this.url,
									image: this.cover,
									width: "236px",
									height: "415px"
								});
							},1000);
							
								 
					}else{
						
						setTimeout(()=>{
							inner();
						},200)
						
					}
				}
				
				inner();
				
			}
			
		},
		created() {
			// var __originalNavigator = navigator;
			// navigator = new Object();
			// navigator.__defineGetter__('userAgent', function () { 
			// 	return 'CPU iPhone OS'; 
			// });
			// 
			// var iframe='<iframe id="frame" name="widget" src ="http://www.baidu.com" width="100%" height="400" marginheight="0" marginwidth="0" frameborder="no" scrolling="no"></iframe>';        
   //      
   //  document.write("User-agent header sent: " + navigator.userAgent + iframe);
			
		},
		watch:{

			videoUrl:{
				handler:function(v){ 
					if(v!=''){
						this.url = v;
						this.playerOptions.sources[0].src = v;
						
						// this.createPlayer();
					}
				},
				immediate:true
			},
			videoId:function(v){
			 
			},
			videoCover:{
				handler:function(v){
					this.cover = v; 
					this.playerOptions.poster = v;
				},
				immediate:true
			},
			aspectRatio:{
				handler:function(v){   
					if(typeof v!= 'undefined' && v!=''){
						this.playerOptions.aspectRatio = v;
					}
				},
				immediate:true
			},
		},
		mounted() {
			// jwplayer("mediaplayer").setup({
			// 	flashplayer: "static/player/player.swf",
			// 	file: "static/player/v.mp4",
			// 	image: "preview.jpg",
			// 	width: "236px",
			// 	height: "415px"
			// });
		}
	}
</script>

<style scoped>
	/*.player{
	    position: absolute;
   width: 300px;
	height: 534px;
    background: #eee; 
	}
	
	.video-player {
		 height: 100%;
		width: 100%;
		background-color: #000;
	}*/
	 
	.player_lay span{
	position: absolute;
	left:20px;
	bottom:20px;
	font-size: 48px;
	line-height: 48px;
	font-weight: bold;
	color: #fff;
	pointer-events: none;
}
</style>
<style>
	/* 播放器按钮样式覆盖 */
.vjs-custom-skin > .video-js .vjs-big-play-button{
	width: 50px;
	height: 50px !important;
	background: url(../../../static/img/next/play_ico.png) center center no-repeat;
	background-color:rgba(0,0,0,0) !important;
	border:none;
	
    background-size: 50px 50px;
	margin-left:-25px !important;
	outline:none !important
}
.video-js .vjs-tech{
	outline:none !important

}
.vjs-custom-skin > .video-js .vjs-big-play-button:hover{
	background-color:rgba(0,0,0,0) !important;



}
</style>