<template>
  <div id="app">
    <background></background>
    <login v-if="islogin == false"></login>
    <div class="totle-app">
      <div id="nav" v-if="islogin == true">
      <div class="nav-style" >
        <div class="myblog-logo">
          <span>MyBlog</span>
        </div>
          <router-link to="/">首页<span v-if="friendsblog.length != 0">(new)</span></router-link> |
          <router-link to="/PersonInformation" >个人信息<span v-if="userinfor.freqcount != 0">({{userinfor.freqcount}})</span></router-link> |
          <router-link @click="friendsEvent" to="/Friends">好友</router-link> |
          <button @click="dropoutEvent">退出</button>
      </div>
      </div>
     <router-view class="nav-view" v-if="isRouterAlive== true && islogin == true" :friendsblog='friendsblog' :nowchatContentList='nowchatContentList' :totleblogData='totleblogData' :myblogData='myblogData' :systemHeader="systemHeader" :friendsRequestList='friendsRequestList' :userinfor='userinfor' :friendslist="friendslist"/>
    </div>
  </div>
</template>

<script>
import login from './Login.vue';
import socket from './socket';
import axios from 'axios'
import bubbleSort from './sort'
import background from './components/Background.vue'
export default {
  name:'app',
  provide(){
    return{
      reload:this.reload
    }
  },
  data(){
    return{
      isRouterAlive:true,
      isonline:false,
      islogin:false,
      userinfor:{},
      userlist:[],
      friendslist:[],
      receiveMsg:[],
      friendsRequestList:[],
      systemHeader:[],
      myblogData:[],
      friendsblogData:[],
      totleblogData:[],
      friendsblog:[],
      nowchatContentList:[]
    }
  },
  components: { login,background },
  async beforeMount(){
    let res=await axios.get('http://localhost:3000/api/userinfor');
    this.userlist = res.data
  },
  mounted(){
    socket.on('login',(data1,data2,data4,data5,data6)=>{
      this.islogin = true
      this.userinfor = data1
      for (let index = 0; index < data2.length; index++) {
        if(data2[index].isfriend  == 'true'){
          this.friendslist.push(data2[index])
        }
        else{
          this.friendsRequestList.push(data2[index])
        }
      }
      this.systemHeader = data4
      this.myblogData = bubbleSort(data5)
      this.friendsblogData = data6
      this.totleblogData = data5.concat(data6)
      this.totleblogData = bubbleSort(this.totleblogData)
    }),
    socket.on('logout',()=>{
      this.islogin = false;
      socket.emit('mustdisconnect',{
        state:'logout',
        content:'退出登录！'
      })
    }),
    socket.on('register',(data)=>{
      this.islogin = true;
      this.userinfor=data
    }),
    socket.on('newFriendBlog',(data)=>{
      // this.friendsblog = this.friendsblog.concat(data)
      this.friendsblogData = this.friendsblogData.concat(data)
      this.totleblogData = this.totleblogData.concat(data)
      this.totleblogData = bubbleSort(this.totleblogData)
    }),
    socket.on('returnNewFriendBlog',(data)=>{
      // this.friendsblog = this.friendsblog.concat(data)
      this.friendsblogData = this.friendsblogData.concat(data)
      this.totleblogData = this.totleblogData.concat(data)
      this.totleblogData = bubbleSort(this.totleblogData)
    }),
    socket.on('friendsRequest',(data)=>{
      let friendobj = {
        userID:data.userID,
        userName:data.userName,
        userHeader:data.userHeader,
        friendsList:data.friendsList,
        isfriend:'false',
        yorm:'y'
      }
      this.friendsRequestList.push(friendobj)
      this.userinfor.freqcount = this.userinfor.freqcount + 1 -1
    }),
    socket.on('receiveMsg',(data)=>{
      this.nowchatContentList.push(data)
    }),
    socket.on('deleteFriendBlog',(data)=>{
      for (let i = 0; i < this.totleblogData.length; i++) {
        if(this.totleblogData[i].userID == data){
          this.totleblogData.splice(i,1)
          i--
        }
      }
      for (let j = 0; j < this.friendsblogData.length; j++) {
        if(this.friendsblogData[j].userID == data){
          this.friendsblogData.splice(j,1)
          j--
        }
      }
    }),
    socket.on('beenDelete',(data)=>{
      for (let index = 0; index < this.friendslist.length; index++) {
        if(this.friendslist[index].userID == data){
          this.friendslist.splice(index,1)
        }
      }
      for (let i = 0; i < this.totleblogData.length; i++) {
        if(this.totleblogData[i].userID == data){
          this.totleblogData.splice(i,1)
          i--
        }
      }
      for (let j = 0; j < this.friendsblogData.length; j++) {
        if(this.friendsblogData[j].userID == data){
          this.friendsblogData.splice(j,1)
          j--
        }
      }
    }),
    socket.on('friendPublishNewBlog',(data1,data2)=>{
      let blogMsg = {userID:data1.userID,userName:data1.userName,blogTitle:data1.blogTitle,blogContent:data1.blogContent,blogLocalTime:data1.blogLocalTime,ispublish:"true",blogTime:data2}
      // this.friendsblog.unshift(blogMsg)
      this.friendsblogData.unshift(blogMsg)
      this.totleblogData.unshift(blogMsg)
    }),
    socket.on('disconnect',()=>{
      console.log("断开连接");
    })
  },
  methods:{ 
    dropoutEvent:function(){
      this.islogin = false;
      this.userinfor = {}
      socket.emit('disconnect',{
        state:'logout',
        content:'退出登录！'
      })
    },
    friendsEvent:function(){
      socket.emit('chooseFriends',this.userinfor)
    },
    reload(){
      this.isRouterAlive = false
      this.$nextTick(function(){
        this.isRouterAlive = true
        console.log('reload');
      })
    }
  },
  // computed:{
  //   refreshEvent:function(){
  //     return this.totleblogData = bubbleSort(this.totleblogData.concat(this.friendsblog))
  //   }
  // }
}
</script>

<style lang="less">
// @mainColor:#9999f1;
@mainColor:rgb(250,87,87);
@fontColor:rgb(230, 52, 52);
@fontColor1:rgb(124, 40, 40);
// @mainColor2:rgb(134, 111, 218);
//rgb(49, 252, 174)
@mainSize:20px;
*{
  margin: 0;
  padding: 0;
  text-align: left;
  color: @fontColor1;
  
button:active{
  position: relative;
  top: 1px;
  // left: 1px;
}

input{
  outline: none;
  font-size: 0.8*@mainSize;
}
textarea{
  outline: none;
  font-size: 0.8*@mainSize;
}
}
#app{
  width: 100vw;
  height: 100vh;
}

.totle-app{
  width: 800px;
  margin: 0 auto;
  opacity: 1;
}

#nav {
  width: 100%;
  height: 50px;
  text-align: center;

  .nav-style{
    width: 800px;
    height: 100%;
    position: relative;
    border-radius: 8px;
    background-color: rgba(@mainColor,.8);
    background: linear-gradient(to bottom,rgba(@mainColor,.8),rgba(@mainColor,.6),rgba(@mainColor,.5),rgba(@mainColor,.7));
    margin: 0 auto;
    line-height: 50px;
    text-align: center;

    .myblog-logo{
      width: 80px;
      height: 38px;
      position: absolute;
      top: 3px;
      left: 100px;
      span{
        width: 80px;
        height: 38px;
        display: block;
        text-align: center;
        line-height: 38px;
        font-size: 1.2*@mainSize;
        color:@fontColor;
        text-shadow: 1px 1px 5px rgba(@fontColor,.5);
      }
    }
  }

  a {
    font-weight: bold;
    // color: #2c3e50;
    color: rgba(@fontColor,.5);
    text-decoration: none;

    &.router-link-exact-active {
      color: @fontColor;
    }
  }

  button{
    font-weight: bold;
    color: rgba(@fontColor,.5);
    font-size: 0.8*@mainSize;
    border: none;
    background-color: transparent;
  }
}
.nav-view{
  width: 800px;
  margin: 0 auto;
  border-radius: 8px;
}
</style>
