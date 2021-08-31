import Vue from 'vue';
import App from './App';
Vue.config.productionTip = false;

App.mpType = 'app';


// 引入全局uView
import uView from 'uview-ui';
Vue.use(uView);

// 此处为演示vuex使用，非uView的功能部分
import store from '@/store';

// 引入uView对小程序分享的mixin封装
let mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare);

import http from './api/index'
import cache from './utils/cache'
import mcUtils from './utils/mcUtils'

Vue.prototype.$cache = cache;
Vue.prototype.$utils = mcUtils;

Vue.prototype.$api = {http};

const app = new Vue({
	store,
	...App
});

app.$mount();
