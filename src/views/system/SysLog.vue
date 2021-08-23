<template>
  <section class="m-t-10">
	  <!--工具条-->
	  <el-row>
	  	<el-col :span="24" class="toolbar m-b-10" >
	  		<el-form :inline="true" :model="filters" ref="filters">
	  			<el-form-item label="标题:" :label-width="toolbarLabelWidth" prop="title">
	  				<el-input v-model.trim="filters.title" size="small" placeholder="请输入标题" v-filter-space-char></el-input>
	  			</el-form-item>
	  			<el-form-item label="请求地址:" :label-width="toolbarLabelWidth" prop="name">
	  				<el-input v-model.trim="filters.name" size="small" placeholder="请输入请求地址" v-filter-space-char></el-input>
	  			</el-form-item>
	  			<el-form-item label="请求时间:" :label-width="toolbarLabelWidth" prop="time"> 
					<el-date-picker size="small" 
					  v-model="filters.time"
					  type="daterange"
					  start-placeholder="请求开始时间"
					  end-placeholder="请求结束时间" value-format="yyyy-MM-dd">
					</el-date-picker>	 
	  			</el-form-item>
	  			
	  			<el-form-item>
	  				<el-button  v-on:click="getUsers" size="small" icon="el-icon-search">查询</el-button>
	  			</el-form-item>
	  			<el-form-item>
	  					<el-button size="small" icon="el-icon-refresh" @click="$refs.filters.resetFields()">重置</el-button>
	  			</el-form-item>
	  			<!--
	  			<el-form-item>
	  				<el-button size="small" icon="el-icon-plus" @click.native.prevent="addFormVisible=true" >增加</el-button>
	  			</el-form-item>
	  			-->
	  		</el-form>
	  	</el-col>
	  </el-row>
	  
	  <el-row>
	  		<!--列表-->
	  		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
	  			<el-table-column type="index" width="60" label="序号">
					<template slot-scope="scope"><span>{{scope.$index+(page - 1) * size + 1}} </span></template>
	  			</el-table-column>
	  			<el-table-column prop="title" label="标题" width="120" >
	  			</el-table-column>
	  			<el-table-column prop="type" label="类型" width="120" >
	  			</el-table-column>
	  			<el-table-column prop="remoteAddr" label="IP地址" width="100">
	  			</el-table-column>
	  			<el-table-column prop="httpMethod" label="请求方法" width="100">
	  			</el-table-column>
				<el-table-column prop="classMethod" label="请求类" min-width="200">
				</el-table-column>
	  			<el-table-column prop="requestUri" label="请求地址" min-width="200">
					
	  			</el-table-column>
				<el-table-column prop="useTime" label="响应时间(ms)" width="120">
				</el-table-column>
				<el-table-column prop="updateDate" label="请求时间" width="160">
				</el-table-column>
	  			<el-table-column  label="请求参数" width="100">
					<template slot-scope="scope"> 
						<el-button size="small" @click="showCode(scope.row.params)">查看</el-button>
					</template>

	  			</el-table-column>
				<el-table-column label="请求响应" width="100">
					<template slot-scope="scope"> 
						<el-button size="small" @click="showCode(scope.row.response)">查看</el-button>

					</template>
				</el-table-column>
	  		</el-table>
	  		<!--工具条-->
	  		<el-col :span="24" class="toolbar"  v-if="users.length>0">
	  			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
	  			<el-pagination background layout="total,prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
	  			</el-pagination>
	  		</el-col> 
	  </el-row>
	  
	  
	  <!-- codeShow -->
	  <CodeShow
	  v-bind:is-show="show"
	  v-bind:params-code="paramsCode"
	  v-bind:set-val="setCodeVisible">
	  </CodeShow>
	  
  </section>
</template>
<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage } from '../../api/api';
	import config from '../../common/js/config';
	
	
	import CodeShow from '../../components/CodeShow.vue'


	export default {
		components:{
			CodeShow
		},
	  data() {
	    return {
			formLabelWidth:config.toolbarLabelWidth,
			toolbarLabelWidth:config.toolbarLabelWidth,
			listLoading: false,
			filters:{
					title:'',
					uri:'',
					time:[],
			},
			users:[],
			total: 0,
			page: 1,
			size: 10,
			sels: [],//列表选中列
			
			show:false,
			paramsCode:''
			
	    }
	  },
	  methods: {
		  setCodeVisible:function(){
			  this.show = false;
		  },
		  showCode:function(code){
			  this.paramsCode = code,
			  this.show = true;
		  },
		handleClick(tab, event) {
		    console.log(tab, event);
		},
		handleCurrentChange(val) {
		  	this.page = val;
		  	this.getUsers();
		},
		  //获取用户列表
		  getUsers() {
		  	this.listLoading = true; 
		  	let params = {
		  		page:this.page,
				limit:this.size, 
				s_title:this.filters.title,
				s_uri:this.filters.uri,
				s_startTime:this.filters.time[0]?this.filters.time[0]:'',
				s_endTime:this.filters.time[1]?this.filters.time[1]:''
		  	}
		  	this.$post('/admin/system/log/list',params).then((res)=>{
		  			let { msg, code, data,count } = res;
		  			 
		  				this.listLoading = false;
		  				this.total = count;
		  				// this.page = Math.ceil(count/this.page);
		  				this.users = data;
		  			
		  	}) 
		  },
		  selsChange: function (sels) {
		  	this.sels = sels;
		  }
	  },
		mounted() {
			this.getUsers();
		}
	}

</script>

<style>

</style>
