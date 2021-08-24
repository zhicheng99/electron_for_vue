import babelpolyfill from 'babel-polyfill'
// import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// import './assets/theme/theme-wic/index.css'
import './assets/theme/theme-next/index.css'


import VueRouter from 'vue-router'
// import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
// import Mock from './mock'
// Mock.bootstrap();
import './styles/font-awesome.min.css'
import '../static/fonts/iconfont.css'
import './styles/public.css'


import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// NProgress.configure({ showSpinner: false })
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

// 
import {post,fetch,patch,put,downXls,postWithFile,downZip,downFile} from './api/http.js'
//定义全局变量
Vue.prototype.$post=post;
Vue.prototype.$fetch=fetch;
Vue.prototype.$patch=patch;
Vue.prototype.$put=put;
Vue.prototype.$downXls=downXls;
Vue.prototype.$downZip=downZip;
Vue.prototype.$postWithFile=postWithFile;
Vue.prototype.$downFile=downFile;







Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
	// mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  //NProgress.start();
//   if (to.path == '/login') {
//     sessionStorage.removeItem('user');
//   }
  // let user = JSON.parse(sessionStorage.getItem('user'));
	
// 	var user = {
// 	  id: 1,
// 	  username: 'tiktok',
// 	  password: '123456',
// 	  avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
// 	  name: '张某某'
// 	}
// 	sessionStorage.setItem('user',JSON.stringify(user));
	
  // if (!user && to.path != '/login') {
  //   next({ path: '/login' })
  // } else {
    NProgress.start();
    next()
  // }

	// next()
})

router.afterEach(transition => {
NProgress.done();
});
 

const store = new Vuex.Store({
  state: {
    userInfo: {},
    platform:'',
    scrollTop:0,
    votedIds:[]

  },
  mutations: {
    updateUserInfo (state,payload) {
      state.userInfo = payload;
    },
    updateScrollTop(state,payload) {
      state.scrollTop = payload;
    },
    updatePlatform (state,payload) {
      state.platform = payload;
    },
    updateVotedIds (state,payload) {
      state.votedIds = payload;
    }
  }
})

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App),
  data:{
	  eventHub:new Vue()
  }
}).$mount('#app')

