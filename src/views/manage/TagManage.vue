<template>
	<div class="p-t-10">
		<el-tabs v-model="activeName" @tab-click="handleClick">
		    <el-tab-pane label="合作行业" name="first"></el-tab-pane>
		    <el-tab-pane label="营销目的" name="second"></el-tab-pane>
		    <el-tab-pane label="合作资源" name="third"></el-tab-pane>
		    <el-tab-pane label="合作平台" name="fourth"></el-tab-pane>
		  </el-tabs>

		  <components :is="activeName"></components>
	</div>
</template>
<script>
	export default{
		components:{
			 first:() => import(`./Tag1.vue`),
			 second:() => import(`./Tag2.vue`),
			 third:() => import(`./Tag3.vue`),
			 fourth:() => import(`./Tag4.vue`),

		},
		props:[],
		data(){
			return {
				activeName:'first'


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

</style>