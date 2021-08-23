<<template>
	<div>
		<el-dialog :title="parentId=='0'?'添加一级区域':'添加子区域'" :visible.sync="show" @close="close">
		 	<el-form :model="addForm" :rules="addFormRules" ref="addForm">
		 		<el-form-item label="区域名称:" :label-width="formLabelWidth" prop="title">
		 			<el-input v-model="addForm.title" size="small"></el-input>
		 		</el-form-item>  
		 		<!-- <el-form-item label="编号:" :label-width="formLabelWidth"  prop="code">
		 			<el-input v-model="addForm.code" size="small"></el-input>
		 		</el-form-item>  -->
		 		 <el-form-item label="排序:" :label-width="formLabelWidth"  prop="sort">
		 			<el-input-number size="small" v-model="addForm.sort" controls-position="right" :min="0"></el-input-number>

		 		</el-form-item>  
		 		<el-form-item  :label-width="formLabelWidth">
		 			<el-button @click="close" size="small">取消</el-button>
		 			<el-button type="primary" @click="addSubmit" size="small" :loading="doing">保存</el-button>
		 		</el-form-item>
		 	</el-form>
		 </el-dialog>
	</div>
</template>
<script>
	import config from '../../../../common/js/config.js';

	export default{
		components:{},
		props:['isShow','parentId','callBack'],
		data(){
			return {
				formLabelWidth:config.dialogLabelWidth,

				show:false,
				doing:false,
				addForm:{
					parentId:'0',//	否	string	上级区域编号
					code:'',//	是	string	编号
					title:'',//	是	string	区域名
					sort:0
					// id:'',//
				},
				addFormRules:{
					title:[
						{ required: true, message: '请输入区域名称', trigger: 'blur' }
					],
					// code:[
					// 	{ required: true, message: '请输入区域编号', trigger: 'blur' }
					// ]
				}
			}
		},
		methods:{
			close:function(){
				this.$emit('update:isShow',false)
			},
			addSubmit:function(){

				this.$refs.addForm.validate(valid=>{

					if(valid){

						this.doing = true;

						this.addForm = {
							...this.addForm,
							...{
								code:new Date().getTime()
							}
						}

						this.$post('/admin/area/save',this.addForm).then(({code})=>{

							code == '00' && (()=>{

								this.$message({
									message:'添加成功！',
									type:'success'
								})

								this.$refs.addForm.resetFields()
								this.close();
								this.callBack && this.callBack();
								this.doing = false;


							})()
						}).catch(()=>{
							this.doing = false;

						})

					}

				})

			}

		},
		mounted(){



		},
		created(){
			
		},
		computed:{

		},
		watch:{
			'isShow':function(v){
				this.show = v;
			},
			'parentId':function(v){
				this.addForm.parentId = v;
			}
		}
	}

</script>
<style scoped>

</style>