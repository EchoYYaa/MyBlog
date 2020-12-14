<template>
    <div class="perInformation-style">
        <div class="aside-nav">
            <div class="aside-block">
                <router-link to="/PersonInformation/" >基本资料</router-link>
            </div>
            <div class="aside-block">
                <router-link to="/PersonInformation/PerFriendsList">好友列表<span v-if="userinfor.freqcount != 0">({{userinfor.freqcount}})</span></router-link>
            </div> 
        </div>
        <router-view class="aside-content" :systemHeader='systemHeader' :friendsRequestList='friendsRequestList' :userinfor='userinfor' :friendslist='friendslist' />
    </div>
</template>

<script>
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
        },
        systemHeader:{
            type:Array,
            default:()=>[]
        }
    }
}
</script>

<style lang="less" scoped>
    // @mainColor:#9999f1;
    @mainColor:rgb(250,87,87);
    @mainColor1:rgb(250, 159, 159);
    @buttonColor:rgb(245, 205, 205);
    @fontColor1:rgb(124, 40, 40);
    .perInformation-style{
        width: 800px;
        min-height: 760px;
        margin: 3px auto;
        position: relative;
    }
    .aside-nav{
        width: 150px;
        height: 100%;
        background-color: rgba(@mainColor1, .1);
        background: linear-gradient(5deg,rgba(@mainColor1,.3),rgba(@mainColor1,.6),rgba(@mainColor1,.3));
        display: flex;
        border-radius: 8px;
        flex-direction: column;
        position: absolute;
        left: 0;
        top: 0;

        .aside-block{
            width: 100%;
            height: 40px;
            border-radius: 8px;
            background-color: rgba(@mainColor, .9);
            margin-bottom: 3px;
            line-height: 40px;
            text-align: center;
        }
        .aisde-block:active{
            background-color: @mainColor;
        }

        a {
          font-weight: bold;
          text-decoration: none;
          color: rgba(@fontColor1,.6);

          &.router-link-exact-active {
          color: @fontColor1;
          }
        }
    }
    .aside-content{
        width: 645px;
        height: 760px;
        margin-left: 5px;
        border-radius: 8px;
        background-color: rgba(@mainColor1, .1);
        background: linear-gradient(10deg,rgba(@mainColor1,.5),rgba(@mainColor1,.2),rgba(@mainColor1,.8));
        position: absolute;
        left: 150px;
        top: 0;
    }
</style>
