<template>
    <div class="basic-infor-style" >
        <div class="basic-infor-img">
            <img :src="userinfor.userHeader"/>
            <button @click="modifyHeader">更换头像</button>
        </div>
        <div class="change-header-block" v-if="changeheader==true">
            <div class="button-block">
                <button @click="confirmModify">修改</button>
                <button @click="returnModify">返回</button>
            </div>
            <div class="image-block">
                <div class="click-image-style" @click="chooseHeader(item)" v-for="(item,index) in systemHeader" :key="index">
                    <img :src="item.sHeader" alt="">
                </div>
            </div>
        </div>
        <div class="modify-result-tip" v-if="modifytip==true">
            <p>修改成功！</p>
            <button @click="modifySuccess">OK</button>
        </div>
        <div class="basic-infor-content">
            <h3>用户名：{{userinfor.userName}}</h3>
            <h3>ID：{{userinfor.userID}}</h3>
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
        systemHeader:{
            type:Array,
            default:()=>[]
        }
    },
    data(){
        return{
            changeheader:false,
            modifytip:false,
            tmpHeader:null
        }
    },
    methods:{
        modifyHeader:function(){
            this.changeheader=true
        },
        chooseHeader:function(item){
            this.tmpHeader = item.sHeader
        },
        confirmModify:function(){
            if(this.tmpHeader != null){
                this.userinfor.userHeader = this.tmpHeader
                socket.emit('modifyHeader',this.userinfor,this.tmpHeader)
            }
        },
        returnModify:function(){
            this.changeheader=false
        },
        modifySuccess:function(){
            this.modifytip=false
        }
    },
    mounted(){
        socket.on('modifyHeader',()=>{
            this.modifytip=true
            this.changeheader=false
        })
    }
}
</script>

<style lang="less" scoped>
    // @mainColor:#9999f1;
    @mainColor:rgb(250,87,87);
    .basic-infor-style{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 30px 10px 20px 50px;
        position: relative;
        div{
            margin-bottom: 20px;
        }
    }

    .change-header-block{
        width: 600px;
        height: 500px;
        background-color: rgb(207, 231, 252);
        position: absolute;
        top: 94px;
        left: 25px;
        .button-block{
            width: 600px;
            height: 50px;
            margin: 0;
            line-height: 50px;
            button{
                width: 60px;
                height: 24px;
                text-align: center;
                border: none;
                border-radius: 10px;
                margin-left: 60px;
                outline: none;
                background-color:rgb(131, 182, 226);
            }
        }
        .image-block{
            width: 560px;
            height: 410px;
            background-color: aliceblue;
            overflow: hidden;
            padding: 20px;
            .click-image-style{
                width: 50px;
                height: 50px;
                margin: 10px;
                float: left;
                img{
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }
        }
    }

    .click-image-style:active{
        position: relative;
        top: 2px;
        left: 2px;
    }

    .modify-result-tip{
        width: 200px;
        height: 120px;
        background-color: azure;
        overflow: hidden;
        position: absolute;
        left: 80px;
        top: 100px;
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
            background-color:rgb(131, 182, 226);
        }
    }

    .basic-infor-img{
        width: 60px;
        height: 80px;
        img{
            width: 60px;
            height: 60px;
            border-radius: 30px;
        }
    }

    .basic-infor-content{
        width: 100%;
        h3{
            text-align: left;
            padding-bottom: 10px;
        }
    }
</style>