<template>
    <div class="friends-style">
        <friendsListCom :friendslist='friendslist' @chooseChatPartner='chatFriend' @openChatView='openChatView'></friendsListCom>
        <friendsChatCom :userinfor='userinfor' :nowchatContentList='nowchatContentList' :chatView='chatView' :chatPartner='chatPartner'></friendsChatCom>
    </div>
</template>

<script>
import friendsListCom from '../components/friendsListCom'
import friendsChatCom from '../components/friendsChatCom'
export default {
    components:{
        friendsListCom,friendsChatCom
    },
    props:['userinfor','friendslist','nowchatContentList'],
    data (){
        return{
            chatPartner:{},
            chatView:false
        }
    },
    methods:{
        chatFriend:function(data){
            this.chatPartner = data
        },
        openChatView:function(data){
            this.chatView = data
        }
    }
}
</script>

<style lang="less" scoped>
    // @mainColor:#9999f1;
@mainColor:rgb(250,87,87);
    .friends-style{
        width: 800px;
        height: 600px;
        border-radius: 8px;
        margin: 3px auto;
        position: relative;
    }
</style>