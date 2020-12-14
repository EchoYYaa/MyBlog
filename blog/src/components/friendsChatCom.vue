<template>
    <div class="friends-chat-style">
        <div class="has-click-chat-friend" v-if="chatView == true">
            <div class="chatPartner-style">
                <p>{{chatPartner.userName}}</p>
            </div>
            <div class="chat-content-style">
                <div v-for="(item,index) in receiveMsg" :key='"receive" + index'>
                    <div class="chat-content-infor" v-if="(item.sendUser == chatPartner.userID)">
                        <div class="chat-content-img" ><img :src="chatPartner.userHeader" alt=""></div>
                        <div class="chat-content-frame" >{{item.chatContent}}</div>
                    </div>
                </div>
                <div v-for="(item,index) in chatContentList" :key='"send " + index'>
                    <div class="chat-content-infor" v-if="(item.sendUser.userID == chatPartner.userID)">
                        <div class="chat-content-img" ><img :src="item.sendUser.userHeader" alt=""></div>
                        <div class="chat-content-frame" >{{item.chatContent}}</div>
                    </div>
                    <div class="chat-content-infor" :class="{self:userinfor.userName == item.sendUser.userName}" v-if="(item.receiveUser.userID == chatPartner.userID)">
                        <div class="chat-content-img" ><img :src="item.sendUser.userHeader" alt=""></div>
                        <div class="chat-content-frame" >{{item.chatContent}}</div>
                    </div>
                </div>
            </div>
            <div class="chat-input-style">
                <textarea @keyup.enter='sendEvent' v-model="sendContent" cols="68" rows="7"></textarea>
                <div>
                    <button @click="sendEvent">发送</button>
                </div>
            </div>
        </div>
        <div class="no-click-chat-friend" v-if="chatView == false"></div>
    </div>
</template>

<script>
import socket from '../socket'
export default {
    props:['userinfor','chatPartner','chatView','nowchatContentList'],
    data(){
        return{
            chatContentList:this.nowchatContentList,
            receiveMsg:[],
            sendContent:''
        }
    },
    methods:{
        sendEvent:function(){
            let msg = {
                sendUser:{userID:this.userinfor.userID,userName:this.userinfor.userName,userHeader:this.userinfor.userHeader},
                receiveUser:this.chatPartner,
                chatContent:this.sendContent,
                chatTime:new Date().getTime()
            }
            socket.emit('sendMsg',msg)
            this.chatContentList.push(msg)
            this.saveStorageChat()
            this.sendContent = ''
        },
        saveStorageChat(){
            let strKey = 'chat-user-'+this.userinfor.userID+'-'+this.chatPartner.userID
            localStorage[strKey] = JSON.stringify(this.chatContentList)
        },
        sendStorageChat(){
            let strKey1 = 'chat-user-'+this.userinfor.userID+'-'+this.chatPartner.userID
            if (localStorage[strKey1]) {
                this.historyContentM = JSON.parse(localStorage[strKey1])
            }
            let strKey2 = 'chat-user-'+this.chatPartner.userID+'-'+this.userinfor.userID
            if (localStorage[strKey2]) {
                this.historyContentY = JSON.parse(localStorage[strKey2])
            }
        }
    },
    mounted(){ 
        socket.on('noreadMsg',(data)=>{
            this.receiveMsg = data
            socket.emit('hasreadMsg',this.userinfor.userID)
        })
    },
    beforeMount(){
        this.sendStorageChat()
    }
}
</script>

<style lang="less" scoped>
    // @mainColor:#9999f1;
    @mainColor:rgb(250,87,87);
    @mainColor1:rgb(250, 159, 159);
    @buttonColor:rgb(245, 205, 205);
    @fontColor1:rgb(124, 40, 40);
    @mainSize:20px;
    .has-click-chat-friend,.no-click-chat-friend{
        width: 595px;
        height: 600px;
        border-radius: 8px;
        position: absolute;
        left: 200px;
        top: 0;
        margin-left: 5px;
        background-color: rgba(@mainColor, .3);
    }

    .chatPartner-style{
        width: 595px;
        height: 40px;
        border-radius: 8px;
        line-height: 40px;
        background-color: rgba(@mainColor, .5);

        p{
            text-align: center;
            font-size: @mainSize;
            color: @fontColor1;
        }
    }

    .chat-content-style::-webkit-scrollbar{
        width: 12px;
        background-color: rgba(@mainColor, .1);
    }
    .chat-content-style::-webkit-scrollbar-thumb{
        border-radius: 8px;
        background-color: rgba(@mainColor, .6);
    }

    .chat-content-style{
        width: 595px;
        height: 360px;
        overflow-y: scroll;
        background-color: rgba(@mainColor1, .1);

        .chat-content-infor{
            margin: 10px 20px 0 20px;
            display: flex;
            flex-direction: row;
            position: relative;

            .chat-content-img{
                width: 40px;
                height: 40px;
                img{
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                }
            }
                
            .chat-content-frame{ 
                max-height: 800px;
                max-width: 400px;
                background-color: aliceblue;
                border-radius: 10px;
                line-height: 32px;
                padding: 2px 5px;
                word-wrap: break-word;
                box-sizing: border-box;
                margin: 2px 15px;
            }

            .chat-content-frame::before{
                content: '';
                display: block;
                width: 0;
                height: 0;
                position: absolute;
                left: 47px;
                top: 12px;
                border-right: 8px solid  aliceblue;
                border-top: 6px solid transparent;
                border-bottom: 6px solid transparent;
            }
        }

        .chat-content-infor.self{
            display: flex;
            flex-direction: row-reverse;

            .chat-content-frame::before{
                content: '';
                display: block;
                width: 0;
                height: 0;
                position: absolute;
                right: 47px;
                top: 12px;
                border-left: 8px solid  aliceblue;
                border-top: 6px solid transparent;
                border-bottom: 6px solid transparent;
                left: initial;
                border-right: initial;
            }
        }
    }

    .chat-input-style{
        width: 595px;
        height: 200px;
        border-radius: 8px;
        background-color: rgba(@mainColor1, .3);
        background: linear-gradient(5deg,rgba(@mainColor1,.8),rgba(@mainColor1,.3),rgba(@mainColor1,.8));

        textarea{
            margin: 15px 15px;
            text-align: left;
            outline: none;
        }

        div{
            width: 100%;
            height: 30px;
            position: relative;
            
            button{
                position: absolute;
                right: 18px;
                top: -2px;
                width: 50px;
                height: 26px;
                border: none;
                background-color:@buttonColor;
                border-radius: 5px;
                text-align: center;
            }
        }
    }
</style>