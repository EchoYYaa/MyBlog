import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  data:{
    userMaster:null
  },
  methods:{
    bubbleSort(arr1){
      let tmp = {}
      for(let i=0;i<arr1.length-1;i++){
        for (let j = i; j < arr1.length-1; j++) {
          if(arr1[j].blogTime<arr1[j+1].blogTime){
            tmp = arr1[j+1]
            arr1[j+1] = arr1[j]
            arr1[j]=tmp
          }
          
        }
      }
    }
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')
