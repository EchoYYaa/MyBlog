<template>
  <div class="blog-style">
    <div class="blog-nav">
      <input type="text" @keyup.enter="searchBlogEvent" v-model="searchblog" placeholder="查找Blog标题">
      <button @click="searchBlogEvent">查找</button>
      <button @click="publishButtonEvent">发表Blog</button>
    </div>
    <p class="nothing" v-if="isnothing == true">什么都没找到~</p>
    <div class="publish-blog-style" v-if="ispublishblog == true">
      <div class="publish-blog-title">
        <p>发表Blog</p>
        <button @click="publishBlogEvent">发表</button>
        <button @click="concelPublish">取消</button>
      </div>
      <div class="publish-blog-content">
        <div class="publish-blog-contitle">
          <input type="text" v-model="nowblogTitle" placeholder="添加Blog标题" required>
        </div>
        <div class="publish-blog-conartical">
          <textarea v-model="nowblogContent" cols="67" rows="16" placeholder="添加内容"></textarea>
        </div>
      </div>
    </div>
    <div class="publishSuccess" v-if="publishTip == true">
      <p v-if="(isnulltip == false) && (issuccess ==true)">OK！</p>
      <p v-if="(isnulltip == true) && (issuccess ==false)">请输入标题！</p>
      <button @click="publishSuccessReturn">返回</button>
    </div>
    <div class="blog-block" v-for="(item,index) in blogList" :key="'publish'+index">
      <div class="blog-block-title">
        <h2>{{item.blogTitle}}</h2>
        <span>发表者：</span>
        <span>{{item.userName}}</span>
        <p>{{item.blogLocalTime}}</p>
      </div>
      <div class="blog-block-content">
        <span>{{item.blogContent}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import socket from '../socket'
import bubbleSort from '../sort'
export default {
  name: 'MyBlog',
  props:{
    userinfor:{
      type:Object
    },
    myblogData:{
      type:Array,
      default:()=>[]
    },
    totleblogData:{
      type:Array,
      default:()=>[]
    }
  },
  data(){
    return {
      ispublishblog:false,
      publishTip:false,
      isnulltip:false,
      issuccess:false,
      nowblogTitle:null,
      nowblogContent:null,
      blogList:this.totleblogData,
      searchblog:null,
      isnothing:false
    }
  },
  mounted(){
    socket.on('publishBlog',()=>{
      this.ispublishblog=false
      this.publishTip=true
      this.issuccess=true
    })
    socket.on('searchBlogR',(data)=>{
      this.blogList = bubbleSort(data)
      this.isnothing = false
    })
    socket.on('nosearchBlogR',()=>{
      this.blogList = []
      this.isnothing = true
    })
  },
  methods:{
    searchBlogEvent:function(){
      if(this.searchblog != null){
        socket.emit('searchBlog',this.searchblog)
      }
      else{
        this.blogList = this.totleblogData
        this.isnothing = false
      }
    },
    publishButtonEvent:function(){
      this.ispublishblog=true
    },
    concelPublish:function(){
      this.ispublishblog=false
      this.nowblogTitle = null
      this.nowblogContent = null
    },
    publishBlogEvent:function(){
      if(this.nowblogTitle == null){
        this.publishTip=true
        this.isnulltip = true
      }
      else{
        var date = new Date()
        let blogTime=date.getTime()
        let blogData={
          blogTitle:this.nowblogTitle,
          blogContent:this.nowblogContent,
          blogLocalTime:date.toLocaleString(),
          userID:this.userinfor.userID,
          userName:this.userinfor.userName
        }
        this.blogList.unshift(blogData)
        socket.emit('publishBlog',this.userinfor,blogData,blogTime)
        this.ispublishblog=false
      }
    },
    publishSuccessReturn:function(){
      this.publishTip=false
      this.isnulltip=false
      this.issuccess=false
      this.nowblogTitle = null
      this.nowblogContent = null
    }
  //   unfoldEvent:function(item){}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="less">
// @mainColor:#9999f1;
@mainColor:rgb(250,87,87);
@mainColor1:rgb(250, 159, 159);
@fontColor:rgb(230, 52, 52);
@fontColor1:rgb(124, 40, 40);
@buttonColor:rgb(245, 205, 205);
@mainSize: 20px;
.blog-style{
  position: relative;
}
.nothing{
  margin-top: 150px;
  text-align: center;
}
.blog-nav{
  width: 800px;
  height: 40px;
  margin-top: 3px;
  border-radius: 8px;
  background-color: @mainColor;
  line-height: 40px;

  input{
    width: 220px;
    height: 20px;
    border-radius: 8px;
    border: none;
    outline: none;
    padding-left: 10px;
    margin-left: 250px;
    background-color:  @buttonColor;
  }

  button{
    width: 40px;
    height: 24px;
    border-radius: 10px;
    border: none;
    outline: none;
    text-align: center;
    background-color:  @buttonColor;
    margin-left: 20px;
  }
  button:last-child{
    width: 80px;
    margin-left: 160px;
  }
}

.publishSuccess{
  width: 200px;
  height: 120px;
  background-color: aliceblue;
  position: absolute;
  left: 300px;
  top: 150px;
  overflow: hidden;
  z-index: 999;
  p{
      margin: 30px 20px;
      text-align: center;
  }
  button{
    width: 60px;
    height: 24px;
    text-align: center;
    border: none;
    border-radius: 10px;
    margin-left: 60px;
    outline: none;
    background-color:@buttonColor;
  }
}

.publish-blog-style{
    width: 600px;
    height: 440px;
    background-color: aliceblue;
    position: absolute;
    top: 64px;
    left: 100px;
    z-index: 666;
    .publish-blog-title{
      width: 560px;
      height: 50px;
      padding: 0 20px;
      display: flex;
      background: linear-gradient(5deg,rgba(@mainColor1,.2),rgba(@mainColor1,.6),rgba(@mainColor1,.2));
      p{
        width: 400px;
        height: 50px;
        text-align: center;
        font-size: @mainSize;
        line-height: 50px;
      }
      button{
        width: 60px;
        height: 24px;
        margin: 13px 10px;
        text-align: center;
        border: none;
        outline: none;
        border-radius: 10px;
        background-color:@buttonColor;
      }
    }
}

.publish-blog-content{
  width: 560px;
  height: 350px;
  background: linear-gradient(5deg,rgba(@mainColor1,.2),rgba(@mainColor1,.3),rgba(@mainColor1,.2));
  padding: 20px;
  .publish-blog-contitle{
    width: 600px;
    height: 50px;
    input{
      width: 200px;
      height: 24px;
    }
  }
  .publish-blog-conartical{
    width: 600px;
    height: 500px;
  }
}

.blog-block{
  width: 760px;
  background-color: rgba(@mainColor1, .1);
  background: linear-gradient(10deg,rgba(@mainColor1,.8),rgba(@mainColor1,.5),rgba(@mainColor1,.2));
  margin-top: 5px;
  border-radius: 8px;
  padding: 10px 20px;
  .blog-block-title{
    width: 700px;
    height: 30px;
    display: flex;
    h2{
      width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    span{
      width: 70px;
      height: 30px;
      margin-left: 20px;
      line-height: 30px;
    }
    span:last-child{
      width: 100px;
      margin-left: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    p{
      width: 300px;
      height: 30px;
      line-height: 30px;
    }
  }
  .blog-block-content{
    width: 700px;
    padding: 10px 0;
    span{
      width: 700px;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
a {
  color: #8080f7;
}
</style>
