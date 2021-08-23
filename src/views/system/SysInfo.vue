<template>
	<section class="m-t-20 padding-20" style="background: #fff">
		<el-row>
			<el-form ref="form" :model="form" label-width="80px">
			  <el-form-item label="网站名称:" :label-width="formLabelWidth">
				<el-input v-model="site.name">
					<template slot="append">name</template>
				</el-input>
			  </el-form-item>
			  <el-form-item label="网站地址:" :label-width="formLabelWidth">
				<el-input v-model="site.url">
					<template slot="append">url</template>
				</el-input>
			  </el-form-item>
			  <el-form-item label="是否开放留言:" :label-width="formLabelWidth">
				<el-input v-model="site.openMessage">
					<template slot="append">openMessage</template>
				</el-input>
			  </el-form-item>
			  <el-form-item label="是否可以匿名留言:" :label-width="formLabelWidth">
				<el-input v-model="site.noName">
					<template slot="append">noName</template>
				</el-input>
			  </el-form-item>
			  <el-form-item label="当前版本:" :label-width="formLabelWidth">
				<el-input v-model="site.version">
					<template slot="append">version</template>
				</el-input>
			  </el-form-item>
			  <el-form-item label="开发作者:" :label-width="formLabelWidth">
				<el-input v-model="site.author">
					<template slot="append">author</template>
				</el-input>
			  </el-form-item>
			  
			  <el-form-item label="作者头像:" :label-width="formLabelWidth">
				<el-input v-model="site.authorIcon">
					<template slot="append">authorIcon</template>
				</el-input>
			  </el-form-item>
			  <el-form-item label="微博:" :label-width="formLabelWidth">
				<el-input v-model="site.weibo">
					<template slot="append">weibo</template>
				</el-input>
			  </el-form-item>
			  <el-form-item label="QQ:" :label-width="formLabelWidth">
				<el-input v-model="site.qq">
					<template slot="append">qq</template>
				</el-input>
			  </el-form-item>
			  <el-form-item label="git:" :label-width="formLabelWidth">
				<el-input v-model="site.git">
					<template slot="append">git</template>
				</el-input>
			  </el-form-item>
			  <el-form-item label="github:" :label-width="formLabelWidth">
				<el-input v-model="site.github">
					<template slot="append">github</template>
				</el-input>
			  </el-form-item>
			  <el-form-item label="手机:" :label-width="formLabelWidth">
				<el-input v-model="site.phone">
					<template slot="append">phone</template>
				</el-input>
			  </el-form-item>
			  <el-form-item label="邮箱:" :label-width="formLabelWidth">
				<el-input v-model="site.email">
					<template slot="append">email</template>
				</el-input>
			  </el-form-item>
			  <el-form-item label="地址:" :label-width="formLabelWidth">
				<el-input v-model="site.address">
					<template slot="append">address</template>
				</el-input>
			  </el-form-item>
			  <el-form-item label="网站LOGO:" :label-width="formLabelWidth">
				<el-input v-model="site.logo">
					<template slot="append">logo</template>
				</el-input>
			  </el-form-item>
			  <el-form-item label="服务器环境:" :label-width="formLabelWidth">
				<el-input v-model="site.serversname">
					<template slot="append">serversname</template>
				</el-input>
			  </el-form-item>
			  <el-form-item label="数据库版本:" :label-width="formLabelWidth">
				<el-input v-model="site.databasename">
					<template slot="append">databasename</template>
				</el-input>
			  </el-form-item>
			  <el-form-item label="最大上传限制:" :label-width="formLabelWidth">
				<el-input v-model="site.maxUpload">
					<template slot="append">maxUpload</template>
				</el-input>
			  </el-form-item>
			  <el-form-item label="默认关键字:" :label-width="formLabelWidth">
				<el-input v-model="site.keywords">
					<template slot="append">keywords</template>
				</el-input>
			  </el-form-item>
			  <el-form-item label="网站描述:" :label-width="formLabelWidth">
				<el-input v-model="site.description">
					<template slot="append">description</template>
				</el-input>
			  </el-form-item>
			  <el-form-item label="版权信息:" :label-width="formLabelWidth">
			  				<el-input v-model="site.powerby">
			  					<template slot="append">powerby</template>
			  				</el-input>
			  </el-form-item>
			  <el-form-item label="网站备案号:" :label-width="formLabelWidth">
			  				<el-input v-model="site.record">
			  					<template slot="append">record</template>
			  				</el-input>
			  </el-form-item>
			  <el-form-item label="个人简介:" :label-width="formLabelWidth">
			  				<el-input v-model="site.remarks">
			  					<template slot="append">remarks</template>
			  				</el-input>
			  </el-form-item>
			  
			  <el-form-item :label-width="formLabelWidth">
				<el-button type="primary" size="small" @click="onSubmit">立即提交</el-button>
				
			  </el-form-item>
			</el-form>
		</el-row>
		
	</section>
	
</template>
<script>
	
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
	import config from '../../common/js/config.js'
	import dic from '../../common/js/dic.js'
	
export default {
    data() {
      return {
		formLabelWidth:'130px',
		site:{},
		addLoading: false,
        
      }
    },
    methods: {
      onSubmit() {
		this.addLoading = true;
        // 提交
        this.$post('/admin/system/site/edit',this.site).then(({code,obj})=>{
        		 this.addLoading = false;
        	(code == '00') && 
        	this.$message({
        		message: '操作成功',
        		type: 'success'
        	})
        })
      }
    },
	mounted(){
		// 获取详情
		this.$post('/admin/system/site/info',{}).then(({code,obj})=>{
				 
			this.site = obj;
		})
	}
  }
</script>