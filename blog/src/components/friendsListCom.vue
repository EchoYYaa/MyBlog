<template>
    <div class="friends-list-style">
        <div class="list-style" @click="clickFriend(item)" v-for="(item,index) in friendslist" :key='index'>
            <img :src="item.userHeader" alt="">
            <div class="list-username-style">
                <label for="">{{item.userName}}</label>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['friendslist'],
    data(){
        return{
            chatView:false
        }
    },
    methods:{
        clickFriend:function(item){
            this.$emit('chooseChatPartner',item)
            this.chatView = true
            this.$emit('openChatView',this.chatView)
        }
    }
}
</script>

<style lang="less" scoped>
    // @mainColor:#9999f1;
@mainColor:rgb(250,87,87);
    .friends-list-style{
        width: 200px;
        height: 600px;
        border-radius: 8px;
        background-color: rgba(@mainColor, .3);

        .list-style{
            width: 200px;
            height: 50px;
            border-radius: 8px;
            background-color: rgba(@mainColor, .7);
            padding: 5px 20px;
            box-sizing: border-box;
            text-align: left;
            position: relative;
            margin-bottom: 5px;

            img{
            width: 40px;
            height: 40px;
            border-radius: 50%;
            }

            .list-username-style{
                width: 100px;
                height: 30px;
                position: absolute;
                left: 80px;
                top: 10px;
                text-align: left;
            }
        }
    }
</style>