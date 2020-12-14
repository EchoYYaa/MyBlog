<template>
    <div class="totle-friends-list-style">
        <div class="friends-title">
            <p>好友列表</p>
            <button class="friends-request" @click="friendsrequestEvent">申请列表<span v-if="userinfor.freqcount != 0">({{userinfor.freqcount}})</span></button>
            <button class="friends-add" @click="addfriendsEvent">添加好友</button>
        </div>
        <div class="friends-request-style" v-show="friendsrequest == true">
            <div class="friends-request-title">
                <p>好友列表申请</p>
                <button @click="friendsRequestReturn">返回</button>
            </div>
            <div class="friends-style" v-for="(item,index) in friendsRequestList1" :key="'friendsrequest'+index">
                <div style="width: 30px">
                    <img :src="item.userHeader" alt="">
                </div>
                <div style="width: 450px">
                    <label for="">{{item.userName}}</label>
                    <label for="">{{item.userID}}</label>
                </div>
                <div v-if="item.yorm == 'y'" style="width: 150px">
                    <button class="agreerequest-button" @click="agreeFriendRequest(item,index)">同意</button>
                    <button @click="disagreeFriendRequest(item,index)">拒绝</button>
                </div>
                <div v-if="item.yorm =='m'" style="width: 150px">
                    <p>申请中</p>
                </div>
            </div>
        </div>
        <div class="add-friends" v-if="addfriends == true">
            <div class="add-friends-nav">
                <input id="searching" type="text" @keyup.enter="searchEvent(searchfriends)" v-model="searchfriends" placeholder="用户ID/用户名">
                <button @click="searchEvent(searchfriends)">查找</button>
                <button @click="returnEvent">返回</button>
            </div>
            <div class="search-failed-tip" v-if="searchfail == true">
                <p>未查找到此用户，请重新输入用户ID/用户名！</p>
                <button @click="searchFailedReturn">返回</button>
            </div>
            <div class="add-friends-style" v-if="search == true">
                <div class="friends-style" v-for="(item,index) in searchFriendsList" :key="index">
                    <div style="width: 30px">
                        <img :src="item.userHeader" alt="">
                    </div>
                    <div style="width: 500px">
                        <label for="">{{item.userName}}</label>
                        <label for="">{{item.userID}}</label>
                    </div>
                    <div style="width: 100px">
                        <button v-if="isadding == false" @click="addNewFriend(item)">添加</button>
                        <p v-if="isadding == true">申请中</p>
                    </div>
                </div>
                <div class="search-failed-tip" v-if="oktip == true">
                    <p>OK！</p>
                    <button @click="oktipReturn">返回</button>
                </div>
                <div class="search-failed-tip" v-if="exitfriend == true">
                    <p>好友已存在！</p>
                    <button @click="exitFriendReturn">返回</button>
                </div>
            </div>
        </div>
        <div class="friends-list-style" v-if="(addfriends == false) && (friendsrequest == false)">
            <div class="friends-style" v-for="(item,index) in friendslist" :key="index">
                <div style="width: 30px">
                    <img :src="item.userHeader" alt="">
                </div>
                <div style="width: 500px">
                    <label for="">{{item.userName}}</label>
                    <label for="">{{item.userID}}</label>
                </div>
                <div style="width: 100px">
                    <button @click="deleteFriend(item)">delete</button>
                </div>
            </div>
        </div>
        <div class="search-failed-tip" v-if="deleteSuccess == true">
            <p>删除成功！</p>
            <button @click="deleteSuccessReturn">返回</button>
        </div>
    </div>
</template>

<script>
import socket from '../socket'
export default {
    props:{
        userinfor:{
            type:Object
        },
        friendslist:{
            type:Array,
            default:()=>[]
        },
        friendsRequestList:{
            type:Array,
            default:()=>[]
        }
    },
    data (){
        return{
            searchFriendsList:[],
            addfriends:false,
            exitfriend:false,
            search:false,
            searchfail:false,
            friendsrequest:false,
            deleteSuccess:false,
            searchfriends:null,
            oktip:false,
            isadding:false,
            friendsRequestList1:this.friendsRequestList
        }
    },
    methods:{
        addfriendsEvent:function(){
            this.addfriends = true
            this.friendsrequest=false
        },
        returnEvent:function(){
            this.addfriends = false
            this.searchfriends = null
            this.isadding = false
            this.searchFriendsList = []
        },
        searchEvent:function(searchfriends){
            if(isNaN(searchfriends) && (searchfriends != null)){
                socket.emit('searchFriendName',searchfriends)
            }
            else if(!isNaN(searchfriends) && (searchfriends != null)){
                socket.emit('searchFriendID',searchfriends)
            }
        },
        searchFailedReturn:function(){
            this.searchfail = false
        },
        addNewFriend:function(item){
            for (let index = 0; index < this.friendslist.length; index++) {
                if(this.friendslist[index].userID == item.userID){
                    this.exitfriend = true
                }
            }
            if(this.exitfriend ==false){
                let tmpsql = {userID:item.userID,userName:item.userName,userHeader:item.userHeader,yorm:"m"}
                this.friendsRequestList.unshift(tmpsql)
                socket.emit('addNewFriend',this.userinfor,item)
            }
            this.isadding =true
        },
        agreeFriendRequest:function(item,index){
            socket.emit('agreeFriendRequest',this.userinfor,item)
            this.friendslist.unshift(item)
            this.friendsRequestList1.splice(index,1)
            // item.oppositewait = 'agree'
        },
        disagreeFriendRequest:function(item,index){
            socket.emit('disagreeFriendRequest',this.userinfor,item)
            this.friendsRequestList1.splice(index,1)
            // item.oppositewait = 'disagree'
        },
        friendsrequestEvent:function(){
            this.friendsrequest=true
            this.addfriends = false
            this.userinfor.freqcount = 0
        },
        friendsRequestReturn:function(){
            this.friendsrequest=false
        },
        exitFriendReturn:function(){
            this.exitfriend = false
        },
        oktipReturn:function(){
            this.oktip = false
        },
        deleteFriend:function(item){
            for (let k = 0; k < this.friendslist.length; k++) {
                if(this.friendslist[k].userID == item.userID){
                    socket.emit('deleteFriend',this.userinfor,item.userID)
                    this.friendslist.splice(k,1)
                }
            }
        },
        deleteSuccessReturn:function(){
            this.deleteSuccess = false
        }
    },
    mounted(){
        socket.on('hasSearchedFriendsName',(data)=>{
            this.searchFriendsList=data
            this.search=true
        }),
        socket.on('noSearchedFriendsName',()=>{
            this.searchfail = true
            this.searchFriendsList=[]
        }),
        socket.on('hasSearchedFriendsID',(data)=>{
            this.searchFriendsList=data
            this.search=true
        }),
        socket.on('noSearchedFriendsID',()=>{
            this.searchfail = true
            this.searchFriendsList=[]
        }),
        socket.on('deleteFriendSuccess',()=>{
            this.deleteSuccess = true
        }),
        // socket.on('addNewFriend',()=>{
        //     this.oktip = true
        // }),
        socket.on('returnAgreeFriendRequest',(data)=>{
            for (let index = 0; index < this.friendsRequestList1.length; index++) {
                if(this.friendsRequestList1[index].userID == data.userID){
                    this.friendsRequestList1.splice(index,1)
                    this.friendslist.unshift(data)
                }
            }
        }),
        socket.on('returnDisagreeFriendRequest',(data)=>{
            for (let index = 0; index < this.friendsRequestList1.length; index++) {
                if(this.friendsRequestList1[index].userID == data.userID){
                    this.friendsRequestList1.splice(index,1)
                }
            }
        })
        // socket.on('friendsRequest',(data)=>{
        //   this.friendsRequestList1.push(data)
        // })
    }
}
</script>

<style lang="less" scoped>
    // @mainColor:#9999f1;
    @mainColor:rgb(250,87,87);
    @mainColor1:rgb(250, 159, 159);
    @buttonColor:rgb(245, 205, 205);
    @fontColor1:rgb(124, 40, 40);
    .totle-friends-list-style{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .friends-title{
        width: 645px;
        height: 40px;
        border-radius: 8px;
        background-color: rgba(@mainColor, .5);
        display: flex;
        p{
            width: 395px;
            height: 40px;
            text-align: left;
            line-height: 40px;
            padding-left: 20px;
        }
        button{
            width: 70px;
            height: 24px;
            text-align: center;
            border: none;
            outline: none;
            border-radius: 10px;
            margin: 8px 20px;
            background-color: @buttonColor;
        }
    }

    .friends-request-style{
        width: 645px;
        height: 765px;
        position: absolute;
        top: 40px;
        left: 0;
        background-color: rgba(@mainColor1, .1);
        background: linear-gradient(10deg,rgba(@mainColor1,.5),rgba(@mainColor1,.2),rgba(@mainColor1,.8));
        .friends-request-title{
            width: 645px;
            height: 40px;
            display: flex;
            p{
                width: 535px;
                height: 40px;
                text-align: center;
                line-height: 40px;
                padding-left: 20px;
            }
            button{
                width: 70px;
                height: 24px;
                text-align: center;
                margin-top: 8px;
                border: none;
                outline: none;
                border-radius: 10px;
                background-color: @buttonColor;
            }
        }
        
    }
    
    // .friends-add{
    //     top: 8px;
    //     right: 20px;
    // }
    
    // .friends-request{
    //     top: 8px;
    //     right: 120px;
    // }
    .search-failed-tip{
        width: 300px;
        height: 250px;
        background-color: salmon;
        position: absolute;
        top: 200px;
        left: 200px;
        p{
            margin: 50px 20px;
            text-align: center;
        }
        button{
            width: 60px;
            height: 30px;
            text-align: center;
            border: none;
            border-radius: 10px;
            margin-left: 120px;
            outline: none;
             background-color: @buttonColor;
        }
    }
    .add-friends{
        width: 645px;
        height: 760px;
        border-radius: 8px;
        position: absolute;
        top: 40px;
        left: 0;
        background-color: rgba(@mainColor1, .1);
        background: linear-gradient(10deg,rgba(@mainColor1,.5),rgba(@mainColor1,.2),rgba(@mainColor1,.8));
        
        .add-friends-nav{
            width: 645px;
            height: 40px;
            line-height: 40px;
            input{
                height: 20px;
                border: none;
                border-radius: 8px;
                padding-left: 10px;
                outline: none;
                margin-left: 180px;
            }
            button{
                width: 40px;
                height: 20px;
                text-align: center;
                border: none;
                outline: none;
                margin: 0 40px;
                border-radius: 8px;
                background-color: @buttonColor;
            }
        }
        .add-friends-style{
            width: 645px;
            height: 695px;
        }
    }

    .friends-list-style{
        width: 645px;
        height: 725px;
    }

    .friends-style{
        width: 635px;
        height: 50px;
        background-color: rgba(@mainColor1, .1);
        background: linear-gradient(5deg,rgba(@mainColor1,.6),rgba(@mainColor1,.8),rgba(@mainColor1,.3));
        padding: 10px;
        box-sizing: border-box;
        text-align: left;
        vertical-align: middle;
        display: flex;
        border-radius: 8px;
        margin: 5px;
        
        div{
            height: 30px;
            left: 50px;
            top: 10px;

            img{
                width: 30px;
                height: 30px;
                border-radius: 50%;
            }

            label{
                padding-left: 20px;
            }

            button{
                width: 45px;
                height: 20px;
                border: none;
                border-radius: 10px;
                background-color: @buttonColor;
                text-align: center;
                outline: none;
            }
            .agreerequest-button{
                margin-right: 20px;
            }
        }
    }
</style>