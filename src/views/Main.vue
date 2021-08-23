<template>
	<div>
		<components :is="platform"></components>
	</div>
</template>
<script>
	export default{
		components:{
			'pc':() => import(`./Pc.vue`),
			'mobile':() => import(`./Mobile.vue`),

		},
		props:[],
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
			platform:function(){
				return this.$store.state.platform;
			}
		},
		watch:{

		}
	}

</script>
<style scoped>

</style>