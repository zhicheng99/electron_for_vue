<template>
	<div class="header_lay">
		<div class="header">
			<img src="../../../static/img/next/logo.png" class="logo" height="36" alt="">
			<UserInfo></UserInfo>
			<Menu v-bind:curr-index="currIndex"></Menu>
		</div>
	</div>
</template>
<script>
	import UserInfo from './UserInfo.vue'
	import Menu from './Menu.vue'

	export default{
		components:{Menu,UserInfo},
		props:['currIndex'],
		data(){
			return {

			}
		},
		methods:{

		},
		mounted(){

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
.header_lay{
	height: 50px;
	background: #000;
}
.header{
	width: 1200px;
	height: 50px;
	margin:0 auto;
}
.logo{
	margin-top:7px;
}
</style>